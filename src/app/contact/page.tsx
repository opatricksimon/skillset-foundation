import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

export default function ContactPage() {
  return (
    <div className="page-shell">
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
        <section className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Contact
          </p>
          <h1 className="display-title mt-4 text-6xl leading-none text-[var(--color-primary)]">
            Reach the right team for support, teaching, and partnerships.
          </h1>
        </section>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              [
                "General inquiries",
                "Questions about programs, access, and the overall Skillset experience.",
              ],
              [
                "Educator applications",
                "For professionals who want to teach, collaborate, or bring expertise to the platform.",
              ],
              [
                "Support and safety",
                "A dedicated route for learner care, account help, and trust-related concerns.",
              ],
              [
                "Partnerships",
                "For institutions, regional collaborators, and strategic growth conversations.",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[14px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {label}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
      </main>
      <SiteFooter />
    </div>
  );
}
