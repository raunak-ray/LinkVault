"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/app/(auth)/api/auth.api";
import {
  attemptSilentRefresh,
  clearAccessToken,
  getAccessToken,
  getTokenExpiry,
  setAccessToken,
} from "@/lib/api/client";
import type { User } from "@/app/(auth)/types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isHydrating, setIsHydrating] = useState(true);
  const hydratedRef = useRef(false);

  // On first mount: if we have no in-memory token (page reload), try to silently
  // refresh using the httpOnly cookie. This is the critical step that fixes
  // "refresh fail 401 on reload" — previously we relied only on interceptor retry
  // of GET /auth/me, which race-conditions with middleware and returns null too early.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const hydrate = async () => {
      if (getAccessToken()) {
        setIsHydrating(false);
        return;
      }
      // Try to get a fresh accessToken from the refresh cookie
      await attemptSilentRefresh();
      setIsHydrating(false);
    };
    hydrate();
  }, []);

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<User | null> => {
      try {
        const res = await authApi.getMe();
        return res.data;
      } catch (err: unknown) {
        // 401 after interceptor's refresh attempt means really unauthenticated
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr?.response?.status === 401) {
          clearAccessToken();
          return null;
        }
        throw err;
      }
    },
    // Don't fetch until hydration attempt finished, otherwise we fire GET /me
    // with no token and immediately 401 before silent refresh has a chance.
    enabled: !isHydrating,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const user = query.data ?? null;
  const isAuthenticated = !!user;

  // Proactive token refresh: schedule refresh 30s before expiry
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    const token = getAccessToken();
    if (!token || !isAuthenticated) return;

    const exp = getTokenExpiry(token);
    if (!exp) return;

    const now = Date.now();
    const msUntilRefresh = exp - now - 30_000; // 30s before expiry
    if (msUntilRefresh <= 0) {
      // token already expired or about to — refresh now
      authApi
        .refresh()
        .then((res) => {
          setAccessToken(res.data.accessToken);
        })
        .catch(() => {
          clearAccessToken();
          queryClient.setQueryData(["auth", "me"], null);
        });
      return;
    }

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const res = await authApi.refresh();
        setAccessToken(res.data.accessToken);
        scheduleRefresh();
      } catch {
        clearAccessToken();
        queryClient.setQueryData(["auth", "me"], null);
      }
    }, msUntilRefresh);
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    scheduleRefresh();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [scheduleRefresh, query.data]);

  // Also refresh on visibility change if token is stale/expired
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      const token = getAccessToken();
      if (!token || !isAuthenticated) return;
      const exp = getTokenExpiry(token);
      if (exp && Date.now() >= exp - 60_000) {
        authApi
          .refresh()
          .then((res) => {
            setAccessToken(res.data.accessToken);
            scheduleRefresh();
          })
          .catch(() => {
            clearAccessToken();
            queryClient.setQueryData(["auth", "me"], null);
          });
      } else {
        // revalidate user in background
        query.refetch();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      window.location.href = "/login";
    }
  }, [queryClient]);

  const refresh = useCallback(async () => {
    const res = await authApi.refresh();
    setAccessToken(res.data.accessToken);
    await query.refetch();
  }, [query]);

  const isLoading = isHydrating || query.isLoading;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      isFetching: query.isFetching,
      error: query.error,
      logout,
      refresh,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      query.isFetching,
      query.error,
      logout,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Optional: hook that returns user and throws if not authenticated (for protected areas)
export function useRequireAuth() {
  const auth = useAuth();
  if (!auth.isLoading && !auth.isAuthenticated) {
    if (typeof window !== "undefined") {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      window.location.href = `/login?next=${next}`;
    }
  }
  return auth;
}
