"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import type { CreateTeacherCourseInput } from "@/domain/teacher-course";
import { createTeacherCourse } from "@/lib/data/teacher-courses";

type CreateCourseModalProps = {
  ownerId: string;
};

const draftSummary =
  "Draft course created from Teacher Studio. Add the full learner outcome, audience, and course promise before submitting for review.";

export function CreateCourseModal({ ownerId }: CreateCourseModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [courseType, setCourseType] =
    useState<NonNullable<CreateTeacherCourseInput["paymentType"]>>("one_time");
  const [delivery, setDelivery] = useState("hosted");
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = title.trim().length >= 3 && !isSaving;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const courseId = await createTeacherCourse({
        ownerId,
        title,
        summary: draftSummary,
        category: "Management",
        paymentType: courseType,
      });

      setOpen(false);
      router.push(`/teach/builder?courseId=${courseId}`);
    } catch {
      setError("We could not create this course. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="button-solid px-5 py-3 text-sm"
      >
        New course
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-[rgba(15,39,68,0.55)] px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-course-title"
        >
          <form
            onSubmit={handleSubmit}
            className="relative w-[min(480px,92vw)] rounded-[4px] border border-[var(--color-line)] bg-white p-7 shadow-[var(--shadow-strong)]"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-[8px] text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
              aria-label="Close create course modal"
            >
              <X aria-hidden="true" size={16} strokeWidth={1.8} />
            </button>

            <h3
              id="create-course-title"
              className="display-title text-2xl font-semibold text-[var(--color-primary)]"
            >
              Create a course
            </h3>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-xs font-semibold text-[var(--color-ink)]">
                Course type
                <select
                  value={courseType}
                  onChange={(event) =>
                    setCourseType(
                      event.target
                        .value as NonNullable<CreateTeacherCourseInput["paymentType"]>,
                    )
                  }
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
                >
                  <option value="one_time">One-time payment</option>
                  <option value="subscription" disabled>
                    Subscription - Coming soon
                  </option>
                  <option value="free">Free course</option>
                </select>
              </label>

              <label className="grid gap-2 text-xs font-semibold text-[var(--color-ink)]">
                Content delivery
                <select
                  value={delivery}
                  onChange={(event) => setDelivery(event.target.value)}
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
                >
                  <option value="hosted">Skillset hosted</option>
                  <option value="external" disabled>
                    External link only - Coming soon
                  </option>
                </select>
              </label>

              <label className="grid gap-2 text-xs font-semibold text-[var(--color-ink)]">
                Course title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  minLength={3}
                  maxLength={120}
                  placeholder="e.g. Advanced Product Design"
                  className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
                />
              </label>
            </div>

            {error ? (
              <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="button-outline px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="button-solid px-4 py-2 text-sm disabled:opacity-60"
              >
                {isSaving ? "Creating..." : "Continue"}
              </button>
            </div>

            <p className="sr-only">
              Selected course type is {courseType}. Selected delivery is {delivery}.
            </p>
          </form>
        </div>
      ) : null}
    </>
  );
}
