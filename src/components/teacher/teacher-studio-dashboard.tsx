"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  Image,
  Settings2,
  WalletCards,
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { TeacherOverviewMetrics } from "@/components/teacher/teacher-overview-metrics";
import { TeacherStudioInsights } from "@/components/teacher/teacher-studio-insights";

const studioActions = [
  {
    title: "Course Builder",
    detail: "Create courses, configure modules, upload lessons and submit for review.",
    href: "/teach/builder",
    cta: "Open builder",
    icon: BookOpenCheck,
  },
  {
    title: "Media library",
    detail: "Review uploaded course covers, lesson videos, recordings and materials.",
    href: "/teach/media",
    cta: "Open library",
    icon: Image,
  },
  {
    title: "Payouts & tax",
    detail: "Connect Stripe, check payout status, statements and tax setup.",
    href: "/account/payments",
    cta: "Open payouts",
    icon: WalletCards,
  },
  {
    title: "Settings",
    detail: "Profile, email, security, notifications, privacy and account preferences.",
    href: "/account",
    cta: "Open settings",
    icon: Settings2,
  },
];

export function TeacherStudioDashboard() {
  const { user } = useAuth();
  const firstName = user?.displayName?.trim().split(/\s+/)[0] ?? "there";

  return (
    <div className="grid gap-5">
      <section className="studio-welcome-card dash-card dash-card--strong p-5 sm:p-7">
        <div className="relative z-[1] flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-accent)]">
              Teacher Studio
            </p>
            <h1 className="display-title mt-3 text-4xl leading-[1.03] text-[var(--color-primary)] sm:text-5xl lg:text-6xl">
              Welcome back, {firstName}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-ink-soft)]">
              Monitor revenue, students, payouts, reviews, and the work that
              needs attention. Course creation lives in Course Builder.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/account?tab=profile"
              className="button-outline bg-white px-4 py-2.5 text-sm"
            >
              Public profile
            </Link>
            <Link
              href="/teach/builder?newCourse=1"
              className="button-solid px-5 py-2.5 text-sm"
            >
              New course
            </Link>
          </div>
        </div>
      </section>

      <TeacherOverviewMetrics />
      <TeacherStudioInsights />

      <section className="dash-card dash-card--strong p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-line)] pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Command center
            </p>
            <h2 className="display-title mt-2 text-3xl leading-tight text-[var(--color-primary)]">
              Go to the right surface.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
            Studio stays focused on dashboard decisions. Operational work is
            separated into builder, media, payout, and settings surfaces.
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {studioActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="studio-action-card group"
              >
                <span className="studio-action-card__icon">
                  <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
                </span>
                <strong>{action.title}</strong>
                <small>{action.detail}</small>
                <span className="studio-action-card__cta">{action.cta}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
