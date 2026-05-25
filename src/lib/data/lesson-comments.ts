"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";

export type LessonComment = {
  id: string;
  courseId: string;
  lessonId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const coursesCollection = "courses";
const lessonCommentsCollection = "lessonComments";

export async function addLessonComment(input: {
  courseId: string;
  lessonId: string;
  authorId: string;
  authorName: string;
  body: string;
}) {
  const body = input.body.trim();

  if (body.length < 3) {
    throw new Error("Comment is too short.");
  }

  const commentsRef = collection(
    getFirestoreDb(),
    coursesCollection,
    input.courseId,
    lessonCommentsCollection,
  );

  await addDoc(commentsRef, {
    courseId: input.courseId,
    lessonId: input.lessonId,
    authorId: input.authorId,
    authorName: input.authorName.trim() || "Skillset learner",
    body,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLessonComment(courseId: string, commentId: string) {
  await deleteDoc(
    doc(
      getFirestoreDb(),
      coursesCollection,
      courseId,
      lessonCommentsCollection,
      commentId,
    ),
  );
}

export function subscribeToLessonComments(
  courseId: string,
  lessonId: string,
  callback: (comments: LessonComment[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const commentsQuery = query(
    collection(
      getFirestoreDb(),
      coursesCollection,
      courseId,
      lessonCommentsCollection,
    ),
    where("lessonId", "==", lessonId),
  );

  return onSnapshot(
    commentsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<LessonComment, "id">),
          }))
          .sort((left, right) => {
            const leftTime = getMillis(left.createdAt);
            const rightTime = getMillis(right.createdAt);
            return leftTime - rightTime;
          }),
      );
    },
    onError,
  );
}

function getMillis(value: unknown): number {
  if (
    typeof value === "object"
    && value !== null
    && "toMillis" in value
    && typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }

  return 0;
}
