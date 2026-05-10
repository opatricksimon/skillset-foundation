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
  CreateTeacherCourseInput,
  TeacherCourse,
  TeacherCourseStatus,
  UpdateTeacherCourseBuilderInput,
} from "@/domain/teacher-course";
import { countCourseLessons } from "@/domain/teacher-course";
import { getFirestoreDb } from "@/lib/firebase/client";

const coursesCollection = "courses";

export async function createTeacherCourse(input: CreateTeacherCourseInput) {
  const courseRef = await addDoc(collection(getFirestoreDb(), coursesCollection), {
    ownerId: input.ownerId,
    title: input.title.trim(),
    summary: input.summary.trim(),
    category: input.category.trim(),
    status: "draft",
    modules: [],
    lessonCount: 0,
    priceAmountMinor: null,
    currency: "USD",
    platformFeeBps: 1500,
    dripStrategy: "instant",
    dripIntervalDays: 1,
    freePreviewLessonId: null,
    coverImageUrl: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return courseRef.id;
}

export async function submitTeacherCourseForReview(courseId: string) {
  await updateDoc(doc(getFirestoreDb(), coursesCollection, courseId), {
    status: "in_review",
    reviewNote: null,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCourseReviewStatus(
  courseId: string,
  status: Extract<TeacherCourseStatus, "published" | "needs_changes" | "inactive">,
  reviewNote: string | null = null,
) {
  await updateDoc(doc(getFirestoreDb(), coursesCollection, courseId), {
    status,
    reviewNote: reviewNote?.trim() || null,
    updatedAt: serverTimestamp(),
  });
}

export async function updateTeacherCourseBuilder(
  courseId: string,
  input: UpdateTeacherCourseBuilderInput,
) {
  await updateDoc(doc(getFirestoreDb(), coursesCollection, courseId), {
    title: input.title.trim(),
    summary: input.summary.trim(),
    category: input.category.trim(),
    modules: input.modules,
    lessonCount: countCourseLessons(input.modules),
    priceAmountMinor: input.priceAmountMinor,
    currency: input.currency,
    platformFeeBps: input.platformFeeBps,
    dripStrategy: input.dripStrategy,
    dripIntervalDays: input.dripIntervalDays,
    freePreviewLessonId: input.freePreviewLessonId,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToTeacherCourse(
  courseId: string,
  callback: (course: TeacherCourse | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirestoreDb(), coursesCollection, courseId),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as Omit<TeacherCourse, "id">),
      });
    },
    onError,
  );
}

export function subscribeToTeacherCourses(
  ownerId: string,
  callback: (courses: TeacherCourse[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const coursesQuery = query(
    collection(getFirestoreDb(), coursesCollection),
    where("ownerId", "==", ownerId),
  );

  return onSnapshot(
    coursesQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<TeacherCourse, "id">),
        })),
      );
    },
    onError,
  );
}

export function subscribeToCoursesInReview(
  callback: (courses: TeacherCourse[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const reviewQuery = query(
    collection(getFirestoreDb(), coursesCollection),
    where("status", "==", "in_review"),
  );

  return onSnapshot(
    reviewQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...(document.data() as Omit<TeacherCourse, "id">),
        })),
      );
    },
    onError,
  );
}
