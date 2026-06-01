import { redirect } from "next/navigation";

/**
 * Compatibility redirect. The canonical public course-detail route is
 * `/courses/[slug]`, which already resolves creator (Firestore) courses by id
 * via its CreatorCourseDetail fallthrough. This legacy `/courses/creator` route
 * used to render CreatorCourseDetail directly off `?courseId=`, but when reached
 * without a courseId it dead-ended on a "Course not selected" state. Nothing in
 * the app links here anymore, so we collapse it into a redirect: forward to the
 * canonical detail when a courseId is present, otherwise back to the marketplace.
 */
export default function CreatorCoursePage({
  searchParams,
}: {
  searchParams: { courseId?: string | string[] };
}) {
  const raw = searchParams.courseId;
  const courseId = (Array.isArray(raw) ? raw[0] : raw)?.trim();

  redirect(courseId ? `/courses/${encodeURIComponent(courseId)}` : "/courses");
}
