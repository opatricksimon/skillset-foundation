"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";

export function SessionCard() {
  const router = useRouter();
  const { status, user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (status === "loading") {
    return (
      <div className="mt-4 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-xs text-[var(--color-ink-soft)]">
        Checking session...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    router.push("/");
  }

  return (
    <div className="mt-4 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
        Signed in
      </p>
      <p className="mt-2 truncate text-sm font-semibold text-[var(--color-ink)]">
        {user.displayName || user.email || "Skillset user"}
      </p>
      <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
        {user.roles.join(", ")}
      </p>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="button-outline mt-3 w-full px-3 py-2 text-xs disabled:opacity-60"
      >
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}
