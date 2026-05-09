import { notFound } from "next/navigation";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { EnrolledCourseWorkspace } from "@/components/learn/enrolled-course-workspace";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getCourseBySlug, getCourseSlugs } from "@/lib/data/catalog";

export function generateStaticParams() {
  return getCourseSlugs().map((slug) => ({ slug }));
}

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <ProtectedSurface permissions={["courses.viewLearning"]}>
      <PlatformShell
        eyebrow="Private course access"
        title="A focused workspace for each enrolled course."
        description="This area keeps the enrolled course path, lesson structure, and future progress tracking inside the authenticated learner surface."
      >
        <EnrolledCourseWorkspace course={course} />
      </PlatformShell>
    </ProtectedSurface>
  );
}
