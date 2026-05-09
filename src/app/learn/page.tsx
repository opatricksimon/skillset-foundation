import { PlatformShell } from "@/components/platform/platform-shell";
import { ProtectedSurface } from "@/components/auth/protected-surface";
import { LearnDashboard } from "@/components/learn/learn-dashboard";

export default function LearnPage() {
  return (
    <ProtectedSurface permissions={["courses.viewLearning"]}>
      <PlatformShell
        eyebrow="Student experience"
        title="A learner dashboard built for focus and continuity."
        description="Courses, milestones, community, and certificates come together in a workspace that keeps progress easy to follow."
      >
        <LearnDashboard />
      </PlatformShell>
    </ProtectedSurface>
  );
}
