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
  type Permission,
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

// Explicit workspace switcher (Learn / Teach / Ops). Only the workspaces
// the member can access are shown; with a single workspace it is hidden.
const workspaces: {
  context: PlatformNavContext;
  label: string;
  href: string;
  permission: Permission;
}[] = [
  {
    context: "learner",
    label: "Learn",
    href: "/learn",
    permission: "courses.viewLearning",
  },
  {
    context: "teacher",
    label: "Teach",
    href: "/teach",
    permission: "teacherStudio.access",
  },
  {
    context: "ops",
    label: "Ops",
    href: "/ops",
    permission: "platform.accessAdmin",
  },
];

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

  const availableWorkspaces = workspaces.filter((workspace) =>
    hasPermission(subject, workspace.permission),
  );

  return (
    <nav className="mt-2 flex flex-col gap-0.5">
      {!collapsed && availableWorkspaces.length > 1 ? (
        <div className="mb-1">
          <p className="px-2 pb-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
            Workspace
          </p>
          <div className="flex gap-1 rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-1">
            {availableWorkspaces.map((workspace) => {
              const active = workspace.context === context;

              return (
                <Link
                  key={workspace.context}
                  href={workspace.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex-1 rounded-[7px] px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.08em] transition-colors ${
                    active
                      ? "bg-[var(--color-primary)] text-white shadow-[0_6px_14px_rgba(26,54,93,0.18)]"
                      : "text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-primary)]"
                  }`}
                >
                  {workspace.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

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
          ? "border-[rgba(24,58,94,0.2)] bg-[var(--color-primary)] text-white shadow-[0_10px_22px_rgba(26,54,93,0.16)] hover:text-white"
          : "border-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span
        className={`grid size-6 shrink-0 place-items-center rounded-[7px] border ${
          active
            ? "border-white/20 bg-white/15"
            : "border-[var(--color-line)] bg-white group-hover:border-[rgba(26,54,93,0.18)]"
        }`}
      >
        <Icon
          size={13}
          strokeWidth={2.2}
          className={active ? "text-white" : "text-[var(--color-primary)]"}
        />
      </span>
      <span className={`platform-sidebar-label ${active ? "text-white" : ""}`}>
        {label}
      </span>
    </Link>
  );
}
