/**
 * Money formatter shared by marketing and account pages. Plan economics
 * (commission rates, monthly prices, break-even points) live in
 * `src/data/plans.ts` — import from there.
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Whole-dollar USD (no cents) for plan pricing, where every amount is a round
 * dollar figure. Keeps "$19" / "$190" / "$1,990" visually even instead of the
 * default "$19.00" the currency formatter produces — the uneven, decimal-heavy
 * look the pricing cards had before.
 */
export function formatUsdWhole(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

import { defaultPlanId, planById } from "@/data/plans";

export { defaultPlanId };

/**
 * @deprecated Use `planById(planId).commissionPercent` from `src/data/plans.ts`.
 * Kept as a fallback for callers that haven't been migrated to plan-aware
 * pricing yet. Points to the Free-tier rate so legacy default reads
 * "no plan = Free plan" instead of the old flat 15%.
 */
export const platformFeePercent = planById(defaultPlanId).commissionPercent;
