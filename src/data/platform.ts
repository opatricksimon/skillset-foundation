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

import { defaultPlanId, planById } from "@/data/plans";

export { defaultPlanId };

/**
 * @deprecated Use `planById(planId).commissionPercent` from `src/data/plans.ts`.
 * Kept as a fallback for callers that haven't been migrated to plan-aware
 * pricing yet. Points to the Free-tier rate so legacy default reads
 * "no plan = Free plan" instead of the old flat 15%.
 */
export const platformFeePercent = planById(defaultPlanId).commissionPercent;
