export type CourseReviewStatus = "published" | "hidden";

export type CourseReview = {
  id: string;
  courseId: string;
  userId: string;
  authorName: string;
  rating: number;
  body: string | null;
  status: CourseReviewStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function normalizeCourseReviewRating(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(5, Math.max(1, Math.round(value)));
}

export function normalizeCourseReviewBody(value: string): string | null {
  const nextValue = value.trim();

  return nextValue ? nextValue.slice(0, 1200) : null;
}
