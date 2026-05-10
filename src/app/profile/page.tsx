import { ProfileSettingsPanel } from "@/components/account/profile-settings-panel";
import { SecuritySettingsPanel } from "@/components/account/security-settings-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function ProfilePage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell
        eyebrow="Profile"
        title="Manage your Skillset identity and security."
        description="Update the profile information, verification state, and security controls used across learning, creator tools, communities, and support."
      >
        <ProfileSettingsPanel />
        <SecuritySettingsPanel />
      </PlatformShell>
    </ProtectedSurface>
  );
}
