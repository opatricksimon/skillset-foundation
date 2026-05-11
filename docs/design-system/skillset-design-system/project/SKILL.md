---
name: skillset-design
description: Use this skill to generate well-branded interfaces and assets for Skillset, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts *or* production code, depending on the need.

## Key files

- `README.md` — overview, content fundamentals, visual foundations, iconography, index of the rest.
- `colors_and_type.css` — tokens: colors, type ramp, spacing, radii, shadows. Drop-in stylesheet for any HTML artifact.
- `assets/` — logos, marks, hero gradient, generic illustrations.
- `fonts/` — Cormorant Garamond (display) + Manrope (UI). Fall back to Google Fonts if missing.
- `preview/` — per-token preview cards (colors, type, spacing, shadows, components).
- `ui_kits/marketing/` — public Skillset.com homepage kit.
- `ui_kits/platform/` — logged-in shell for Learn / Teach / Ops.
