import type { Course, CourseStatus } from "@/domain/learning";

export type EnrollmentStatus =
  | "active"
  | "completed"
  | "refunded"
  | "revoked"
  | "expired";

export type EnrollmentSource = "manual_demo" | "payment" | "admin";

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

export function getEnrollmentId(userId: string, courseSlug: string): string {
  return `${userId}__${courseSlug}`;
}

export function canSelfEnrollCourse(status: CourseStatus): boolean {
  return status === "published" || status === "pilot";
}

export function canOpenEnrollment(status: EnrollmentStatus): boolean {
  return status === "active" || status === "completed";
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
