import { AccountPanel } from "@/components/account/account-panel";
import { AccountDataPanel } from "@/components/account/account-data-panel";
import { SecuritySettingsPanel } from "@/components/account/security-settings-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountSecurityPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell
        eyebrow="Account"
        title="Security settings."
        description="Verify your email, request an email change, and review security controls for your Skillset account."
      >
        <AccountPanel active="Security">
          <SecuritySettingsPanel />
          <AccountDataPanel />
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
