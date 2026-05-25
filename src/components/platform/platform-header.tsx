"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { NotificationBell } from "@/components/platform/notification-bell";
import { AccountMenu } from "@/components/site/account-menu";
import { LogoWordmark } from "@/components/shared/logo-wordmark";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { platformNav } from "@/data/site";

const surfaceCopy = {
  learn: {
    crumb: "Learner",
    cta: { label: "Browse programs", href: "/courses" },
  },
  teach: {
    crumb: "Teach",
    cta: null,
  },
  ops: {
    crumb: "Operations",
    cta: { label: "Review queue", href: "/ops" },
  },
  account: {
    crumb: "Account",
    cta: { label: "Explore courses", href: "/courses" },
  },
  platform: {
    crumb: "Platform",
    cta: { label: "Explore courses", href: "/courses" },
  },
};

export function PlatformHeader({
  onOpenMobileNav,
}: {
  onOpenMobileNav?: () => void;
}) {
  const pathname = usePathname() ?? "";
  const { status, user, signOut } = useAuth();
  const surface = getSurface(pathname);
  const copy = surfaceCopy[surface];
  const pageLabel = getPageLabel(pathname);

  return (
    <header className="border-b border-[var(--color-line)] bg-white">
      <div className="flex w-full items-center gap-3 px-4 py-2.5 sm:px-6">
        <LogoWordmark nav href="/" className="mr-2" />
        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 items-center gap-1.5 text-sm md:flex"
        >
          <span className="hidden shrink-0 text-[var(--color-ink-soft)] sm:inline">
            {copy.crumb}
          </span>
          <span
            aria-hidden="true"
            className="hidden text-[var(--color-ink-muted)] sm:inline"
          >
            /
          </span>
          <span className="truncate font-semibold text-[var(--color-ink)]">
            {pageLabel}
          </span>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="hidden sm:block">
            <NotificationBell />
          </div>
          {copy.cta ? (
            <Link
              href={copy.cta.href}
              aria-label={copy.cta.label}
              className="button-solid hidden px-4 py-2 text-sm sm:inline-flex"
            >
              {copy.cta.label}
            </Link>
          ) : null}
          {status === "authenticated" && user ? (
            <AccountMenu user={user} onSignOut={signOut} />
          ) : null}
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="grid size-10 place-items-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-soft)] text-[var(--color-ink)] transition hover:bg-[var(--color-surface-strong)] sm:hidden"
            aria-label="Open navigation menu"
          >
            <Menu aria-hidden="true" size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}

function getSurface(pathname: string): keyof typeof surfaceCopy {
  if (pathname.startsWith("/learn")) {
    return "learn";
  }

  if (pathname.startsWith("/teach")) {
    return "teach";
  }

  if (pathname.startsWith("/ops")) {
    return "ops";
  }

  if (pathname.startsWith("/account")) {
    return "account";
  }

  return "platform";
}

function getPageLabel(pathname: string): string {
  const matches = platformNav
    .filter(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length);

  if (matches[0]) {
    return matches[0].label;
  }

  const segment = pathname.split("/").filter(Boolean).pop() ?? "Home";
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
