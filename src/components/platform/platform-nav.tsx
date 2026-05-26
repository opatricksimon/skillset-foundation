"use client";

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
  Receipt,
  RefreshCw,
  Settings,
  ShoppingBag,
  Tag,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  platformNav,
  type PlatformNavContext,
  type PlatformNavItem,
} from "@/data/site";
import {
  hasPermission,
  type PermissionSubject,
} from "@/lib/permissions";

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
  Receipt,
  RefreshCw,
  Settings,
  ShoppingBag,
  Tag,
  UserCheck,
  Users,
};

export function PlatformNav({ collapsed = false }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname() ?? "";
  const subject: PermissionSubject = { roles: user?.roles ?? ["guest"] };
  const context = resolveContext(pathname, subject);
  const canSwitchWorkspace = hasPermission(subject, "teacherStudio.access");

  const visibleItems = platformNav.filter(
    (item) =>
      item.contexts.includes(context) &&
      (!item.permission || hasPermission(subject, item.permission)),
  );
  const sections = groupBySection(visibleItems, context);

  return (
    <nav className="platform-sidebar-nav mt-3 flex flex-col gap-4" aria-label="Workspace">
      {!collapsed && canSwitchWorkspace ? (
        <div className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-2">
          <div className="grid grid-cols-2 gap-1 rounded-[8px] border border-[var(--color-line)] bg-white p-1">
            <WorkspaceSwitchLink
              href="/learn"
              active={context === "learner"}
              label="Learner"
            />
            <WorkspaceSwitchLink
              href="/teach"
              active={context === "teacher"}
              label="Creator"
            />
          </div>
        </div>
      ) : null}

      {sections.map((section) => (
        <div key={section.label} className="grid gap-1">
          {!collapsed ? (
            <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-muted)]">
              {section.label}
            </p>
          ) : null}
          {section.items.map((item) => (
            <PlatformNavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActivePlatformRoute(pathname, item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

function groupBySection(items: PlatformNavItem[], context: PlatformNavContext) {
  const sectionOrder: Record<PlatformNavContext, string[]> = {
    learner: ["Discover", "Learn", "Account"],
    teacher: ["Teach", "Discover", "Account", "Growth", "Setup"],
    ops: ["Operations", "Discover", "Account"],
  };
  const groups = new Map<string, PlatformNavItem[]>();

  items.forEach((item) => {
    groups.set(item.section, [...(groups.get(item.section) ?? []), item]);
  });

  const orderedLabels = [
    ...sectionOrder[context],
    ...Array.from(groups.keys()).filter(
      (label) => !sectionOrder[context].includes(label),
    ),
  ];

  return orderedLabels
    .map((label) => ({ label, items: groups.get(label) ?? [] }))
    .filter((group) => group.items.length > 0);
}

function WorkspaceSwitchLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`workspace-switch-link rounded-[7px] px-3 py-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] transition ${
        active
          ? "workspace-switch-link--active bg-[var(--color-primary)] text-white shadow-[var(--shadow-button)]"
          : "text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
      }`}
    >
      {label}
    </Link>
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

  if (hasPermission(subject, "platform.accessAdmin")) {
    return "ops";
  }

  if (hasPermission(subject, "teacherStudio.access")) {
    return "teacher";
  }

  return "learner";
}

function isActivePlatformRoute(pathname: string, href: string) {
  if (href === "/account") {
    return (
      pathname === "/account" ||
      pathname.startsWith("/account/profile") ||
      pathname.startsWith("/account/email") ||
      pathname.startsWith("/account/security") ||
      pathname.startsWith("/account/notifications")
    );
  }

  if (["/learn", "/teach", "/ops"].includes(href)) {
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
      className={`platform-nav-link group flex items-center gap-2.5 rounded-[10px] border py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(44,82,130,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${collapsed ? "justify-center px-0" : "px-2.5"} ${
        active
          ? "platform-nav-active border-[rgba(24,58,94,0.2)] bg-[var(--color-primary)] shadow-[0_10px_22px_rgba(26,54,93,0.16)]"
          : "border-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-strong)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span className="platform-nav-icon-chip">
        <Icon
          aria-hidden="true"
          size={18}
          strokeWidth={2}
          className="shrink-0"
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
