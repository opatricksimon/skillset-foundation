"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, toggleMode } = useTheme();
  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleMode}
      className="relative grid size-10 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-soft)] text-[var(--color-ink)] transition duration-[180ms] hover:bg-[var(--color-surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(26,54,93,0.28)]"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.9} />
    </button>
  );
}
