"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ThemeMode = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = "tfs_theme";

function applyThemeClasses(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage and prefers-color-scheme
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      const initialMode: ThemeMode =
        stored === "dark" || stored === "light" || stored === "system" ? stored : "system";
      setThemeState(initialMode);

      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const computeResolved = (mode: ThemeMode): ResolvedTheme => {
        if (mode === "dark") return "dark";
        if (mode === "light") return "light";
        return mql.matches ? "dark" : "light";
      };

      const resolved = computeResolved(initialMode);
      setResolvedTheme(resolved);
      applyThemeClasses(resolved);

      // Listen for system changes while in 'system' mode
      const handleSystemChange = (e: MediaQueryListEvent) => {
        try {
          const currentMode = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || "system";
          if (currentMode === "system") {
            const nextResolved: ResolvedTheme = e.matches ? "dark" : "light";
            setResolvedTheme(nextResolved);
            applyThemeClasses(nextResolved);
          }
        } catch {
          // ignore storage error
        }
      };

      mql.addEventListener("change", handleSystemChange);
      setMounted(true);

      return () => {
        mql.removeEventListener("change", handleSystemChange);
      };
    } catch {
      setMounted(true);
    }
  }, []);

  const setTheme = useCallback((newMode: ThemeMode) => {
    setThemeState(newMode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // Storage might be disabled in private browsing
    }

    let nextResolved: ResolvedTheme = "dark";
    if (newMode === "dark") {
      nextResolved = "dark";
    } else if (newMode === "light") {
      nextResolved = "light";
    } else {
      const isDark =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      nextResolved = isDark ? "dark" : "light";
    }

    setResolvedTheme(nextResolved);
    applyThemeClasses(nextResolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
