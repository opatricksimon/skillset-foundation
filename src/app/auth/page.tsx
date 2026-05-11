import { AuthPage } from "@/components/auth/auth-page";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Access Skillset | Skillset",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnifiedAuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthPage />
    </Suspense>
  );
}

function AuthFallback() {
  return (
    <main className="auth-page">
      <section className="auth-main">
        <div className="auth-card text-center text-sm font-semibold text-[var(--color-ink-soft)]">
          Preparing account access...
        </div>
      </section>
    </main>
  );
}
