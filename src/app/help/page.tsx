import Link from "next/link";

import { PublicPage } from "@/components/site/public-page";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

const faqs = [
  ["How do students access a course?", "After enrollment is confirmed, the course appears in the student learning portal."],
  ["Can creators upload courses themselves?", "Yes. Creators draft courses in the studio, then submit for Skillset review before marketplace publication."],
  ["How are refunds handled?", "The MVP uses a 7-day automatic refund window with progress and certificate checks."],
  ["How are creator payouts handled?", "Creator earnings are tracked in a payout ledger and scheduled for release after the hold period."],
  ["Does Skillset support live classes?", "The current model supports external live links and recording upload workflows."],
];

export const metadata = buildPageMetadata({
  title: "Help center",
  description:
    "Answers about courses, payments, payouts, refunds, and getting started on Skillset.",
  path: "/help",
});

export default function HelpPage() {
  return (
    <PublicPage
      eyebrow="Help"
      title="Start with the core questions."
      description="This help center begins as a focused FAQ for learners and creators. It can later evolve into searchable support articles and ticket routing."
    >
      <section className="mt-10 grid gap-4">
        {faqs.map(([question, answer]) => (
          <article
            key={question}
            className="rounded-[16px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]"
          >
            <h2 className="text-lg font-bold text-[var(--color-ink)]">
              {question}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
              {answer}
            </p>
          </article>
        ))}
      </section>
      <div className="mt-8">
        <Link href="/support" className="button-solid px-5 py-3 text-sm">
          Contact support
        </Link>
      </div>
    </PublicPage>
  );
}
