import Link from "next/link";

import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingChoice } from "@/components/auth/onboarding-choice";

export default function OnboardingPage() {
  return (
    <AuthShell
      eyebrow="Account setup"
      title="Set up your Skillset profile."
      description="Choose your workspace path, create a public identity, and tell Skillset what you want to build or learn first."
      footer={
        <>
          Need to review the public catalog first?{" "}
          <Link href="/courses" className="font-semibold text-[var(--color-primary)]">
            Browse courses
          </Link>
        </>
      }
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Onboarding
        </p>
        <h2 className="display-title mt-3 text-4xl text-[var(--color-primary)]">
          Complete your profile
        </h2>
        <Suspense fallback={<OnboardingFallback />}>
          <OnboardingChoice />
        </Suspense>
      </div>
    </AuthShell>
  );
}

function OnboardingFallback() {
  return (
    <div className="mt-6 rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4 text-sm font-semibold text-[var(--color-ink-soft)]">
      Preparing onboarding...
    </div>
  );
}
