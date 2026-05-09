import Image from "next/image";
import Link from "next/link";

import { SiteNav } from "@/components/site/site-nav";
import { instructors } from "@/data/instructors";

export default function InstructorsPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand)]">
            Instructors
          </p>
          <h1 className="display-title mt-3 text-6xl text-[var(--color-ink)]">
            Meet the educators behind the courses.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            Each profile highlights experience, teaching focus, and the courses
            they bring to Skillset.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Link
              key={instructor.slug}
              href={`/instructors/${instructor.slug}`}
              className="surface-card overflow-hidden rounded-[18px] transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,39,68,0.84)] via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {instructor.region}
                </p>
                <h2 className="display-title mt-3 text-3xl leading-none text-[var(--color-primary)]">
                  {instructor.name}
                </h2>
                <p className="mt-4 text-sm font-semibold text-[var(--color-primary-light)]">
                  {instructor.focus}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {instructor.bio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
