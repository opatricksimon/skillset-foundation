"use client";

import { useEffect, useState, type FormEvent } from "react";

import type { CourseAsset, CourseAssetKind } from "@/domain/course-asset";
import {
  courseAssetAcceptTypes,
  courseAssetKindLabels,
  courseAssetMaxBytes,
  formatCourseAssetSize,
  isAllowedCourseAssetFile,
} from "@/domain/course-asset";
import type { TeacherCourse } from "@/domain/teacher-course";
import {
  subscribeToCourseAssets,
  uploadCourseAsset,
  type UploadCourseAssetProgress,
} from "@/lib/data/course-assets";

const assetKinds: CourseAssetKind[] = [
  "course_cover",
  "module_cover",
  "lesson_thumbnail",
  "lesson_material",
  "lesson_video",
  "live_recording",
];

const lessonTargetKinds: CourseAssetKind[] = [
  "lesson_thumbnail",
  "lesson_material",
  "lesson_video",
  "live_recording",
];

type CourseAssetUploaderProps = {
  course: TeacherCourse;
  isEditable: boolean;
};

export function CourseAssetUploader({ course, isEditable }: CourseAssetUploaderProps) {
  const [assets, setAssets] = useState<CourseAsset[]>([]);
  const [kind, setKind] = useState<CourseAssetKind>("course_cover");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lessonId, setLessonId] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadCourseAssetProgress | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const allLessons = course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleTitle: module.title,
    })),
  );
  const requiresLessonTarget = lessonTargetKinds.includes(kind);
  const selectedLesson = lessonId
    ? allLessons.find((lesson) => lesson.id === lessonId)
    : null;
  const courseLevelAssets = assets.filter((asset) => !asset.lessonId);
  const lessonAssets = assets.filter((asset) => asset.lessonId);

  useEffect(() => {
    return subscribeToCourseAssets(
      course.id,
      setAssets,
      () => setError("We could not load course assets."),
    );
  }, [course.id]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEditable || !selectedFile) {
      return;
    }

    setError("");
    setSuccess("");
    setUploadProgress(null);

    if (!isAllowedCourseAssetFile(selectedFile, kind)) {
      setError(
        `Use a valid ${courseAssetKindLabels[kind].toLowerCase()} file under ${formatCourseAssetSize(courseAssetMaxBytes)}.`,
      );
      return;
    }

    if (requiresLessonTarget && !lessonId) {
      setError("Choose the lesson this asset belongs to.");
      return;
    }

    setIsUploading(true);

    try {
      await uploadCourseAsset({
        courseId: course.id,
        ownerId: course.ownerId,
        kind,
        file: selectedFile,
        isPreview,
        lessonId: requiresLessonTarget ? lessonId : null,
        onProgress: setUploadProgress,
      });
      setSuccess("Asset uploaded.");
      setSelectedFile(null);
      setLessonId("");
      setIsPreview(false);
      setUploadProgress(null);
      setFileInputKey((current) => current + 1);
    } catch {
      setError("We could not upload this asset. Check the file, course ownership, and current permissions.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
        Course assets
      </p>
      <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
        Upload course media
      </h3>
      <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
        Add covers, lesson materials, preview clips, and recordings. Large video
        processing comes later; this prepares the authenticated upload layer.
      </p>
      {course.coverImageUrl ? (
        <p className="mt-4 rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
          Course cover is set. Upload another course cover to replace it.
        </p>
      ) : null}

      <form className="mt-5 grid gap-3" onSubmit={handleUpload}>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setKind("course_cover");
              setLessonId("");
              setSelectedFile(null);
              setFileInputKey((current) => current + 1);
              setUploadProgress(null);
            }}
            disabled={!isEditable || isUploading}
            className={`rounded-[3px] border p-4 text-left transition-colors disabled:opacity-60 ${
              !requiresLessonTarget
                ? "border-[var(--color-primary)] bg-[rgba(26,54,93,0.08)]"
                : "border-[var(--color-line)] bg-[var(--color-surface-soft)]"
            }`}
          >
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Course asset
            </span>
            <span className="mt-2 block text-sm font-semibold text-[var(--color-ink)]">
              Covers and course-level files
            </span>
            <span className="mt-1 block text-xs leading-5 text-[var(--color-ink-soft)]">
              Use for public course covers and broad course visuals.
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setKind("lesson_material");
              setSelectedFile(null);
              setFileInputKey((current) => current + 1);
              setUploadProgress(null);
            }}
            disabled={!isEditable || isUploading}
            className={`rounded-[3px] border p-4 text-left transition-colors disabled:opacity-60 ${
              requiresLessonTarget
                ? "border-[var(--color-primary)] bg-[rgba(26,54,93,0.08)]"
                : "border-[var(--color-line)] bg-[var(--color-surface-soft)]"
            }`}
          >
            <span className="block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              Lesson asset
            </span>
            <span className="mt-2 block text-sm font-semibold text-[var(--color-ink)]">
              Attach to a specific lesson
            </span>
            <span className="mt-1 block text-xs leading-5 text-[var(--color-ink-soft)]">
              Use for videos, PDFs, thumbnails, and recordings.
            </span>
          </button>
        </div>

        <select
          value={kind}
          onChange={(event) => {
            setKind(event.target.value as CourseAssetKind);
            setSelectedFile(null);
            setLessonId("");
            setUploadProgress(null);
            setFileInputKey((current) => current + 1);
          }}
          disabled={!isEditable || isUploading}
          className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
        >
          {assetKinds.map((item) => (
            <option key={item} value={item}>
              {courseAssetKindLabels[item]}
            </option>
          ))}
        </select>

        {requiresLessonTarget ? (
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Attach to lesson
            <select
              value={lessonId}
              onChange={(event) => setLessonId(event.target.value)}
              disabled={!isEditable || isUploading || allLessons.length === 0}
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
            >
              <option value="">
                {allLessons.length === 0 ? "Add lessons first" : "Choose lesson"}
              </option>
              {allLessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.moduleTitle} - {lesson.title}
                </option>
              ))}
            </select>
            {selectedLesson ? (
              <p className="rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] px-4 py-3 text-xs leading-5 text-[var(--color-ink-soft)]">
                Upload target:{" "}
                <strong className="text-[var(--color-ink)]">
                  {selectedLesson.moduleTitle} - {selectedLesson.title}
                </strong>
              </p>
            ) : null}
          </label>
        ) : null}

        <input
          key={fileInputKey}
          type="file"
          accept={courseAssetAcceptTypes[kind]}
          disabled={!isEditable || isUploading}
          onChange={(event) => {
            setSelectedFile(event.target.files?.[0] ?? null);
            setUploadProgress(null);
          }}
          className="rounded-[10px] border border-dashed border-[var(--color-line)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-ink-soft)] file:mr-4 file:rounded-[8px] file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-primary)] disabled:opacity-60"
        />

        <label className="flex items-start gap-3 rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-sm leading-6 text-[var(--color-ink-soft)]">
          <input
            type="checkbox"
            checked={isPreview}
            disabled={!isEditable || isUploading}
            onChange={(event) => setIsPreview(event.target.checked)}
            className="mt-1"
          />
          Mark as free preview asset when it is safe to expose before purchase.
        </label>

        {selectedFile ? (
          <p className="rounded-[10px] bg-[var(--color-surface-soft)] px-4 py-3 text-xs font-semibold text-[var(--color-primary)]">
            Selected: {selectedFile.name} ({formatCourseAssetSize(selectedFile.size)})
          </p>
        ) : null}

        {uploadProgress ? (
          <div className="rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] p-3">
            <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[var(--color-primary)]">
              <span>
                {uploadProgress.state === "success" ? "Upload complete" : "Uploading"}
              </span>
              <span>{uploadProgress.percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-200"
                style={{ width: `${uploadProgress.percent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-[var(--color-ink-soft)]">
              {formatCourseAssetSize(uploadProgress.bytesTransferred)} of{" "}
              {formatCourseAssetSize(uploadProgress.totalBytes)}
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-[10px] border border-[rgba(26,54,93,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={
            !isEditable
            || isUploading
            || !selectedFile
            || (requiresLessonTarget && !lessonId)
          }
          className="button-solid px-4 py-3 text-sm disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : "Upload asset"}
        </button>
      </form>

      <div className="mt-6 grid gap-4">
        {assets.length === 0 ? (
          <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-ink-soft)]">
            No uploaded assets yet. Start with a course cover or first lesson
            material.
          </p>
        ) : (
          <>
            <AssetGroup
              title="Course-level assets"
              assets={courseLevelAssets}
              allLessons={allLessons}
            />
            <AssetGroup
              title="Lesson assets"
              assets={lessonAssets}
              allLessons={allLessons}
            />
          </>
        )}
      </div>
    </section>
  );
}

function AssetGroup({
  title,
  assets,
  allLessons,
}: {
  title: string;
  assets: CourseAsset[];
  allLessons: Array<{ id: string; title: string; moduleTitle: string }>;
}) {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        {title}
      </p>
      {assets.length === 0 ? (
        <p className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-xs leading-5 text-[var(--color-ink-soft)]">
          Nothing uploaded here yet.
        </p>
      ) : (
        assets.map((asset) => {
          const lesson = asset.lessonId
            ? allLessons.find((item) => item.id === asset.lessonId)
            : null;

          return (
            <article
              key={asset.id}
              className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {asset.fileName}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--color-ink-soft)]">
                    {courseAssetKindLabels[asset.kind]} - {formatCourseAssetSize(asset.size)}
                  </p>
                  {asset.lessonId ? (
                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                      Lesson:{" "}
                      {lesson
                        ? `${lesson.moduleTitle} - ${lesson.title}`
                        : asset.lessonId}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-[8px] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
                  {asset.isPreview ? "Preview" : "Private"}
                </span>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
