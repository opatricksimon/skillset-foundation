"use client";

import { useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  isStrongPassword,
  PasswordStrengthChecklist,
} from "@/components/auth/password-strength-checklist";
import {
  changeSkillsetPassword,
  getAuthErrorMessage,
  requestSkillsetEmailChange,
  refreshCurrentUserEmailVerification,
  sendSkillsetEmailVerification,
} from "@/lib/auth/firebase-auth";

export function SecuritySettingsPanel() {
  const { user } = useAuth();
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified ?? false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const passwordReady = isStrongPassword(nextPassword);

  async function handleSendVerification() {
    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      await sendSkillsetEmailVerification();
      setMessage("Verification email sent. Check your inbox and return here.");
    } catch {
      setError("Could not send the verification email. Try again in a moment.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRefreshVerification() {
    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      const verified = await refreshCurrentUserEmailVerification();
      setEmailVerified(verified);
      setMessage(
        verified
          ? "Email verified. Creator tools can now be enabled."
          : "Email is not verified yet.",
      );
    } catch {
      setError("Could not refresh your email verification status.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleEmailChangeRequest() {
    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      await requestSkillsetEmailChange(newEmail);
      setMessage(
        "Verification sent to the new email. Open it to confirm the email change.",
      );
      setNewEmail("");
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsBusy(false);
    }
  }

  async function handlePasswordChangeRequest() {
    if (!passwordReady) {
      setError("Use a password that meets every requirement.");
      return;
    }

    setIsBusy(true);
    setError("");
    setMessage("");

    try {
      await changeSkillsetPassword(currentPassword, nextPassword);
      setCurrentPassword("");
      setNextPassword("");
      setMessage("Password updated.");
    } catch (caughtError) {
      setError(getAuthErrorMessage(caughtError));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
        Security
      </p>
      <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
        Account protection
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        Verify your email before opening creator tools. Two-factor
        authentication is reserved here and will be activated after Firebase
        Multi-Factor is enabled for the project.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[var(--color-ink)]">
                Email verification
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
                Required for creators before publishing tools are enabled.
              </p>
            </div>
            <span
              className={`rounded-[8px] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                emailVerified
                  ? "bg-white text-[var(--color-primary)]"
                  : "bg-[rgba(178,34,52,0.08)] text-[var(--color-accent)]"
              }`}
            >
              {emailVerified ? "Verified" : "Required"}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSendVerification}
              disabled={isBusy || emailVerified}
              className="button-outline px-4 py-2 text-xs disabled:opacity-60"
            >
              Send email
            </button>
            <button
              type="button"
              onClick={handleRefreshVerification}
              disabled={isBusy}
              className="button-solid px-4 py-2 text-xs disabled:opacity-60"
            >
              Refresh status
            </button>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--color-line)] bg-white p-4">
          <p className="font-semibold text-[var(--color-ink)]">
            Change email
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
            Current email: {user?.email || "No email on file"}. We verify the
            new address before replacing it.
          </p>
          <div className="mt-4 grid gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              placeholder="new-email@example.com"
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)]"
            />
            <button
              type="button"
              onClick={handleEmailChangeRequest}
              disabled={isBusy || !newEmail.trim()}
              className="button-outline justify-self-start px-4 py-2 text-xs disabled:opacity-60"
            >
              Send change confirmation
            </button>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--color-line)] bg-white p-4">
          <p className="font-semibold text-[var(--color-ink)]">
            Change password
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
            Enter your current password before choosing a new one. Social-only
            accounts should use password recovery to add an email password.
          </p>
          <div className="mt-4 grid gap-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Current password"
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)]"
            />
            <input
              type="password"
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
              placeholder="New password"
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm outline-none focus:border-[var(--color-primary-light)]"
            />
            {nextPassword ? (
              <PasswordStrengthChecklist password={nextPassword} />
            ) : null}
            <button
              type="button"
              onClick={handlePasswordChangeRequest}
              disabled={isBusy || !currentPassword || !passwordReady}
              className="button-outline justify-self-start px-4 py-2 text-xs disabled:opacity-60"
            >
              Update password
            </button>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--color-line)] bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-[var(--color-ink)]">
                Two-factor authentication
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">
                Planned for creator accounts with payouts or sensitive
                financial actions.
              </p>
            </div>
            <span className="rounded-[8px] bg-[rgba(26,54,93,0.08)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
              Ready next
            </span>
          </div>
          <button
            type="button"
            disabled
            className="button-outline mt-4 px-4 py-2 text-xs opacity-60"
          >
            Enable after Firebase MFA setup
          </button>
        </div>
      </div>

      {message ? (
        <p className="mt-4 rounded-[10px] border border-[rgba(26,54,93,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      ) : null}
    </section>
  );
}
