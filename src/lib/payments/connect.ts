"use client";

import { httpsCallable } from "firebase/functions";

import { getFirebaseFunctions } from "@/lib/firebase/client";

type AccountLinkResult = {
  url: string;
};

type RefreshStripeAccountResult = {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  status?: "created" | "onboarding_required" | "ready";
};

export async function startTeacherStripeOnboarding() {
  const createAccountLink = httpsCallable<Record<string, never>, AccountLinkResult>(
    getFirebaseFunctions(),
    "createTeacherStripeAccountLink",
  );
  const result = await createAccountLink({});

  if (!result.data.url) {
    throw new Error("Stripe account onboarding URL missing.");
  }

  window.location.assign(result.data.url);
}

export async function refreshTeacherStripeAccountStatus() {
  const refreshAccount = httpsCallable<
    Record<string, never>,
    RefreshStripeAccountResult
  >(getFirebaseFunctions(), "refreshTeacherStripeAccount");
  const result = await refreshAccount({});

  return result.data;
}
