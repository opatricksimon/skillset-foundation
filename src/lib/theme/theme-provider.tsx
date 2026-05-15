"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

type ThemeContextValue = {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

const storageKey = "skillset_theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedMode = window.localStorage.getItem(storageKey);

  return storedMode === "dark" || storedMode === "system" || storedMode === "light"
    ? storedMode
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getStoredMode);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme);
  const resolvedTheme = mode === "system" ? systemTheme : mode;

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(getSystemTheme());

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [resolvedTheme]);

  function setMode(nextMode: ThemeMode) {
    setModeState(nextMode);
    window.localStorage.setItem(storageKey, nextMode);
  }

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
      toggleMode: () => setMode(resolvedTheme === "dark" ? "light" : "dark"),
    }),
    [mode, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
