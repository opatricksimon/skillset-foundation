import Link from "next/link";

import { PublicPage } from "@/components/site/public-page";
import { formatUsd, platformFeePercent } from "@/data/platform";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

const sampleCoursePrice = 200;
const sampleFee = (sampleCoursePrice * platformFeePercent) / 100;
const examples = [
  ["Course price", formatUsd(sampleCoursePrice)],
  [`Skillset platform fee (${platformFeePercent}%)`, formatUsd(sampleFee)],
  ["Estimated creator net", formatUsd(sampleCoursePrice - sampleFee)],
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
            The default platform fee is {platformFeePercent}% per paid sale. Creators keep control
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

      <section className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-6">
        <div>
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Ready to publish on Skillset?
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            No subscription. The platform fee applies only when you sell.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/for-creators" className="button-outline px-5 py-3 text-sm">
            Creator overview
          </Link>
          <Link href="/auth?mode=signup" className="button-solid px-5 py-3 text-sm">
            Get started free
          </Link>
        </div>
      </section>
    </PublicPage>
  );
}
