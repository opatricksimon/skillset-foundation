import Link from "next/link";
import { Search } from "lucide-react";

import { PublicPage } from "@/components/site/public-page";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

// FAQ items grouped by category. The `id` on each item is the deep-link
// target used by in-app components (teacher-wallet → #payouts, course-builder
// → #course-pricing / #drip-release / #course-review, integrations page →
// #integrations). Keep the id whenever the FAQ moves between categories.
const categories: ReadonlyArray<{
  id: string;
  label: string;
  items: ReadonlyArray<{ id?: string; q: string; a: string }>;
}> = [
  {
    id: "getting-started",
    label: "Getting started",
    items: [
      {
        q: "How do students access a course?",
        a: "After enrollment is confirmed, the course appears in the student learning portal under Classroom. Progress, lessons, and any community spaces tied to the course are reachable from there.",
      },
      {
        q: "How do I create my Skillset account?",
        a: "Click Get started free on the homepage. You can sign up as a learner or jump straight to the teacher application from the For creators page. The same account works for learning and teaching.",
      },
    ],
  },
  {
    id: "course-creation",
    label: "Course creation",
    items: [
      {
        q: "Can creators upload courses themselves?",
        a: "Yes. Creators draft courses inside the Studio, attach lessons and media, then submit for Skillset review before marketplace publication.",
      },
      {
        id: "course-pricing",
        q: "How do I set pricing for my course?",
        a: "Pricing is set per course inside Studio → course builder. You choose a one-time price in the currency of your choice; Stripe handles multi-currency checkout at the learner's end. The 15% platform fee is deducted after the sale and shown clearly in the wallet ledger.",
      },
      {
        id: "drip-release",
        q: "What is drip release and when should I use it?",
        a: "Drip release lets you make lessons available on a schedule instead of all at once after enrollment. Useful for cohort-style programs or to pace learners across weeks. Configure per lesson in the course builder.",
      },
      {
        id: "course-review",
        q: "How does Skillset review work?",
        a: "Every course goes through a Skillset review before it can be published in the marketplace. Reviewers check that lessons are complete, descriptions are accurate, pricing is reasonable, and any claims in the copy can be backed up. Typical review takes a few business days.",
      },
    ],
  },
  {
    id: "payouts",
    label: "Payouts",
    items: [
      {
        id: "payouts",
        q: "When do I receive my first payout?",
        a: "Creator earnings move from pending to available after the 7-day refund window closes for each enrollment. Payouts are then scheduled via Stripe Connect — typically D+30 from clearance today, with shorter cycles planned as the platform matures. The wallet panel in Studio shows the exact next payout date.",
      },
      {
        q: "How are creator payouts handled?",
        a: "Earnings are tracked in a payout ledger inside Studio. After the hold period, the balance is released to your connected bank account through Stripe Connect. You can review every sale, fee deduction, and payout line in the ledger.",
      },
    ],
  },
  {
    id: "refunds",
    label: "Refunds",
    items: [
      {
        q: "How are refunds handled?",
        a: "The current model uses a 7-day automatic refund window with progress and certificate checks. If a learner has completed less than the configured progress threshold and has not received a certificate, they can request a refund directly from their order. Refunds appear in the creator wallet within minutes of being processed.",
      },
    ],
  },
  {
    id: "live",
    label: "Live classes",
    items: [
      {
        q: "Does Skillset support live classes?",
        a: "Today's model supports external live links (Zoom, Google Meet, etc.) and recording upload workflows. Lessons can include a live session link plus a follow-up recording so learners who missed the live stay on track. Native live streaming is on the roadmap.",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    items: [
      {
        id: "integrations",
        q: "What integrations does Skillset support today?",
        a: "Skillset connects natively with Stripe (checkout, multi-currency, Connect payouts) and Firebase Auth for sign-in. Course assets and media are stored in Firebase Storage. The Studio → Integrations page lists what is live and what is coming next — request a specific integration there if you don't see it.",
      },
    ],
  },
];

export const metadata = buildPageMetadata({
  title: "Help center",
  description:
    "Answers about courses, payments, payouts, refunds, integrations, and getting started on Skillset.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <PublicPage
      eyebrow="Help"
      title="Help center."
      description="Short answers to the questions learners and creators ask most. Don't see your question? Contact support — a real person reads every message."
    >
      {/* Visual search shell. Non-functional today (we don't have enough
          content yet to justify search); the placeholder makes the intent
          explicit and the keyboard tab order already includes it. Wire it
          up to an in-page filter once the FAQ count crosses ~20. */}
      <div className="mt-8 flex w-full items-center gap-3 rounded-[12px] border fine-rule bg-white p-3 shadow-[var(--shadow-soft)]">
        <Search
          aria-hidden="true"
          size={16}
          strokeWidth={1.8}
          className="text-[var(--color-ink-muted)]"
        />
        <input
          type="search"
          disabled
          placeholder="Search help articles (coming soon — for now, jump to a category below)"
          className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-ink-muted)]"
          aria-label="Search help"
        />
      </div>

      {/* Category jump nav: 1-tap to a section. Maps to the same ids the
          in-app components link to (#payouts, #integrations, etc.). */}
      <nav
        aria-label="Help categories"
        className="mt-5 flex flex-wrap gap-2"
      >
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="rounded-full border fine-rule bg-white px-3.5 py-1.5 text-xs font-semibold text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
          >
            {category.label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-28"
            aria-labelledby={`${category.id}-heading`}
          >
            <h2
              id={`${category.id}-heading`}
              className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]"
            >
              {category.label}
            </h2>
            <div className="mt-4 grid gap-4">
              {category.items.map((item) => (
                <article
                  key={item.q}
                  id={item.id}
                  className={`rounded-[16px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)] ${item.id ? "scroll-mt-28" : ""}`}
                >
                  <h3 className="text-lg font-bold text-[var(--color-ink)]">
                    {item.q}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                    {item.a}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-[18px] border fine-rule bg-[var(--color-surface-soft)] p-7 text-center sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          Still stuck?
        </p>
        <h2 className="display-title mt-3 text-3xl text-[var(--color-primary)] sm:text-4xl">
          Talk to a real person.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-ink-soft)]">
          Payment, payout, or course-review questions go to the human support
          queue. We answer in plain language, in business hours.
        </p>
        <Link
          href="/support"
          className="button-solid mt-6 inline-flex px-5 py-3 text-sm"
        >
          Contact support
        </Link>
      </div>
    </PublicPage>
  );
}
