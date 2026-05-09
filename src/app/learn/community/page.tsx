import { ProtectedSurface } from "@/components/auth/protected-surface";
import { LearnCommunityHub } from "@/components/learn/learn-community-hub";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function LearnCommunityPage() {
  return (
    <ProtectedSurface permissions={["community.read"]}>
      <PlatformShell
        eyebrow="Course communities"
        title="Community stays connected to enrolled learning."
        description="Each course can open its own discussion space for questions, announcements, resources, and cohort interaction."
      >
        <LearnCommunityHub />
      </PlatformShell>
    </ProtectedSurface>
  );
}
