import { SiteNav } from "@/components/site/site-nav";

export default function TermsPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-8 shadow-[var(--shadow-soft)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Legal
          </p>
          <h1 className="display-title mt-4 text-6xl leading-none text-[var(--color-primary)]">
            Terms of service
          </h1>
          <p className="mt-6 text-sm leading-8 text-[var(--color-ink-soft)]">
            These terms explain how the site, courses, and educator tools can be
            used across Skillset.
          </p>
        </section>
      </main>
    </div>
  );
}
