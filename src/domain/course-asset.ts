export type CourseAssetKind =
  | "course_cover"
  | "module_cover"
  | "lesson_thumbnail"
  | "lesson_material"
  | "lesson_video"
  | "live_recording";

export type CourseAsset = {
  id: string;
  courseId: string;
  ownerId: string;
  kind: CourseAssetKind;
  fileName: string;
  contentType: string;
  size: number;
  storagePath: string;
  downloadUrl?: string | null;
  isPreview: boolean;
  lessonId: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export const courseAssetKindLabels: Record<CourseAssetKind, string> = {
  course_cover: "Course cover",
  module_cover: "Module cover",
  lesson_thumbnail: "Lesson thumbnail",
  lesson_material: "Lesson material",
  lesson_video: "Lesson video",
  live_recording: "Live recording",
};

export const courseAssetAcceptTypes: Record<CourseAssetKind, string> = {
  course_cover: "image/*",
  module_cover: "image/*",
  lesson_thumbnail: "image/*",
  lesson_material: "application/pdf,text/*,image/*",
  lesson_video: "video/*",
  live_recording: "video/*",
};

export const courseAssetMaxBytes = 500 * 1024 * 1024;

export function isAllowedCourseAssetFile(file: File, kind: CourseAssetKind): boolean {
  if (file.size > courseAssetMaxBytes) {
    return false;
  }

  if (kind === "lesson_video" || kind === "live_recording") {
    return file.type.startsWith("video/");
  }

  if (
    kind === "course_cover" ||
    kind === "module_cover" ||
    kind === "lesson_thumbnail"
  ) {
    return file.type.startsWith("image/");
  }

  return (
    file.type === "application/pdf" ||
    file.type.startsWith("text/") ||
    file.type.startsWith("image/")
  );
}

export function formatCourseAssetSize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
