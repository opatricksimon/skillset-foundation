import Link from "next/link";

import { RevealSection } from "@/components/shared/reveal-section";

const promises = [
  {
    eyebrow: "01",
    title: "Fee-lock for 24 months",
    description: "Your fee at signup is your fee for two years.",
  },
  {
    eyebrow: "03",
    title: "Data portability",
    description: "Export your full business in one click, anytime.",
  },
  {
    eyebrow: "04",
    title: "One-click cancellation",
    description: "Delete your account in one click. No retention games.",
  },
];

export function PromisePreviewBand() {
  return (
    <section className="bg-[var(--color-surface-soft)] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <RevealSection>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              The Skillset Promise
            </p>
            <h2 className="display-title mt-3 text-4xl leading-tight text-[var(--color-primary)] sm:text-5xl">
              Six commitments. Written down. Public.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
              Skillset writes its obligations to creators into a contract
              everyone can read. Fee-locked. Data portable. Cancellable. Read
              it before signing up.
            </p>
          </div>
        </RevealSection>

        <div className="mt-10 grid gap-5 md:grid-cols-3 sm:mt-12">
          {promises.map((promise, index) => (
            <RevealSection key={promise.title} delay={index * 100}>
              <article className="h-full rounded-[14px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] transition duration-[180ms] ease-out hover:-translate-y-0.5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                  {promise.eyebrow}
                </p>
                <h3 className="mt-4 text-lg font-bold text-[var(--color-primary)]">
                  {promise.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {promise.description}
                </p>
              </article>
            </RevealSection>
          ))}
        </div>

        <RevealSection delay={260}>
          <Link href="/promise" className="button-outline mt-10 px-5 py-3 text-sm">
            Read the full Promise
          </Link>
        </RevealSection>
      </div>
    </section>
  );
}
