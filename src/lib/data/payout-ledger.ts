"use client";

import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import type { PayoutLedgerEntry } from "@/domain/payout-ledger";
import { getFirestoreDb } from "@/lib/firebase/client";

const payoutLedgerCollection = "payoutLedger";

export function subscribeToTeacherPayoutLedger(
  teacherId: string,
  callback: (entries: PayoutLedgerEntry[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const payoutLedgerQuery = query(
    collection(getFirestoreDb(), payoutLedgerCollection),
    where("teacherId", "==", teacherId),
    limit(50),
  );

  return onSnapshot(
    payoutLedgerQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<PayoutLedgerEntry, "id">),
        })),
      );
    },
    onError,
  );
}
