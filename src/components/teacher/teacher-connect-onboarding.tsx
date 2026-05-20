"use client";

import {
  ConnectAccountOnboarding,
  ConnectComponentsProvider,
  ConnectNotificationBanner,
} from "@stripe/react-connect-js";
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from "@stripe/connect-js";
import { useEffect, useState } from "react";

import { fetchConnectAccountSessionSecret } from "@/lib/payments/connect";

/**
 * Renders Stripe's embedded creator-onboarding flow INSIDE Skillset.
 * The creator completes KYC, identity, and bank-account verification
 * without ever being redirected to a Stripe-hosted page.
 *
 * Initialization shape:
 *   1. Read the publishable key from NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
 *   2. fetchClientSecret is called once at init AND once whenever Connect
 *      decides the session expired — same callable on the backend mints
 *      a fresh secret each time.
 *   3. <ConnectComponentsProvider> establishes context; the actual UI
 *      lives in <ConnectAccountOnboarding>. The component handles its
 *      own form, validation, and step navigation — Skillset just owns
 *      the host page.
 *
 * onExit fires when the creator finishes (or escapes) onboarding. We
 * fire onComplete so the parent (TeacherWalletPanel) can refresh status.
 */

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null;

type TeacherConnectOnboardingProps = {
  onComplete?: () => void;
};

export function TeacherConnectOnboarding({
  onComplete,
}: TeacherConnectOnboardingProps) {
  const [connect, setConnect] = useState<StripeConnectInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publishableKey) return;

    let cancelled = false;

    async function init() {
      try {
        const instance = await loadConnectAndInitialize({
          publishableKey: publishableKey!,
          fetchClientSecret: fetchConnectAccountSessionSecret,
          // Inherit Skillset brand colors so the embedded UI doesn't
          // look like a foreign Stripe widget plopped onto the page.
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#1a365d",
              colorBackground: "#ffffff",
              colorText: "#0f2744",
              colorDanger: "#b22234",
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
              borderRadius: "10px",
            },
          },
        });
        if (!cancelled) {
          setConnect(instance);
        }
      } catch (cause) {
        if (!cancelled) {
          const message =
            cause instanceof Error
              ? cause.message
              : "Stripe Connect failed to initialize.";
          setError(message);
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!publishableKey) {
    return (
      <div className="rounded-[3px] border border-dashed border-[rgba(178,34,52,0.32)] bg-[rgba(178,34,52,0.04)] p-5 text-sm leading-6 text-[var(--color-ink)]">
        <p className="font-semibold text-[var(--color-accent)]">
          Stripe publishable key not configured.
        </p>
        <p className="mt-1 text-[var(--color-ink-soft)]">
          Set <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> in the
          environment before creators can start in-app onboarding.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[3px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
        {error}
      </div>
    );
  }

  if (!connect) {
    return (
      <div
        className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-5 text-sm text-[var(--color-ink-soft)]"
        aria-busy="true"
        aria-live="polite"
      >
        Preparing your payout onboarding…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[3px] border fine-rule bg-white shadow-[var(--shadow-soft)]">
      <ConnectComponentsProvider connectInstance={connect}>
        <div className="border-b fine-rule px-4 py-3">
          <ConnectNotificationBanner />
        </div>
        <div className="p-4">
          <ConnectAccountOnboarding
            onExit={() => {
              onComplete?.();
            }}
          />
        </div>
        <p className="border-t fine-rule px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          Powered by Stripe
        </p>
      </ConnectComponentsProvider>
    </div>
  );
}
