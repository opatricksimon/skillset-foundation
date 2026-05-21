"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  type Certificate,
  getCertificateStatusLabel,
  getCredentialCandidate,
  type CredentialCandidate,
} from "@/domain/certificate";
import type { Enrollment } from "@/domain/enrollment";
import { subscribeToUserCertificates } from "@/lib/data/certificates";
import { subscribeToUserEnrollments } from "@/lib/data/enrollments";

export function LearnCredentialsHub() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [certificatesReady, setCertificatesReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToUserEnrollments(
      user.uid,
      (nextEnrollments) => {
        setEnrollments(nextEnrollments);
        setIsLoading(false);
      },
      () => {
        setError("We could not load your credential records.");
        setIsLoading(false);
      },
    );
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToUserCertificates(
      user.uid,
      (nextCertificates) => {
        setCertificates(nextCertificates);
        setCertificatesReady(true);
      },
      () => {
        setError("We could not load your issued certificate records.");
        setCertificatesReady(true);
      },
    );
  }, [user]);

  const candidates = useMemo(
    () => enrollments.map((enrollment) => {
      const certificate =
        certificates.find((item) => item.enrollmentId === enrollment.id) ?? null;

      return getCredentialCandidate(enrollment, certificate);
    }),
    [certificates, enrollments],
  );
  const eligibleCount = candidates.filter((candidate) => candidate.status === "eligible").length;
  const issuedCount = candidates.filter((candidate) => candidate.status === "issued").length;

  if (isLoading || !certificatesReady) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-4 sm:p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-[var(--color-ink-soft)]">Loading credentials...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[4px] border border-[rgba(178,34,52,0.2)] bg-white p-4 sm:p-6 shadow-[var(--shadow-soft)]">
        <p className="rounded-[10px] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      </section>
    );
  }

  if (candidates.length === 0) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-4 sm:p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Skillset Verified
        </p>
        <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
          Credentials appear after enrollment.
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
          Enroll in a course, complete the required lessons, and this area will
          show which credentials are in progress or ready for Skillset review.
        </p>
        <div className="mt-6">
          <Link href="/courses" className="button-solid px-5 py-3 text-sm">
            Explore programs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          `${candidates.length} credential track${candidates.length === 1 ? "" : "s"}`,
          `${eligibleCount} ready for review`,
          `${issuedCount} issued`,
        ].map((item) => (
          <div
            key={item}
            className="rounded-[4px] border fine-rule bg-white p-4 shadow-[var(--shadow-soft)]"
          >
            <p className="text-sm font-semibold text-[var(--color-ink)]">{item}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {candidates.map((candidate) => (
          <CredentialCard key={candidate.enrollmentId} candidate={candidate} />
        ))}
      </section>
    </div>
  );
}

function CredentialCard({ candidate }: { candidate: CredentialCandidate }) {
  const isEligible = candidate.status === "eligible";
  const isIssued = candidate.status === "issued";

  return (
    <article className="rounded-[4px] border border-[var(--color-line)] bg-white p-4 sm:p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            {candidate.authorityLabel}
          </p>
          <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
            {candidate.courseTitle}
          </h3>
        </div>
        <span className="rounded-[8px] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          {getCertificateStatusLabel(candidate.status)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
        {isEligible
          ? "This course is complete. Certificate issuance will run automatically when completion is confirmed."
          : isIssued
            ? "Your Skillset Verified certificate has been issued and is ready for verification."
          : "Continue the course to unlock credential review eligibility."}
      </p>
      <div className="mt-5 rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
          Progress
        </p>
        <p className="mt-2 text-2xl font-semibold text-[var(--color-primary)]">
          {candidate.progressPercent}%
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/learn/courses/${candidate.courseSlug}`}
          className={isEligible ? "button-outline px-4 py-3 text-sm" : "button-solid px-4 py-3 text-sm"}
        >
          {isEligible ? "Review course" : "Continue course"}
        </Link>
        {isEligible ? (
          <button type="button" disabled className="button-outline px-4 py-3 text-sm opacity-70">
            Issuance queued
          </button>
        ) : null}
        {isIssued ? (
          <Link
            href={`/verify?code=${encodeURIComponent(candidate.verificationCode ?? "")}`}
            className="button-solid px-4 py-3 text-sm"
          >
            Verify credential
          </Link>
        ) : null}
      </div>
    </article>
  );
}
