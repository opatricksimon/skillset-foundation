import Image from "next/image";
/**
 * @deprecated Removed from public home in MVP launch.
 * Kept for future reuse when real published courses exist.
 * Do not import in src/app/page.tsx.
 */
import Link from "next/link";

import { featuredTracks } from "@/data/site";

export function FeaturedTracks() {
  const homeTracks = featuredTracks.slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)]">
            Programs
          </p>
          <h2 className="display-title mt-3 text-5xl leading-tight text-[var(--color-ink)]">
            Featured learning pathways
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
          Explore the first structured pathways across psychology, leadership,
          management, health, and professional communication.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {homeTracks.map((track) => (
          <article key={track.title} className="surface-card overflow-hidden rounded-[18px]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={track.image}
                alt={track.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,39,68,0.84)] via-transparent to-transparent" />
              <div className="absolute left-5 top-5">
                <span className="accent-chip rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]">
                  {track.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {track.category}
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-ink-soft)]">
                  {track.duration}
                </span>
              </div>
              <h3 className="display-title mt-4 text-3xl leading-none text-[var(--color-primary)]">
                {track.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
                {track.summary}
              </p>
              <Link
                href={`/courses/${track.slug}`}
                className="button-outline mt-6 px-4 py-2 text-sm"
              >
                View program
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/courses" className="button-solid px-5 py-3 text-sm">
          View all programs
        </Link>
      </div>
    </section>
  );
}
