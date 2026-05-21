"use client";

import { ProtectedSurface } from "@/components/auth/protected-surface";
import { PlatformShell } from "@/components/platform/platform-shell";
import { HorizontalTabs } from "@/components/shared/horizontal-tabs";
import { TableEmptyRow } from "@/components/shared/table-empty-row";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processed", label: "Processed" },
  { value: "rejected", label: "Rejected" },
];

export default function TeacherRefundsPage() {
  return (
    <ProtectedSurface permissions={["teacherStudio.access"]}>
      <PlatformShell
        eyebrow="Teacher Studio"
        title="Refunds."
        description="Review refund requests and outcomes across your courses."
      >
        <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <HorizontalTabs
            tabs={tabs}
            activeValue="all"
            onChange={() => undefined}
            ariaLabel="Refund filters"
          />
          <div className="mt-6 overflow-x-auto rounded-[4px] border border-[var(--color-line)]">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-[var(--color-surface-soft)] text-xs uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Course</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <TableEmptyRow
                  colSpan={7}
                  message="No refunds yet."
                  detail="That's a good sign. Refund records will appear here after requests are processed."
                />
              </tbody>
            </table>
          </div>
        </section>
      </PlatformShell>
    </ProtectedSurface>
  );
}
