import Link from "next/link";

export function MarketingHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-primary)] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#07172a] via-[#102944] to-[#1a365d]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.45), transparent 32%), radial-gradient(circle at 86% 64%, rgba(178,34,52,0.46), transparent 34%)",
        }}
      />
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex w-fit rounded-[8px] border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            International professional learning
          </div>
          <div className="mt-10 space-y-5 sm:mt-16 lg:mt-20">
            <h1 className="display-title text-4xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
              Skillset Is Being Built.
              <span className="block text-[var(--color-accent-soft)]">
                Watch This Space.
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/84 sm:text-lg">
              Skillset is an international platform of professional courses and
              live programs. Independent experts publish full courses with
              structured learning, course communities, live sessions, and
              verifiable credentials reviewed before they go live.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth?mode=signup" className="button-solid-light px-5 py-3 text-sm">
                Get started free
              </Link>
              <Link href="/auth?mode=signup&path=teacher" className="button-outline-light px-5 py-3 text-sm">
                Become a teacher
              </Link>
            </div>
          </div>
          <dl className="mt-10 hidden max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 sm:mt-12 sm:grid">
            {[
              ["Reviewed", "every program goes through Skillset review before publishing"],
              ["Global", "multi-currency checkout in 30+ currencies via Stripe"],
              ["Verifiable", "every certificate has a public verification URL"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-sm font-bold text-white">{value}</dt>
                <dd className="mt-1 text-xs leading-5 text-white/66">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-accent)]" />
      </div>
    </section>
  );
}
