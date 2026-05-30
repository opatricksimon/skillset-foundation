/**
 * Pure analytics helpers for the course-creation funnel.
 *
 * Kept free of firebase imports so the funnel logic — WHEN `course_published`
 * fires and WITH WHICH properties — is unit-testable without the Firestore
 * emulator, the same pattern as payment-rules.ts and audit-log.ts. The
 * Firestore trigger in index.ts wires these into `captureServerEvent`.
 *
 * Why a trigger (and not a callable): publishing a course is an admin
 * moderation write (in_review -> published) made through the Firestore client,
 * so there is no callable to emit from. A trigger is the only server-side hook
 * — and the correct one here, because the funnel's distinct_id is the course
 * OWNER (teacher), which stitches this event onto the same person profile as
 * `course_draft_created`. The admin who approved is irrelevant to the teacher's
 * creation funnel.
 */

export interface CoursePublishedSource {
  ownerId?: unknown;
  category?: unknown;
  lessonCount?: unknown;
  priceAmountMinor?: unknown;
  currency?: unknown;
  platformFeeBps?: unknown;
}

export interface CoursePublishedProperties {
  course_id: string;
  teacher_id: string;
  category: string | null;
  lesson_count: number | null;
  price_amount_minor: number | null;
  currency: string | null;
  platform_fee_bps: number | null;
}

const PUBLISHED_STATUS = "published";

/**
 * Emit the funnel event only on the TRANSITION into published. Editing an
 * already-published course (rating updates, builder saves) keeps status at
 * "published" on both sides and must NOT re-fire the event.
 */
export function isCoursePublishTransition(
  beforeStatus: unknown,
  afterStatus: unknown,
): boolean {
  return beforeStatus !== PUBLISHED_STATUS && afterStatus === PUBLISHED_STATUS;
}

function finiteNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function nonEmptyStringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * Build the PostHog properties for `course_published`. Returns null when the
 * course has no owner id or course id — we refuse to emit an anonymous funnel
 * event, since the teacher uid is the distinct_id that stitches onto
 * `course_draft_created`.
 */
export function buildCoursePublishedProperties(
  courseId: string,
  course: CoursePublishedSource,
): CoursePublishedProperties | null {
  const teacherId = nonEmptyStringOrNull(course.ownerId);

  if (!courseId || !teacherId) {
    return null;
  }

  return {
    course_id: courseId,
    teacher_id: teacherId,
    category: nonEmptyStringOrNull(course.category),
    lesson_count: finiteNumberOrNull(course.lessonCount),
    price_amount_minor: finiteNumberOrNull(course.priceAmountMinor),
    currency: nonEmptyStringOrNull(course.currency),
    platform_fee_bps: finiteNumberOrNull(course.platformFeeBps),
  };
}
