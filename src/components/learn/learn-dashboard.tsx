"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { canOpenEnrollment, type Enrollment } from "@/domain/enrollment";
import { getCourseBySlug } from "@/lib/data/catalog";
import { subscribeToUserEnrollments } from "@/lib/data/enrollments";

export function LearnDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToUserEnrollments(
      user.uid,
      (nextEnrollments) => {
        setEnrollments(nextEnrollments);
        setIsLoading(false);
      },
      () => {
        setError("We could not load your enrolled courses.");
        setIsLoading(false);
      },
    );
  }, [user]);

  if (isLoading) {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm text-[var(--color-ink-soft)]">Loading your learning workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[18px] border border-[rgba(178,34,52,0.2)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="rounded-[10px] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            My learning
          </p>
          <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
            Your learning dashboard is ready.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
            The next step is attaching your first course. When you add a program
            from the marketplace, it appears here with its private learning workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/courses" className="button-solid px-5 py-3 text-sm">
              Explore programs
            </Link>
            <Link href="/platform" className="button-outline px-5 py-3 text-sm">
              View platform overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const openEnrollments = enrollments.filter((enrollment) =>
    canOpenEnrollment(enrollment.status),
  );
  const inactiveEnrollments = enrollments.length - openEnrollments.length;

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          `${openEnrollments.length} active course${openEnrollments.length === 1 ? "" : "s"}`,
          "Private course workspaces",
          inactiveEnrollments
            ? `${inactiveEnrollments} inactive enrollment${inactiveEnrollments === 1 ? "" : "s"}`
            : "Enrollment data connected",
        ].map((item) => (
          <div
            key={item}
            className="rounded-[14px] border fine-rule bg-white p-4 shadow-[var(--shadow-soft)]"
          >
            <p className="text-sm font-semibold text-[var(--color-ink)]">{item}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          My courses
        </p>
        <div className="mt-5 grid gap-4">
          {enrollments.map((enrollment) => {
            const course = getCourseBySlug(enrollment.courseSlug);
            const nextLesson = course?.modules[0]?.lessons[0];
            const workspaceHref = course
              ? `/learn/courses/${enrollment.courseSlug}`
              : `/learn/courses/creator?courseId=${enrollment.courseId}`;
            const canOpenWorkspace = canOpenEnrollment(enrollment.status);

            return (
              <article
                key={enrollment.id}
                className="grid gap-4 rounded-[14px] border fine-rule bg-[var(--color-surface-soft)] p-4 md:grid-cols-[220px_1fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-[12px]">
                  <Image
                    src={enrollment.courseImage}
                    alt={enrollment.courseTitle}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
                      {enrollment.courseCategory}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
                      {enrollment.courseTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                      {course?.summary ??
                        "This enrollment is connected. The private course workspace is ready for the next lesson and progress tools."}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
                      {canOpenWorkspace
                        ? `${enrollment.progressPercent}% complete`
                        : `Access ${enrollment.status}`}
                      {nextLesson ? ` - Next: ${nextLesson.title}` : ""}
                    </p>
                    {canOpenWorkspace ? (
                      <Link
                        href={workspaceHref}
                        className="button-solid px-4 py-3 text-sm"
                      >
                        Open workspace
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="button-outline px-4 py-3 text-sm opacity-70"
                      >
                        Access inactive
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
