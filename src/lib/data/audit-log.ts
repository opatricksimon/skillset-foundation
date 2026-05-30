"use client";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Timestamp,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";

const auditLogCollection = "auditLog";

export interface AuditLogEntry {
  id: string;
  action: string;
  actorId: string;
  actorEmail: string | null;
  targetType: string;
  targetId: string;
  summary: string;
  metadata: Record<string, string | number | boolean | null>;
  createdAt?: Timestamp;
}

/**
 * Streams the most recent audit entries (newest first) for the admin ops
 * dashboard. Read access is enforced by Firestore rules (admins only); this
 * collection is never written from the client.
 */
export function subscribeToAuditLog(
  callback: (entries: AuditLogEntry[]) => void,
  onError: (error: Error) => void,
  max = 100,
): Unsubscribe {
  const auditQuery = query(
    collection(getFirestoreDb(), auditLogCollection),
    orderBy("createdAt", "desc"),
    limit(max),
  );

  return onSnapshot(
    auditQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => {
          const data = document.data() as Omit<AuditLogEntry, "id">;
          return { id: document.id, ...data };
        }),
      );
    },
    onError,
  );
}
