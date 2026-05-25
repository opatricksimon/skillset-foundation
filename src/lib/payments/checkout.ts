"use client";

import { httpsCallable } from "firebase/functions";

import { getFirebaseFunctions } from "@/lib/firebase/client";

type CreateCheckoutSessionInput = {
  courseId: string;
};

type CreateCheckoutSessionResult = {
  url: string;
};

type CreateFreeCourseEnrollmentResult = {
  enrollmentId: string;
};

export async function startCourseCheckout(courseId: string) {
  const createCheckoutSession = httpsCallable<
    CreateCheckoutSessionInput,
    CreateCheckoutSessionResult
  >(getFirebaseFunctions(), "createCheckoutSession");
  const result = await createCheckoutSession({ courseId });

  if (!result.data.url) {
    throw new Error("Checkout URL missing.");
  }

  window.location.assign(result.data.url);
}

export async function enrollInFreeCreatorCourse(courseId: string) {
  const createFreeEnrollment = httpsCallable<
    CreateCheckoutSessionInput,
    CreateFreeCourseEnrollmentResult
  >(getFirebaseFunctions(), "createFreeCourseEnrollment");
  const result = await createFreeEnrollment({ courseId });

  if (!result.data.enrollmentId) {
    throw new Error("Enrollment was not created.");
  }

  return result.data.enrollmentId;
}
