import { Suspense } from "react";

import { CreatorCourseDetail } from "@/components/courses/creator-course-detail";
import { SiteNav } from "@/components/site/site-nav";

export default function CreatorCoursePage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <Suspense
          fallback={
            <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm text-[var(--color-ink-soft)]">
                Loading creator course...
              </p>
            </section>
          }
        >
          <CreatorCourseDetail />
        </Suspense>
      </main>
    </div>
  );
}
