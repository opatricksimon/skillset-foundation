import { AccountPanel } from "@/components/account/account-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountBillingPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell
        eyebrow="Account"
        title="Billing history."
        description="Purchase receipts and billing records for courses bought through Skillset will appear here."
      >
        <AccountPanel active="Billing">
          <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
              Purchases
            </p>
            <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
              No purchases yet.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Student purchase history will show course, value, payment status,
              and receipt actions after Stripe checkout records exist for this
              account.
            </p>
          </section>
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
