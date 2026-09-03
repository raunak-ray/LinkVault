import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

export function getAccessToken() {
  return accessToken;
}

// Decode JWT payload without verification (client side only for exp check)
export function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewMs = 30_000): boolean {
  const exp = getTokenExpiry(token);
  if (!exp) return true;
  return Date.now() >= exp - skewMs;
}

export const rawApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attempt silent refresh on page reload when in-memory token is lost
// Uses rawApi (no interceptors) so it doesn't trigger the response interceptor loop
export async function attemptSilentRefresh(): Promise<string | null> {
  try {
    const response = await rawApi.post("/auth/refresh");
    const token =
      (response.data?.data?.accessToken as string | undefined) ??
      (response.data?.accessToken as string | undefined);
    if (token) {
      setAccessToken(token);
      return token;
    }
    return null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  // allow bypassing auth header via custom flag
  const skipAuth =
    (config.headers as Record<string, unknown>)?.["x-skip-auth"] === "true";
  if (skipAuth) {
    delete (config.headers as Record<string, unknown>)["x-skip-auth"];
    delete (config.headers as Record<string, unknown>).Authorization;
    return config;
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string> {
  // Use rawApi (no interceptors) to avoid sending expired token and to avoid recursion
  const response = await rawApi.post("/auth/refresh");

  // Support both wrapped (TransformInterceptor) and raw shapes
  // Wrapped: { success, data: { accessToken, refreshExpiry } }
  // Some setups: response.data.data.accessToken
  const token =
    (response.data?.data?.accessToken as string | undefined) ??
    (response.data?.accessToken as string | undefined);

  if (!token) {
    throw new Error("No access token in refresh response");
  }

  setAccessToken(token);
  return token;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const url: string = originalRequest.url ?? "";

    // Do not retry these endpoints or non-401
    const isAuthEndpoint =
      url === "/auth/refresh" ||
      url === "/auth/login" ||
      url === "/auth/register" ||
      url.endsWith("/auth/refresh") ||
      url.endsWith("/auth/login") ||
      url.endsWith("/auth/register");

    if (status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const token = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();

      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const currentPath = pathname + window.location.search;
        // Public pages must never force-redirect to /login.
        // "/" is the public landing page — anyone can stay there,
        // authenticated or not. /login and /register are auth pages
        // where a redirect would loop.
        const isPublicPage =
          pathname === "/" ||
          currentPath.startsWith("/login") ||
          currentPath.startsWith("/register");
        if (!isPublicPage) {
          const next = encodeURIComponent(currentPath);
          window.location.href = `/login?next=${next}`;
        }
      }

      return Promise.reject(
        refreshError instanceof Error ? refreshError : error,
      );
    }
  },
);

export default api;
