import { Target } from "lucide-react";

const milestones = [100, 1000, 5000, 25000, 100000, 500000, 1000000];

type RevenueMilestoneStripProps = {
  currentRevenueUsd?: number;
};

export function RevenueMilestoneStrip({
  currentRevenueUsd = 0,
}: RevenueMilestoneStripProps) {
  const nextMilestone = milestones.find((milestone) => currentRevenueUsd < milestone);

  if (!nextMilestone) {
    return null;
  }

  const progress = Math.min(100, (currentRevenueUsd / nextMilestone) * 100);
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <section className="rounded-[12px] bg-[linear-gradient(90deg,var(--color-surface-soft)_0%,var(--color-surface-strong)_100%)] p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid size-10 place-items-center rounded-[10px] bg-white text-[var(--color-accent)] shadow-[var(--shadow-soft)]">
          <Target aria-hidden="true" size={20} strokeWidth={1.8} />
        </div>
        <div className="min-w-52 flex-1">
          <p className="text-sm font-semibold text-[var(--color-ink)]">
            Next milestone: {money.format(nextMilestone)} in sales
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[rgba(26,54,93,0.10)]">
            <div
              className="h-full rounded-full bg-[var(--color-accent)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="text-sm font-bold text-[var(--color-primary)]">
          {money.format(currentRevenueUsd)} / {money.format(nextMilestone)}
        </p>
      </div>
    </section>
  );
}
