/**
 * Single source of truth for platform economics shown across marketing
 * pages (pricing, fees and payouts). Centralized so the fee can never
 * diverge between pages.
 */
export const platformFeePercent = 15;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
