import { PublicPage } from "@/components/site/public-page";

const policies = [
  ["Platform fee", "Default 15% Skillset fee on successful paid enrollments."],
  ["Refund window", "7-day automatic refund window, subject to course progress and certificate status."],
  ["Release schedule", "Creator net revenue is held in release and scheduled for transfer after 30 days."],
  ["Payout account", "Creators connect Stripe before selling paid courses."],
  ["Currency", "Marketplace displays USD by default; Stripe Checkout can present local payment options when supported."],
  ["Taxes", "Tax automation is planned through Stripe Tax when international volume justifies activation."],
];

export default function FeesAndPayoutsPage() {
  return (
    <PublicPage
      eyebrow="Fees and payouts"
      title="A payout policy built for trust."
      description="Skillset separates the student payment, refund window, platform fee, and creator payout ledger so the marketplace can protect learners and creators without hiding the rules."
    >
      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {policies.map(([title, detail]) => (
          <article
            key={title}
            className="rounded-[16px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {title}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
              {detail}
            </p>
          </article>
        ))}
      </section>
    </PublicPage>
  );
}
