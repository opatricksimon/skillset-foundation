"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  normalizeCourseCategories,
  skillsetCourseCategories,
  type CreateTeacherCourseInput,
} from "@/domain/teacher-course";
import { createTeacherCourse } from "@/lib/data/teacher-courses";

type CreateCourseModalProps = {
  ownerId: string;
  autoOpen?: boolean;
  triggerClassName?: string;
};

export function CreateCourseModal({
  ownerId,
  autoOpen = false,
  triggerClassName = "button-solid px-5 py-3 text-sm",
}: CreateCourseModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(autoOpen);
  const [courseType, setCourseType] =
    useState<NonNullable<CreateTeacherCourseInput["paymentType"]>>("one_time");
  const [delivery, setDelivery] = useState("hosted");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const canSubmit =
    title.trim().length >= 3 && summary.trim().length >= 20 && !isSaving;

  function closeModal() {
    setOpen(false);

    if (autoOpen) {
      router.replace("/teach/builder", { scroll: false });
    }
  }

  function openModal() {
    setOpen(true);
  }

  function toggleCategory(nextCategory: string) {
    setSelectedCategories((current) => {
      if (current.includes(nextCategory)) {
        return current.filter((category) => category !== nextCategory);
      }

      return normalizeCourseCategories([...current, nextCategory]);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const categories = normalizeCourseCategories(selectedCategories);
      const primaryCategory = categories[0] ?? "Other";
      const courseId = await createTeacherCourse({
        ownerId,
        title,
        summary,
        category: primaryCategory,
        categories,
        paymentType: courseType,
      });

      setOpen(false);
      router.push(`/teach/builder?courseId=${courseId}`);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "";
      setError(
        message.toLowerCase().includes("already")
          ? "A course with this title already exists. Choose a more specific name."
          : message.toLowerCase().includes("permission")
          ? "Course creation is blocked until creator setup is complete. Verify your email and accept Teacher Terms first."
          : message.toLowerCase().includes("summary")
          ? "Add a course summary with at least 20 characters."
          : "We could not create this course. Please try again.",
      );
      setIsSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={triggerClassName}
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
            className="relative w-[min(520px,92vw)] rounded-[18px] border border-[var(--color-line)] bg-white p-7 shadow-[var(--shadow-strong)]"
          >
            <button
              type="button"
              onClick={closeModal}
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
                  <option value="subscription_monthly" disabled>
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

              <label className="grid gap-2 text-xs font-semibold text-[var(--color-ink)]">
                Course promise
                <textarea
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  minLength={20}
                  maxLength={1200}
                  rows={4}
                  placeholder="Explain what learners will be able to do after completing this course."
                  className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal leading-6 outline-none focus:border-[var(--color-primary-light)]"
                />
                <span className="text-[11px] font-normal text-[var(--color-ink-soft)]">
                  Minimum 20 characters. You can refine this later in the builder.
                </span>
              </label>

              <div className="grid gap-2 text-xs font-semibold text-[var(--color-ink)]">
                Categories
                <p className="text-xs font-normal leading-5 text-[var(--color-ink-soft)]">
                  Optional. Select up to five categories so learners can find the
                  course in the right context.
                </p>
                <div className="grid max-h-44 gap-2 overflow-y-auto rounded-[10px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-3 sm:grid-cols-2">
                  {skillsetCourseCategories.map((category) => {
                    const selected = selectedCategories.includes(category);

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`rounded-[8px] border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                          selected
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:border-[var(--color-primary-light)]"
                        }`}
                        aria-pressed={selected}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeModal}
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
