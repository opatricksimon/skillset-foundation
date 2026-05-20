"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useState } from "react";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("cat") ?? allCategoriesLabel,
  );
  // Seed from the platform header search (`/courses?q=...`) so the term is
  // honored and the input is pre-filled; the user can refine from there.
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [publishedCourses, setPublishedCourses] = useState<CourseCard[]>([]);
  const [publishedCoursesError, setPublishedCoursesError] = useState("");
  const [isLoadingPublishedCourses, setIsLoadingPublishedCourses] = useState(
    Boolean(getFirebaseClientConfig()),
  );
  const deferredQuery = useDeferredValue(query.toLowerCase().trim());

  // Keep category + search in the URL so a filtered view is shareable and
  // survives refresh / back-forward — consistent with the rest of the app.
  useEffect(() => {
    const desiredCat =
      activeCategory !== allCategoriesLabel ? activeCategory : null;
    const desiredQuery = query.trim() || null;

    if (
      desiredCat === searchParams.get("cat") &&
      desiredQuery === searchParams.get("q")
    ) {
      return;
    }

    const params = new URLSearchParams();
    if (desiredCat) params.set("cat", desiredCat);
    if (desiredQuery) params.set("q", desiredQuery);
    const next = params.toString();

    startTransition(() => {
      router.replace(next ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    });
  }, [activeCategory, query, pathname, router, searchParams]);
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

  const hasAnyCourses = marketplaceCourses.length > 0;
  const isFiltering =
    activeCategory !== allCategoriesLabel || deferredQuery.length > 0;

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
                aria-pressed={isActive}
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
        <div className="grid gap-5 lg:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="surface-card animate-pulse overflow-hidden rounded-[18px]"
            >
              <div className="aspect-[4/3] bg-[var(--color-surface-strong)]" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-24 rounded bg-[var(--color-surface-strong)]" />
                <div className="h-6 w-3/4 rounded bg-[var(--color-surface-strong)]" />
                <div className="h-16 rounded bg-[var(--color-surface-soft)]" />
              </div>
            </div>
          ))}
        </div>
      ) : visibleCourses.length === 0 ? (
        hasAnyCourses && isFiltering ? (
          <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
              No matches
            </p>
            <h2 className="display-title mt-3 text-3xl text-[var(--color-ink)]">
              No courses match your search.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-ink-soft)]">
              Try a different category or keyword.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory(allCategoriesLabel);
                setQuery("");
              }}
              className="button-outline mt-5 px-5 py-2.5 text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="rounded-[18px] border-2 border-dashed border-[var(--color-line-strong)] bg-white p-8 text-center sm:p-12">
            <div className="mx-auto grid size-14 place-items-center rounded-[14px] bg-[var(--color-surface-soft)] text-[var(--color-primary)]">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-7"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Marketplace opening soon
            </p>
            <h2 className="display-title mt-3 text-3xl text-[var(--color-ink)] sm:text-4xl">
              The first courses are in review.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Skillset reviews every course before it goes live so the catalog
              stays high signal. Want to be in the first wave of published
              creators? The runway is open.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/auth?mode=signup&path=teacher" className="button-solid px-5 py-3 text-sm">
                Apply to teach
              </Link>
              <Link href="/for-creators" className="button-outline px-5 py-3 text-sm">
                Creator overview
              </Link>
            </div>
          </div>
        )
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
