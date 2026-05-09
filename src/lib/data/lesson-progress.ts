"use client";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";

const enrollmentsCollection = "enrollments";
const progressCollection = "progress";

export function subscribeToCompletedLessons(
  enrollmentId: string,
  callback: (lessonIds: string[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), enrollmentsCollection, enrollmentId, progressCollection),
    (snapshot) => {
      callback(snapshot.docs.map((document) => document.id).sort());
    },
    onError,
  );
}

export async function markLessonCompleted(
  enrollmentId: string,
  userId: string,
  lessonId: string,
) {
  await setDoc(
    doc(getFirestoreDb(), enrollmentsCollection, enrollmentId, progressCollection, lessonId),
    {
      lessonId,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function unmarkLessonCompleted(
  enrollmentId: string,
  lessonId: string,
) {
  await deleteDoc(
    doc(getFirestoreDb(), enrollmentsCollection, enrollmentId, progressCollection, lessonId),
  );
}
