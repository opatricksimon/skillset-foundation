export type SupportTicketCategory =
  | "account"
  | "course"
  | "payment"
  | "technical"
  | "other";

export type SupportTicketStatus = "open" | "in_review" | "resolved";

export type SupportTicket = {
  id: string;
  userId: string;
  userEmail: string | null;
  userName: string | null;
  category: SupportTicketCategory;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type CreateSupportTicketInput = {
  userId: string;
  userEmail: string | null;
  userName: string | null;
  category: SupportTicketCategory;
  subject: string;
  message: string;
};

export const supportTicketCategoryLabels: Record<SupportTicketCategory, string> = {
  account: "Account",
  course: "Course",
  payment: "Payment",
  technical: "Technical",
  other: "Other",
};

export const supportTicketStatusLabels: Record<SupportTicketStatus, string> = {
  open: "Open",
  in_review: "In review",
  resolved: "Resolved",
};
