import Link from "next/link";

export function MarketingHero() {
  // Negative top margin pulls the hero UP behind the floating SiteNav pill
  // so the navy bg becomes the canvas the nav sits on (matches the
  // user-cited preference for nav-over-navy at scroll=0). The inner
  // container's pt-* compensates so the hero copy stays where it was.
  // Only renders on the home page; SiteNav is z-40, hero is at default
  // stacking so the pill stays on top.
  return (
    <section className="relative -mt-24 overflow-hidden bg-[var(--color-primary)] text-white lg:-mt-32">
      <div className="absolute inset-0 bg-gradient-to-br from-[#07172a] via-[#102944] to-[#1a365d]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 28%, rgba(255,255,255,0.45), transparent 32%), radial-gradient(circle at 86% 64%, rgba(178,34,52,0.46), transparent 34%)",
        }}
      />
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-44 sm:px-8 lg:pb-28 lg:pt-60">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex w-fit rounded-[8px] border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            International professional learning
          </div>
          <div className="mt-10 space-y-5 sm:mt-16 lg:mt-20">
            <h1 className="display-title text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] text-white">
              The marketplace for serious online courses.
              <span className="block text-white/58">
                Reviewed before they go live.
              </span>
            </h1>
            <p className="max-w-2xl text-[17px] leading-[1.7] text-white/84">
              Skillset is an international platform where independent experts
              publish full courses with structured learning, course communities,
              live sessions, and verifiable credentials. Every program goes
              through review before going public.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth?mode=signup" className="button-solid-light px-5 py-3 text-sm">
                Get started free
              </Link>
              <Link href="/promise" className="button-outline-light px-5 py-3 text-sm">
                Read the Promise
              </Link>
            </div>
          </div>
          <dl className="mt-12 hidden max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 sm:grid">
            {[
              ["Reviewed", "Every program goes through Skillset review before publishing."],
              ["Global", "Multi-currency checkout in 30+ currencies via Stripe."],
              ["Verifiable", "Every certificate has a public verification URL."],
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
