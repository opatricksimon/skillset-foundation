import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { SaleDetail } from "@/components/teacher/sale-detail";

export default async function TeacherSaleDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Sale detail."
        description="Review a single transaction, payment trail, course context, and operational actions."
      >
        <SaleDetail orderId={orderId} />
      </PlatformShell>
    </ProtectedSurface>
  );
}
