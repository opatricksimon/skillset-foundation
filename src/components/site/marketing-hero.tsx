import Link from "next/link";

export function MarketingHero() {
  // Negative top margin pulls the hero UP behind the floating SiteNav pill
  // so the navy bg becomes the canvas the nav sits on (matches the
  // user-cited preference for nav-over-navy at scroll=0). The inner
  // container's pt-* compensates so the hero copy lands just below the
  // nav with a small breathing gap — earlier values left too much empty
  // navy between nav and badge (per audit). Only renders on the home page.
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
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-32 sm:px-8 sm:pb-14 lg:pb-16 lg:pt-40">
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <div className="inline-flex w-fit rounded-[8px] border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            For independent experts who want to teach for a living
          </div>
          <div className="mt-5 space-y-4 sm:mt-8 lg:mt-10">
            {/* Hook + outcome (Hormozi value equation: dream outcome ÷
                perceived effort). Old copy described WHAT we are; new copy
                names WHO they become + WHAT they get to skip. */}
            <h1 className="display-title text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] text-white">
              Turn your expertise into a global course business.
              <span className="block text-white/58">
                Without building a website, hiring a developer, or
                stitching tools together.
              </span>
            </h1>
            <p className="max-w-2xl text-[17px] leading-[1.7] text-white/84">
              Publish a reviewed program in days. Skillset handles checkout
              in 30+ currencies, the student workspace, the course community,
              and your payouts — so you can spend your week teaching, not
              configuring software.
            </p>
            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/auth?mode=signup&path=teacher" className="button-solid-light px-5 py-3 text-sm">
                Start teaching free
              </Link>
              <Link href="/pricing" className="button-outline-light px-5 py-3 text-sm">
                See how you get paid
              </Link>
            </div>
          </div>
          <dl className="mt-12 hidden w-full max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-5 sm:grid">
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
