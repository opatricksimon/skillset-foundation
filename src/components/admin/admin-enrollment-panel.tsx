"use client";

import { useEffect, useMemo, useState } from "react";

import type { TeacherCourse } from "@/domain/teacher-course";
import type { UserProfile } from "@/domain/user-profile";
import { subscribeToAdminUserProfiles } from "@/lib/data/admin-users";
import { createAdminEnrollmentForTeacherCourse } from "@/lib/data/enrollments";
import { subscribeToPublishedTeacherCourses } from "@/lib/data/published-courses";

export function AdminEnrollmentPanel() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return subscribeToAdminUserProfiles(
      (nextUsers) => {
        setUsers(nextUsers);
        setIsLoadingUsers(false);
      },
      () => {
        setError("We could not load users for manual enrollment.");
        setIsLoadingUsers(false);
      },
    );
  }, []);

  useEffect(() => {
    return subscribeToPublishedTeacherCourses(
      (nextCourses) => {
        setCourses(nextCourses);
        setIsLoadingCourses(false);
      },
      () => {
        setError("We could not load published creator courses.");
        setIsLoadingCourses(false);
      },
    );
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId) ?? null,
    [courseId, courses],
  );

  async function handleCreateEnrollment() {
    if (!userId || !selectedCourse) {
      setError("Choose a user and a published creator course.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await createAdminEnrollmentForTeacherCourse(userId, selectedCourse);
      setSuccess("Admin enrollment created. The learner can now open the creator course workspace.");
    } catch {
      setError("We could not create this enrollment. Check admin role and rules.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            Manual enrollment
          </p>
          <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
            Grant beta access without fake checkout.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
            Use this only for beta, support, or admin-granted access. Paid
            enrollment still belongs to Stripe webhook activation.
          </p>
        </div>
        <span className="rounded-[8px] bg-[var(--color-surface-soft)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">
          Admin only
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
          Learner
          <select
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            disabled={isLoadingUsers || users.length === 0}
            className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
          >
            <option value="">
              {isLoadingUsers ? "Loading users..." : "Choose user"}
            </option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.displayName || user.email || user.uid}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
          Published creator course
          <select
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            disabled={isLoadingCourses || courses.length === 0}
            className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)] disabled:bg-[var(--color-surface-soft)]"
          >
            <option value="">
              {isLoadingCourses ? "Loading courses..." : "Choose course"}
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p className="mt-5 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-5 rounded-[10px] border border-[rgba(26,54,93,0.12)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
          {success}
        </p>
      ) : null}

      <button
        type="button"
        onClick={handleCreateEnrollment}
        disabled={isSaving || !userId || !selectedCourse}
        className="button-solid mt-6 px-5 py-3 text-sm disabled:opacity-60"
      >
        {isSaving ? "Creating enrollment..." : "Create admin enrollment"}
      </button>
    </section>
  );
}
