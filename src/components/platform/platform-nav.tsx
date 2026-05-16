"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { platformNav, type PlatformNavContext } from "@/data/site";
import { hasPermission, type PermissionSubject } from "@/lib/permissions";

export function PlatformNav({ collapsed = false }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const subject: PermissionSubject = { roles: user?.roles ?? ["guest"] };
  const context = resolveContext(pathname, subject);

  const visibleItems = platformNav.filter(
    (item) =>
      item.contexts.includes(context) &&
      (!item.permission || hasPermission(subject, item.permission)),
  );

  return (
    <nav className="mt-3 flex flex-col gap-1">
      {visibleItems.map((item, index) => {
        const previous = visibleItems[index - 1];
        const showDivider = previous !== undefined && previous.group !== item.group;

        return (
          <Fragment key={item.href}>
            {showDivider ? (
              <div
                role="separator"
                aria-hidden="true"
                className="mx-1 my-1.5 h-px bg-[var(--color-line)]"
              />
            ) : null}
            <PlatformNavLink
              href={item.href}
              label={item.label}
              shortLabel={item.shortLabel}
              active={isActivePlatformRoute(pathname, item.href)}
              collapsed={collapsed}
            />
          </Fragment>
        );
      })}
    </nav>
  );
}

function resolveContext(
  pathname: string,
  subject: PermissionSubject,
): PlatformNavContext {
  if (pathname.startsWith("/learn")) {
    return "learner";
  }

  if (pathname.startsWith("/teach")) {
    return "teacher";
  }

  if (pathname.startsWith("/ops")) {
    return "ops";
  }

  // Neutral pages (Home, Marketplace, Account) follow the member's primary
  // workspace so a teacher keeps their studio sidebar until they explicitly
  // switch to "My learning" from the top-right account menu.
  if (hasPermission(subject, "platform.accessAdmin")) {
    return "ops";
  }

  if (hasPermission(subject, "teacherStudio.access")) {
    return "teacher";
  }

  return "learner";
}

function isActivePlatformRoute(pathname: string, href: string) {
  if (["/platform", "/learn", "/teach", "/ops"].includes(href)) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function PlatformNavLink({
  href,
  label,
  shortLabel,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  shortLabel: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-2 rounded-[10px] border py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(44,82,130,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${collapsed ? "justify-center px-0" : "px-2.5"} ${
        active
          ? "border-[rgba(24,58,94,0.2)] bg-[var(--color-primary)] text-white shadow-[0_10px_22px_rgba(26,54,93,0.16)] hover:text-white"
          : "border-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-[7px] border text-[10px] font-bold ${
          active
            ? "border-white/20 bg-white/14 text-white"
            : "border-[var(--color-line)] bg-white text-[var(--color-primary)] group-hover:border-[rgba(26,54,93,0.18)]"
        }`}
      >
        {shortLabel}
      </span>
      <span className={`platform-sidebar-label ${active ? "text-white" : ""}`}>
        {label}
      </span>
    </Link>
  );
}
