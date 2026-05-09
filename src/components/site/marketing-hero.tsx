import Image from "next/image";
import Link from "next/link";

import { featuredTracks } from "@/data/site";

export function MarketingHero() {
  const heroImage = featuredTracks[1]?.image ?? featuredTracks[0].image;

  return (
    <section className="mx-auto w-full max-w-7xl px-5 pb-8 pt-5 sm:px-8 lg:pb-12">
      <div className="relative overflow-hidden rounded-[12px] bg-[var(--color-primary)] px-5 py-8 text-white shadow-[var(--shadow-strong)] sm:px-8 lg:px-12 lg:py-11">
        <Image
          src={heroImage}
          alt="Skillset professional learning"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.34]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,39,68,0.96)] via-[rgba(26,54,93,0.78)] to-[rgba(15,39,68,0.36)]" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent)]" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex w-fit rounded-[8px] border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            International professional learning
          </div>
          <div className="mt-10 space-y-5 sm:mt-16 lg:mt-20">
            <h1 className="display-title text-4xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Learn From The Best.
              <span className="block text-[var(--color-accent-soft)]">
                Become The Best.
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/84 sm:text-lg">
              A premium learning platform for expert-led courses, focused
              student progress, and communities built around professional growth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses" className="button-solid-light px-5 py-3 text-sm">
                Explore programs
              </Link>
              <Link href="/instructors" className="button-outline-light px-5 py-3 text-sm">
                Meet the faculty
              </Link>
            </div>
          </div>
          <dl className="mt-10 hidden max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 sm:mt-12 sm:grid">
            {[
              ["Courses", "structured learning"],
              ["Community", "peer support"],
              ["Certificates", "proof of progress"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="display-title text-3xl leading-none text-white">{value}</dt>
                <dd className="mt-1 text-xs uppercase tracking-[0.18em] text-white/66">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
