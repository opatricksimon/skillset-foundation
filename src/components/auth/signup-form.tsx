"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { GoogleMark } from "@/components/auth/google-mark";
import {
  getAuthErrorMessage,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth/firebase-auth";
import {
  normalizeUsername,
  validateDisplayName,
  validateUsername,
} from "@/lib/auth/profile-validation";
import {
  getAuthPathIntentFromSearchParams,
  getAuthPathQuery,
  getPostAuthRoute,
} from "@/lib/auth/routing";
import {
  acceptUserTerms,
  getUserProfile,
  updateUserIdentity,
} from "@/lib/data/user-profiles";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathIntent = useMemo(
    () => getAuthPathIntentFromSearchParams(searchParams),
    [searchParams],
  );
  const pathQuery = getAuthPathQuery(pathIntent);
  const pathLabel = pathIntent === "teacher" ? "educator" : "learner";
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Accept the terms and privacy policy to create your account.");
      return;
    }

    const displayNameError = validateDisplayName(displayName);
    const usernameError = validateUsername(username);

    if (displayNameError || usernameError) {
      setError(displayNameError || usernameError);
      return;
    }

    setIsLoading(true);

    try {
      const normalizedUsername = normalizeUsername(username);
      const user = await signUpWithEmail({ displayName, email, password });
      await acceptUserTerms(user.uid, marketingConsent);
      await updateUserIdentity(user.uid, {
        displayName,
        username: normalizedUsername,
      });
      const profile = await getUserProfile(user.uid);
      router.push(getPostAuthRoute(profile, pathIntent));
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");

    if (!termsAccepted) {
      setError("Accept the terms and privacy policy before continuing with Google.");
      return;
    }

    const normalizedUsername = normalizeUsername(username);

    if (normalizedUsername) {
      const usernameError = validateUsername(username);

      if (usernameError) {
        setError(usernameError);
        return;
      }
    }

    setIsLoading(true);

    try {
      const user = await signInWithGoogle();
      await acceptUserTerms(user.uid, marketingConsent);
      if (normalizedUsername) {
        await updateUserIdentity(user.uid, { username: normalizedUsername });
      }
      const profile = await getUserProfile(user.uid);
      router.push(getPostAuthRoute(profile, pathIntent));
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleEmailSignup}>
      <div className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
          {pathLabel} path
        </p>
        <p className="mt-1 text-sm leading-6 text-[var(--color-ink-soft)]">
          This account will continue into the {pathLabel} setup. You can add the
          other side later from your profile.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
        Full name
        <input
          type="text"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Your name"
          required
          className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
        Username
        <div className="flex overflow-hidden rounded-[10px] border border-[var(--color-line)] bg-white focus-within:border-[var(--color-primary-light)]">
          <span className="grid place-items-center border-r border-[var(--color-line)] px-3 text-sm font-semibold text-[var(--color-ink-soft)]">
            @
          </span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(normalizeUsername(event.target.value))}
            placeholder="patrick-simon"
            minLength={3}
            maxLength={32}
            required
            className="min-w-0 flex-1 px-4 py-3 text-sm font-normal outline-none"
          />
        </div>
        <span className="text-xs font-normal leading-5 text-[var(--color-ink-soft)]">
          Used for your future Skillset profile and community identity.
        </span>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          minLength={6}
          required
          className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
        />
      </label>
      <label className="flex items-start gap-3 rounded-[10px] border fine-rule bg-[var(--color-surface-soft)] p-3 text-sm leading-6 text-[var(--color-ink-soft)]">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}
          className="mt-1"
          required
        />
        <span>
          I agree to the{" "}
          <Link href="/legal/terms" className="font-semibold text-[var(--color-primary)]">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="font-semibold text-[var(--color-primary)]">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      <label className="flex items-start gap-3 rounded-[10px] border fine-rule bg-white p-3 text-sm leading-6 text-[var(--color-ink-soft)]">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(event) => setMarketingConsent(event.target.checked)}
          className="mt-1"
        />
        <span>Send me Skillset updates, launch notes, and creator resources.</span>
      </label>
      {error ? (
        <p className="rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={isLoading || !termsAccepted} className="button-solid mt-2 px-5 py-3 text-sm disabled:opacity-60">
        {isLoading ? "Creating account..." : "Create account"}
      </button>
      <button
        type="button"
        disabled={isLoading || !termsAccepted}
        onClick={handleGoogleSignup}
        className="button-outline px-5 py-3 text-sm disabled:opacity-60"
      >
        <GoogleMark />
        Create with Google
      </button>
      <Link
        href={`/login${pathQuery}`}
        className="inline-flex text-sm font-semibold text-[var(--color-primary)]"
      >
        Already have an account?
      </Link>
    </form>
  );
}
