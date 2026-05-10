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
