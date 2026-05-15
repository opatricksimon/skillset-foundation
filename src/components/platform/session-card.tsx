"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";

export function SessionCard({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();
  const { status, user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (status === "loading") {
    return (
      <div className={`mt-4 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-xs text-[var(--color-ink-soft)] ${collapsed ? "text-center" : ""}`}>
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

  if (collapsed) {
    return (
      <a
        href="/account/profile"
        className="mt-4 grid place-items-center rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(44,82,130,0.28)]"
        aria-label="Open profile settings"
      >
        <UserAvatar
          name={user.displayName || user.email}
          photoURL={user.photoURL}
          size="md"
          className="shadow-[var(--shadow-avatar)]"
        />
      </a>
    );
  }

  return (
    <div className="mt-4 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-3">
      <div className="flex items-center gap-3">
        <UserAvatar
          name={user.displayName || user.email}
          photoURL={user.photoURL}
          size="sm"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
            {user.displayName || user.email || "Skillset user"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            {user.roles.join(", ")}
          </p>
        </div>
      </div>
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
