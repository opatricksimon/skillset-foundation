import { PublicPage } from "@/components/site/public-page";

const trustLayers = [
  ["Course review", "Courses pass through Skillset review before marketplace publication."],
  ["Protected access", "Private learning workspaces open through enrollment, not public links."],
  ["Refund controls", "Automatic refunds are limited by time, progress, and certificate status."],
  ["Moderation", "Course communities include reporting and operations review workflows."],
  ["Verified credentials", "Skillset Verified certificates can be issued and checked through the platform."],
  ["Audit-ready payments", "Orders, payments, refunds, payout ledger entries, and transfers are tracked separately."],
];

export default function TrustPage() {
  return (
    <PublicPage
      eyebrow="Trust and safety"
      title="A marketplace needs rules before scale."
      description="Skillset is built around controlled course publication, protected student access, transparent payments, moderation, and verifiable learning outcomes."
    >
      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trustLayers.map(([title, detail]) => (
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
