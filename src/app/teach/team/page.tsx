import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherComingSoonPanel } from "@/components/teacher/teacher-coming-soon-panel";

export default function TeacherTeamPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell title="Team & roles" hideHeader>
        <TeacherComingSoonPanel
          eyebrow="Teacher Studio"
          title="Team & roles are on the roadmap."
          description="Inviting teammates, assigning editor or analyst roles, and sharing a course catalog across a team need permission logic we haven't shipped yet. For now, each Teacher Studio belongs to a single account."
        />
      </PlatformShell>
    </ProtectedSurface>
  );
}
