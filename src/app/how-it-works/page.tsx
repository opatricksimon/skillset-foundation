import { PublicPage } from "@/components/site/public-page";

const steps = [
  ["Discover", "Learners browse courses, previews, creator profiles, and categories."],
  ["Enroll", "Paid checkout activates access only after confirmed payment."],
  ["Learn", "Students progress through lessons, files, events, and course-linked community."],
  ["Verify", "Completion can produce a Skillset Verified credential when requirements are met."],
];

export default function HowItWorksPage() {
  return (
    <PublicPage
      eyebrow="How it works"
      title="Course-first learning with community built in."
      description="Skillset keeps the main loop simple: creators publish structured courses, students enroll, learning happens inside a protected workspace, and progress leads toward proof."
    >
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map(([title, detail], index) => (
          <article
            key={title}
            className="rounded-[16px] border fine-rule bg-white p-5 shadow-[var(--shadow-soft)]"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-sm font-bold text-white">
              {index + 1}
            </span>
            <h2 className="mt-4 text-lg font-bold text-[var(--color-ink)]">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
              {detail}
            </p>
          </article>
        ))}
      </section>
    </PublicPage>
  );
}
