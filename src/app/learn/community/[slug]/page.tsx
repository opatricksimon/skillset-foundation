import { ProtectedSurface } from "@/components/auth/protected-surface";
import { CourseCommunityFeed } from "@/components/learn/course-community-feed";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getCourseBySlug } from "@/lib/data/catalog";
import type { CommunitySpace } from "@/domain/learning";

export function generateStaticParams() {
  return [];
}

export default async function LearnCommunityCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  const space: CommunitySpace = {
    id: `community-${slug}`,
    courseSlug: slug,
    name: course ? `${course.title} community` : "Course community",
    description: course
      ? `Announcements, discussion, questions, and resources for ${course.title}. Open it after enrolling in the course.`
      : "This space is loaded from your real enrollment. Open it only after enrolling in the matching course.",
    visibility: "enrolled_only",
    categories: ["announcement", "discussion", "question", "resource"],
  };

  return (
    <ProtectedSurface permissions={["community.read"]}>
      <PlatformShell
        eyebrow="Private course community"
        title={course ? course.title : "Discussion belongs inside the learning path."}
        description="This feed stays tied to a course so conversation, announcements, and resources support progress instead of distracting from it."
      >
        <CourseCommunityFeed space={space} />
      </PlatformShell>
    </ProtectedSurface>
  );
}
