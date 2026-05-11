import { cn } from "@/lib/cn";

export type StatusChipStatus =
  | "active"
  | "cancelled"
  | "completed"
  | "dismissed"
  | "draft"
  | "expired"
  | "failed"
  | "inactive"
  | "in_review"
  | "needs_changes"
  | "open"
  | "paid"
  | "partially_refunded"
  | "pending"
  | "published"
  | "refunded"
  | "resolved"
  | "reviewed"
  | "revoked"
  | "succeeded";

type StatusChipProps = {
  status: StatusChipStatus | string;
  label?: string;
  className?: string;
};

const statusLabels: Record<string, string> = {
  active: "Active",
  cancelled: "Cancelled",
  completed: "Completed",
  dismissed: "Dismissed",
  draft: "Draft",
  expired: "Expired",
  failed: "Failed",
  inactive: "Inactive",
  in_review: "In review",
  needs_changes: "Needs changes",
  open: "Open",
  paid: "Paid",
  partially_refunded: "Partially refunded",
  pending: "Pending",
  published: "Published",
  refunded: "Refunded",
  resolved: "Resolved",
  reviewed: "Reviewed",
  revoked: "Revoked",
  succeeded: "Succeeded",
};

const statusVariants: Record<string, string> = {
  active: "success",
  completed: "success",
  paid: "success",
  published: "success",
  resolved: "success",
  succeeded: "success",
  draft: "draft",
  in_review: "warning",
  needs_changes: "danger",
  failed: "danger",
  cancelled: "inactive",
  dismissed: "inactive",
  expired: "inactive",
  inactive: "inactive",
  revoked: "inactive",
  open: "info",
  partially_refunded: "info",
  pending: "info",
  refunded: "info",
  reviewed: "info",
};

export function StatusChip({ status, label, className }: StatusChipProps) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, "_");
  const variant = statusVariants[normalizedStatus] ?? "draft";
  const displayLabel =
    label ?? statusLabels[normalizedStatus] ?? normalizedStatus.replaceAll("_", " ");

  return (
    <span
      className={cn("status-chip", `status-chip--${variant}`, className)}
      data-status={normalizedStatus}
    >
      <span className="status-chip__dot" aria-hidden="true" />
      {displayLabel}
    </span>
  );
}
