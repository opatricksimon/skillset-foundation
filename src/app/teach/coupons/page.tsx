"use client";

import Link from "next/link";
import { Gift, Percent, ShieldCheck, Ticket } from "lucide-react";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { ListingSearchBar } from "@/components/shared/listing-search-bar";
import { StatusChip } from "@/components/shared/status-chip";

export default function TeacherCouponsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.manageCourses"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Coupons."
        description="Create course discounts after checkout coupon rules are connected to Stripe."
      >
        <section className="overflow-hidden rounded-[18px] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]">
          <div className="grid gap-6 border-b border-[var(--color-line)] bg-[linear-gradient(135deg,#ffffff_0%,var(--color-surface-soft)_100%)] p-6 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  Discounts
                </p>
                <StatusChip status="pending" label="Checkout wiring required" />
              </div>
              <h3 className="display-title mt-4 text-4xl leading-tight text-[var(--color-primary)]">
                Coupon manager
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
                This is where creators will create codes, limit usage, attach
                discounts to courses, and send the rule to Stripe Checkout. For
                MVP, keep the pricing model clean until paid checkout is fully
                verified end to end.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/teach" className="button-solid px-4 py-3 text-sm">
                  Back to Studio
                </Link>
                <Link href="/account/payments#stripe-connect" className="button-outline px-4 py-3 text-sm">
                  Check payout setup
                </Link>
              </div>
            </div>
            <div className="rounded-[16px] bg-[var(--color-primary)] p-5 text-white shadow-[var(--shadow-strong)]">
              <Ticket aria-hidden="true" size={28} strokeWidth={1.7} />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/62">
                Planned flow
              </p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.03em]">
                Code, discount, limits, course scope.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">
                No fake coupons are shown. The page explains the future workflow
                and keeps creators oriented.
              </p>
            </div>
          </div>
          <div className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Gift,
                  title: "Launch offers",
                  detail: "Intro codes for early cohorts and beta launches.",
                },
                {
                  icon: Percent,
                  title: "Fixed or percentage",
                  detail: "Support percentage and fixed-amount discounts later.",
                },
                {
                  icon: ShieldCheck,
                  title: "Checkout-safe",
                  detail: "Rules must be enforced by Stripe, not just the browser.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4"
                  >
                    <span className="grid size-10 place-items-center rounded-[10px] bg-white text-[var(--color-primary)]">
                      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    </span>
                    <h4 className="mt-4 text-sm font-bold text-[var(--color-ink)]">
                      {item.title}
                    </h4>
                    <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                      {item.detail}
                    </p>
                  </article>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ListingSearchBar
                value=""
                onChange={() => undefined}
                placeholder="Search coupons..."
              />
              <button
                type="button"
                disabled
                className="button-outline px-4 py-3 text-sm opacity-60"
              >
                Create coupon
              </button>
            </div>
            <div className="overflow-x-auto rounded-[14px] border border-[var(--color-line)]">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-[var(--color-surface-soft)] text-xs uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Code</th>
                    <th className="px-5 py-3 font-semibold">Discount</th>
                    <th className="px-5 py-3 font-semibold">Course</th>
                    <th className="px-5 py-3 font-semibold">Usage</th>
                    <th className="px-5 py-3 font-semibold">Valid until</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center">
                      <p className="text-sm font-bold text-[var(--color-ink)]">
                        No coupon rules exist yet.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                        Coupon creation activates after Stripe Checkout discount
                        rules are connected.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </PlatformShell>
    </ProtectedSurface>
  );
}
