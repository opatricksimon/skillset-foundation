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
        <Suspense fallback={<SettingsFallback />}>
          <AccountSettingsHub />
        </Suspense>
      </PlatformShell>
    </ProtectedSurface>
  );
}

function SettingsFallback() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="h-40 animate-pulse rounded-[18px] border border-[var(--color-line)] bg-[var(--color-surface-strong)]" />
      <div className="h-64 animate-pulse rounded-[18px] border border-[var(--color-line)] bg-[var(--color-surface-strong)]" />
    </div>
  );
}
