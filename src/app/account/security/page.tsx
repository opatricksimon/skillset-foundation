import { AccountPanel } from "@/components/account/account-panel";
import { AccountDataPanel } from "@/components/account/account-data-panel";
import { SecuritySettingsPanel } from "@/components/account/security-settings-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountSecurityPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell title="Security settings" compact>
        <AccountPanel active="Security">
          <SecuritySettingsPanel />
          <AccountDataPanel />
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
