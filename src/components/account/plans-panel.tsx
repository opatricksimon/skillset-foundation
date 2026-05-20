"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { StatusChip } from "@/components/shared/status-chip";
import {
  hasRealStripePriceIds,
  isBillingConfigured,
  plans,
  type Plan,
  type PlanBillingCycle,
  type PlanId,
} from "@/data/plans";
import { formatUsd } from "@/data/platform";
import { subscribeToUserProfile } from "@/lib/data/user-profiles";
import { openBillingPortal } from "@/lib/payments/billing";

const billingCycles: ReadonlyArray<{
  value: PlanBillingCycle;
  label: string;
  hint: string;
}> = [
  { value: "monthly", label: "Monthly", hint: "Pay each month" },
  { value: "yearly", label: "Yearly", hint: "~17% off vs monthly" },
];

export function PlansPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [cycle, setCycle] = useState<PlanBillingCycle>("monthly");
  const [currentPlanId, setCurrentPlanId] = useState<PlanId>("free");
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserProfile(
      user.uid,
      (profile) => {
        setCurrentPlanId(profile?.currentPlanId ?? "free");
      },
      () => {
        // Profile fetch failures keep the user on the safe default (Free)
        // without blocking the page — the upgrade buttons still work.
        setCurrentPlanId("free");
      },
    );
    return () => unsubscribe();
  }, [user]);

  const billingReady = isBillingConfigured();

  function handleUpgrade(plan: Plan) {
    if (plan.id === "free") return;
    setError(null);
    setBusyAction(`upgrade-${plan.id}`);
    // Navigate to the in-app upgrade page that mounts the embedded
    // Stripe checkout — the learner never leaves Skillset.
    router.push(
      `/account/billing/upgrade?plan=${plan.id}&cycle=${cycle}`,
    );
  }

  async function handleManage() {
    setError(null);
    setBusyAction("portal");
    try {
      await openBillingPortal();
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Could not open the billing portal.";
      setError(message);
      setBusyAction(null);
    }
  }

  if (!user) {
    return (
      <div className="rounded-[14px] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-soft)] p-6 text-sm text-[var(--color-ink-soft)]">
        Sign in to view and manage your plan.
      </div>
    );
  }

  return (
    <section className="grid gap-5">
      {!billingReady ? (
        <div className="rounded-[14px] border border-dashed border-[rgba(178,34,52,0.32)] bg-[rgba(178,34,52,0.04)] p-4 text-sm leading-6 text-[var(--color-ink)]">
          <p className="font-semibold text-[var(--color-accent)]">
            Billing setup pending.
          </p>
          <p className="mt-1 text-[var(--color-ink-soft)]">
            The Stripe Price IDs haven&apos;t been configured yet, so paid
            plans can&apos;t be purchased. Free still works as the default
            tier for every account.
          </p>
        </div>
      ) : null}

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Current plan
          </p>
          <h2 className="display-title mt-2 text-3xl text-[var(--color-primary)]">
            {plans.find((plan) => plan.id === currentPlanId)?.name ?? "Free"}
          </h2>
        </div>
        {currentPlanId !== "free" ? (
          <button
            type="button"
            onClick={handleManage}
            disabled={busyAction === "portal"}
            className="button-outline px-4 py-2 text-sm disabled:opacity-60"
          >
            {busyAction === "portal" ? "Opening Stripe..." : "Manage subscription"}
          </button>
        ) : null}
      </header>

      <div
        role="radiogroup"
        aria-label="Billing cycle"
        className="inline-flex w-fit gap-1 rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] p-1"
      >
        {billingCycles.map((option) => {
          const active = cycle === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setCycle(option.value)}
              className={
                active
                  ? "platform-nav-active rounded-[7px] bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em]"
                  : "rounded-[7px] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-primary)]"
              }
            >
              {option.label}
              <span className="ml-2 text-[10px] font-medium normal-case opacity-80">
                {option.hint}
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isPaidPlan = plan.id !== "free";
          const canPurchase = isPaidPlan && hasRealStripePriceIds(plan);
          const price = cycle === "yearly" ? plan.yearlyUsd : plan.monthlyUsd;
          const periodLabel = cycle === "yearly" ? "/year" : "/month";
          const monthlyEquivalent =
            cycle === "yearly" && plan.yearlyUsd > 0
              ? plan.yearlyUsd / 12
              : null;

          return (
            <article
              key={plan.id}
              className={
                isCurrent
                  ? "relative rounded-[18px] border-2 border-[var(--color-primary)] bg-white p-5 shadow-[0_18px_36px_rgba(15,39,68,0.10)]"
                  : "rounded-[18px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]"
              }
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {plan.name}
                </p>
                {isCurrent ? <StatusChip status="active" label="Current" /> : null}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="display-title text-3xl text-[var(--color-primary)]">
                  {price === 0 ? "Free" : formatUsd(price)}
                </span>
                {price > 0 ? (
                  <span className="text-xs text-[var(--color-ink-soft)]">
                    {periodLabel}
                  </span>
                ) : null}
              </div>
              {monthlyEquivalent ? (
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  ≈ {formatUsd(monthlyEquivalent)}/mo
                </p>
              ) : null}
              <p className="mt-3 text-xs text-[var(--color-ink-soft)]">
                {plan.tagline}
              </p>

              <div className="mt-4 rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] px-3 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                  Commission per sale
                </p>
                <p className="display-title mt-0.5 text-2xl text-[var(--color-primary)]">
                  {plan.commissionPercent}%
                </p>
              </div>

              <ul className="mt-4 grid gap-1.5 text-xs leading-5 text-[var(--color-ink-soft)]">
                {plan.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-1.5">
                    <Check
                      aria-hidden="true"
                      size={12}
                      strokeWidth={2.4}
                      className="mt-1 shrink-0 text-[var(--color-primary)]"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  type="button"
                  disabled
                  className="button-outline mt-5 w-full justify-center px-3 py-2 text-xs disabled:opacity-60"
                >
                  Your plan
                </button>
              ) : isPaidPlan ? (
                <button
                  type="button"
                  onClick={() => handleUpgrade(plan)}
                  disabled={!canPurchase || busyAction === `upgrade-${plan.id}`}
                  className={
                    canPurchase
                      ? "button-solid mt-5 w-full justify-center px-3 py-2 text-xs disabled:opacity-60"
                      : "button-outline mt-5 w-full justify-center px-3 py-2 text-xs disabled:opacity-60"
                  }
                  title={canPurchase ? undefined : "Stripe Price ID not configured yet."}
                >
                  {busyAction === `upgrade-${plan.id}`
                    ? "Opening Stripe..."
                    : canPurchase
                      ? `Upgrade to ${plan.name}`
                      : "Unavailable"}
                </button>
              ) : (
                <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  Default tier
                </p>
              )}
            </article>
          );
        })}
      </div>

      <footer className="rounded-[14px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-xs leading-6 text-[var(--color-ink-soft)]">
        Plan changes are processed by Stripe. Upgrades apply immediately and
        Stripe Billing prorates the difference. Downgrades and cancellations
        take effect at the end of the current billing period. You can update
        your card or download invoices any time from the Stripe Customer Portal.
      </footer>
    </section>
  );
}
