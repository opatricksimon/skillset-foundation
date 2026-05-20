"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Calendar,
  CreditCard,
  GraduationCap,
  Image,
  LayoutDashboard,
  PenTool,
  Plug,
  RefreshCw,
  Settings,
  ShoppingBag,
  Tag,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { platformNav, type PlatformNavContext } from "@/data/site";
import {
  hasPermission,
  type PermissionSubject,
} from "@/lib/permissions";

// Map icon key strings (from site.ts) to Lucide components.
// Adding an icon to platformNav? Add its import above and entry here.
const iconMap: Record<string, LucideIcon> = {
  Award,
  BookOpen,
  Calendar,
  CreditCard,
  GraduationCap,
  Image,
  LayoutDashboard,
  PenTool,
  Plug,
  RefreshCw,
  Settings,
  ShoppingBag,
  Tag,
  UserCheck,
  Users,
};

// Workspace switching lives in the top-right AccountMenu ("Switch view"
// section with Manage my teaching / My learning) — clearer labels and a
// single source of truth. The 2-letter LEARN/TEACH/OPS chips that used
// to live at the top of this sidebar were redundant.

export function PlatformNav({ collapsed = false }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname() ?? "";
  const subject: PermissionSubject = { roles: user?.roles ?? ["guest"] };
  const context = resolveContext(pathname, subject);

  const visibleItems = platformNav.filter(
    (item) =>
      item.contexts.includes(context) &&
      (!item.permission || hasPermission(subject, item.permission)),
  );

  return (
    <nav className="mt-2 flex flex-col gap-0.5">
      {visibleItems.map((item, index) => {
        const previous = visibleItems[index - 1];
        const showHeader =
          previous === undefined || previous.section !== item.section;

        return (
          <Fragment key={item.href}>
            {!collapsed && showHeader ? (
              <p className="mt-1.5 px-2 pb-0 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)] first:mt-0">
                {item.section}
              </p>
            ) : null}
            <PlatformNavLink
              href={item.href}
              label={item.label}
              icon={item.icon}
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

  // Neutral pages (Marketplace, Account) follow the member's primary
  // workspace so a teacher keeps their studio sidebar until they switch.
  if (hasPermission(subject, "platform.accessAdmin")) {
    return "ops";
  }

  if (hasPermission(subject, "teacherStudio.access")) {
    return "teacher";
  }

  return "learner";
}

function isActivePlatformRoute(pathname: string, href: string) {
  if (["/learn", "/teach", "/ops", "/account"].includes(href)) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function PlatformNavLink({
  href,
  label,
  icon,
  active,
  collapsed,
}: {
  href: string;
  label: string;
  icon: string;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = iconMap[icon] ?? LayoutDashboard;

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`group flex items-center gap-2 rounded-[10px] border py-1 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(44,82,130,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${collapsed ? "justify-center px-0" : "px-2.5"} ${
        active
          ? "platform-nav-active border-[rgba(24,58,94,0.2)] bg-[var(--color-primary)] shadow-[0_10px_22px_rgba(26,54,93,0.16)]"
          : "border-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-[7px] border ${
          active
            ? "border-[var(--color-base)]/30 bg-[var(--color-base)]"
            : "border-[var(--color-line)] bg-white group-hover:border-[rgba(26,54,93,0.18)]"
        }`}
      >
        <Icon
          size={13}
          strokeWidth={2.2}
          className="text-[var(--color-primary)]"
        />
      </span>
      <span
        className={`platform-sidebar-label ${active ? "text-[var(--color-base)]" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}
