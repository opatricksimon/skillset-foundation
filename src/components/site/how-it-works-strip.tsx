const steps = [
  {
    number: "01",
    title: "Apply to teach",
    description:
      "Open a Teacher Studio account in minutes. Connect Stripe. Accept Teacher Terms.",
  },
  {
    number: "02",
    title: "Build and submit",
    description:
      "Add modules, lessons, pricing, and a free preview. Submit for Skillset review.",
  },
  {
    number: "03",
    title: "Sell globally",
    description:
      "Multi-currency checkout. D+30 transparent payout. Payout advance available.",
  },
];

export function HowItWorksStrip() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          How it works
        </p>
        <h2 className="display-title mt-3 text-4xl leading-tight text-[var(--color-primary)] sm:text-5xl">
          Three steps from idea to income.
        </h2>
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {steps.map((step) => (
          <article key={step.number} className="border-t border-[var(--color-line)] pt-6">
            <p className="display-title text-6xl leading-none text-[var(--color-accent-soft)]">
              {step.number}
            </p>
            <h3 className="mt-4 text-lg font-bold text-[var(--color-primary)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
              {step.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
