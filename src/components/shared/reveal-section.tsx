"use client";

import type { HTMLAttributes } from "react";

import { useRevealOnView } from "@/lib/ui/use-reveal-on-view";

type RevealSectionProps = HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export function RevealSection({
  children,
  className = "",
  delay = 0,
  style,
  ...props
}: RevealSectionProps) {
  const { ref, revealed } = useRevealOnView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        ...style,
        transitionDelay: revealed ? `${delay}ms` : "0ms",
      }}
      className={[
        "reveal-on-view",
        revealed ? "reveal-on-view--in" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
