import { AccountPanel } from "@/components/account/account-panel";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherWalletPanel } from "@/components/teacher/teacher-wallet-panel";

export default function AccountPaymentsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell title="Payments and payouts" compact>
        <AccountPanel active="Payments">
          <TeacherWalletPanel />
        </AccountPanel>
      </PlatformShell>
    </ProtectedSurface>
  );
}
