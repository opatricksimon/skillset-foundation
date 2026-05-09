import Image from "next/image";
import Link from "next/link";

import { brand } from "@/data/brand";

type LogoWordmarkProps = {
  href?: string;
  compact?: boolean;
  nav?: boolean;
  className?: string;
};

export function LogoWordmark({
  href = "/",
  compact = false,
  nav = false,
  className,
}: LogoWordmarkProps) {
  const dimensions = nav
    ? { width: 62, height: 19 }
    : compact
      ? { width: 92, height: 28 }
      : { width: 132, height: 40 };

  const content = (
    <div
      className={[
        "flex items-center",
        nav ? "h-7 max-w-[74px]" : compact ? "max-w-[104px]" : "max-w-[148px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src={brand.logoUrl}
        alt={`${brand.name} logo`}
        width={dimensions.width}
        height={dimensions.height}
        priority
        className={nav ? "h-auto max-h-5 w-auto object-contain" : "h-auto w-auto object-contain"}
      />
    </div>
  );

  return (
    <Link href={href} aria-label={brand.name} className="inline-flex shrink-0 items-center">
      {content}
    </Link>
  );
}
