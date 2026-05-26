import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherEventStudio } from "@/components/teacher/teacher-event-studio";

export default function TeacherEventsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.manageCourses"]}>
      <PlatformShell
        eyebrow="Course agenda"
        title="Schedule live learning."
        description="Create course-linked live classes, mentorships, masterclasses, office hours, webinars, and deadlines. Learners see the same agenda in their workspace."
      >
        <TeacherEventStudio />
      </PlatformShell>
    </ProtectedSurface>
  );
}
