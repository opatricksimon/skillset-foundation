"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { platformNav } from "@/data/site";
import { hasPermission } from "@/lib/permissions";

export function PlatformNav({ collapsed = false }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const subject = { roles: user?.roles ?? ["guest"] };
  const visibleItems = platformNav.filter(
    (item) => !item.permission || hasPermission(subject, item.permission),
  );
  const sections = Array.from(new Set(visibleItems.map((item) => item.section)));

  return (
    <nav className="mt-4 flex flex-col gap-4">
      {sections.map((section, index) => (
        <div
          key={section}
          className={`grid gap-1.5 ${
            index === 0 ? "" : "border-t border-[var(--color-line)] pt-4"
          }`}
        >
          <p className="platform-sidebar-label px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
            {section}
          </p>
          {visibleItems
            .filter((item) => item.section === section)
            .map((item) => (
              <PlatformNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                shortLabel={item.shortLabel}
                active={isActivePlatformRoute(pathname, item.href)}
                collapsed={collapsed}
              />
            ))}
        </div>
      ))}
    </nav>
  );
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
      className={`group flex items-center gap-2 rounded-[10px] border py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(44,82,130,0.24)] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${collapsed ? "justify-center px-0" : "px-2.5"} ${
        active
          ? "border-[rgba(24,58,94,0.2)] bg-[var(--color-primary)] text-white shadow-[0_10px_22px_rgba(26,54,93,0.16)] hover:text-white"
          : "border-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]"
      }`}
    >
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-[8px] border text-[10px] font-bold ${
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
