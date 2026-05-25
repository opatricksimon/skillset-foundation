import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Layers3 } from "lucide-react";

import { StatusChip } from "@/components/shared/status-chip";

type TeacherComingSoonPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function TeacherComingSoonPanel({
  eyebrow,
  title,
  description,
  primaryHref = "/teach",
  primaryLabel = "Back to Studio",
}: TeacherComingSoonPanelProps) {
  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)]">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_360px]">
        <div>
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
            <Link href="/teach/builder" className="button-outline px-4 py-3 text-sm">
              Open Course Builder
            </Link>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-brand)]">
            Why this page exists
          </p>
          <div className="mt-4 grid gap-3">
            {[
              {
                icon: Layers3,
                title: "Navigation is reserved",
                detail: "The surface has a stable place in Creator Studio.",
              },
              {
                icon: Clock3,
                title: "Workflow is staged",
                detail: "The MVP keeps focus on course creation, uploads, checkout, and learning.",
              },
              {
                icon: CheckCircle2,
                title: "No fake data",
                detail: "This page stays honest until collaboration logic is ready.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-[12px] border border-[var(--color-line)] bg-white p-3"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-[var(--color-surface-strong)] text-[var(--color-primary)]">
                    <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-ink)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-ink-soft)]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
