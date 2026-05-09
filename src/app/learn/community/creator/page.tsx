import { Suspense } from "react";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { CreatorCourseCommunity } from "@/components/learn/creator-course-community";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function LearnCreatorCommunityPage() {
  return (
    <ProtectedSurface permissions={["community.read"]}>
      <PlatformShell
        eyebrow="Creator course community"
        title="A private discussion space for teacher-published courses."
        description="Firestore creator courses use this route so communities stay connected to enrollment without relying on static demo slugs."
      >
        <Suspense
          fallback={
            <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm text-[var(--color-ink-soft)]">
                Loading creator community...
              </p>
            </section>
          }
        >
          <CreatorCourseCommunity />
        </Suspense>
      </PlatformShell>
    </ProtectedSurface>
  );
}
