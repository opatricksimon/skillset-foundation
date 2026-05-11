/**
 * @deprecated Removed from public home in MVP launch.
 * Kept for future reuse when real verified instructors exist.
 * Do not import in src/app/page.tsx.
 */
import Image from "next/image";
import Link from "next/link";

import { instructors } from "@/data/instructors";

export function InstructorShowcase() {
  return (
    <section className="border-y border-[var(--color-line)] bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Expert faculty
            </p>
            <h2 className="display-title mt-3 text-5xl leading-tight text-[var(--color-primary)]">
              Meet the educators shaping the first Skillset programs.
            </h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            Expertise should be visible before a learner commits.
          </p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Link
              key={instructor.slug}
              href={`/instructors/${instructor.slug}`}
              className="overflow-hidden rounded-[18px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,39,68,0.88)] via-transparent to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {instructor.region}
                </p>
                <h3 className="display-title mt-3 text-3xl leading-none text-[var(--color-primary)]">
                  {instructor.name}
                </h3>
                <p className="mt-3 text-sm font-semibold text-[var(--color-primary-light)]">
                  {instructor.focus}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {instructor.bio}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
