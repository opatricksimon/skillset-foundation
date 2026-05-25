"use client";

import Link from "next/link";
import { Clock3, RotateCcw, ShieldCheck, WalletCards } from "lucide-react";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { HorizontalTabs } from "@/components/shared/horizontal-tabs";
import { TableEmptyRow } from "@/components/shared/table-empty-row";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processed", label: "Processed" },
  { value: "rejected", label: "Rejected" },
];

export default function TeacherRefundsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Refunds."
        description="Review refund requests and outcomes across your courses."
      >
        <div className="grid gap-5">
          <section className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Clock3,
                label: "Pending",
                value: "0",
                detail: "No open refund requests.",
              },
              {
                icon: RotateCcw,
                label: "Processed",
                value: "0",
                detail: "Refund records will appear here.",
              },
              {
                icon: WalletCards,
                label: "Refunded value",
                value: "$0",
                detail: "Tracked after checkout events exist.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="rounded-[16px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                        {item.label}
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                        {item.value}
                      </p>
                    </div>
                    <span className="grid size-10 place-items-center rounded-[10px] bg-[var(--color-surface-soft)] text-[var(--color-primary)]">
                      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--color-ink-soft)]">
                    {item.detail}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="rounded-[16px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-white text-[var(--color-primary)]">
                  <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-ink)]">
                    Refund policy stays tied to checkout.
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)]">
                    When orders exist, this page should show requests, reasons,
                    Stripe status, and whether payout release is blocked. Until
                    then, the empty state is explicit instead of looking broken.
                  </p>
                </div>
              </div>
              <Link href="/account/payments" className="button-outline px-4 py-3 text-sm">
                Payments settings
              </Link>
            </div>
          </section>

          <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <HorizontalTabs
            tabs={tabs}
            activeValue="all"
            onChange={() => undefined}
            ariaLabel="Refund filters"
          />
          <div className="mt-6 overflow-x-auto rounded-[4px] border border-[var(--color-line)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[var(--color-surface-soft)] text-xs uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <TableEmptyRow
                  colSpan={7}
                  message="No refunds yet."
                  detail="That's a good sign. Refund records will appear here after requests are processed."
                />
              </tbody>
            </table>
          </div>
          </section>
        </div>
      </PlatformShell>
    </ProtectedSurface>
  );
}
