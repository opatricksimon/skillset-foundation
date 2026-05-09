import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { TeacherCourseStudio } from "@/components/teacher/teacher-course-studio";
import { TeacherEventStudio } from "@/components/teacher/teacher-event-studio";
import { TeacherWalletPanel } from "@/components/teacher/teacher-wallet-panel";

const checklist = [
  "Complete your educator profile",
  "Outline your first course",
  "Set launch details and pricing",
  "Submit for Skillset review",
];

export default function TeachPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Create courses for Skillset review."
        description="Build your course details, prepare the learner experience, and submit when ready. Skillset reviews every submission before publication."
      >
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
              Publishing checklist
            </p>
            <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
              Publishing flow
            </h3>
            <div className="mt-6 grid gap-3">
              {checklist.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
                Teacher support
              </p>
              <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
                Educator support
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                Publishing guidance, quality standards, and account help stay
                close to the teaching workflow.
              </p>
            </div>
          </div>
        </div>
        <TeacherWalletPanel />
        <TeacherCourseStudio />
        <TeacherEventStudio />
      </PlatformShell>
    </ProtectedSurface>
  );
}
