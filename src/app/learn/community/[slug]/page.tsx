import { ProtectedSurface } from "@/components/auth/protected-surface";
import { CourseCommunityFeed } from "@/components/learn/course-community-feed";
import { PlatformShell } from "@/components/platform/platform-shell";
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
  const space: CommunitySpace = {
    id: `community-${slug}`,
    courseSlug: slug,
    name: "Course community",
    description:
      "This space is loaded from your real enrollment. Open it only after enrolling in the matching course.",
    visibility: "enrolled_only",
    categories: ["announcement", "discussion", "question", "resource"],
  };

  return (
    <ProtectedSurface permissions={["community.read"]}>
      <PlatformShell
        eyebrow="Private course community"
        title="Discussion belongs inside the learning path."
        description="This feed stays tied to a course so conversation, announcements, and resources support progress instead of distracting from it."
      >
        <CourseCommunityFeed space={space} />
      </PlatformShell>
    </ProtectedSurface>
  );
}
