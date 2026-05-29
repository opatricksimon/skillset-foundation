import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherMediaLibrary } from "@/components/teacher/teacher-media-library";

export default function TeacherMediaPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell title="Media library" hideHeader>
        <TeacherMediaLibrary />
      </PlatformShell>
    </ProtectedSurface>
  );
}
