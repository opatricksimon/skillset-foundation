"use client";

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
        <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
                Discounts
              </p>
              <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
                Coupon manager
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
                Coupon creation is staged for P2. The UI surface is ready so
                pricing workflows have a stable destination.
              </p>
            </div>
            <StatusChip status="pending" label="Coming soon" />
          </div>
          <ListingSearchBar
            value=""
            onChange={() => undefined}
            placeholder="Search coupons..."
            className="mt-6"
          />
          <div className="mt-6 rounded-[14px] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-soft)] p-5 text-sm leading-7 text-[var(--color-ink-soft)]">
            No coupons yet. Coupon creation will activate after discount rules
            are wired into checkout.
          </div>
        </section>
      </PlatformShell>
    </ProtectedSurface>
  );
}
