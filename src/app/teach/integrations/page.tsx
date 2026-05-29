import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherComingSoonPanel } from "@/components/teacher/teacher-coming-soon-panel";

export default function TeacherIntegrationsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell title="Integrations" hideHeader>
        <TeacherComingSoonPanel
          eyebrow="Teacher Studio"
          title="Integrations are on the roadmap."
          description="Connecting email tools, webhooks, and analytics destinations needs an integrations framework we haven't built yet. Payouts already run through Stripe — manage your connected account from billing in the meantime."
          primaryHref="/account/payments"
          primaryLabel="Manage payouts"
        />
      </PlatformShell>
    </ProtectedSurface>
  );
}
