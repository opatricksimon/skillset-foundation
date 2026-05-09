"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";

import type { SkillsetUser } from "@/domain/auth";
import type {
  CourseEvent,
  CourseEventRsvp,
  CourseEventRsvpStatus,
  CreateCourseEventInput,
} from "@/domain/course-event";
import { getFirestoreDb } from "@/lib/firebase/client";

const courseEventsCollection = "courseEvents";

export async function createCourseEvent(input: CreateCourseEventInput) {
  const eventRef = await addDoc(collection(getFirestoreDb(), courseEventsCollection), {
    courseId: input.courseId,
    courseSlug: input.courseSlug,
    courseTitle: input.courseTitle.trim(),
    ownerId: input.ownerId,
    title: input.title.trim(),
    description: input.description.trim(),
    type: input.type,
    status: "scheduled",
    startsAt: input.startsAt,
    externalUrl: input.externalUrl.trim(),
    recordingAssetId: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return eventRef.id;
}

export function subscribeToTeacherCourseEvents(
  ownerId: string,
  callback: (events: CourseEvent[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const eventsQuery = query(
    collection(getFirestoreDb(), courseEventsCollection),
    where("ownerId", "==", ownerId),
  );

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CourseEvent, "id">),
          }))
          .sort((left, right) => left.startsAt.localeCompare(right.startsAt)),
      );
    },
    onError,
  );
}

export async function saveCourseEventRsvp(input: {
  eventId: string;
  courseSlug: string;
  status: CourseEventRsvpStatus;
  user: SkillsetUser;
}) {
  const rsvpRef = doc(
    getFirestoreDb(),
    courseEventsCollection,
    input.eventId,
    "rsvps",
    input.user.uid,
  );
  const existingRsvp = await getDoc(rsvpRef);

  await setDoc(
    rsvpRef,
    {
      eventId: input.eventId,
      courseSlug: input.courseSlug,
      userId: input.user.uid,
      attendeeName: input.user.displayName?.trim() || input.user.email || "Skillset learner",
      attendeeEmail: input.user.email,
      status: input.status,
      updatedAt: serverTimestamp(),
      ...(existingRsvp.exists() ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );
}

export function subscribeToCourseEventRsvp(
  eventId: string,
  userId: string,
  callback: (rsvp: CourseEventRsvp | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirestoreDb(), courseEventsCollection, eventId, "rsvps", userId),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      callback({
        id: snapshot.id,
        ...(snapshot.data() as Omit<CourseEventRsvp, "id">),
      });
    },
    onError,
  );
}

export function subscribeToCourseEventRsvps(
  eventId: string,
  callback: (rsvps: CourseEventRsvp[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirestoreDb(), courseEventsCollection, eventId, "rsvps"),
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CourseEventRsvp, "id">),
          }))
          .sort((left, right) => left.attendeeName.localeCompare(right.attendeeName)),
      );
    },
    onError,
  );
}

export function subscribeToCourseEvents(
  courseSlug: string,
  callback: (events: CourseEvent[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const eventsQuery = query(
    collection(getFirestoreDb(), courseEventsCollection),
    where("courseSlug", "==", courseSlug),
  );

  return onSnapshot(
    eventsQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map((document) => ({
            id: document.id,
            ...(document.data() as Omit<CourseEvent, "id">),
          }))
          .filter((event) => event.status === "scheduled")
          .sort((left, right) => left.startsAt.localeCompare(right.startsAt)),
      );
    },
    onError,
  );
}
