import { Suspense } from "react";

import { AccountSettingsHub } from "@/components/account/account-settings-hub";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function AccountPage() {
  return (
    <ProtectedSurface permissions={["auth.signOut"]}>
      <PlatformShell
        title="Settings"
        description="Profile, login, notifications, learning defaults, and privacy controls."
        compact
        hideHeader
      >
        <Suspense fallback={null}>
          <AccountSettingsHub />
        </Suspense>
      </PlatformShell>
    </ProtectedSurface>
  );
}
