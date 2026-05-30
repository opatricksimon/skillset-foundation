"use client";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import type {
  CreateSupportTicketInput,
  SupportTicket,
  SupportTicketStatus,
} from "@/domain/support-ticket";
import { getFirestoreDb } from "@/lib/firebase/client";

const supportTicketsCollection = "supportTickets";

export async function createSupportTicket(input: CreateSupportTicketInput) {
  const ticketRef = await addDoc(collection(getFirestoreDb(), supportTicketsCollection), {
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    category: input.category,
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "open",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ticketRef.id;
}

export function subscribeToUserSupportTickets(
  userId: string,
  callback: (tickets: SupportTicket[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const ticketsQuery = query(
    collection(getFirestoreDb(), supportTicketsCollection),
    where("userId", "==", userId),
  );

  return onSnapshot(
    ticketsQuery,
    (snapshot) => callback(mapSupportTicketSnapshot(snapshot.docs)),
    onError,
  );
}

export function subscribeToAdminSupportTickets(
  callback: (tickets: SupportTicket[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), supportTicketsCollection),
    (snapshot) => callback(mapSupportTicketSnapshot(snapshot.docs)),
    onError,
  );
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: SupportTicketStatus,
) {
  await updateDoc(doc(getFirestoreDb(), supportTicketsCollection, ticketId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Post a support reply the ticket owner can read back, and resolve the ticket.
 * Admin/support only (enforced by firestore.rules supportCanUpdateTicketStatus).
 */
export async function respondToSupportTicket(
  ticketId: string,
  response: string,
  responderId: string,
) {
  await updateDoc(doc(getFirestoreDb(), supportTicketsCollection, ticketId), {
    adminResponse: response.trim(),
    respondedBy: responderId,
    respondedAt: serverTimestamp(),
    status: "resolved",
    updatedAt: serverTimestamp(),
  });
}

function mapSupportTicketSnapshot(
  docs: Array<{ id: string; data: () => unknown }>,
): SupportTicket[] {
  return docs
    .map((document) => ({
      id: document.id,
      ...(document.data() as Omit<SupportTicket, "id">),
    }))
    .sort((left, right) => left.subject.localeCompare(right.subject));
}
