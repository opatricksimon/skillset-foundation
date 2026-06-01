export const brand = {
  name: "Skillset",
  shortName: "Skillset",
  title: "Skillset | Professional Learning Network",
  description:
    "Career-focused learning pathways, trusted instructors, and a polished student experience for international learners.",
  logoUrl: "/brand/skillset-logo.png",
  faviconUrl: "/brand/skillset-favicon.png",
  // Full wordmark, theme-specific (navy text on light, white text on dark).
  logoFullLight: "/brand/logo-full-light.png",
  logoFullDark: "/brand/logo-full-dark.png",
  logoFullLightSize: { width: 459, height: 112 },
  logoFullDarkSize: { width: 963, height: 259 },
  // Round emblem only — theme-agnostic, used in the collapsed sidebar.
  logoMark: "/brand/logo-mark.png",
  logoMarkSize: { width: 290, height: 295 },
  // Square-ish raster favicon. Declaring the real pixel size in the web
  // manifest avoids the "Resource size is not correct" warning that
  // `sizes: "any"` triggers on a non-vector icon.
  faviconSize: { width: 120, height: 115 },
};
