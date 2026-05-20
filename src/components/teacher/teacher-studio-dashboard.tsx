"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, startTransition } from "react";

import { DashboardFilters } from "@/components/shared/dashboard-filters";
import { HorizontalTabs } from "@/components/shared/horizontal-tabs";
import { StatusChip } from "@/components/shared/status-chip";
import { RevenueMilestoneStrip } from "@/components/teacher/revenue-milestone-strip";
import { TeacherCourseStudio } from "@/components/teacher/teacher-course-studio";
import { TeacherOverviewMetrics } from "@/components/teacher/teacher-overview-metrics";
import { TeacherEventStudio } from "@/components/teacher/teacher-event-studio";
import { TeacherWalletPanel } from "@/components/teacher/teacher-wallet-panel";

const tabs = [
  { value: "my_courses", label: "My courses" },
  { value: "co_productions", label: "Co-productions" },
  { value: "affiliations", label: "Affiliations" },
];

const checklist = [
  "Complete your educator profile",
  "Outline your first course",
  "Set launch details and pricing",
  "Submit for Skillset review",
];

const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last_7d", label: "Last 7 days" },
  { value: "last_30d", label: "Last 30 days" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "this_year", label: "This year" },
  { value: "custom", label: "Custom range" },
];

const courseOptions = [{ value: "all", label: "All courses" }];

const currencyOptions = [
  { value: "all", label: "All currencies" },
  { value: "usd", label: "USD" },
  { value: "brl", label: "BRL" },
  { value: "eur", label: "EUR" },
];

export function TeacherStudioDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "my_courses";
  const period = searchParams.get("period") ?? "today";
  const course = searchParams.get("course") ?? "all";
  const currency = searchParams.get("currency") ?? "all";

  const filters = useMemo(
    () => [
      { key: "period", label: "Period", value: period, options: periodOptions },
      { key: "course", label: "Course", value: course, options: courseOptions },
      {
        key: "currency",
        label: "Currency",
        value: currency,
        options: currencyOptions,
      },
    ],
    [course, currency, period],
  );

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    startTransition(() => {
      router.replace(`/teach?${params.toString()}`, { scroll: false });
    });
  }

  function handleTabChange(value: string) {
    updateParam("tab", value);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <HorizontalTabs
          tabs={tabs}
          activeValue={activeTab}
          onChange={handleTabChange}
          ariaLabel="Teacher Studio sections"
        />
        <div className="mt-5">
          <DashboardFilters filters={filters} onChange={updateParam} />
        </div>
      </section>

      {activeTab === "co_productions" ? (
        <ComingSoonPanel
          eyebrow="Co-productions"
          title="Collaborate with other creators."
          description="Co-produce courses with other Skillset creators and split revenue automatically. This surface is scheduled for a future release."
        />
      ) : activeTab === "affiliations" ? (
        <ComingSoonPanel
          eyebrow="Affiliations"
          title="Affiliate distribution is planned."
          description="Invite trusted partners to distribute your courses with controlled attribution and payouts. This surface is not active yet."
        />
      ) : (
        <>
          <TeacherOverviewMetrics />
          <RevenueMilestoneStrip />
          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-baseline gap-2 border-b border-[var(--color-line)] pb-4">
                <h3 className="text-base font-bold text-[var(--color-ink)]">
                  Publishing flow
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                  Publishing checklist
                </span>
              </div>
              <div className="mt-6 grid gap-3">
                {checklist.map((item, index) => (
                  <div
                    key={item}
                    className="rounded-[3px] border fine-rule bg-[var(--color-surface-soft)] p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-brand)]">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-5">
              <div className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-baseline gap-2 border-b border-[var(--color-line)] pb-4">
                  <h3 className="text-base font-bold text-[var(--color-ink)]">
                    Educator support
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)]">
                    Teacher support
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                  Publishing guidance, quality standards, and account help stay
                  close to the teaching workflow.
                </p>
              </div>
            </div>
          </div>
          <TeacherWalletPanel />
          <TeacherCourseStudio />
          <TeacherEventStudio />
        </>
      )}
    </div>
  );
}

function ComingSoonPanel({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h3 className="display-title mx-auto mt-3 max-w-2xl text-4xl text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        {description}
      </p>
      <div className="mt-6 flex justify-center">
        <StatusChip status="pending" label="Coming soon" />
      </div>
    </section>
  );
}
