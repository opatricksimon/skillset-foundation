"use client";

import {
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import type { Order } from "@/domain/order";
import { getFirestoreDb } from "@/lib/firebase/client";

const ordersCollection = "orders";

export function subscribeToOrder(
  orderId: string,
  callback: (order: Order | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirestoreDb(), ordersCollection, orderId),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as Omit<Order, "id">),
      });
    },
    onError,
  );
}

export function subscribeToRecentOrders(
  callback: (orders: Order[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const recentOrdersQuery = query(
    collection(getFirestoreDb(), ordersCollection),
    limit(12),
  );

  return onSnapshot(
    recentOrdersQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<Order, "id">),
        })),
      );
    },
    onError,
  );
}

export function subscribeToTeacherOrders(
  teacherId: string,
  callback: (orders: Order[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const teacherOrdersQuery = query(
    collection(getFirestoreDb(), ordersCollection),
    where("teacherId", "==", teacherId),
    limit(20),
  );

  return onSnapshot(
    teacherOrdersQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<Order, "id">),
        })),
      );
    },
    onError,
  );
}
