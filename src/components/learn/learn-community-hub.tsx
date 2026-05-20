"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import type { Enrollment } from "@/domain/enrollment";
import { getCommunitySpaces } from "@/lib/data/catalog";
import { subscribeToUserEnrollments } from "@/lib/data/enrollments";

type CommunityCard = {
  id: string;
  categories: string;
  courseTitle: string;
  description: string;
  href: string;
  name: string;
  type: "official" | "creator";
  visibility: string;
};

export function LearnCommunityHub() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<CommunityCard["type"] | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    return subscribeToUserEnrollments(
      user.uid,
      (nextEnrollments) => {
        setEnrollments(nextEnrollments);
        setIsLoading(false);
      },
      () => {
        setError("We could not load your enrolled community spaces.");
        setIsLoading(false);
      },
    );
  }, [user]);

  if (isLoading) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-sm text-[var(--color-ink-soft)]">Loading community spaces...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[4px] border border-[rgba(178,34,52,0.2)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="rounded-[10px] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {error}
        </p>
      </section>
    );
  }

  const enrolledCourseSlugs = new Set(enrollments.map((enrollment) => enrollment.courseSlug));
  const demoSpaces = getCommunitySpaces();
  const demoSpaceSlugs = new Set(demoSpaces.map((space) => space.courseSlug));
  const communityCards: CommunityCard[] = [
    ...demoSpaces
      .filter((space) => enrolledCourseSlugs.has(space.courseSlug))
      .map((space) => ({
        id: space.id,
        categories: space.categories.join(" - "),
        courseTitle: space.name.replace(" community", ""),
        description: space.description,
        href: `/learn/community/${space.courseSlug}`,
        name: space.name,
        type: "official" as const,
        visibility: space.visibility.replace("_", " "),
      })),
    ...enrollments
      .filter((enrollment) => !demoSpaceSlugs.has(enrollment.courseSlug))
      .map((enrollment) => ({
        id: `creator-${enrollment.id}`,
        categories: "announcement - discussion - question - resource",
        courseTitle: enrollment.courseTitle,
        description:
          "A course-linked space for the teacher, enrolled learners, questions, announcements, and resources.",
        href: `/learn/community/creator?courseId=${enrollment.courseId}`,
        name: `${enrollment.courseTitle} community`,
        type: "creator" as const,
        visibility: "enrolled only",
      })),
  ];
  const filteredCards = communityCards.filter((space) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      space.name.toLowerCase().includes(normalizedSearch) ||
      space.courseTitle.toLowerCase().includes(normalizedSearch) ||
      space.categories.toLowerCase().includes(normalizedSearch);
    const matchesType = typeFilter === "all" || space.type === typeFilter;

    return matchesSearch && matchesType;
  });

  if (communityCards.length === 0) {
    return (
      <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
          Course communities
        </p>
        <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
          Community opens after enrollment.
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
          Enroll in a course first, then its discussion space appears here with
          announcements, questions, and shared resources.
        </p>
        <div className="mt-6">
          <Link href="/courses" className="button-solid px-5 py-3 text-sm">
            Explore programs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[4px] border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Search enrolled communities
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by course, category, or community"
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
            Community type
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as CommunityCard["type"] | "all")
              }
              className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
            >
              <option value="all">All enrolled</option>
              <option value="official">Skillset demo</option>
              <option value="creator">Creator courses</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
          {filteredCards.length} of {communityCards.length} communities visible
        </p>
      </div>

      {filteredCards.length === 0 ? (
        <div className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="display-title text-3xl text-[var(--color-ink)]">
            No communities match this filter.
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            Clear the search or switch filters to see enrolled course spaces.
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
      {filteredCards.map((space) => (
        <article
          key={space.id}
          className="rounded-[4px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-brand)]">
            {space.categories}
          </p>
          <span className="mt-4 inline-flex rounded-[8px] bg-[var(--color-surface-soft)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
            {space.type === "creator" ? "Creator course" : "Skillset program"}
          </span>
          <h3 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
            {space.name}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            {space.description}
          </p>
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-soft)]">
              {space.visibility}
            </p>
            <Link
              href={space.href}
              className="button-solid px-4 py-3 text-sm"
            >
              Open community
            </Link>
          </div>
        </article>
      ))}
      </div>
    </section>
  );
}
