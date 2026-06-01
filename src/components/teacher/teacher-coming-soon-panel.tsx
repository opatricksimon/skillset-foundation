import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { StatusChip } from "@/components/shared/status-chip";

type TeacherComingSoonPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

/**
 * Clean "Planned" announcement for Creator Studio surfaces that exist in the
 * navigation but aren't built yet. Copy speaks to the teacher's benefit and
 * points them to something useful right now — it never explains the build
 * process or our roadmap rationale to the user.
 */
export function TeacherComingSoonPanel({
  eyebrow,
  title,
  description,
  primaryHref = "/teach",
  primaryLabel = "Back to Studio",
}: TeacherComingSoonPanelProps) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-10">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
        <StatusChip status="pending" label="Planned" />
      </div>
      <h3 className="display-title mt-4 max-w-3xl text-4xl leading-tight text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-ink-soft)]">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={primaryHref} className="button-solid px-4 py-3 text-sm">
          {primaryLabel}
          <ArrowRight aria-hidden="true" size={14} strokeWidth={1.8} />
        </Link>
        {primaryHref !== "/teach/builder" ? (
          <Link href="/teach/builder" className="button-outline px-4 py-3 text-sm">
            Open Course Builder
          </Link>
        ) : null}
      </div>
    </section>
  );
}
