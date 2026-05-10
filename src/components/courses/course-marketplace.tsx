"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";

import type { CourseCard } from "@/lib/data/catalog";
import {
  subscribeToPublishedTeacherCourses,
  teacherCourseToCourseCard,
} from "@/lib/data/published-courses";
import { getFirebaseClientConfig } from "@/lib/firebase/config";

type CourseMarketplaceProps = {
  courses?: CourseCard[];
};

const allCategoriesLabel = "All courses";

export function CourseMarketplace({ courses = [] }: CourseMarketplaceProps) {
  const [activeCategory, setActiveCategory] = useState(allCategoriesLabel);
  const [query, setQuery] = useState("");
  const [publishedCourses, setPublishedCourses] = useState<CourseCard[]>([]);
  const [publishedCoursesError, setPublishedCoursesError] = useState("");
  const [isLoadingPublishedCourses, setIsLoadingPublishedCourses] = useState(
    Boolean(getFirebaseClientConfig()),
  );
  const deferredQuery = useDeferredValue(query.toLowerCase().trim());
  const marketplaceCourses = [...courses, ...publishedCourses];
  const categories = [
    allCategoriesLabel,
    ...Array.from(new Set(marketplaceCourses.map((course) => course.category))),
  ];

  useEffect(() => {
    if (!getFirebaseClientConfig()) {
      return;
    }

    return subscribeToPublishedTeacherCourses(
      (nextCourses) => {
        setPublishedCourses(nextCourses.map(teacherCourseToCourseCard));
        setPublishedCoursesError("");
        setIsLoadingPublishedCourses(false);
      },
      () => {
        setPublishedCoursesError("Creator-published courses could not load right now.");
        setIsLoadingPublishedCourses(false);
      },
    );
  }, []);

  const visibleCourses = marketplaceCourses.filter((course) => {
    const matchesCategory =
      activeCategory === allCategoriesLabel || course.category === activeCategory;
    const matchesQuery =
      !deferredQuery ||
      `${course.title} ${course.category} ${course.summary}`
        .toLowerCase()
        .includes(deferredQuery);

    return matchesCategory && matchesQuery;
  });

  return (
    <section>
      <div className="mb-8 grid gap-3 lg:grid-cols-[1fr_280px] lg:items-center">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((filter) => {
            const isActive = activeCategory === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveCategory(filter)}
                className={
                  isActive
                    ? "button-solid px-4 py-2 text-sm"
                    : "button-outline px-4 py-2 text-sm"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>
        <label className="grid gap-2 text-sm font-semibold text-[var(--color-ink)]">
          Search
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skill, category, or outcome"
            className="rounded-[10px] border border-[var(--color-line)] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[var(--color-primary-light)]"
          />
        </label>
      </div>

      {publishedCoursesError ? (
        <p className="mb-5 rounded-[10px] border border-[rgba(178,34,52,0.2)] bg-[rgba(178,34,52,0.06)] px-4 py-3 text-sm font-semibold text-[var(--color-accent)]">
          {publishedCoursesError}
        </p>
      ) : null}

      {isLoadingPublishedCourses ? (
        <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-sm leading-7 text-[var(--color-ink-soft)]">
            Loading published creator courses...
          </p>
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
            Creator catalog opening
          </p>
          <h2 className="display-title mt-3 text-4xl text-[var(--color-ink)]">
            Published courses will appear here after Skillset review.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
            The marketplace is connected to the teacher publishing workflow. As
            creators submit and Skillset approves courses, this page becomes the
            public storefront for enrollment, previews, and course discovery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/for-creators" className="button-solid px-5 py-3 text-sm">
              For creators
            </Link>
            <Link href="/teach" className="button-outline px-5 py-3 text-sm">
              Open Creator Studio
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {visibleCourses.map((track) => {
            const hasFreePreview = Boolean(track.freePreviewHref);

            return (
            <article
              key={`${track.slug}-${track.title}`}
              className="surface-card overflow-hidden rounded-[18px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={track.image}
                  alt={track.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,39,68,0.84)] via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                  <span className="accent-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                    {track.status}
                  </span>
                  <span className="accent-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                    {track.sourceLabel ?? "Preview"}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {track.category}
                  </span>
                  <span className="text-xs text-[var(--color-ink-soft)]">{track.duration}</span>
                </div>
                <h2 className="display-title mt-4 text-3xl leading-none text-[var(--color-primary)]">
                  {track.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {track.summary}
                </p>
                <div className="mt-5 grid gap-2 rounded-[12px] border fine-rule bg-[var(--color-surface-soft)] p-4 text-sm">
                  <p className="font-semibold text-[var(--color-ink)]">
                    {track.priceLabel}
                  </p>
                  <p className="text-xs leading-5 text-[var(--color-ink-soft)]">
                    {track.freePreviewLabel}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    href={track.href ?? `/courses/${track.slug}`}
                    className="button-solid px-4 py-2 text-sm"
                  >
                    View course
                  </Link>
                  {hasFreePreview ? (
                    <Link
                      href={track.freePreviewHref ?? `/courses/${track.slug}#free-preview`}
                      className="button-outline px-4 py-2 text-sm"
                    >
                      Free preview
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
