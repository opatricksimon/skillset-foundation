"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthSession } from "@/domain/auth";
import {
  acceptUserTerms,
  getUserProfile,
} from "@/lib/data/user-profiles";
import { listenToAuthState, signOutOfSkillset } from "@/lib/auth/firebase-auth";
import {
  currentPrivacyVersion,
  currentTermsVersion,
} from "@/lib/legal/versions";

type AuthContextValue = AuthSession & {
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>({
    status: "loading",
    user: null,
  });

  useEffect(() => {
    return listenToAuthState(setSession);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...session,
        signOut: signOutOfSkillset,
      }}
    >
      <LegalAcceptanceGate />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

function LegalAcceptanceGate() {
  const { status, user } = useAuth();
  const pathname = usePathname();
  const [needsAcceptance, setNeedsAcceptance] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkLegalAcceptance() {
      if (status !== "authenticated" || !user) {
        setNeedsAcceptance(false);
        return;
      }

      if (
        pathname.startsWith("/legal")
        || pathname.startsWith("/auth")
        || pathname.startsWith("/login")
        || pathname.startsWith("/loading")
        || pathname.startsWith("/signup")
        || pathname.startsWith("/welcome")
      ) {
        setNeedsAcceptance(false);
        return;
      }

      const profile = await getUserProfile(user.uid);

      if (cancelled) {
        return;
      }

      setNeedsAcceptance(
        profile?.termsVersion !== currentTermsVersion
          || profile?.privacyVersion !== currentPrivacyVersion,
      );
      setTermsAccepted(false);
      setPrivacyAccepted(false);
      setError("");
    }

    void checkLegalAcceptance();

    return () => {
      cancelled = true;
    };
  }, [pathname, status, user]);

  async function handleAccept() {
    if (!user || !termsAccepted || !privacyAccepted) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const profile = await getUserProfile(user.uid);
      await acceptUserTerms(user.uid, profile?.marketingConsent ?? false);
      setNeedsAcceptance(false);
    } catch {
      setError("Could not update your legal acceptance. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!needsAcceptance) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(12,25,39,0.62)] px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-strong)]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Legal update
        </p>
        <h2 className="display-title mt-3 text-4xl text-[var(--color-primary)]">
          Review Skillset terms to continue.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
          Skillset updated its legal terms. Accept the current Terms of Service
          and Privacy Policy to continue using your account.
        </p>

        <div className="mt-5 grid gap-3">
          <label className="flex gap-3 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-sm leading-6 text-[var(--color-ink-soft)]">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1 size-4 accent-[var(--color-primary)]"
            />
            <span>
              I agree to the current Skillset{" "}
              <Link
                href="/legal/terms"
                className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
              >
                Terms of Service
              </Link>
              .
            </span>
          </label>

          <label className="flex gap-3 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-sm leading-6 text-[var(--color-ink-soft)]">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
              className="mt-1 size-4 accent-[var(--color-primary)]"
            />
            <span>
              I agree to the current Skillset{" "}
              <Link
                href="/legal/privacy"
                className="font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={isSaving || !termsAccepted || !privacyAccepted}
          onClick={handleAccept}
          className="button-solid mt-5 w-full px-5 py-3 text-sm disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Accept and continue"}
        </button>
      </div>
    </div>
  );
}
