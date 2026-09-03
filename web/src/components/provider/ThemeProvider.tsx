"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolved: "light" | "dark";
  toggle: () => void;
  setTheme: (t: Theme) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(theme: Theme) {
  const resolved: "light" | "dark" = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("linkvault-theme") as Theme | null) ?? "system";
    setThemeState(stored);
    setResolved(apply(stored));
    setMounted(true);

    if (stored === "system") {
      const m = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => setResolved(apply("system"));
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("linkvault-theme", t);
    setResolved(apply(t));
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    // simple toggle cycles dark->light->system ; but header icon toggles dark/light
    if (theme === "system") {
      const sys = getSystemTheme();
      setTheme(sys === "dark" ? "light" : "dark");
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, resolved, toggle, setTheme, mounted }), [theme, resolved, toggle, setTheme, mounted]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
