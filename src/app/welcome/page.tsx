import type { Metadata } from "next";
import { Suspense } from "react";

import { OnboardingWizard } from "@/components/auth/onboarding-wizard";

export const metadata: Metadata = {
  title: "Welcome to Skillset | Skillset",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WelcomePage() {
  return (
    <Suspense fallback={<WelcomeFallback />}>
      <OnboardingWizard />
    </Suspense>
  );
}

function WelcomeFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-5">
      <div className="text-center">
        <div className="mx-auto mb-5 size-14 rounded-full border-[3px] border-[rgba(26,54,93,0.12)] border-t-[var(--color-accent)] motion-safe:animate-spin" />
        <p className="text-sm font-semibold text-[var(--color-primary)]">
          Preparing onboarding
        </p>
      </div>
    </main>
  );
}
