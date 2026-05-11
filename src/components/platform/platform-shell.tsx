"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { MobileSidebarDrawer } from "@/components/platform/mobile-sidebar-drawer";
import { LogoWordmark } from "@/components/shared/logo-wordmark";
import { PlatformHeader } from "@/components/platform/platform-header";
import { PlatformNav } from "@/components/platform/platform-nav";
import { SidebarToggle } from "@/components/platform/sidebar-toggle";
import { SessionCard } from "@/components/platform/session-card";
import { useSidebarState } from "@/lib/ui/sidebar-state";

type PlatformShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PlatformShell({
  eyebrow,
  title,
  description,
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
    <main className="page-shell min-h-screen">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6">
        <div className={`platform-grid gap-6 ${isCollapsed ? "platform-grid--collapsed" : ""}`}>
          <aside
            className={`platform-sidebar platform-sidebar-panel h-fit rounded-[14px] border border-[var(--color-line)] bg-white p-3 shadow-[var(--shadow-soft)] ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SidebarToggle
              state={persistentState}
              isCollapsed={isCollapsed}
              onToggle={toggle}
            />
            <div className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-3">
              {isCollapsed ? (
                <LinkLogo />
              ) : (
                <>
                  <LogoWordmark nav href="/" />
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="platform-sidebar-label">
                      <h1 className="text-sm font-bold text-[var(--color-primary)]">
                        Skillset
                      </h1>
                      <p className="mt-0.5 text-xs text-[var(--color-ink-soft)]">
                        Professional learning network
                      </p>
                    </div>
                    <span className="platform-sidebar-label rounded-[8px] border border-[rgba(178,34,52,0.18)] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                      beta
                    </span>
                  </div>
                </>
              )}
            </div>
            <PlatformNav collapsed={isCollapsed} />
            <SessionCard collapsed={isCollapsed} />
          </aside>
          <section className="platform-content space-y-6">
            <PlatformHeader />
            <div className="rounded-[16px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                {eyebrow}
              </p>
              <h2 className="display-title mt-3 max-w-4xl text-4xl leading-none text-[var(--color-primary)] sm:text-5xl">
                {title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)]">
                {description}
              </p>
            </div>
            {children}
          </section>
        </div>
      </div>
      <MobileSidebarDrawer />
    </main>
  );
}

function LinkLogo() {
  return (
    <Link
      href="/"
      aria-label="Skillset"
      className="mx-auto grid size-10 place-items-center rounded-[10px] bg-white text-lg font-bold text-[var(--color-primary)] shadow-[var(--shadow-soft)]"
    >
      S
    </Link>
  );
}
