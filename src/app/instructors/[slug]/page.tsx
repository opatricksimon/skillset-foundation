import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteNav } from "@/components/site/site-nav";
import { instructors } from "@/data/instructors";

export function generateStaticParams() {
  return instructors.map((instructor) => ({ slug: instructor.slug }));
}

export default function InstructorDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const instructor = instructors.find((item) => item.slug === params.slug);

  if (!instructor) {
    notFound();
  }

  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="surface-card overflow-hidden rounded-[18px] p-0">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={instructor.image}
                alt={instructor.name}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,39,68,0.84)] via-transparent to-transparent" />
            </div>
            <div className="p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                {instructor.region}
              </p>
              <h1 className="display-title mt-4 text-6xl leading-none text-[var(--color-primary)]">
                {instructor.name}
              </h1>
              <p className="mt-4 text-sm font-semibold text-[var(--color-primary-light)]">
                {instructor.focus}
              </p>
            </div>
          </aside>
          <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-7 shadow-[var(--shadow-soft)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent)]">
              Profile
            </p>
            <p className="mt-4 text-sm leading-8 text-[var(--color-ink-soft)]">
              {instructor.bio}
            </p>
            <p className="mt-6 text-sm leading-8 text-[var(--color-ink-soft)]">
              Each profile is designed to make teaching style, subject focus,
              and program fit easier to understand at a glance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="button-solid px-5 py-3 text-sm"
              >
                Explore courses
              </Link>
              <Link
                href="/instructors"
                className="button-outline px-5 py-3 text-sm"
              >
                Back to instructors
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
