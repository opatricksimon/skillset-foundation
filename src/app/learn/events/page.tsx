import { ProtectedSurface } from "@/components/auth/protected-surface";
import { LearnEventsHub } from "@/components/learn/learn-events-hub";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function LearnEventsPage() {
  return (
    <ProtectedSurface permissions={["courses.viewLearning"]}>
      <PlatformShell
        eyebrow="Course agenda"
        title="Your live learning schedule."
        description="Classes, mentorships, masterclasses, office hours, webinars, and deadlines from your enrolled courses appear here."
      >
        <LearnEventsHub />
      </PlatformShell>
    </ProtectedSurface>
  );
}
