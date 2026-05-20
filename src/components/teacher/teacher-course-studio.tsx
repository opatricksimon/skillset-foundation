"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { ListingSearchBar } from "@/components/shared/listing-search-bar";
import { StatusChip } from "@/components/shared/status-chip";
import { StatusFilterDropdown } from "@/components/shared/status-filter-dropdown";
import { CreateCourseModal } from "@/components/teacher/create-course-modal";
import type { TeacherCourse } from "@/domain/teacher-course";
import { teacherCanSubmitCourse } from "@/domain/teacher-course";
import {
  subscribeToTeacherCourses,
  submitTeacherCourseForReview,
} from "@/lib/data/teacher-courses";

const statusFilterMatches: Record<string, (course: TeacherCourse) => boolean> = {
  active: (course) => course.status === "published",
  all: () => true,
  draft: (course) => course.status === "draft",
  in_review: (course) => course.status === "in_review",
  inactive: (course) => course.status === "inactive",
  needs_changes: (course) => course.status === "needs_changes",
};

export function TeacherCourseStudio() {
  const { user } = useAuth();
  const [courseQuery, setCourseQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [error, setError] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [reviewingCourseId, setReviewingCourseId] = useState<string | null>(null);
  const normalizedCourseQuery = courseQuery.toLowerCase().trim();
  const visibleCourses = normalizedCourseQuery
    ? courses.filter((course) =>
        `${course.title} ${course.summary} ${course.category} ${course.status}`
          .toLowerCase()
          .includes(normalizedCourseQuery),
      )
    : courses;
  const statusFilteredCourses = visibleCourses.filter(
    statusFilterMatches[statusFilter] ?? statusFilterMatches.all,
  );

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
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-baseline gap-2 border-b border-[var(--color-line)] pb-4">
          <h3 className="text-base font-bold text-[var(--color-ink)]">Start a course submission</h3>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">Course submissions</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
          Create a draft, shape the learner path in Course Builder, and submit
          when the structure is ready for Skillset review.
        </p>
        <div className="mt-6">
          {user ? <CreateCourseModal ownerId={user.uid} /> : null}
        </div>
        <div className="mt-6 grid gap-3">
          {[
            "Choose one-time payment or free course.",
            "Add modules, lessons, pricing, and a preview lesson in the builder.",
            "Submit for review when the learning path is ready.",
          ].map((item, index) => (
            <div
              key={item}
              className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                Step {index + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                {item}
              </p>
            </div>
          ))}
        </div>
          {error ? (
            <p className="mt-5 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
              {error}
            </p>
          ) : null}
      </section>

      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-line)] pb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-base font-bold text-[var(--color-ink)]">Courses in progress</h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">Your submissions</span>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Drafts stay private. Approved courses can keep receiving new
              lessons and materials while Skillset controls marketplace
              visibility.
            </p>
          </div>
          <ListingSearchBar
            value={courseQuery}
            onChange={setCourseQuery}
            placeholder="Search your courses..."
            className="mt-1"
          />
          <StatusFilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
        <div className="mt-6 grid gap-3">
          {isLoadingCourses ? (
            <p className="text-sm text-[var(--color-ink-soft)]">Loading your courses...</p>
          ) : courses.length === 0 ? (
            <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
              No courses yet. Start a course when you are ready to prepare a
              submission for Skillset review.
            </p>
          ) : statusFilteredCourses.length === 0 ? (
            <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
              No courses match these filters.
            </p>
          ) : (
            statusFilteredCourses.map((course) => (
              <article
                key={course.id}
                className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4"
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
                  <StatusChip status={course.status} />
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
