import { AccountPanel } from "@/components/account/account-panel";
import { SecuritySettingsPanel } from "@/components/account/security-settings-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountEmailPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell title="Email settings" compact>
        <AccountPanel active="Email">
          <SecuritySettingsPanel />
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
