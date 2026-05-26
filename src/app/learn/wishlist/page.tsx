import { ProtectedSurface } from "@/components/auth/protected-surface";
import { LearnerWishlist } from "@/components/learn/learner-wishlist";
import { PlatformShell } from "@/components/platform/platform-shell";

export default function LearnWishlistPage() {
  return (
    <ProtectedSurface permissions={["courses.viewLearning"]}>
      <PlatformShell
        eyebrow="Saved courses"
        title="Your course wishlist."
        description="Save programs from the marketplace and return here before you enroll."
      >
        <LearnerWishlist />
      </PlatformShell>
    </ProtectedSurface>
  );
}
