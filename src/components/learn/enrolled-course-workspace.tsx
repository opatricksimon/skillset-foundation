"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { CourseAsset } from "@/domain/course-asset";
import { courseAssetKindLabels, formatCourseAssetSize } from "@/domain/course-asset";
import {
  getLessonUnlockState,
  type LessonUnlockState,
} from "@/domain/drip-policy";
import type { Enrollment } from "@/domain/enrollment";
import type { Course, Lesson, LessonType } from "@/domain/learning";
import {
  getCourseProgressPercent,
  getLastCompletedCourseLesson,
  getNextCourseLesson,
} from "@/domain/lesson-progress";
import { subscribeToEnrollment } from "@/lib/data/enrollments";
import { updateEnrollmentProgress } from "@/lib/data/enrollments";
import {
  markLessonCompleted,
  subscribeToCompletedLessons,
  unmarkLessonCompleted,
} from "@/lib/data/lesson-progress";
import {
  getProtectedCourseAssetObjectUrl,
  subscribeToCourseAssets,
} from "@/lib/data/course-assets";
import { issueSkillsetCertificate } from "@/lib/data/certificates";

type EnrolledCourseWorkspaceProps = {
  course: Course;
  enableFirestoreAssets?: boolean;
};

export function EnrolledCourseWorkspace({
  course,
  enableFirestoreAssets = false,
}: EnrolledCourseWorkspaceProps) {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressState, setProgressState] = useState<{
    key: string | null;
    lessonIds: string[];
    ready: boolean;
  }>({
    key: null,
    lessonIds: [],
    ready: false,
  });
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [assetsState, setAssetsState] = useState<{
    assets: CourseAsset[];
    key: string | null;
    ready: boolean;
  }>({
    assets: [],
    key: null,
    ready: false,
  });
  const [error, setError] = useState("");
  const progressKey = enrollment?.id ?? null;

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToEnrollment(
      user.uid,
      course.slug,
      (nextEnrollment) => {
        setEnrollment(nextEnrollment);
        setIsLoading(false);
      },
      () => {
        setError("We could not confirm your enrollment for this course.");
        setIsLoading(false);
      },
    );
  }, [course.slug, user]);

  useEffect(() => {
    if (!enrollment) {
      return;
    }

    return subscribeToCompletedLessons(
      enrollment.id,
      (lessonIds) => {
        setProgressState({
          key: enrollment.id,
          lessonIds,
          ready: true,
        });
      },
      () => {
        setError("We could not load lesson progress for this course.");
        setProgressState({
          key: enrollment.id,
          lessonIds: [],
          ready: true,
        });
      },
    );
  }, [enrollment]);

  useEffect(() => {
    if (!enableFirestoreAssets || !enrollment) {
      return;
    }

    return subscribeToCourseAssets(
      course.id,
      (assets) => {
        setAssetsState({
          assets,
          key: course.id,
          ready: true,
        });
      },
      () => {
        setError("We could not load lesson assets for this course.");
        setAssetsState({
          assets: [],
          key: course.id,
          ready: true,
        });
      },
    );
  }, [course.id, enableFirestoreAssets, enrollment]);

  if (isLoading) {
    return (
      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-[var(--color-ink-soft)]">Loading course workspace...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[18px] border border-[rgba(178,34,52,0.2)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="rounded-[10px] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      </section>
    );
  }

  if (!enrollment) {
    return (
      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Enrollment required
        </p>
        <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
          This private workspace opens after enrollment.
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
          Open the public course page first, then add the course to your learning
          workspace.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/courses/${course.slug}`} className="button-solid px-5 py-3 text-sm">
            Open course page
          </Link>
          <Link href="/learn" className="button-outline px-5 py-3 text-sm">
            Back to My Learning
          </Link>
        </div>
      </section>
    );
  }

  const completedLessonIds = progressState.lessonIds;
  const isProgressLoading = Boolean(
    enrollment && (!progressState.ready || progressState.key !== progressKey),
  );
  const progressPercent = getCourseProgressPercent(course, completedLessonIds);
  const nextLesson = getNextCourseLesson(course, completedLessonIds)?.lesson ?? null;
  const allLessons = course.modules.flatMap((module) => module.lessons);
  const lessonUnlockStateById = new Map(
    allLessons.map((lesson) => [
      lesson.id,
      getLessonUnlockState(course, lesson, enrollment, completedLessonIds),
    ]),
  );
  const selectedLesson =
    allLessons.find((lesson) => lesson.id === selectedLessonId)
    ?? nextLesson
    ?? allLessons[0]
    ?? null;
  const selectedLessonUnlockState = selectedLesson
    ? lessonUnlockStateById.get(selectedLesson.id)
      ?? { unlocked: true, unlocksAt: null, reason: "available" }
    : null;
  const selectedLessonAssets =
    assetsState.key === course.id && selectedLesson
      ? assetsState.assets.filter((asset) => asset.lessonId === selectedLesson.id)
      : [];
  const courseLevelAssets =
    assetsState.key === course.id
      ? assetsState.assets.filter((asset) => !asset.lessonId)
      : [];
  const assetCountByLessonId = new Map<string, number>();

  if (assetsState.key === course.id) {
    for (const asset of assetsState.assets) {
      if (asset.lessonId) {
        assetCountByLessonId.set(
          asset.lessonId,
          (assetCountByLessonId.get(asset.lessonId) ?? 0) + 1,
        );
      }
    }
  }

  async function toggleLessonCompletion(lessonId: string, completed: boolean) {
    if (!user || !enrollment) {
      return;
    }

    const unlockState = lessonUnlockStateById.get(lessonId);

    if (unlockState && !unlockState.unlocked) {
      setError("This lesson is still locked by the course release schedule.");
      return;
    }

    setError("");
    setActiveLessonId(lessonId);

    const nextCompletedLessonIds = completed
      ? completedLessonIds.filter((id) => id !== lessonId)
      : [...completedLessonIds, lessonId];
    const nextProgressPercent = getCourseProgressPercent(course, nextCompletedLessonIds);
    const lastCompletedLesson = getLastCompletedCourseLesson(course, nextCompletedLessonIds);

    try {
      if (completed) {
        await unmarkLessonCompleted(enrollment.id, lessonId);
      } else {
        await markLessonCompleted(enrollment.id, user.uid, lessonId);
      }

      await updateEnrollmentProgress(
        user.uid,
        course.slug,
        nextProgressPercent,
        lastCompletedLesson?.lesson.id ?? null,
        nextProgressPercent === 100 ? "completed" : "active",
      );

      if (!completed && nextProgressPercent === 100) {
        await issueSkillsetCertificate(enrollment.id);
      }
    } catch {
      setError("We could not update lesson progress. Please try again.");
    } finally {
      setActiveLessonId(null);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Course workspace
        </p>
        <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
          {course.title}
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
          {course.summary}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              Progress
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
              {progressPercent}%
            </p>
          </div>
          <div className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              Status
            </p>
            <p className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
              {progressPercent === 100 ? "completed" : enrollment.status}
            </p>
          </div>
          <div className="rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              Next lesson
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-primary)]">
              {nextLesson?.title ?? "Course completed"}
            </p>
          </div>
        </div>
        {error ? (
          <p className="mt-5 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            {error}
          </p>
        ) : null}
        {selectedLesson ? (
          <LessonContentPanel
            assets={selectedLessonAssets}
            completed={completedLessonIds.includes(selectedLesson.id)}
            enableFirestoreAssets={enableFirestoreAssets}
            isLoadingAssets={Boolean(
              enableFirestoreAssets
                && (!assetsState.ready || assetsState.key !== course.id),
            )}
            isSaving={activeLessonId === selectedLesson.id}
            lesson={selectedLesson}
            unlockState={selectedLessonUnlockState}
            onToggleComplete={() =>
              toggleLessonCompletion(
                selectedLesson.id,
                completedLessonIds.includes(selectedLesson.id),
              )
            }
          />
        ) : null}
        {enableFirestoreAssets ? (
          <CourseAssetResourceList
            assets={courseLevelAssets}
            isLoading={Boolean(
              enableFirestoreAssets
                && (!assetsState.ready || assetsState.key !== course.id),
            )}
          />
        ) : null}
      </section>

      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Modules and lessons
        </p>
        <div className="mt-5 grid gap-4">
          {course.modules.map((module, moduleIndex) => (
            <article
              key={module.id}
              className="rounded-[14px] border fine-rule bg-[var(--color-surface-soft)] p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Module {moduleIndex + 1}
              </p>
              <h4 className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                {module.title}
              </h4>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
                {module.summary}
              </p>
              <div className="mt-4 grid gap-2">
                {module.lessons.map((lesson) => (
                  (() => {
                    const unlockState =
                      lessonUnlockStateById.get(lesson.id)
                      ?? { unlocked: true, unlocksAt: null, reason: "available" };
                    const isCompleted = completedLessonIds.includes(lesson.id);

                    return (
                  <div
                    key={lesson.id}
                    className="grid gap-3 rounded-[10px] bg-white px-3 py-3 text-xs sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-ink)]">{lesson.title}</p>
                      <p className="mt-1 uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                        {lessonTypeLabels[lesson.type]}
                      </p>
                      {!unlockState.unlocked ? (
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                          {formatUnlockMessage(unlockState)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                      {assetCountByLessonId.get(lesson.id) ? (
                        <span className="shrink-0 rounded-[8px] bg-[rgba(26,54,93,0.08)] px-3 py-1 font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                          {assetCountByLessonId.get(lesson.id)} file
                          {assetCountByLessonId.get(lesson.id) === 1 ? "" : "s"}
                        </span>
                      ) : null}
                      <span className="shrink-0 rounded-[8px] bg-[var(--color-surface-soft)] px-3 py-1 font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                        {lesson.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedLessonId(lesson.id)}
                        className="button-outline px-3 py-2 text-[11px]"
                      >
                        {unlockState.unlocked ? "Open" : "Preview lock"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          toggleLessonCompletion(
                            lesson.id,
                            isCompleted,
                          )
                        }
                        disabled={
                          !unlockState.unlocked
                          || isProgressLoading
                          || activeLessonId === lesson.id
                        }
                        className="button-outline px-3 py-2 text-[11px] disabled:opacity-60"
                      >
                        {activeLessonId === lesson.id
                          ? "Saving..."
                          : isCompleted
                            ? "Completed"
                            : !unlockState.unlocked
                              ? "Locked"
                            : "Mark complete"}
                      </button>
                    </div>
                  </div>
                    );
                  })()
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/learn" className="button-outline px-4 py-3 text-sm">
            Back to My Learning
          </Link>
          {progressPercent === 100 ? (
            <Link href="/learn/credentials" className="button-solid px-4 py-3 text-sm">
              View credential status
            </Link>
          ) : null}
          <Link href={`/courses/${course.slug}`} className="button-outline px-4 py-3 text-sm">
            View public course page
          </Link>
        </div>
      </section>
    </div>
  );
}

const lessonTypeLabels: Record<LessonType, string> = {
  video: "Video lesson",
  text: "Text lesson",
  quiz: "Quiz",
  assignment: "Assignment",
  live_recording: "Live recording",
  download: "Download",
  external_embed: "External embed",
};

const lessonTypeDescriptions: Record<LessonType, string> = {
  video: "Secure video playback will appear here when the instructor attaches the lesson media.",
  text: "Written lesson content will appear here when the instructor publishes the lesson body.",
  quiz: "Quiz questions and passing rules will appear here when assessment tools are connected.",
  assignment: "Assignment instructions, submission upload, and review status will appear here in the assignment module.",
  live_recording: "Recorded live sessions will appear here after the instructor uploads or links the replay.",
  download: "Downloadable files and supporting materials will appear here after upload.",
  external_embed: "External learning embeds will appear here when the instructor connects a trusted provider link.",
};

function formatUnlockMessage(unlockState: LessonUnlockState) {
  if (unlockState.unlocked) {
    return "Available";
  }

  if (unlockState.reason === "previous_lesson_required") {
    return "Complete the previous lesson to unlock";
  }

  if (unlockState.unlocksAt) {
    return `Unlocks ${new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(unlockState.unlocksAt)}`;
  }

  return "Locked";
}

function CourseAssetResourceList({
  assets,
  isLoading,
}: {
  assets: CourseAsset[];
  isLoading: boolean;
}) {
  return (
    <div className="mt-5 rounded-[16px] border fine-rule bg-[var(--color-surface-soft)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Course resources
      </p>
      <h4 className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
        General files and visuals attached to this course
      </h4>
      {isLoading ? (
        <p className="mt-4 rounded-[10px] bg-white px-3 py-2 text-sm text-[var(--color-ink-soft)]">
          Loading course resources...
        </p>
      ) : assets.length === 0 ? (
        <p className="mt-4 rounded-[10px] bg-white px-3 py-2 text-sm text-[var(--color-ink-soft)]">
          No general course resources are attached yet.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-[12px] border border-[var(--color-line)] bg-white p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {asset.fileName}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                    {courseAssetKindLabels[asset.kind]} - {formatCourseAssetSize(asset.size)}
                  </p>
                </div>
                <span className="rounded-[8px] bg-[var(--color-surface-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  {asset.isPreview ? "Preview" : "Enrolled"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonContentPanel({
  assets,
  completed,
  enableFirestoreAssets,
  isLoadingAssets,
  isSaving,
  lesson,
  unlockState,
  onToggleComplete,
}: {
  assets: CourseAsset[];
  completed: boolean;
  enableFirestoreAssets: boolean;
  isLoadingAssets: boolean;
  isSaving: boolean;
  lesson: Lesson;
  unlockState: LessonUnlockState | null;
  onToggleComplete: () => void;
}) {
  const locked = Boolean(unlockState && !unlockState.unlocked);

  return (
    <div className="mt-6 rounded-[16px] border fine-rule bg-[var(--color-surface-soft)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {lessonTypeLabels[lesson.type]}
          </p>
          <h4 className="display-title mt-2 text-2xl text-[var(--color-ink)]">
            {lesson.title}
          </h4>
        </div>
        <span className="rounded-[8px] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
          {lesson.duration}
        </span>
      </div>

      <div className="mt-5 rounded-[14px] border border-[var(--color-line)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--color-ink)]">
          Lesson content
        </p>
        {locked ? (
          <p className="mt-3 rounded-[10px] border border-[rgba(178,34,52,0.18)] bg-[rgba(178,34,52,0.05)] px-3 py-2 text-sm font-semibold text-[var(--color-accent)]">
            {unlockState ? formatUnlockMessage(unlockState) : "Locked"}
          </p>
        ) : null}
        {!locked && lesson.description ? (
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink)]">
            {lesson.description}
          </p>
        ) : null}
        {!locked && lesson.contentText ? (
          <div className="mt-4 whitespace-pre-line rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            {lesson.contentText}
          </div>
        ) : null}
        {!locked && lesson.externalUrl ? (
          <a
            href={lesson.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="button-outline mt-4 inline-flex px-4 py-3 text-sm"
          >
            Open instructor resource
          </a>
        ) : null}
        <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
          {lessonTypeDescriptions[lesson.type]}
        </p>
        {!locked && enableFirestoreAssets ? (
          <LessonAssetList assets={assets} isLoading={isLoadingAssets} />
        ) : null}
        {lesson.isPreview ? (
          <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.18)] bg-[rgba(178,34,52,0.05)] px-3 py-2 text-sm font-semibold text-[var(--color-accent)]">
            This lesson is marked as a free preview on the public course page.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onToggleComplete}
        disabled={locked || isSaving}
        className="button-solid mt-5 px-4 py-3 text-sm disabled:opacity-60"
      >
        {locked
          ? "Lesson locked"
          : isSaving
            ? "Saving..."
            : completed
              ? "Mark as incomplete"
              : "Mark complete"}
      </button>
    </div>
  );
}

function LessonAssetList({
  assets,
  isLoading,
}: {
  assets: CourseAsset[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <p className="mt-4 rounded-[10px] bg-[var(--color-surface-soft)] px-3 py-2 text-sm text-[var(--color-ink-soft)]">
        Loading lesson assets...
      </p>
    );
  }

  if (assets.length === 0) {
    return (
      <p className="mt-4 rounded-[10px] bg-[var(--color-surface-soft)] px-3 py-2 text-sm text-[var(--color-ink-soft)]">
        No files are attached to this lesson yet.
      </p>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      {assets.map((asset) => (
        <div
          key={asset.id}
          className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-3"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {asset.fileName}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                {courseAssetKindLabels[asset.kind]} - {formatCourseAssetSize(asset.size)}
              </p>
            </div>
            <span className="rounded-[8px] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
              {asset.isPreview ? "Preview" : "Enrolled"}
            </span>
          </div>

          <ProtectedAssetPreview asset={asset} />
        </div>
      ))}
    </div>
  );
}

function ProtectedAssetPreview({ asset }: { asset: CourseAsset }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let nextObjectUrl: string | null = null;

    getProtectedCourseAssetObjectUrl(asset)
      .then((url) => {
        nextObjectUrl = url;

        if (isMounted) {
          setObjectUrl(url);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Asset access is protected. Try again after refreshing your session.");
        }
      });

    return () => {
      isMounted = false;

      if (nextObjectUrl) {
        URL.revokeObjectURL(nextObjectUrl);
      }
    };
  }, [asset]);

  if (error) {
    return (
      <p className="mt-3 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-3 py-2 text-sm font-semibold text-[var(--color-accent)]">
        {error}
      </p>
    );
  }

  if (!objectUrl) {
    return (
      <p className="mt-3 rounded-[10px] bg-white px-3 py-2 text-sm text-[var(--color-ink-soft)]">
        Preparing protected asset...
      </p>
    );
  }

  if (asset.contentType.startsWith("video/")) {
    return (
      <video
        controls
        src={objectUrl}
        className="mt-3 aspect-video w-full rounded-[10px] bg-[var(--color-primary)]"
      />
    );
  }

  if (asset.contentType.startsWith("image/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={objectUrl}
        alt={asset.fileName}
        className="mt-3 max-h-72 w-full rounded-[10px] object-cover"
      />
    );
  }

  return (
    <a
      href={objectUrl}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)]"
    >
      Open protected asset
    </a>
  );
}
