import { SiteNav } from "@/components/site/site-nav";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "How Skillset collects, uses, and protects your data.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <section className="rounded-[18px] border border-[var(--color-line)] bg-white p-8 shadow-[var(--shadow-soft)] sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Legal
          </p>
          <h1 className="display-title mt-4 text-6xl leading-none text-[var(--color-primary)]">
            Privacy policy
          </h1>
          <p className="mt-6 text-sm leading-8 text-[var(--color-ink-soft)]">
            Learn how Skillset handles account details, course activity, and
            support information for visitors, learners, and educators.
          </p>
        </section>
      </main>
    </div>
  );
}
