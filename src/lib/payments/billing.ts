"use client";

import { httpsCallable } from "firebase/functions";

import type { PlanBillingCycle, PlanId } from "@/data/plans";
import { getFirebaseFunctions } from "@/lib/firebase/client";

type CreateBillingCheckoutInput = {
  planId: Exclude<PlanId, "free">;
  cycle: PlanBillingCycle;
};

type CreateBillingCheckoutResult = {
  /** Stripe Checkout Session client_secret for embedded mode. */
  clientSecret: string;
  /** Stripe Checkout Session id (useful for diagnostics + status polling). */
  sessionId: string;
};

type CreateBillingPortalResult = {
  url: string;
};

/**
 * Creates a Stripe Checkout Session for upgrading to a paid plan and
 * returns the `clientSecret` needed to mount the embedded checkout UI.
 * The server-side function resolves the Stripe Price ID from plans.ts
 * so the client never has to know it.
 *
 * The UI then renders `<EmbeddedCheckoutProvider clientSecret={...}>`
 * — the learner stays on Skillset, the card form is Stripe Elements
 * inside our page (PCI-compliant, no redirect).
 */
export async function createBillingCheckoutClientSecret(
  planId: Exclude<PlanId, "free">,
  cycle: PlanBillingCycle,
): Promise<CreateBillingCheckoutResult> {
  const createBillingCheckoutSession = httpsCallable<
    CreateBillingCheckoutInput,
    CreateBillingCheckoutResult
  >(getFirebaseFunctions(), "createBillingCheckoutSession");
  const result = await createBillingCheckoutSession({ planId, cycle });

  if (!result.data.clientSecret) {
    throw new Error("Stripe did not return a client_secret.");
  }

  return result.data;
}

/**
 * Opens the Stripe Customer Portal so the user can update card, change
 * plan, cancel, or download invoices. The Portal is a Stripe-hosted page
 * (no embedded option exists for it today). Used for managing an
 * EXISTING subscription, not for the upgrade conversion flow — that
 * stays embedded via the function above.
 */
export async function openBillingPortal() {
  const createBillingPortalSession = httpsCallable<
    Record<string, never>,
    CreateBillingPortalResult
  >(getFirebaseFunctions(), "createBillingPortalSession");
  const result = await createBillingPortalSession({});

  if (!result.data.url) {
    throw new Error("Stripe did not return a Customer Portal URL.");
  }

  window.location.assign(result.data.url);
}
