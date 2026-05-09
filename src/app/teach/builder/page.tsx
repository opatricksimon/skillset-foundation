import { Suspense } from "react";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { CourseBuilderStudio } from "@/components/teacher/course-builder-studio";

export default function TeacherBuilderPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.manageCourses"]}>
      <PlatformShell
        eyebrow="Course builder"
        title="Build the course outline."
        description="Add the basics, structure modules, create lessons, and submit the course when it is ready for Skillset review."
      >
        <Suspense
          fallback={
            <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm text-[var(--color-ink-soft)]">
                Loading course builder...
              </p>
            </section>
          }
        >
          <CourseBuilderStudio />
        </Suspense>
      </PlatformShell>
    </ProtectedSurface>
  );
}
