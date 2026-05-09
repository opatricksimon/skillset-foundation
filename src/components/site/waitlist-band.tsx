import Link from "next/link";

export function WaitlistBand() {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8 sm:pb-16">
      <div className="blue-panel rounded-[22px] px-6 py-8 shadow-[var(--shadow-strong)] sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-accent-soft)]">
              Next step
            </p>
            <h2 className="display-title mt-3 text-4xl leading-tight text-white sm:text-5xl">
              One learning network for courses, educators, and community.
            </h2>
          </div>
          <div className="space-y-4">
            <p className="text-sm leading-7 text-[rgba(255,255,255,0.78)]">
              Skillset is being built so learners can study with clarity and
              educators can publish with structure, support, and trust.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/platform"
                className="button-solid-light px-5 py-3 text-sm"
              >
                Explore the platform
              </Link>
              <Link
                href="/courses"
                className="button-outline-light px-5 py-3 text-sm"
              >
                Explore courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
