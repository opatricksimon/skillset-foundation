import Link from "next/link";

import { PublicPage } from "@/components/site/public-page";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

const creatorTools = [
  "Course builder with modules, lessons, previews, pricing, and drip release.",
  "Protected student workspace with progress, files, and certificates.",
  "Course-linked community, events, and future notifications.",
  "Stripe Connect onboarding, refund controls, and payout ledger.",
  "Skillset review before marketplace publication.",
  "Shareable course links for simple launch campaigns.",
];

export const metadata = buildPageMetadata({
  title: "Teach on Skillset",
  description:
    "Publish professional courses to a global audience. 15% fee paid only on sales, D+30 payouts, course community and certificates included.",
  path: "/for-creators",
});

export default function ForCreatorsPage() {
  return (
    <PublicPage
      eyebrow="For creators"
      title="Teach with a real course operating system."
      description="Skillset is designed for experts who want to publish structured learning products, manage students, build community, and get paid without stitching together disconnected tools."
    >
      <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-3">
          {creatorTools.map((tool) => (
            <div
              key={tool}
              className="rounded-[14px] border fine-rule bg-white p-5 text-sm font-semibold leading-7 text-[var(--color-ink)] shadow-[var(--shadow-soft)]"
            >
              {tool}
            </div>
          ))}
        </div>
        <aside className="rounded-[18px] border border-[var(--color-line)] bg-[var(--color-primary)] p-6 text-white shadow-[var(--shadow-soft)]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Creator path
          </p>
          <h2 className="display-title mt-3 text-4xl">
            Start as a creator, publish after review.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/78">
            Creators can draft courses immediately. Marketplace visibility
            remains controlled by Skillset review so the platform does not turn
            into a noisy upload directory.
          </p>
          <Link href="/signup" className="button-solid-light mt-6 px-5 py-3 text-sm">
            Create account
          </Link>
        </aside>
      </section>
    </PublicPage>
  );
}
