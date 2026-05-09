import { ProtectedSurface } from "@/components/auth/protected-surface";
import { ProfileSettingsPanel } from "@/components/account/profile-settings-panel";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function LearnSettingsPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell
        eyebrow="Account settings"
        title="Keep your Skillset identity current."
        description="Manage the profile details used across learning, teaching, communities, and future public-facing Skillset surfaces."
      >
        <ProfileSettingsPanel />
      </PlatformShell>
    </ProtectedSurface>
  );
}

