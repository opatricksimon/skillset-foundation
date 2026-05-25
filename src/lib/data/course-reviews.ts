"use client";

import {
  doc,
  limit,
  onSnapshot,
  query,
  where,
  collection,
  type Unsubscribe,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import type { CourseReview } from "@/domain/course-review";
import {
  normalizeCourseReviewBody,
  normalizeCourseReviewRating,
} from "@/domain/course-review";
import { getFirebaseFunctions, getFirestoreDb } from "@/lib/firebase/client";

const courseReviewsCollection = "courseReviews";

export async function submitCourseReview(input: {
  courseId: string;
  rating: number;
  body: string;
}) {
  const submitReview = httpsCallable<
    { courseId: string; rating: number; body: string | null },
    { success: true; reviewId: string; ratingAverage: number; ratingCount: number }
  >(getFirebaseFunctions(), "submitCourseReview");

  const result = await submitReview({
    courseId: input.courseId,
    rating: normalizeCourseReviewRating(input.rating),
    body: normalizeCourseReviewBody(input.body),
  });

  return result.data;
}

export function getCourseReviewId(courseId: string, userId: string) {
  return `${courseId}__${userId}`;
}

export function subscribeToCourseReviews(
  courseId: string,
  callback: (reviews: CourseReview[]) => void,
  onError: (error: Error) => void,
  maxReviews = 12,
): Unsubscribe {
  const reviewsQuery = query(
    collection(getFirestoreDb(), courseReviewsCollection),
    where("courseId", "==", courseId),
    where("status", "==", "published"),
    limit(maxReviews),
  );

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CourseReview, "id">),
          }))
          .sort((left, right) => getMillis(right.updatedAt) - getMillis(left.updatedAt)),
      );
    },
    onError,
  );
}

export function subscribeToUserCourseReview(
  courseId: string,
  userId: string,
  callback: (review: CourseReview | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirestoreDb(), courseReviewsCollection, getCourseReviewId(courseId, userId)),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as Omit<CourseReview, "id">),
      });
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
