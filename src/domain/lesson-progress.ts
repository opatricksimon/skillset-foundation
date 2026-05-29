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

/**
 * Resolves the lesson that follows the learner's last *completed* lesson
 * (enrollment.lastLessonId). Used by list/dashboard surfaces that know the
 * last completed lesson id but do not load the full completed-lesson set.
 *
 * - null lastLessonId (nothing completed yet) → first lesson
 * - stale id not in this course → first lesson (safe fallback)
 * - last completed lesson is the final one → null (course finished)
 */
export function getNextCourseLessonAfter(
  course: Course,
  lastCompletedLessonId: string | null,
): CourseLessonEntry | null {
  const entries = getCourseLessonEntries(course);

  if (entries.length === 0) {
    return null;
  }

  if (!lastCompletedLessonId) {
    return entries[0];
  }

  const lastIndex = entries.findIndex(
    (entry) => entry.lesson.id === lastCompletedLessonId,
  );

  if (lastIndex < 0) {
    return entries[0];
  }

  return entries[lastIndex + 1] ?? null;
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
