import type { Course, CourseStatus } from "@/domain/learning";

export type EnrollmentStatus =
  | "active"
  | "completed"
  | "refunded"
  | "revoked"
  | "expired";

export type EnrollmentSource = "manual_demo" | "free_course" | "payment" | "admin";

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  courseCategory: string;
  courseImage: string;
  status: EnrollmentStatus;
  source: EnrollmentSource;
  progressPercent: number;
  lastLessonId: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type EnrollmentCommunityCard = {
  id: string;
  categories: string;
  courseTitle: string;
  description: string;
  href: string;
  name: string;
  visibility: string;
};

export function getEnrollmentId(userId: string, courseSlug: string): string {
  return `${userId}__${courseSlug}`;
}

export function canSelfEnrollCourse(status: CourseStatus): boolean {
  return status === "published" || status === "pilot";
}

export function canOpenEnrollment(status: EnrollmentStatus): boolean {
  return status === "active" || status === "completed";
}

export function canContinueEnrollment(status: EnrollmentStatus): boolean {
  return status === "active";
}

export function createEnrollmentSnapshot(course: Course) {
  return {
    courseId: course.id,
    courseSlug: course.slug,
    courseTitle: course.title,
    courseCategory: course.category,
    courseImage: course.image,
  };
}

export function createEnrollmentCommunityCards(
  enrollments: Enrollment[],
): EnrollmentCommunityCard[] {
  return enrollments
    .filter((enrollment) => canOpenEnrollment(enrollment.status))
    .map((enrollment) => ({
      id: `community-${enrollment.id}`,
      categories: "course community",
      courseTitle: enrollment.courseTitle,
      description:
        "A course-linked space for teacher announcements, learner questions, discussion, and shared resources.",
      href: `/learn/community/creator?courseId=${enrollment.courseId}`,
      name: `${enrollment.courseTitle} community`,
      visibility: "enrolled only",
    }));
}
