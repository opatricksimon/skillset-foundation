import Link from "next/link";

import { RevealSection } from "@/components/shared/reveal-section";
import { planById, payoutClearDays } from "@/data/plans";

const freePlan = planById("free");

const trustBullets = [
  `Start free at ${freePlan.commissionPercent}% commission — drop to 0% as you grow.`,
  `D+${payoutClearDays} payouts, no creator-side subscription on Free.`,
  "Drip tools to protect content from refund abuse.",
  "Course community and certificates included on every plan.",
];

export function ForCreatorsBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <RevealSection>
        <div className="relative overflow-hidden rounded-[22px] bg-[var(--color-primary)] p-6 text-white shadow-[var(--shadow-strong)] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#07172a] via-[#102944] to-[#1a365d]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                For independent experts
              </p>
              <h2 className="display-title mt-4 text-4xl leading-tight text-white sm:text-5xl">
                Bring your expertise to a global audience.
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/auth?mode=signup&path=teacher" className="button-solid-light px-5 py-3 text-sm">
                  Start teaching
                </Link>
                <Link
                  href="/promise"
                  className="inline-flex items-center px-2 py-3 text-sm font-semibold text-white/80 underline-offset-4 transition hover:text-white hover:underline"
                >
                  Read the Creator Promise
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustBullets.map((bullet, index) => (
                <RevealSection key={bullet} delay={index * 80}>
                  <div className="h-full rounded-[14px] border border-white/16 bg-white/10 p-4 text-sm leading-6 text-white/80">
                    {bullet}
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
