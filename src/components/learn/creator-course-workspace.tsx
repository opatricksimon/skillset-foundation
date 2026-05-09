"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { EnrolledCourseWorkspace } from "@/components/learn/enrolled-course-workspace";
import { canOpenEnrollment, type Enrollment } from "@/domain/enrollment";
import type { TeacherCourse } from "@/domain/teacher-course";
import { subscribeToEnrollment } from "@/lib/data/enrollments";
import { teacherCourseToLearningCourse } from "@/lib/data/published-courses";
import { subscribeToTeacherCourse } from "@/lib/data/teacher-courses";
import { getFirebaseClientConfig } from "@/lib/firebase/config";

export function CreatorCourseWorkspace() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") ?? "";
  const hasFirebaseConfig = Boolean(getFirebaseClientConfig());
  const { user } = useAuth();
  const [enrollmentState, setEnrollmentState] = useState<{
    enrollment: Enrollment | null;
    key: string | null;
    ready: boolean;
  }>({
    enrollment: null,
    key: null,
    ready: false,
  });
  const [courseState, setCourseState] = useState<{
    course: TeacherCourse | null;
    key: string | null;
    ready: boolean;
  }>({
    course: null,
    key: null,
    ready: false,
  });
  const [error, setError] = useState("");
  const enrollment =
    enrollmentState.key === courseId ? enrollmentState.enrollment : null;
  const canOpenCourse = enrollment ? canOpenEnrollment(enrollment.status) : false;
  const course = courseState.key === courseId ? courseState.course : null;
  const isLoadingEnrollment = Boolean(
    user
      && courseId
      && hasFirebaseConfig
      && (!enrollmentState.ready || enrollmentState.key !== courseId),
  );
  const isLoadingCourse = Boolean(
    canOpenCourse && (!courseState.ready || courseState.key !== courseId),
  );

  useEffect(() => {
    if (!user || !courseId || !hasFirebaseConfig) {
      return;
    }

    return subscribeToEnrollment(
      user.uid,
      courseId,
      (nextEnrollment) => {
        setEnrollmentState({
          enrollment: nextEnrollment,
          key: courseId,
          ready: true,
        });
      },
      () => {
        setError("We could not confirm your enrollment for this creator course.");
        setEnrollmentState({
          enrollment: null,
          key: courseId,
          ready: true,
        });
      },
    );
  }, [courseId, hasFirebaseConfig, user]);

  useEffect(() => {
    if (!enrollment || !canOpenEnrollment(enrollment.status) || !courseId) {
      return;
    }

    return subscribeToTeacherCourse(
      courseId,
      (nextCourse) => {
        setCourseState({
          course: nextCourse,
          key: courseId,
          ready: true,
        });
      },
      () => {
        setError("We could not load this creator course workspace.");
        setCourseState({
          course: null,
          key: courseId,
          ready: true,
        });
      },
    );
  }, [courseId, enrollment]);

  if (!courseId) {
    return (
      <CreatorWorkspaceState
        title="Course not selected."
        detail="Open My Learning from an enrollment card or return to the marketplace."
      />
    );
  }

  if (!hasFirebaseConfig) {
    return (
      <CreatorWorkspaceState
        title="Creator course access is not connected."
        detail="Firebase configuration is required before enrolled creator courses can load."
      />
    );
  }

  if (isLoadingEnrollment || isLoadingCourse) {
    return (
      <CreatorWorkspaceState
        title="Loading course workspace..."
        detail="We are confirming enrollment and loading the teacher-published course."
      />
    );
  }

  if (error) {
    return <CreatorWorkspaceState title="Course unavailable." detail={error} />;
  }

  if (!enrollment) {
    return (
      <CreatorWorkspaceState
        title="Enrollment required."
        detail="This private workspace opens only after payment, admin enrollment, or approved access."
      />
    );
  }

  if (!canOpenCourse) {
    return (
      <CreatorWorkspaceState
        title="Course access is inactive."
        detail={`This enrollment is ${enrollment.status}. Private lessons reopen only after payment, admin approval, or restored access.`}
      />
    );
  }

  if (!course) {
    return (
      <CreatorWorkspaceState
        title="Course record not found."
        detail="The enrollment exists, but the course record is unavailable or restricted."
      />
    );
  }

  return (
    <EnrolledCourseWorkspace
      course={teacherCourseToLearningCourse(course)}
      enableFirestoreAssets
    />
  );
}

function CreatorWorkspaceState({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
        Creator course access
      </p>
      <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        {detail}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/learn" className="button-solid px-5 py-3 text-sm">
          Back to My Learning
        </Link>
        <Link href="/courses" className="button-outline px-5 py-3 text-sm">
          Open marketplace
        </Link>
      </div>
    </section>
  );
}
