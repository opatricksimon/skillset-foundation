"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { LogoWordmark } from "@/components/shared/logo-wordmark";
import { UserAvatar } from "@/components/shared/user-avatar";
import type { SkillsetUser } from "@/domain/auth";
import Link from "next/link";

const navItems = [
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/fees-and-payouts", label: "Fees & tax" },
  { href: "/contact", label: "Contact" },
];

const accessPaths = [
  {
    title: "Learner",
    eyebrow: "Study",
    description: "Browse courses, join communities, attend events, and track progress.",
    signInHref: "/login?path=student",
    signUpHref: "/signup?path=student",
  },
  {
    title: "Educator",
    eyebrow: "Teach",
    description: "Build courses, manage students, upload lessons, and submit for review.",
    signInHref: "/login?path=teacher",
    signUpHref: "/signup?path=teacher",
  },
];

export function SiteNav() {
  const { status, user, signOut } = useAuth();
  const isAuthenticated = status === "authenticated" && user;

  return (
    <header className="sticky top-0 z-30 border-b fine-rule bg-[rgba(255,255,255,0.94)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-1.5 sm:px-8">
        <LogoWordmark nav />
        <nav className="hidden items-center gap-4 text-[13px] font-medium text-[var(--color-ink-soft)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <details className="relative md:hidden">
            <summary className="button-outline list-none px-3 py-2 text-xs marker:hidden [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 mt-2 grid w-[min(calc(100vw-2rem),22rem)] gap-2 rounded-[12px] border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-soft)]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-1 grid gap-2 border-t border-[var(--color-line)] pt-2">
                {isAuthenticated ? (
                  <AccountMenu user={user} onSignOut={signOut} compact />
                ) : (
                  accessPaths.map((path) => (
                    <AccessPathCard key={path.title} {...path} compact />
                  ))
                )}
              </div>
            </div>
          </details>
          {isAuthenticated ? (
            <AccountMenu user={user} onSignOut={signOut} />
          ) : (
            <details className="group relative">
              <summary className="button-solid list-none px-3.5 py-2 text-xs marker:hidden sm:text-sm [&::-webkit-details-marker]:hidden">
                Get started
              </summary>
              <div className="absolute right-0 mt-2 grid w-[min(calc(100vw-2rem),28rem)] gap-3 rounded-[14px] border border-[var(--color-line)] bg-white p-3 shadow-[var(--shadow-strong)]">
                <div className="px-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    Choose your path
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-ink-soft)]">
                    One Skillset account can learn, teach, or do both after setup.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {accessPaths.map((path) => (
                    <AccessPathCard key={path.title} {...path} />
                  ))}
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    </header>
  );
}

function getPrimaryWorkspaceHref(user: SkillsetUser) {
  if (user.roles.includes("admin") || user.roles.includes("support")) {
    return "/ops";
  }

  if (user.roles.includes("teacher")) {
    return "/teach";
  }

  return "/learn";
}

function getPrimaryRoleLabel(user: SkillsetUser) {
  if (user.roles.includes("admin")) {
    return "Admin";
  }

  if (user.roles.includes("support")) {
    return "Support";
  }

  if (user.roles.includes("teacher")) {
    return "Educator";
  }

  return "Learner";
}

function AccountMenu({
  user,
  onSignOut,
  compact = false,
}: {
  user: SkillsetUser;
  onSignOut: () => Promise<void>;
  compact?: boolean;
}) {
  const workspaceHref = getPrimaryWorkspaceHref(user);

  return (
    <details className={compact ? "" : "group relative"}>
      <summary
        className={`cursor-pointer select-none list-none rounded-[10px] border border-[var(--color-line)] bg-white text-left marker:hidden [&::-webkit-details-marker]:hidden ${
          compact ? "p-3" : "px-2.5 py-1.5"
        }`}
      >
        <span className="flex items-center gap-2">
          <UserAvatar
            name={user.displayName || user.email}
            photoURL={user.photoURL}
            size="sm"
          />
          <span className={compact ? "grid" : "hidden text-left sm:grid"}>
            <span className="max-w-32 truncate text-xs font-bold text-[var(--color-ink)]">
              {user.displayName || user.email || "Skillset member"}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              {getPrimaryRoleLabel(user)}
            </span>
          </span>
        </span>
      </summary>
      <div
        className={`grid gap-1 rounded-[12px] border border-[var(--color-line)] bg-white p-2 shadow-[var(--shadow-soft)] ${
          compact ? "mt-2" : "absolute right-0 mt-2 w-60"
        }`}
      >
        <Link
          href={workspaceHref}
          className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]"
        >
          Open workspace
        </Link>
        <Link
          href="/profile"
          className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)]"
        >
          Profile settings
        </Link>
        {user.roles.includes("teacher") ? (
          <Link
            href="/teach"
            className="rounded-[8px] px-3 py-2 text-sm font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)]"
          >
            Teacher Studio
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => {
            void onSignOut();
          }}
          className="rounded-[8px] px-3 py-2 text-left text-sm font-semibold text-[var(--color-accent)] hover:bg-[rgba(178,34,52,0.06)]"
        >
          Sign out
        </button>
      </div>
    </details>
  );
}

function AccessPathCard({
  title,
  eyebrow,
  description,
  signInHref,
  signUpHref,
  compact = false,
}: {
  title: string;
  eyebrow: string;
  description: string;
  signInHref: string;
  signUpHref: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-sm font-bold text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
        {description}
      </p>
      <div className="mt-3 grid gap-2">
        <Link href={signUpHref} className="button-solid px-3 py-2 text-xs">
          Create account
        </Link>
        <Link href={signInHref} className="button-outline px-3 py-2 text-xs">
          Sign in
        </Link>
      </div>
    </div>
  );
}
