"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useState } from "react";

import { plans, type PlanBillingCycle, type PlanId } from "@/data/plans";
import { formatUsd } from "@/data/platform";
import { createBillingCheckoutClientSecret } from "@/lib/payments/billing";

/**
 * The publishable key is intentionally public — Stripe distinguishes
 * publishable (front-end safe) from secret (server-only). It still has
 * to be exposed via NEXT_PUBLIC_* so Next inlines it at build time.
 * When missing, the panel surfaces a clear "billing not configured"
 * banner instead of trying to call Stripe with `undefined`.
 */
const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;

// Stripe.js loader is cached at module scope so multiple checkouts
// reuse the same Stripe instance instead of re-loading the SDK.
let stripePromise: Promise<Stripe | null> | null = null;
function getStripePromise(): Promise<Stripe | null> | null {
  if (!publishableKey) return null;
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

type EmbeddedCheckoutPanelProps = {
  planId: Exclude<PlanId, "free">;
  cycle: PlanBillingCycle;
};

export function EmbeddedCheckoutPanel({
  planId,
  cycle,
}: EmbeddedCheckoutPanelProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stripeLoader = getStripePromise();
  const plan = plans.find((candidate) => candidate.id === planId);

  // Stable options object — recreating it every render reboots the
  // EmbeddedCheckoutProvider and the user loses any half-typed card.
  const options = useMemo(
    () => (clientSecret ? { clientSecret } : null),
    [clientSecret],
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!stripeLoader) return;
      setError(null);
      setClientSecret(null);
      try {
        const result = await createBillingCheckoutClientSecret(planId, cycle);
        if (!cancelled) {
          setClientSecret(result.clientSecret);
        }
      } catch (cause) {
        if (!cancelled) {
          const message =
            cause instanceof Error
              ? cause.message
              : "Could not start checkout. Try again in a moment.";
          setError(message);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [planId, cycle, stripeLoader]);

  if (!plan) {
    return (
      <div className="rounded-[14px] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-soft)] p-6 text-sm text-[var(--color-ink-soft)]">
        Unknown plan: {planId}.
      </div>
    );
  }

  if (!publishableKey) {
    return (
      <div className="rounded-[14px] border border-dashed border-[rgba(178,34,52,0.32)] bg-[rgba(178,34,52,0.04)] p-6 text-sm leading-7 text-[var(--color-ink)]">
        <p className="font-semibold text-[var(--color-accent)]">
          Stripe publishable key not configured.
        </p>
        <p className="mt-2 text-[var(--color-ink-soft)]">
          Set <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in the
          environment (test key for staging, live key for production) so
          the embedded checkout can initialize.
        </p>
      </div>
    );
  }

  const periodLabel = cycle === "yearly" ? "/year" : "/month";
  const price = cycle === "yearly" ? plan.yearlyUsd : plan.monthlyUsd;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-[16px] border fine-rule bg-white shadow-[var(--shadow-soft)]">
        {error ? (
          <div className="p-6 text-sm text-[var(--color-accent)]">
            <p className="font-semibold">Checkout could not start.</p>
            <p className="mt-2 text-[var(--color-ink-soft)]">{error}</p>
          </div>
        ) : !options ? (
          <div
            className="grid place-items-center p-8 text-sm text-[var(--color-ink-soft)]"
            aria-busy="true"
            aria-live="polite"
          >
            Preparing secure checkout…
          </div>
        ) : (
          <EmbeddedCheckoutProvider stripe={stripeLoader!} options={options}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>

      <aside className="h-fit rounded-[16px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          You&apos;re subscribing to
        </p>
        <h2 className="display-title mt-2 text-3xl text-[var(--color-primary)]">
          Skillset {plan.name}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          {plan.tagline}
        </p>
        <div className="mt-4 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
            {cycle === "yearly" ? "Yearly billing" : "Monthly billing"}
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="display-title text-3xl text-[var(--color-primary)]">
              {formatUsd(price)}
            </span>
            <span className="text-xs text-[var(--color-ink-soft)]">
              {periodLabel}
            </span>
          </div>
          {cycle === "yearly" ? (
            <p className="mt-1 text-[11px] text-[var(--color-ink-soft)]">
              ≈ {formatUsd(plan.yearlyUsd / 12)}/mo equivalent
            </p>
          ) : null}
        </div>
        <p className="mt-4 text-[11px] leading-5 text-[var(--color-ink-muted)]">
          Commission per sale on {plan.name}:{" "}
          <strong className="text-[var(--color-ink)]">
            {plan.commissionPercent}%
          </strong>
          . Stripe processing fee is passed through to you on every sale
          (2.9% + $0.30 USD / 3.9% + $0.30 intl).
        </p>
        <p className="mt-2 text-[11px] leading-5 text-[var(--color-ink-muted)]">
          Cancel anytime from your billing settings — you keep your plan
          benefits until the end of the period.
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Powered by Stripe
        </p>
      </aside>
    </div>
  );
}
