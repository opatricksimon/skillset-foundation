import { BillingTabs } from "@/components/account/billing-tabs";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountBillingPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell
        title="Billing"
        description="Billing is for purchases, subscriptions, invoices, and receipts on this account. Creator payouts live under Payouts."
        compact
      >
        <BillingTabs />
      </PlatformShell>
    </ProtectedSurface>
  );
}
