import type { MetadataRoute } from "next";

import { brand } from "@/data/brand";

export const dynamic = "force-static";

// Served at /manifest.webmanifest. Next.js injects the
// <link rel="manifest"> tag automatically when this file exists.
// Colors mirror the design tokens in globals.css
// (--color-primary #1a365d, --color-base #ffffff).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.title,
    short_name: brand.shortName,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a365d",
    icons: [
      {
        src: brand.logoMark,
        sizes: `${brand.logoMarkSize.width}x${brand.logoMarkSize.height}`,
        type: "image/png",
        purpose: "any",
      },
      {
        src: brand.faviconUrl,
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
