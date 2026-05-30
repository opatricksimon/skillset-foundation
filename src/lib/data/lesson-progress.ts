"use client";

import {
  collection,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { getFirestoreDb, getFirebaseFunctions } from "@/lib/firebase/client";

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

export type LessonProgressResult = {
  progressPercent: number;
  status: "active" | "completed";
  completedLessonCount: number;
  totalLessonCount: number;
};

/**
 * Record (or clear) lesson completion through the server-authoritative
 * recordLessonProgress callable. The function validates the lesson belongs to
 * the course, writes the marker via the Admin SDK, and recomputes the
 * enrollment's progressPercent in one transaction. The client can no longer
 * write progress markers or progressPercent directly (both are admin-only in
 * firestore.rules), which closes the certificate/refund-cap spoof.
 */
export async function recordLessonProgress(
  enrollmentId: string,
  lessonId: string,
  completed: boolean,
): Promise<LessonProgressResult> {
  const callable = httpsCallable<
    { enrollmentId: string; lessonId: string; completed: boolean },
    LessonProgressResult
  >(getFirebaseFunctions(), "recordLessonProgress");

  const result = await callable({ enrollmentId, lessonId, completed });

  return result.data;
}
