import type { DripStrategy } from "@/domain/drip-policy";

export type TeacherCourseStatus =
  | "draft"
  | "in_review"
  | "needs_changes"
  | "published"
  | "inactive";

export type LessonType =
  | "video"
  | "text"
  | "quiz"
  | "assignment"
  | "live_recording"
  | "download"
  | "external_embed";

export type TeacherCoursePaymentType =
  | "one_time"
  | "subscription_monthly"
  | "subscription_yearly"
  | "free";

export type TeacherLesson = {
  id: string;
  title: string;
  type: LessonType;
  description: string;
  durationMinutes?: number | null;
  contentText?: string | null;
  externalUrl?: string | null;
  dripDelayDays?: number | null;
};

export type TeacherCourseModule = {
  id: string;
  title: string;
  lessons: TeacherLesson[];
};

export type TeacherCourse = {
  id: string;
  ownerId: string;
  title: string;
  summary: string;
  category: string;
  status: TeacherCourseStatus;
  modules: TeacherCourseModule[];
  lessonCount: number;
  priceAmountMinor?: number | null;
  currency?: string;
  paymentType?: TeacherCoursePaymentType;
  installmentsEnabled?: boolean;
  installmentsMax?: number | null;
  platformFeeBps?: number;
  dripStrategy?: DripStrategy;
  dripIntervalDays?: number | null;
  freePreviewLessonId?: string | null;
  coverImageUrl?: string | null;
  reviewNote?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CreateTeacherCourseInput = {
  ownerId: string;
  title: string;
  summary: string;
  category: string;
  paymentType?: Extract<TeacherCoursePaymentType, "one_time" | "free">;
};

export type UpdateTeacherCourseBuilderInput = {
  title: string;
  summary: string;
  category: string;
  modules: TeacherCourseModule[];
  priceAmountMinor: number | null;
  currency: string;
  paymentType: TeacherCoursePaymentType;
  installmentsEnabled: boolean;
  installmentsMax: number | null;
  platformFeeBps: number;
  dripStrategy: DripStrategy;
  dripIntervalDays: number | null;
  freePreviewLessonId: string | null;
};

export function countCourseLessons(modules: TeacherCourseModule[]): number {
  return modules.reduce((total, module) => total + module.lessons.length, 0);
}

export function normalizeInstallmentsMax(value: number | null): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.min(36, Math.max(1, Math.round(value)));
}

export function teacherCanEditCourse(status: TeacherCourseStatus): boolean {
  return ["draft", "needs_changes", "published", "inactive"].includes(status);
}

export function teacherCanSubmitCourse(status: TeacherCourseStatus): boolean {
  return ["draft", "needs_changes", "inactive"].includes(status);
}
