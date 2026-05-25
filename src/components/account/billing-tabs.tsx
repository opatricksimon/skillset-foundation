"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";

import { PlansPanel } from "@/components/account/plans-panel";
import { HorizontalTabs } from "@/components/shared/horizontal-tabs";
import { StatusChip } from "@/components/shared/status-chip";

const billingTabs = [
  { value: "purchases", label: "Purchases" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "invoices", label: "Invoices" },
];

export function BillingTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "purchases";

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);

    startTransition(() => {
      router.replace(`/account/billing?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-4 sm:p-6 shadow-[var(--shadow-soft)]">
      <div className="mb-5 rounded-[4px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Billing is not payouts
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
          Use Billing for purchases, subscriptions, invoices, and receipts tied
          to this account. Use Payouts when you are a creator connecting Stripe
          or checking money owed to you.
        </p>
      </div>
      <HorizontalTabs
        tabs={billingTabs}
        activeValue={activeTab}
        onChange={handleTabChange}
        ariaLabel="Billing sections"
      />
      <div className="mt-6">
        {activeTab === "subscriptions" ? (
          <PlansPanel />
        ) : activeTab === "invoices" ? (
          <BillingEmptyState
            eyebrow="Invoices"
            title="No invoices yet."
            detail="Stripe receipts and invoice records will appear here after paid checkout activity is connected to this account."
            statusLabel="Ready"
          />
        ) : (
          <BillingEmptyState
            eyebrow="Purchases"
            title="No purchases yet."
            detail="Student purchase history will show course, value, payment status, and receipt actions after Stripe checkout records exist for this account."
            statusLabel="Empty"
          />
        )}
      </div>
    </section>
  );
}

function BillingEmptyState({
  eyebrow,
  title,
  detail,
  statusLabel,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  statusLabel: string;
}) {
  return (
    <div className="rounded-[4px] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-soft)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            {eyebrow}
          </p>
          <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
            {title}
          </h3>
        </div>
        <StatusChip status="pending" label={statusLabel} />
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        {detail}
      </p>
    </div>
  );
}
