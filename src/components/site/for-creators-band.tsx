import Link from "next/link";

const trustBullets = [
  "15% platform fee, paid only when you sell.",
  "D+30 payouts with optional advance.",
  "Drip tools to protect your content from refund abuse.",
  "Built-in community for every course.",
];

export function ForCreatorsBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8">
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
              <Link href="/trust" className="button-outline-light px-5 py-3 text-sm">
                Read the Creator Promise
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustBullets.map((bullet) => (
              <div
                key={bullet}
                className="rounded-[14px] border border-white/16 bg-white/10 p-4 text-sm leading-6 text-white/80"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
