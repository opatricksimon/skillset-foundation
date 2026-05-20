/**
 * Skillset pricing model — single source of truth.
 *
 * Four tiers. Every feature is available on every tier; the plan only
 * changes the commission rate Skillset takes per paid sale and adds an
 * optional monthly subscription. Stripe processing fee is passed through
 * to the creator on every sale, regardless of plan (see DECISIONS.md D2
 * and src/domain/payment-split.ts).
 *
 * If the user upgrades or downgrades, sales BEFORE the change keep the
 * commission rate from `plan_at_time_of_sale` (snapshot in the transactions
 * table). New sales after the change use the new rate.
 */

export type PlanId = "free" | "starter" | "pro" | "plus";

export type Plan = {
  id: PlanId;
  name: string;
  /** Subscription price billed monthly, in USD. Zero on Free. */
  monthlyUsd: number;
  /** Subscription price billed yearly, in USD. Reflects the annual discount. */
  yearlyUsd: number;
  /** Commission rate per paid sale, as a percent (e.g. 8 = 8%). */
  commissionPercent: number;
  /** One-line positioning tagline. */
  tagline: string;
  /** Who this plan is for. */
  audience: string;
  /**
   * Approximate monthly GMV (in USD) where moving UP to this plan becomes
   * cheaper than staying on the cheaper plan. Computed from:
   *   (delta_subscription) / (delta_commission_rate)
   * Free → Starter: $19 / (0.08 - 0.04) = $475 GMV
   * Starter → Pro:  ($89 - $19) / (0.04 - 0.01) = $2,333 GMV
   * Pro → Plus:     ($199 - $89) / (0.01 - 0.00) = $11,000 GMV
   * Null on Free (no plan beneath it to compare against).
   */
  breakEvenGmvUsd: number | null;
  /** Headline bullets shown on the pricing page. */
  highlights: ReadonlyArray<string>;
};

export const plans: ReadonlyArray<Plan> = [
  {
    id: "free",
    name: "Free",
    monthlyUsd: 0,
    yearlyUsd: 0,
    commissionPercent: 8,
    tagline: "Start selling without a subscription.",
    audience: "New creators validating an idea.",
    breakEvenGmvUsd: null,
    highlights: [
      "Every Skillset feature — no tier locks",
      "Reviewed course publishing",
      "Stripe checkout in 30+ currencies",
      "Verifiable credentials",
      "Course communities and live sessions",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyUsd: 19,
    yearlyUsd: 190,
    commissionPercent: 4,
    tagline: "Half the commission, small monthly cost.",
    audience: "Creators earning around $500–$2,000 a month.",
    breakEvenGmvUsd: 475,
    highlights: [
      "Everything in Free",
      "Commission drops from 8% to 4%",
      "Annual billing saves ~17%",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyUsd: 89,
    yearlyUsd: 890,
    commissionPercent: 1,
    tagline: "Almost zero commission for established catalogs.",
    audience: "Creators earning around $2,000–$11,000 a month.",
    breakEvenGmvUsd: 2333,
    highlights: [
      "Everything in Starter",
      "Commission drops to 1%",
      "Priority human support",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    monthlyUsd: 199,
    yearlyUsd: 1990,
    commissionPercent: 0,
    tagline: "Zero commission for high-volume creators.",
    audience: "Creators earning $11,000 a month and up.",
    breakEvenGmvUsd: 11000,
    highlights: [
      "Everything in Pro",
      "Zero platform commission",
      "Dedicated launch reviews",
    ],
  },
];

/** Default plan for any account without an active subscription. */
export const defaultPlanId: PlanId = "free";

export function planById(id: PlanId): Plan {
  const plan = plans.find((candidate) => candidate.id === id);
  if (!plan) {
    throw new Error(`Unknown plan id: ${id}`);
  }
  return plan;
}

/**
 * Refund window in days. A learner who has not crossed the progress /
 * certificate thresholds can self-refund within this window from the
 * order's `sale_at`. After the window, refunds are admin-only.
 */
export const refundWindowDays = 7;

/**
 * Days the creator's earnings stay in "pending" before clearing to
 * "available" in the wallet. Matches the refund window so a refunded
 * order never tries to claw back already-paid-out money.
 */
export const payoutClearDays = 7;
