import { Suspense } from "react";

import { CourseMarketplace } from "@/components/courses/course-marketplace";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Browse courses",
  description:
    "Browse professional courses on Skillset. Every program is reviewed before it goes live, with course communities, live sessions, and verifiable certificates.",
  path: "/courses",
});

export default function CoursesPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
              Marketplace
            </p>
            <h1 className="display-title mt-3 text-6xl leading-none text-[var(--color-ink)]">
              Find the right course.
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
            Browse professional learning pathways, filter by category, preview
            selected lessons, and choose the course you want to continue inside
            Skillset.
          </p>
        </div>

        <Suspense
          fallback={
            <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm text-[var(--color-ink-soft)]">
                Loading courses...
              </p>
            </section>
          }
        >
          <CourseMarketplace />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
