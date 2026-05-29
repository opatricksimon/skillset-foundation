import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { SaleList } from "@/components/teacher/sale-list";

export default function TeacherSalesPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Your sales."
        description="Every paid order for your courses, with payment status and a link to each transaction's payout trail."
      >
        <SaleList />
      </PlatformShell>
    </ProtectedSurface>
  );
}
