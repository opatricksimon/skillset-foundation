"use client";

import type { ReactNode } from "react";

import { MobileSidebarDrawer } from "@/components/platform/mobile-sidebar-drawer";
import { HelpBubble } from "@/components/platform/help-bubble";
import { LogoWordmark } from "@/components/shared/logo-wordmark";
import { PlatformHeader } from "@/components/platform/platform-header";
import { PlatformNav } from "@/components/platform/platform-nav";
import { SidebarToggle } from "@/components/platform/sidebar-toggle";
import { StatusBanner } from "@/components/platform/status-banner";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { useSidebarState } from "@/lib/ui/sidebar-state";

type PlatformShellProps = {
  /** Title is always required — it's the page identity in the sidebar grid. */
  title: string;
  /** Small uppercase label above the title. Optional. */
  eyebrow?: string;
  /** One-paragraph context line below the title. Optional. */
  description?: string;
  /**
   * Compact variant: smaller title, tighter padding. Use for inner pages
   * where a tab/breadcrumb already gives context (e.g. /account/billing).
   * Default = false (full hero, fine for workspace landings like /teach).
   */
  compact?: boolean;
  children: ReactNode;
};

export function PlatformShell({
  eyebrow,
  title,
  description,
  compact = false,
  children,
}: PlatformShellProps) {
  const {
    handleMouseEnter,
    handleMouseLeave,
    isCollapsed,
    persistentState,
    toggle,
  } = useSidebarState();

  return (
    <ThemeProvider>
      <main className="page-shell min-h-screen">
      <StatusBanner />
      <PlatformHeader />
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        <div className={`platform-grid gap-6 ${isCollapsed ? "platform-grid--collapsed" : ""}`}>
          <aside
            className={`platform-sidebar platform-sidebar-panel h-fit rounded-[14px] border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-soft)] ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SidebarToggle
              state={persistentState}
              isCollapsed={isCollapsed}
              onToggle={toggle}
            />
            {isCollapsed ? (
              <div className="mt-1 px-1">
                <LinkLogo />
              </div>
            ) : (
              <div className="mt-1 flex items-center justify-between gap-3 px-1">
                <LogoWordmark nav href="/" />
                <span className="platform-sidebar-label rounded-[6px] border border-[rgba(178,34,52,0.18)] bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  beta
                </span>
              </div>
            )}
            <PlatformNav collapsed={isCollapsed} />
            {/* Profile + sign-out live in the top-right AccountMenu; the
                sidebar footer is intentionally just the theme toggle. */}
            <div
              className={`mt-2 flex items-center border-t border-[var(--color-line)] pt-2 ${
                isCollapsed ? "justify-center" : "justify-end"
              }`}
            >
              <ThemeToggle />
            </div>
          </aside>
          <section className={`platform-content ${compact ? "space-y-4" : "space-y-6"}`}>
            <div
              className={`rounded-[16px] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)] ${compact ? "px-5 py-4" : "p-5"}`}
            >
              {eyebrow ? (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {eyebrow}
                </p>
              ) : null}
              <h1
                className={
                  compact
                    ? "display-title max-w-4xl text-2xl leading-tight text-[var(--color-primary)] sm:text-3xl"
                    : `display-title ${eyebrow ? "mt-3" : ""} max-w-4xl text-4xl leading-none text-[var(--color-primary)] sm:text-5xl`
                }
              >
                {title}
              </h1>
              {description ? (
                <p
                  className={`max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)] ${compact ? "mt-2" : "mt-3"}`}
                >
                  {description}
                </p>
              ) : null}
            </div>
            {children}
          </section>
        </div>
      </div>
      <MobileSidebarDrawer />
      <HelpBubble />
      </main>
    </ThemeProvider>
  );
}

function LinkLogo() {
  // Collapsed sidebar: show the round emblem (theme-agnostic) instead of a
  // plain "S". LogoWordmark already provides the link wrapper.
  return <LogoWordmark variant="mark" className="mx-auto" />;
}
