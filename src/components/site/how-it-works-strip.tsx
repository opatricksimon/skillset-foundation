import { RevealSection } from "@/components/shared/reveal-section";

const steps = [
  {
    number: "01",
    title: "Apply to teach",
    description:
      "Open a Teacher Studio account, accept Teacher Terms, connect Stripe Express. Free, takes minutes.",
  },
  {
    number: "02",
    title: "Build and submit",
    description:
      "Build modules and lessons in Course Builder. Set pricing and a free preview lesson. Submit for review.",
  },
  {
    number: "03",
    title: "Sell globally",
    description:
      "Skillset reviews your program. Once approved, your course is live on the marketplace. Get paid in 30+ currencies, D+30.",
  },
];

export function HowItWorksStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
      <RevealSection className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          How it works
        </p>
        <h2 className="display-title mt-3 text-4xl leading-tight text-[var(--color-primary)] sm:text-5xl">
          Three steps from idea to income.
        </h2>
      </RevealSection>
      <div className="mt-10 grid gap-8 sm:mt-12 lg:grid-cols-3">
        {steps.map((step, index) => (
          <RevealSection key={step.number} delay={index * 120}>
            <article className="border-t border-[var(--color-line)] pt-6">
              <p className="display-title inline-block border-b border-[var(--color-primary)] text-6xl leading-none text-[var(--color-accent-soft)]">
                {step.number}
              </p>
              <h3 className="mt-4 text-lg font-bold text-[var(--color-primary)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                {step.description}
              </p>
            </article>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
