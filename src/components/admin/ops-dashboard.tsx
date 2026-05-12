"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useMemo } from "react";

import { AccountActionRequestsPanel } from "@/components/admin/account-action-requests-panel";
import { AdminEnrollmentPanel } from "@/components/admin/admin-enrollment-panel";
import { CommunityModerationQueue } from "@/components/admin/community-moderation-queue";
import { CourseReviewQueue } from "@/components/admin/course-review-queue";
import { PaymentOperationsPanel } from "@/components/admin/payment-operations-panel";
import { SupportTicketQueue } from "@/components/admin/support-ticket-queue";
import { UserLookupPanel } from "@/components/admin/user-lookup-panel";
import { DashboardFilters } from "@/components/shared/dashboard-filters";
import { HorizontalTabs } from "@/components/shared/horizontal-tabs";
import { StatusChip } from "@/components/shared/status-chip";

const opsTabs = [
  { value: "courses", label: "Courses in review" },
  { value: "payments", label: "Payments" },
  { value: "community", label: "Community reports" },
  { value: "support", label: "Support tickets" },
  { value: "users", label: "Users" },
  { value: "audit", label: "Audit log" },
];

const periodOptions = [
  { value: "today", label: "Today" },
  { value: "last_7d", label: "Last 7 days" },
  { value: "last_30d", label: "Last 30 days" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "this_year", label: "This year" },
];

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in_review", label: "In review" },
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];

export function OpsDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "courses";
  const period = searchParams.get("period") ?? "last_7d";
  const status = searchParams.get("status") ?? "all";
  const filters = useMemo(
    () => [
      { key: "period", label: "Period", value: period, options: periodOptions },
      { key: "status", label: "Status", value: status, options: statusOptions },
    ],
    [period, status],
  );

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    startTransition(() => {
      router.replace(`/ops?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <HorizontalTabs
          tabs={opsTabs}
          activeValue={activeTab}
          onChange={(value) => updateParam("tab", value)}
          ariaLabel="Operations queues"
        />
        <div className="mt-5">
          <DashboardFilters filters={filters} onChange={updateParam} />
        </div>
      </section>

      {activeTab === "payments" ? (
        <>
          <PaymentOperationsPanel />
          <AdminEnrollmentPanel />
        </>
      ) : activeTab === "community" ? (
        <CommunityModerationQueue />
      ) : activeTab === "support" ? (
        <SupportTicketQueue />
      ) : activeTab === "users" ? (
        <>
          <UserLookupPanel />
          <AccountActionRequestsPanel />
        </>
      ) : activeTab === "audit" ? (
        <AuditLogPlaceholder />
      ) : (
        <CourseReviewQueue />
      )}
    </div>
  );
}

function AuditLogPlaceholder() {
  return (
    <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        Audit log
      </p>
      <h3 className="display-title mx-auto mt-3 max-w-2xl text-4xl text-[var(--color-primary)]">
        Sensitive actions will be listed here.
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        Admin audit logging is reserved for backend hardening. This tab gives
        operations a stable destination before Cloud Functions write audit
        events.
      </p>
      <div className="mt-6 flex justify-center">
        <StatusChip status="pending" label="Backend pending" />
      </div>
    </section>
  );
}
