import { PublicPage } from "@/components/site/public-page";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

const examples = [
  ["Course price", "$200.00"],
  ["Skillset platform fee", "$30.00"],
  ["Estimated creator net", "$170.00"],
];

export const metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Transparent pricing for Skillset creators: a flat 15% platform fee, paid only when you sell. No subscription, no hidden costs.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <PublicPage
      eyebrow="Pricing"
      title="Clear learner pricing. Transparent creator economics."
      description="Learners pay the price set by each creator. Skillset keeps a platform fee on successful paid enrollments, then releases creator earnings through the payout ledger."
    >
      <section className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Default model
          </p>
          <h2 className="display-title mt-3 text-4xl text-[var(--color-ink)]">
            Skillset earns when creators sell.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">
            The default platform fee is 15% per paid sale. Creators keep control
            of course price, content, and learning experience while Skillset
            provides checkout, access control, review, community, and payout
            infrastructure.
          </p>
        </div>
        <div className="grid gap-3">
          {examples.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-[14px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {label}
              </p>
              <p className="text-xl font-bold text-[var(--color-primary)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PublicPage>
  );
}
