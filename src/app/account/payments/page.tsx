import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherWalletPanel } from "@/components/teacher/teacher-wallet-panel";

export default function AccountPaymentsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        title="Payouts & tax"
        description="Creator money only: Stripe Connect status, sales, payout release, refunds, and statements. Profile and security settings stay in Settings."
        compact
      >
        <TeacherWalletPanel />
      </PlatformShell>
    </ProtectedSurface>
  );
}
