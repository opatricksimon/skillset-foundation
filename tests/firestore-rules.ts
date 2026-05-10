import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  it,
} from "vitest";

let testEnv: RulesTestEnvironment;

const verifiedAuth = {
  email: "learner@example.com",
  email_verified: true,
};

const unverifiedAuth = {
  email: "learner@example.com",
  email_verified: false,
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "skillset-rules-test",
    firestore: {
      rules: readFileSync(resolve("firestore.rules"), "utf8"),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe("Firestore user role rules", () => {
  it("allows a verified user to create a student profile only", async () => {
    const db = testEnv.authenticatedContext("student-1", verifiedAuth).firestore();
    const profileRef = doc(db, "users/student-1");

    await assertSucceeds(
      setDoc(profileRef, {
        uid: "student-1",
        email: "learner@example.com",
        displayName: "Learner One",
        roles: ["student"],
        onboardingCompleted: false,
        termsAcceptedAt: Timestamp.now(),
        termsVersion: "2026-05-10",
        privacyAcceptedAt: Timestamp.now(),
        privacyVersion: "2026-05-10",
        marketingConsent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      }),
    );
  });

  it("blocks client self-assignment of protected platform roles", async () => {
    const db = testEnv.authenticatedContext("bad-actor", verifiedAuth).firestore();

    await assertFails(
      setDoc(doc(db, "users/bad-actor"), {
        uid: "bad-actor",
        email: "bad@example.com",
        displayName: "Bad Actor",
        roles: ["student", "admin"],
        onboardingCompleted: true,
        termsAcceptedAt: Timestamp.now(),
        termsVersion: "2026-05-10",
        privacyAcceptedAt: Timestamp.now(),
        privacyVersion: "2026-05-10",
        marketingConsent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      }),
    );
  });

  it("requires verified email and Teacher Terms before self-service teacher role", async () => {
    const unverifiedDb = testEnv
      .authenticatedContext("teacher-unverified", unverifiedAuth)
      .firestore();
    const verifiedDb = testEnv
      .authenticatedContext("teacher-verified", verifiedAuth)
      .firestore();

    await assertFails(
      setDoc(doc(unverifiedDb, "users/teacher-unverified"), {
        uid: "teacher-unverified",
        email: "teacher@example.com",
        displayName: "Teacher Unverified",
        roles: ["student", "teacher"],
        onboardingCompleted: true,
        teacherTermsAcceptedAt: Timestamp.now(),
        teacherTermsVersion: "2026-05-10",
        termsAcceptedAt: Timestamp.now(),
        termsVersion: "2026-05-10",
        privacyAcceptedAt: Timestamp.now(),
        privacyVersion: "2026-05-10",
        marketingConsent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      }),
    );

    await assertFails(
      setDoc(doc(verifiedDb, "users/teacher-verified"), {
        uid: "teacher-verified",
        email: "teacher@example.com",
        displayName: "Teacher Verified",
        roles: ["student", "teacher"],
        onboardingCompleted: true,
        termsAcceptedAt: Timestamp.now(),
        termsVersion: "2026-05-10",
        privacyAcceptedAt: Timestamp.now(),
        privacyVersion: "2026-05-10",
        marketingConsent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      }),
    );

    await assertSucceeds(
      setDoc(doc(verifiedDb, "users/teacher-verified"), {
        uid: "teacher-verified",
        email: "teacher@example.com",
        displayName: "Teacher Verified",
        roles: ["student", "teacher"],
        onboardingCompleted: true,
        teacherTermsAcceptedAt: Timestamp.now(),
        teacherTermsVersion: "2026-05-10",
        termsAcceptedAt: Timestamp.now(),
        termsVersion: "2026-05-10",
        privacyAcceptedAt: Timestamp.now(),
        privacyVersion: "2026-05-10",
        marketingConsent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      }),
    );
  });
});

describe("Firestore course publishing rules", () => {
  it("allows teacher draft creation but blocks direct publication", async () => {
    await seedTeacher("teacher-1");

    const db = testEnv.authenticatedContext("teacher-1", verifiedAuth).firestore();

    await assertSucceeds(
      setDoc(doc(db, "courses/course-draft"), createCourse("teacher-1", "draft")),
    );

    await assertFails(
      setDoc(
        doc(db, "courses/course-published"),
        createCourse("teacher-1", "published"),
      ),
    );
  });

  it("allows teacher submit-for-review but blocks teacher self-publish", async () => {
    await seedTeacher("teacher-1");

    const db = testEnv.authenticatedContext("teacher-1", verifiedAuth).firestore();
    const courseRef = doc(db, "courses/course-review");

    await assertSucceeds(setDoc(courseRef, createCourse("teacher-1", "draft")));
    await assertSucceeds(updateDoc(courseRef, {
      status: "in_review",
      reviewNote: null,
      updatedAt: Timestamp.now(),
    }));
    await assertFails(updateDoc(courseRef, {
      status: "published",
      updatedAt: Timestamp.now(),
    }));
  });
});

async function seedTeacher(uid: string) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), `users/${uid}`), {
      uid,
      email: `${uid}@example.com`,
      displayName: "Teacher One",
      roles: ["student", "teacher"],
      onboardingCompleted: true,
      teacherTermsAcceptedAt: Timestamp.now(),
      teacherTermsVersion: "2026-05-10",
      termsAcceptedAt: Timestamp.now(),
      termsVersion: "2026-05-10",
      privacyAcceptedAt: Timestamp.now(),
      privacyVersion: "2026-05-10",
      marketingConsent: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      lastLoginAt: Timestamp.now(),
    });
  });
}

function createCourse(ownerId: string, status: "draft" | "published" | "in_review") {
  return {
    ownerId,
    title: "Professional Course",
    summary: "A structured professional course with a clear learning outcome.",
    category: "Leadership",
    status,
    modules: [],
    lessonCount: 0,
    priceAmountMinor: 19900,
    currency: "USD",
    platformFeeBps: 1500,
    dripStrategy: "instant",
    dripIntervalDays: 1,
    freePreviewLessonId: null,
    coverImageUrl: null,
    reviewNote: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}
