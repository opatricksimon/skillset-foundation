import Link from "next/link";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Account access"
      title="Sign in to continue learning."
      description="Use one Skillset account to access courses, communities, educator tools, and platform support."
      footer={
        <>
          New to Skillset?{" "}
          <Link href="/signup" className="font-semibold text-[var(--color-primary)]">
            Create an account
          </Link>
        </>
      }
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Sign in
        </p>
        <h2 className="display-title mt-3 text-4xl text-[var(--color-primary)]">
          Welcome back
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">
          Sign in with email and password or continue with Google.
        </p>
        <Suspense fallback={<AuthFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </AuthShell>
  );
}

function AuthFormFallback() {
  return (
    <div className="mt-6 rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4 text-sm font-semibold text-[var(--color-ink-soft)]">
      Preparing sign in...
    </div>
  );
}
