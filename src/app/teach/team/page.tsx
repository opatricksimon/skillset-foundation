import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherComingSoonPanel } from "@/components/teacher/teacher-coming-soon-panel";

export default function TeacherTeamPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Team."
        description="Invite collaborators to help manage courses, support students, and review sales."
      >
        <TeacherComingSoonPanel
          eyebrow="Team"
          title="Bring collaborators into your studio."
          description="Team seats, scoped permissions, and collaborator workflows are planned for a future release."
        />
      </PlatformShell>
    </ProtectedSurface>
  );
}
