"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";

const surfaceCopy = {
  learn: {
    label: "Classroom",
    search: "Search courses, lessons, community posts...",
    actions: [
      { href: "/courses", label: "Browse courses" },
      { href: "/learn/community", label: "Community" },
    ],
  },
  teach: {
    label: "Teacher workspace",
    search: "Search courses, students, media...",
    actions: [
      { href: "/teach/builder", label: "Open builder" },
      { href: "/teach/media", label: "Media library" },
    ],
  },
  ops: {
    label: "Operations workspace",
    search: "Search users, courses, tickets...",
    actions: [
      { href: "/ops", label: "Review queue" },
      { href: "/support", label: "Support intake" },
    ],
  },
  platform: {
    label: "Skillset home",
    search: "Search Skillset...",
    actions: [
      { href: "/learn", label: "Classroom" },
      { href: "/teach", label: "Teacher Studio" },
    ],
  },
};

export function PlatformHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const surface = getSurface(pathname);
  const copy = surfaceCopy[surface];
  const initials = getInitials(user?.displayName ?? user?.email ?? "S");

  return (
    <header className="rounded-[14px] border border-[var(--color-line)] bg-white p-3 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {copy.label}
          </p>
          <p className="mt-1 truncate text-sm leading-6 text-[var(--color-ink-soft)]">
            Courses, community, events, and creator tools in one workspace.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="min-w-0 sm:w-80">
            <span className="sr-only">Workspace search</span>
            <input
              type="search"
              placeholder={copy.search}
              disabled
              className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] px-4 py-2.5 text-sm text-[var(--color-ink-soft)] outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {copy.actions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="button-outline px-3 py-2 text-xs"
              >
                {action.label}
              </Link>
            ))}
            <button
              type="button"
              disabled
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-ink-soft)] opacity-70"
              title="Notifications will be connected after the core course and payment loop is stable."
            >
              Alerts
            </button>
            <div className="grid size-9 place-items-center rounded-[10px] border border-[var(--color-line)] bg-[var(--color-primary)] text-xs font-semibold text-white">
              {initials}
            </div>
          </div>
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

function getInitials(value: string) {
  const parts = value
    .split(/[.\s@_-]+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "S";
  }

  return parts.map((part) => part[0]?.toUpperCase()).join("");
}
