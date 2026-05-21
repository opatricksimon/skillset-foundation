"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, type KeyboardEvent } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { NotificationBell } from "@/components/platform/notification-bell";
import { AccountMenu } from "@/components/site/account-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { platformNav } from "@/data/site";

const surfaceCopy = {
  learn: {
    crumb: "Learner",
    search: "Search courses, lessons...",
    searchHref: "/courses",
    cta: { label: "Browse programs", href: "/courses" },
  },
  teach: {
    crumb: "Educator",
    search: "Search courses, students...",
    searchHref: "/courses",
    cta: { label: "New course", href: "/teach/builder" },
  },
  ops: {
    crumb: "Operations",
    search: "Search users, courses...",
    searchHref: "/courses",
    cta: { label: "Review queue", href: "/ops" },
  },
  platform: {
    crumb: "Skillset",
    search: "Search Skillset...",
    searchHref: "/courses",
    cta: { label: "Explore courses", href: "/courses" },
  },
};

export function PlatformHeader() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { status, user, signOut } = useAuth();
  const surface = getSurface(pathname);
  const copy = surfaceCopy[surface];
  const pageLabel = getPageLabel(pathname);
  const searchRef = useRef<HTMLInputElement>(null);

  function handleSearchKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;
    const q = searchRef.current?.value.trim();
    if (q) {
      router.push(`${copy.searchHref}?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <header className="border-b border-[var(--color-line)] bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-sm"
        >
          <Link
            href="/"
            className="hidden text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-primary)] sm:inline"
          >
            Skillset
          </Link>
          <span
            aria-hidden="true"
            className="hidden text-[var(--color-ink-muted)] sm:inline"
          >
            /
          </span>
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

        {/* Search input only on sm+ — on mobile the marketplace surface
            has its own search field; cramming it into a 375px header
            squeezed every other action. */}
        <label className="ml-auto hidden min-w-0 max-w-[240px] flex-1 sm:block sm:max-w-xs">
          <span className="sr-only">
            Workspace search — press Enter to search
          </span>
          <input
            ref={searchRef}
            type="search"
            placeholder={copy.search}
            onKeyDown={handleSearchKey}
            className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] px-4 py-2 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-primary-light)] focus:bg-white"
          />
        </label>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <ThemeToggle />
          <NotificationBell />
          {/* Primary CTA: full label on sm+, icon-only chip on mobile.
              Was hidden entirely on mobile before, leaving inner pages with
              no primary action in the header. */}
          <Link
            href={copy.cta.href}
            aria-label={copy.cta.label}
            className="button-solid hidden px-4 py-2 text-sm sm:inline-flex"
          >
            {copy.cta.label}
          </Link>
          <Link
            href={copy.cta.href}
            aria-label={copy.cta.label}
            title={copy.cta.label}
            className="button-solid grid size-9 place-items-center px-0 py-0 text-sm sm:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </Link>
          {status === "authenticated" && user ? (
            <AccountMenu user={user} onSignOut={signOut} />
          ) : null}
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
