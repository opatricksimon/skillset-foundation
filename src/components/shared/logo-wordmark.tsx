import Image from "next/image";
import Link from "next/link";

import { brand } from "@/data/brand";

type LogoWordmarkProps = {
  href?: string;
  /** "full" = wordmark (theme-aware). "mark" = round emblem only. */
  variant?: "full" | "mark";
  compact?: boolean;
  nav?: boolean;
  className?: string;
};

// Rendered height per placement. Sized to read as a brand anchor (not as
// chrome), matching reference platforms in the same SaaS-marketplace tier.
function heightClass(nav: boolean, compact: boolean): string {
  if (nav) return "h-10";
  if (compact) return "h-12";
  return "h-14";
}

function markSizeClass(nav: boolean, compact: boolean): string {
  if (nav) return "size-10";
  if (compact) return "size-11";
  return "size-12";
}

export function LogoWordmark({
  href = "/",
  variant = "full",
  compact = false,
  nav = false,
  className,
}: LogoWordmarkProps) {
  const inner =
    variant === "mark" ? (
      <Image
        src={brand.logoMark}
        alt={`${brand.name} emblem`}
        width={brand.logoMarkSize.width}
        height={brand.logoMarkSize.height}
        priority
        className={`${markSizeClass(nav, compact)} w-auto object-contain`}
      />
    ) : (
      <>
        <Image
          src={brand.logoFullLight}
          alt={`${brand.name} logo`}
          width={brand.logoFullLightSize.width}
          height={brand.logoFullLightSize.height}
          priority
          className={`logo-theme-light ${heightClass(nav, compact)} w-auto object-contain`}
        />
        <Image
          src={brand.logoFullDark}
          alt={`${brand.name} logo`}
          width={brand.logoFullDarkSize.width}
          height={brand.logoFullDarkSize.height}
          priority
          className={`logo-theme-dark ${heightClass(nav, compact)} w-auto object-contain`}
        />
      </>
    );

  return (
    <Link
      href={href}
      aria-label={brand.name}
      className={["inline-flex shrink-0 items-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      {inner}
    </Link>
  );
}
