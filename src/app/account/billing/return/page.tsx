import Link from "next/link";
import { Check } from "lucide-react";

import { AccountPanel } from "@/components/account/account-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

/**
 * Stripe's embedded Checkout redirects to this URL after a completed
 * session. By the time the user lands here, the customer.subscription.created
 * webhook will have updated their currentPlanId in Firestore — the page
 * just shows a clean "you're upgraded" confirmation and pushes them
 * back into the workspace.
 */
export default function BillingReturnPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell title="Subscription confirmed" compact>
        <AccountPanel active="Billing">
          <div className="rounded-[18px] border fine-rule bg-white p-10 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Check aria-hidden="true" size={24} strokeWidth={2.4} />
            </div>
            <h2 className="display-title mt-5 text-3xl text-[var(--color-primary)]">
              You&apos;re on the new plan.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-ink-soft)]">
              Stripe confirmed the payment. Your commission rate and plan
              benefits are active starting now — every new sale uses the new
              rate. You can update your card or cancel from billing settings
              any time.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/account/billing?tab=subscriptions"
                className="button-outline px-5 py-3 text-sm"
              >
                Back to billing
              </Link>
              <Link href="/teach" className="button-solid px-5 py-3 text-sm">
                Open Teacher Studio
              </Link>
            </div>
          </div>
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
