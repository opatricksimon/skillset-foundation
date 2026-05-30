"use client";

import { httpsCallable } from "firebase/functions";

import { getFirebaseFunctions } from "@/lib/firebase/client";

type RequestRefundInput = {
  enrollmentId: string;
};

type RequestRefundResult = {
  refundId: string;
  status: string | null;
};

export async function requestEnrollmentRefund(enrollmentId: string) {
  const requestRefund = httpsCallable<RequestRefundInput, RequestRefundResult>(
    getFirebaseFunctions(),
    "requestRefund",
  );

  return requestRefund({ enrollmentId });
}

type IssueAdminRefundInput = {
  orderId: string;
  amountMinor?: number;
};

/**
 * Admin-initiated refund (full or partial). Gated server-side on the admin
 * role; the order/ledger/enrollment state transition flows through the
 * charge.refunded webhook. `amountMinor` omitted means a full refund.
 */
export async function issueAdminRefund(orderId: string, amountMinor?: number) {
  const callable = httpsCallable<IssueAdminRefundInput, RequestRefundResult>(
    getFirebaseFunctions(),
    "issueAdminRefund",
  );

  return callable({
    orderId,
    ...(amountMinor !== undefined ? { amountMinor } : {}),
  });
}
