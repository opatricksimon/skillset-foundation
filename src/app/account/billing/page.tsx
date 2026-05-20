import { BillingTabs } from "@/components/account/billing-tabs";
import { AccountPanel } from "@/components/account/account-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountBillingPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell title="Billing history" compact>
        <AccountPanel active="Billing">
          <BillingTabs />
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
