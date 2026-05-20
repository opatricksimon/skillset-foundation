import { RevealSection } from "@/components/shared/reveal-section";

const capabilities = [
  {
    title: "Course builder",
    description: "Modular structure, multiple lesson types, scheduled events, free preview slot.",
  },
  {
    title: "Drip-released content",
    description: "Protect your work from refund abuse. Release lessons by progress or schedule.",
  },
  {
    title: "Course-linked community",
    description: "Every paid course opens its own private community space for posts, replies, and likes.",
  },
  {
    title: "Multi-currency checkout",
    description: "30+ currencies. Stripe Adaptive Pricing handles local conversion at checkout.",
  },
  {
    title: "Creator wallet, 7-day clearance",
    description: "Earnings clear from pending to available 7 days after each sale. Transparent ledger with full audit trail.",
  },
  {
    title: "Verifiable certificates",
    description: "Public verification URL. Employers can confirm credentials in seconds.",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <RevealSection className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Built into Skillset
        </p>
        <h2 className="display-title mt-3 text-4xl leading-tight text-[var(--color-primary)] sm:text-5xl">
          Everything a program needs, included.
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-ink-soft)]">
          No add-ons. No feature paywalls. Every plan unlocks the same toolset
          — your plan only changes the commission per sale.
        </p>
      </RevealSection>
      <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 xl:grid-cols-3">
        {capabilities.map((capability, index) => (
          <RevealSection key={capability.title} delay={index * 80}>
            <article className="h-full rounded-[14px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] transition duration-[180ms] ease-out hover:-translate-y-0.5">
              <h3 className="text-lg font-bold text-[var(--color-primary)]">
                {capability.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {capability.description}
              </p>
            </article>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
