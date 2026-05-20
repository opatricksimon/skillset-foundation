import { AccountPanel } from "@/components/account/account-panel";
import { ProfileSettingsPanel } from "@/components/account/profile-settings-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountProfilePage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell title="Profile settings" compact>
        <AccountPanel active="Profile">
          <ProfileSettingsPanel />
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
