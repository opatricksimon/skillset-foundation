import Link from "next/link";
import type { ReactNode } from "react";

const accountLinks = [
  ["Profile", "/account/profile"],
  ["Email", "/account/email"],
  ["Security", "/account/security"],
  ["Payments", "/account/payments"],
  ["Billing", "/account/billing"],
  ["Notifications", "/account/notifications"],
] as const;

type AccountLink = (typeof accountLinks)[number][0];

export function AccountPanel({
  active,
  children,
}: {
  active: AccountLink;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      {/* Mobile: horizontal-scroll tab strip (snap, single row). Keeps the
          6-item nav out of the way so content stays in the first scroll.
          Desktop (lg+): vertical sidebar — same items, more breathing room
          when there's space to spare. */}
      <AccountNavMobile active={active} />
      <aside className="dash-card dash-card--strong hidden h-fit p-3 lg:block">
        <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Account
        </p>
        <nav className="mt-3 grid gap-1" aria-label="Account settings">
          {accountLinks.map(([label, href]) => (
            <AccountNavLink
              key={href}
              label={label}
              href={href}
              isActive={label === active}
            />
          ))}
        </nav>
      </aside>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function AccountNavMobile({ active }: { active: AccountLink }) {
  return (
    <nav
      aria-label="Account settings"
      className="dash-card dash-card--strong overflow-x-auto px-2 py-2 lg:hidden"
    >
      <div className="flex min-w-max gap-1">
        {accountLinks.map(([label, href]) => {
          const isActive = label === active;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-[3px] px-3 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "platform-nav-active bg-[var(--color-primary)]"
                  : "text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AccountNavLink({
  label,
  href,
  isActive,
}: {
  label: AccountLink;
  href: string;
  isActive: boolean;
}) {
  const short =
    label === "Payments"
      ? "Pa"
      : label === "Notifications"
        ? "No"
        : label.slice(0, 2);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 rounded-[3px] px-2 py-2 text-sm font-semibold transition ${
        isActive
          ? "platform-nav-active bg-[var(--color-primary)]"
          : "text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]"
      }`}
    >
      <span
        className={`grid size-7 place-items-center rounded-[2px] text-[11px] font-bold ${
          isActive
            ? "bg-[var(--color-base)]"
            : "bg-[var(--color-surface-soft)] text-[var(--color-primary)]"
        }`}
        style={isActive ? { color: "var(--color-primary)" } : undefined}
      >
        {short}
      </span>
      {label}
    </Link>
  );
}
