"use client";

import { DashboardFilters } from "@/components/shared/dashboard-filters";

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In review" },
  { value: "needs_changes", label: "Needs changes" },
  { value: "inactive", label: "Inactive" },
  { value: "all", label: "All" },
];

type StatusFilterDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export function StatusFilterDropdown({
  value,
  onChange,
}: StatusFilterDropdownProps) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
        Status
      </p>
      <DashboardFilters
        filters={[
          {
            key: "status",
            label: "Status",
            value,
            options: statusOptions,
          },
        ]}
        onChange={(_key, nextValue) => onChange(nextValue)}
      />
    </div>
  );
}
