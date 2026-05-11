import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherComingSoonPanel } from "@/components/teacher/teacher-coming-soon-panel";

export default function TeacherCoProductionsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Co-productions."
        description="Collaborate with other Skillset creators without losing control of the course experience."
      >
        <TeacherComingSoonPanel
          eyebrow="Co-productions"
          title="Collaborate with other creators."
          description="Co-produce courses with other Skillset creators and split revenue automatically. This is planned for a future release."
        />
      </PlatformShell>
    </ProtectedSurface>
  );
}
