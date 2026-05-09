"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { TeacherCourse } from "@/domain/teacher-course";
import { teacherCanSubmitCourse } from "@/domain/teacher-course";
import {
  createTeacherCourse,
  subscribeToTeacherCourses,
  submitTeacherCourseForReview,
} from "@/lib/data/teacher-courses";

const categories = ["Psychology", "Management", "Health", "Soft Skills"];
const statusLabels: Record<TeacherCourse["status"], string> = {
  draft: "Draft",
  in_review: "In review",
  needs_changes: "Needs changes",
  published: "Published",
  inactive: "Inactive",
};

export function TeacherCourseStudio() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [reviewingCourseId, setReviewingCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToTeacherCourses(
      user.uid,
      (nextCourses) => {
        setCourses(nextCourses);
        setIsLoadingCourses(false);
      },
      () => {
        setError("We could not load your courses. Please refresh or contact Skillset support.");
        setIsLoadingCourses(false);
      },
    );
  }, [user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setError("Please sign in again to continue.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await createTeacherCourse({
        ownerId: user.uid,
        title,
        summary,
        category,
      });
      setTitle("");
      setSummary("");
      setCategory(categories[0]);
    } catch {
      setError("We could not create this course. Please try again or contact Skillset support.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSubmitForReview(courseId: string) {
    setError("");
    setReviewingCourseId(courseId);

    try {
      await submitTeacherCourseForReview(courseId);
    } catch {
      setError("We could not submit this course for review. Please try again or contact Skillset support.");
    } finally {
      setReviewingCourseId(null);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Course submissions
        </p>
        <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
          Start a course submission
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
          Add the essential details for a course you want to offer on Skillset.
          Your draft stays private until you submit it for review.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Course title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="Example: Practical Leadership Development"
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Course summary
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              required
              minLength={20}
              rows={4}
              placeholder="Who is this for, what will learners gain, and what outcome should they expect?"
              className="resize-none rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
            />
          </label>
          {error ? (
            <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSaving}
            className="button-solid px-5 py-3 text-sm disabled:opacity-60"
          >
            {isSaving ? "Creating course..." : "Create course"}
          </button>
        </form>
      </section>

      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Your submissions
        </p>
        <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
          Courses in progress
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
          Drafts stay private. Approved courses can keep receiving new lessons
          and materials while Skillset controls marketplace visibility.
        </p>
        <div className="mt-6 grid gap-3">
          {isLoadingCourses ? (
            <p className="text-sm text-[var(--color-ink-soft)]">Loading your courses...</p>
          ) : courses.length === 0 ? (
            <p className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
              No courses yet. Start a course when you are ready to prepare a
              submission for Skillset review.
            </p>
          ) : (
            courses.map((course) => (
              <article
                key={course.id}
                className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                      {course.category}
                    </p>
                    <h4 className="mt-2 text-base font-semibold text-[var(--color-ink)]">
                      {course.title}
                    </h4>
                  </div>
                  <span className="rounded-[8px] bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                    {statusLabels[course.status]}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
                  {course.summary}
                </p>
                {course.reviewNote ? (
                  <div className="mt-3 rounded-[10px] border border-[rgba(178,34,52,0.18)] bg-white px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                      Skillset review note
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
                      {course.reviewNote}
                    </p>
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/teach/builder?courseId=${course.id}`}
                    className="button-outline px-4 py-2 text-xs"
                  >
                    Continue course
                  </Link>
                  {teacherCanSubmitCourse(course.status) ? (
                    <button
                      type="button"
                      onClick={() => handleSubmitForReview(course.id)}
                      disabled={reviewingCourseId === course.id}
                      className="button-solid px-4 py-2 text-xs disabled:opacity-60"
                    >
                      {reviewingCourseId === course.id
                        ? "Submitting..."
                        : "Send for review"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
