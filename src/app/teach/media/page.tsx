import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherMediaLibrary } from "@/components/teacher/teacher-media-library";

export default function TeacherMediaPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.manageCourses"]}>
      <PlatformShell
        eyebrow="Teacher media"
        title="Manage course assets."
        description="Review uploaded covers, lesson files, recordings, and private course media from one teacher workspace."
      >
        <TeacherMediaLibrary />
      </PlatformShell>
    </ProtectedSurface>
  );
}

