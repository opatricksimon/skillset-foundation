import { ProtectedSurface } from "@/components/auth/protected-surface";
import { LearnEventsHub } from "@/components/learn/learn-events-hub";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function LearnEventsPage() {
  return (
    <ProtectedSurface permissions={["courses.viewLearning"]}>
      <PlatformShell
        eyebrow="Live schedule"
        title="Classes, mentorships, and course events in one place."
        description="Learners see live sessions only for courses they are enrolled in. External links work first; recordings can be connected after the class."
      >
        <LearnEventsHub />
      </PlatformShell>
    </ProtectedSurface>
  );
}
