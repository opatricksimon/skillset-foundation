import Link from "next/link";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type InlineHelpProps = {
  topic: string;
  children: ReactNode;
  href: string;
  className?: string;
};

export function InlineHelp({ topic, children, href, className }: InlineHelpProps) {
  return (
    <aside
      className={cn(
        "flex items-start gap-3 rounded-[8px] border-l-[3px] border-l-[var(--color-info)] bg-[var(--color-info-soft)] px-4 py-3",
        className,
      )}
    >
      <Info
        aria-hidden="true"
        size={16}
        strokeWidth={1.9}
        className="mt-0.5 shrink-0 text-[var(--color-info)]"
      />
      <p className="text-xs leading-6 text-[var(--color-primary)]">
        {children}{" "}
        <Link href={href} className="font-semibold underline underline-offset-2">
          Learn more about {topic}
        </Link>
      </p>
    </aside>
  );
}
