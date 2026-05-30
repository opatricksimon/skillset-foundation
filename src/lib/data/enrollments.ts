"use client";

import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  collection,
  type Unsubscribe,
} from "firebase/firestore";

import {
  createEnrollmentSnapshot,
  getEnrollmentId,
  type Enrollment,
} from "@/domain/enrollment";
import type { Course } from "@/domain/learning";
import type { TeacherCourse } from "@/domain/teacher-course";
import { getFirestoreDb } from "@/lib/firebase/client";

const enrollmentsCollection = "enrollments";

export async function createManualEnrollment(userId: string, course: Course) {
  const enrollmentId = getEnrollmentId(userId, course.slug);
  const enrollmentRef = doc(getFirestoreDb(), enrollmentsCollection, enrollmentId);
  const snapshot = await getDoc(enrollmentRef);

  if (snapshot.exists()) {
    return enrollmentId;
  }

  await setDoc(enrollmentRef, {
    id: enrollmentId,
    userId,
    ...createEnrollmentSnapshot(course),
    status: "active",
    source: "manual_demo",
    progressPercent: 0,
    lastLessonId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return enrollmentId;
}

export async function createAdminEnrollmentForTeacherCourse(
  userId: string,
  course: TeacherCourse,
) {
  const enrollmentId = getEnrollmentId(userId, course.id);
  const enrollmentRef = doc(getFirestoreDb(), enrollmentsCollection, enrollmentId);
  const snapshot = await getDoc(enrollmentRef);

  if (snapshot.exists()) {
    return enrollmentId;
  }

  await setDoc(enrollmentRef, {
    id: enrollmentId,
    userId,
    courseId: course.id,
    courseSlug: course.id,
    courseTitle: course.title,
    courseCategory: course.category,
    courseImage: course.coverImageUrl || "/brand/logo-mark.png",
    status: "active",
    source: "admin",
    progressPercent: 0,
    lastLessonId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return enrollmentId;
}

export function subscribeToUserEnrollments(
  userId: string,
  callback: (enrollments: Enrollment[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const enrollmentsQuery = query(
    collection(getFirestoreDb(), enrollmentsCollection),
    where("userId", "==", userId),
  );

  return onSnapshot(
    enrollmentsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<Enrollment, "id">),
          }))
          .sort((left, right) => left.courseTitle.localeCompare(right.courseTitle)),
      );
    },
    onError,
  );
}

export function subscribeToAdminGrantedEnrollments(
  callback: (enrollments: Enrollment[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const grantedQuery = query(
    collection(getFirestoreDb(), enrollmentsCollection),
    where("source", "in", ["admin", "manual_demo"]),
  );

  return onSnapshot(
    grantedQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<Enrollment, "id">),
          }))
          .sort((left, right) => left.courseTitle.localeCompare(right.courseTitle)),
      );
    },
    onError,
  );
}

/**
 * Revoke an admin/demo-granted enrollment. Hard-deletes the enrollment doc
 * (admin only via firestore.rules enrollments delete == isAdmin()), the inverse
 * of createManualEnrollment / createAdminEnrollmentForTeacherCourse.
 */
export async function revokeEnrollment(enrollmentId: string) {
  await deleteDoc(doc(getFirestoreDb(), enrollmentsCollection, enrollmentId));
}

export function subscribeToEnrollment(
  userId: string,
  courseSlug: string,
  callback: (enrollment: Enrollment | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirestoreDb(), enrollmentsCollection, getEnrollmentId(userId, courseSlug)),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as Omit<Enrollment, "id">),
      });
    },
    onError,
  );
}
