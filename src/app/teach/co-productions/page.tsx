import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherComingSoonPanel } from "@/components/teacher/teacher-coming-soon-panel";

export default function TeacherCoProductionsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell title="Co-productions" hideHeader>
        <TeacherComingSoonPanel
          eyebrow="Teacher Studio"
          title="Co-productions are on the roadmap."
          description="Splitting revenue with a co-creator and tracking each partner's share needs a payout-split engine on top of Stripe Connect. Until that lands, every payout routes to the course owner's connected account."
        />
      </PlatformShell>
    </ProtectedSurface>
  );
}
