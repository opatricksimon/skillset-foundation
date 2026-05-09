export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded"
  | "cancelled";

export type PaymentProvider = "stripe";

export type Order = {
  id: string;
  userId: string;
  teacherId?: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  amountMinor: number;
  currency: "USD" | "BRL" | "GYD";
  platformFeeBps: number;
  status: OrderStatus;
  provider: PaymentProvider;
  checkoutSessionId: string | null;
  paymentIntentId: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export type Payment = {
  id: string;
  orderId: string;
  userId: string;
  amountMinor: number;
  currency: "USD" | "BRL" | "GYD";
  provider: PaymentProvider;
  providerPaymentId: string;
  courseId?: string;
  refundedAmountMinor?: number;
  status: "succeeded" | "failed" | "refunded" | "partially_refunded";
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function isPaidOrder(status: OrderStatus): boolean {
  return status === "paid";
}
