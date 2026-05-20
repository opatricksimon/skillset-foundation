import { StatusChip } from "@/components/shared/status-chip";

type TeacherComingSoonPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function TeacherComingSoonPanel({
  eyebrow,
  title,
  description,
}: TeacherComingSoonPanelProps) {
  return (
    <section className="rounded-[4px] border border-[var(--color-line)] bg-white p-8 text-center shadow-[var(--shadow-soft)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h3 className="display-title mx-auto mt-3 max-w-2xl text-4xl text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        {description}
      </p>
      <div className="mt-6 flex justify-center">
        <StatusChip status="pending" label="Coming soon" />
      </div>
    </section>
  );
}
