const capabilities = [
  {
    title: "Course builder",
    description: "Modules, lessons, multiple media types, and free previews.",
  },
  {
    title: "Drip-released content",
    description: "Protect your work. Release lessons over time, by progress or by schedule.",
  },
  {
    title: "Course-linked community",
    description: "Every paid course gets its own private community space.",
  },
  {
    title: "Multi-currency checkout",
    description: "30+ currencies. Stripe Adaptive Pricing. Local conversion at checkout.",
  },
  {
    title: "Creator wallet, D+30 payouts",
    description: "Transparent ledger. Payout advance available. Full audit trail.",
  },
  {
    title: "Verifiable certificates",
    description: "Public verification URLs. Recruiters can confirm credentials in seconds.",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Built in
        </p>
        <h2 className="display-title mt-3 text-4xl leading-tight text-[var(--color-primary)] sm:text-5xl">
          The operating system for serious courses.
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {capabilities.map((capability) => (
          <article
            key={capability.title}
            className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]"
          >
            <h3 className="text-lg font-bold text-[var(--color-primary)]">
              {capability.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
              {capability.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
