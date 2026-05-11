"use client";

import {
  collection,
  limit,
  onSnapshot,
  query,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { getFirebaseFunctions, getFirestoreDb } from "@/lib/firebase/client";

export type AccountActionRequestType = "account_deletion" | "data_export";
export type AccountActionStatus = "pending" | "processing" | "completed" | "rejected";

export type AccountActionRequest = {
  id: string;
  type: AccountActionRequestType;
  requestedBy: string;
  email?: string | null;
  status: AccountActionStatus;
  requestedAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

type AccountActionResult = {
  success: boolean;
  requestId: string;
};

export async function requestDataExportAction() {
  const callable = httpsCallable<Record<string, never>, AccountActionResult>(
    getFirebaseFunctions(),
    "requestDataExport",
  );

  return callable({});
}

export async function requestAccountDeletionAction() {
  const callable = httpsCallable<Record<string, never>, AccountActionResult>(
    getFirebaseFunctions(),
    "requestAccountDeletion",
  );

  return callable({});
}

export function subscribeToAccountActionRequests(
  callback: (requests: AccountActionRequest[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const requestsQuery = query(
    collection(getFirestoreDb(), "accountActionRequests"),
    limit(50),
  );

  return onSnapshot(
    requestsQuery,
    (snapshot) => {
      const requests = snapshot.docs
        .map((document) => ({
          id: document.id,
          ...(document.data() as Omit<AccountActionRequest, "id">),
        }))
        .sort((left, right) => {
          const leftMillis = left.requestedAt?.toMillis?.() ?? 0;
          const rightMillis = right.requestedAt?.toMillis?.() ?? 0;

          return rightMillis - leftMillis;
        });

      callback(requests);
    },
    onError,
  );
}
