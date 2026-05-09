import type { Course, Lesson } from "@/domain/learning";

export type LessonProgress = {
  lessonId: string;
  userId: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CourseLessonEntry = {
  moduleId: string;
  moduleTitle: string;
  lesson: Lesson;
};

export function getCourseLessonEntries(course: Course): CourseLessonEntry[] {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      moduleId: module.id,
      moduleTitle: module.title,
      lesson,
    })),
  );
}

export function getCourseProgressPercent(
  course: Course,
  completedLessonIds: readonly string[],
): number {
  const lessons = getCourseLessonEntries(course);

  if (lessons.length === 0) {
    return 0;
  }

  const completedSet = new Set(completedLessonIds);
  const completedCount = lessons.filter((entry) => completedSet.has(entry.lesson.id)).length;

  return Math.round((completedCount / lessons.length) * 100);
}

export function getNextCourseLesson(
  course: Course,
  completedLessonIds: readonly string[],
): CourseLessonEntry | null {
  const completedSet = new Set(completedLessonIds);

  return (
    getCourseLessonEntries(course).find((entry) => !completedSet.has(entry.lesson.id)) ??
    null
  );
}

export function getLastCompletedCourseLesson(
  course: Course,
  completedLessonIds: readonly string[],
): CourseLessonEntry | null {
  const completedSet = new Set(completedLessonIds);
  const completedEntries = getCourseLessonEntries(course).filter((entry) =>
    completedSet.has(entry.lesson.id),
  );

  return completedEntries.at(-1) ?? null;
}
