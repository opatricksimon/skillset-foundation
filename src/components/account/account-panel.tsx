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

export function AccountPanel({
  active,
  children,
}: {
  active: (typeof accountLinks)[number][0];
  children: ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-[14px] border border-[var(--color-line)] bg-white p-3 shadow-[var(--shadow-soft)]">
        <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Account
        </p>
        <nav className="mt-3 grid gap-1" aria-label="Account settings">
          {accountLinks.map(([label, href]) => {
            const isActive = label === active;
            const short =
              label === "Payments"
                ? "Pa"
                : label === "Notifications"
                  ? "No"
                  : label.slice(0, 2);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-[10px] px-2 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "platform-nav-active bg-[var(--color-primary)] shadow-[0_10px_22px_rgba(26,54,93,0.16)]"
                    : "text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]"
                }`}
              >
                <span
                  className={`grid size-7 place-items-center rounded-[8px] text-[11px] font-bold ${
                    isActive
                      ? "bg-[var(--color-base)]"
                      : "bg-[var(--color-surface-soft)] text-[var(--color-primary)]"
                  }`}
                  style={
                    isActive ? { color: "var(--color-primary)" } : undefined
                  }
                >
                  {short}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="space-y-5">{children}</div>
    </div>
  );
}
