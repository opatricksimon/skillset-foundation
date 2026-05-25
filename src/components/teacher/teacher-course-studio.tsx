"use client";

import Link from "next/link";
import { BookOpenCheck, Layers3, PlayCircle, Sparkles } from "lucide-react";
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

export function TeacherCourseStudio({
  autoOpenCreate = false,
}: {
  autoOpenCreate?: boolean;
}) {
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
    <div className="grid gap-5">
      <section className="dash-card overflow-hidden p-0">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Course workbench
            </p>
            <h2 className="display-title mt-3 max-w-3xl text-3xl leading-tight text-[var(--color-primary)] sm:text-4xl">
              Create, structure, upload, price, and submit from one place.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Course Builder is the production area for teacher content. Drafts
              stay private until every module, lesson, material, price, and
              preview setting is ready for Skillset review.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  icon: Layers3,
                  title: "1. Structure",
                  detail: "Name the course, choose categories, add modules, and set the learning path.",
                },
                {
                  icon: PlayCircle,
                  title: "2. Lessons",
                  detail: "Upload videos, paste YouTube embeds, add PDFs, slides, and lesson notes.",
                },
                {
                  icon: Sparkles,
                  title: "3. Publish",
                  detail: "Set pricing, choose free preview lessons, and submit for Skillset review.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4"
                  >
                    <span className="grid size-9 place-items-center rounded-[10px] bg-white text-[var(--color-primary)] shadow-[var(--shadow-avatar)]">
                      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                    </span>
                    <p className="mt-4 text-sm font-bold text-[var(--color-ink)]">
                      {item.title}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-[var(--color-ink-soft)]">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="border-t border-[var(--color-line)] bg-[linear-gradient(145deg,var(--color-primary)_0%,#0f2744_100%)] p-5 text-white lg:border-l lg:border-t-0 sm:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
              Start here
            </p>
            <h3 className="display-title mt-3 text-3xl leading-tight text-white">
              Draft the next course.
            </h3>
            <p className="mt-4 text-sm leading-7 text-[rgba(255,255,255,0.78)]">
              Free and draft courses do not require payout setup. Payouts are
              only required before selling paid courses.
            </p>
            <div className="mt-6 grid gap-3">
              {user ? (
                <CreateCourseModal
                  key={autoOpenCreate ? "auto-open-create-course" : "manual-create-course"}
                  ownerId={user.uid}
                  autoOpen={autoOpenCreate}
                  triggerClassName="button-solid-light px-5 py-3 text-sm"
                />
              ) : null}
              <Link href="/teach/media" className="button-outline-light px-4 py-3 text-center text-sm">
                Open media library
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {error ? (
        <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      ) : null}

      <section className="dash-card p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-line)] pb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-base font-bold text-[var(--color-ink)]">Courses in progress</h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">Your drafts and submissions</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Continue any draft, review status, or course needing changes from
              this list.
            </p>
          </div>
          {courses.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <ListingSearchBar
                value={courseQuery}
                onChange={setCourseQuery}
                placeholder="Search your courses..."
              />
              <StatusFilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          {isLoadingCourses ? (
            <p className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4 text-sm text-[var(--color-ink-soft)]">
              Loading your courses...
            </p>
          ) : courses.length === 0 ? (
            <div className="rounded-[16px] border border-dashed border-[var(--color-line-strong)] bg-[var(--color-surface-soft)] p-5 sm:p-6">
              <div className="flex flex-wrap items-start gap-4">
                <span className="grid size-11 place-items-center rounded-[12px] bg-white text-[var(--color-primary)] shadow-[var(--shadow-avatar)]">
                  <BookOpenCheck aria-hidden="true" size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    First course
                  </p>
                  <h4 className="mt-2 text-xl font-bold text-[var(--color-ink)]">
                    No course drafts yet.
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
                    Create a draft using the panel above. The builder then opens
                    with course details, curriculum, lesson uploads, pricing,
                    preview, and review controls.
                  </p>
                </div>
              </div>
            </div>
          ) : statusFilteredCourses.length === 0 ? (
            <p className="rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
              No courses match these filters.
            </p>
          ) : (
            statusFilteredCourses.map((course) => (
              <article
                key={course.id}
                className="rounded-[14px] border fine-rule bg-[var(--color-surface-soft)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
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
