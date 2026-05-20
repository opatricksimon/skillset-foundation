"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { TeacherCourse } from "@/domain/teacher-course";
import { subscribeToPublishedTeacherCourse } from "@/lib/data/published-courses";
import { isPublicFeatureEnabled } from "@/lib/feature-flags";
import { getFirebaseClientConfig } from "@/lib/firebase/config";
import { startCourseCheckout } from "@/lib/payments/checkout";

type CreatorCourseDetailProps = {
  courseIdOverride?: string;
};

export function CreatorCourseDetail({ courseIdOverride }: CreatorCourseDetailProps = {}) {
  const { status: authStatus, user } = useAuth();
  const searchParams = useSearchParams();
  const courseId = courseIdOverride ?? searchParams.get("courseId") ?? "";
  const checkoutStatus = searchParams.get("checkout");
  const hasFirebaseConfig = Boolean(getFirebaseClientConfig());
  const checkoutEnabled = isPublicFeatureEnabled("payments.checkout");
  const [course, setCourse] = useState<TeacherCourse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!courseId || !hasFirebaseConfig) {
      return;
    }

    return subscribeToPublishedTeacherCourse(
      courseId,
      (nextCourse) => {
        setCourse(nextCourse);
        setIsLoading(false);
      },
      () => {
        setError("We could not load this course right now.");
        setIsLoading(false);
      },
    );
  }, [courseId, hasFirebaseConfig]);

  if (!courseId) {
    return (
      <CourseDetailState
        title="Course not selected."
        detail="Open the marketplace and choose a creator-published course."
      />
    );
  }

  if (!hasFirebaseConfig) {
    return (
      <CourseDetailState
        title="Creator course data is not connected."
        detail="Firebase configuration is required to load approved teacher courses."
      />
    );
  }

  if (isLoading) {
    return (
      <CourseDetailState
        title="Loading course..."
        detail="We are checking the published course record."
      />
    );
  }

  if (error) {
    return <CourseDetailState title="Course unavailable." detail={error} />;
  }

  if (!course) {
    return (
      <CourseDetailState
        title="Course is not public."
        detail="This course may still be in review, inactive, or unavailable."
      />
    );
  }

  const priceLabel =
    typeof course.priceAmountMinor === "number"
      ? new Intl.NumberFormat("en", {
          style: "currency",
          currency: course.currency ?? "USD",
        }).format(course.priceAmountMinor / 100)
      : "Pricing pending";
  const canCheckout =
    checkoutEnabled
    && authStatus === "authenticated"
    && Boolean(user)
    && typeof course.priceAmountMinor === "number"
    && course.priceAmountMinor > 0;
  const hasPaidPrice =
    authStatus === "authenticated"
    && Boolean(user)
    && typeof course.priceAmountMinor === "number"
    && course.priceAmountMinor > 0;
  const lessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleTitle: module.title,
    })),
  );
  const previewLesson = course.freePreviewLessonId
    ? lessons.find((lesson) => lesson.id === course.freePreviewLessonId)
    : null;
  const lockedLessonCount = Math.max(lessons.length - (previewLesson ? 1 : 0), 0);

  async function handleCheckout() {
    if (!course || !canCheckout || !checkoutEnabled) {
      return;
    }

    const checkoutCourseId = course.id;
    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      await startCourseCheckout(checkoutCourseId);
    } catch (checkoutError) {
      setCheckoutError(
        checkoutError instanceof Error && checkoutError.message
          ? checkoutError.message
          : "We could not start secure checkout. Try again or contact support.",
      );
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <section>
        <div className="rounded-[20px] border border-[var(--color-line)] bg-[var(--color-primary)] p-8 text-white shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            Teacher published
          </p>
          <h1 className="display-title mt-4 text-6xl leading-none">
            {course.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78">
            {course.summary}
          </p>
        </div>

        <section
          id="free-preview"
          className="mt-8 rounded-[16px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Free preview
          </p>
          {previewLesson ? (
            <div className="mt-5 grid gap-4 rounded-[14px] border fine-rule bg-[var(--color-surface-soft)] p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                  {previewLesson.moduleTitle}
                </p>
                <h2 className="display-title mt-2 text-4xl leading-none text-[var(--color-primary)]">
                  {previewLesson.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {previewLesson.description
                    || "This lesson is open so learners can judge the teaching style before enrolling."}
                </p>
              </div>
              {previewLesson.contentText ? (
                <div className="rounded-[12px] bg-white p-4 text-sm leading-7 text-[var(--color-ink)]">
                  {previewLesson.contentText}
                </div>
              ) : null}
              {previewLesson.externalUrl ? (
                <a
                  href={previewLesson.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-outline w-fit px-4 py-2 text-sm"
                >
                  Open preview resource
                </a>
              ) : (
                <p className="rounded-[12px] bg-white p-4 text-xs leading-6 text-[var(--color-ink-soft)]">
                  Preview media can be attached by the educator as a video,
                  external lesson link, or text resource.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-7 text-[var(--color-ink-soft)]">
              This educator has not selected a public preview lesson yet.
            </p>
          )}
          <p className="mt-4 text-xs leading-6 text-[var(--color-ink-soft)]">
            {lockedLessonCount} lesson{lockedLessonCount === 1 ? "" : "s"} remain
            inside the member area after enrollment.
          </p>
        </section>

        <section className="mt-8 rounded-[16px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Course structure
          </p>
          <div className="mt-5 grid gap-4">
            {course.modules.length === 0 ? (
              <p className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                The course is approved, but the public curriculum preview is
                still being prepared.
              </p>
            ) : (
              course.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4"
                >
                  <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                    {module.title}
                  </h2>
                  <div className="mt-4 grid gap-2">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between gap-3 rounded-[10px] bg-white px-3 py-2 text-xs text-[var(--color-ink-soft)]"
                      >
                        <span className="font-semibold text-[var(--color-ink)]">
                          {lesson.title}
                        </span>
                        <span className="shrink-0 text-right uppercase tracking-[0.16em]">
                          {lesson.type.replace("_", " ")}
                          {lesson.durationMinutes ? ` - ${lesson.durationMinutes} min` : ""}
                          {course.freePreviewLessonId === lesson.id ? " - preview" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>

      <aside className="h-fit rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
          At a glance
        </p>
        <dl className="mt-5 grid gap-4">
          {[
            ["Category", course.category],
            ["Status", "Published"],
            ["Lessons", String(course.lessonCount)],
            ["Price", priceLabel],
            ["Access", checkoutEnabled ? "Stripe Checkout" : "Checkout pending"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-[var(--color-line)] pb-4 last:border-b-0 last:pb-0"
            >
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[var(--color-ink)]">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {checkoutStatus === "cancelled" ? (
          <p className="mt-5 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            Checkout was cancelled. Your card was not charged.
          </p>
        ) : null}

        {checkoutStatus === "success" ? (
          <p className="mt-5 rounded-[10px] border border-[rgba(26,54,93,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
            Payment received. Your course access opens after Stripe confirms the webhook.
          </p>
        ) : null}

        {checkoutError ? (
          <p className="mt-5 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            {checkoutError}
          </p>
        ) : null}

        {authStatus !== "authenticated" ? (
          <div className="mt-6 grid gap-3">
            <Link href="/auth?mode=signup" className="button-solid w-full justify-center px-5 py-3 text-sm">
              Create account to enroll
            </Link>
            <Link href="/auth?mode=signin" className="button-outline w-full justify-center px-5 py-3 text-sm">
              Sign in
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={!canCheckout || isCheckingOut}
              className="button-solid mt-6 w-full px-5 py-3 text-sm disabled:opacity-60"
            >
              {isCheckingOut
                ? "Opening secure checkout..."
                : checkoutEnabled && hasPaidPrice
                  ? `Enroll for ${priceLabel}`
                  : "Secure checkout coming next"}
            </button>
            {!checkoutEnabled ? (
              <p className="mt-3 rounded-[10px] border border-[rgba(24,58,94,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-xs leading-6 text-[var(--color-ink-soft)]">
                Checkout is feature-flagged off until Firebase Functions and
                Stripe webhooks are deployed.
              </p>
            ) : null}
          </>
        )}

        <p className="mt-3 text-xs leading-6 text-[var(--color-ink-soft)]">
          Paid access opens only after the Stripe webhook confirms payment and
          creates your enrollment.
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-flex w-full justify-center text-sm font-semibold text-[var(--color-primary)]"
        >
          Back to all programs
        </Link>
      </aside>
    </div>
  );
}

function CourseDetailState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
        Creator course
      </p>
      <h1 className="display-title mt-3 text-4xl text-[var(--color-ink)]">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        {detail}
      </p>
      <Link href="/courses" className="button-solid mt-6 inline-flex px-5 py-3 text-sm">
        Open marketplace
      </Link>
    </section>
  );
}
