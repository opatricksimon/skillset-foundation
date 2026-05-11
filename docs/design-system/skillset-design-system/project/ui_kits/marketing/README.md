# Marketing UI Kit — Skillset

A high-fidelity recreation of Skillset's public marketing surface, modeled directly on `SkillsetUSA/src/app/page.tsx` + `globals.css`.

## Files
- `index.html` — interactive prototype that mounts the full homepage with a working "Get started" overlay.
- `styles.css` — Skillset-specific styles (page shell, header, hero, sections, course cards, instructors, waitlist, footer, dropdown).
- `Marketing.jsx` — composed components exported globally:
  - `SiteHeader`, `Hero`, `CoursesSection`, `InstructorsSection`, `PathsBand`, `WaitlistBand`, `SiteFooter`, `AccessOverlay`
  - Each component is also a usable `data-screen-label` slide section for downstream design work.

## Notes
- Real images are not in the codebase yet — cards use the navy gradient placeholder that appears in production today.
- "Get started" expands into a two-path overlay (Learn / Teach) — same metaphor as the Access dropdown in `Header.tsx`.
- Pricing copy is illustrative, not real.
