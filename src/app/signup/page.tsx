import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Start as a learner or educator."
      description="The same account can support learning, teaching, and future community participation with role-based access."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--color-primary)]">
            Sign in
          </Link>
        </>
      }
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Join Skillset
        </p>
        <h2 className="display-title mt-3 text-4xl text-[var(--color-primary)]">
          Create your account
        </h2>
        <Suspense fallback={<AuthFormFallback />}>
          <SignupForm />
        </Suspense>
      </div>
    </AuthShell>
  );
}

function AuthFormFallback() {
  return (
    <div className="mt-6 rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4 text-sm font-semibold text-[var(--color-ink-soft)]">
      Preparing account setup...
    </div>
  );
}
