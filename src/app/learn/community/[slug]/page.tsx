import { notFound } from "next/navigation";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { CourseCommunityFeed } from "@/components/learn/course-community-feed";
import { PlatformShell } from "@/components/platform/platform-shell";
import { getCommunitySpaces } from "@/lib/data/catalog";

export function generateStaticParams() {
  return getCommunitySpaces().map((space) => ({ slug: space.courseSlug }));
}

export default async function LearnCommunityCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = getCommunitySpaces().find((item) => item.courseSlug === slug);

  if (!space) {
    notFound();
  }

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
