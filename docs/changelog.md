# Changelog

## 2026-05-11

- `[P6-HM-1][frontend]` Refined the home page copy around verified capabilities, added the Skillset Promise preview band, added reveal-on-view motion for marketing sections, and removed unused mock marketing components.
- `[P6-AV-1][frontend]` Added authenticated user refresh after avatar upload and made avatar URLs cache-busting so header/sidebar avatars update without a manual reload.
- `[P6-OB-1][frontend]` Replaced the minimal welcome choice with a Typeform-style onboarding wizard that saves answers incrementally and resumes incomplete onboarding.
- `[P6-SB-1][frontend]` Added a collapsible platform sidebar with persistent local state, hover expansion, a compact session avatar state, and mobile bottom navigation with a drawer.
- `[P6-AM-1][frontend]` Extracted AccountMenu into a shared component, added producer/learner switch view, and connected the same avatar menu to the platform header.
- `[P6-ADD-01/04/27][frontend]` Added platform setup status banners, a notification bell empty state, and a floating help bubble for authenticated surfaces.
- `[P6-ADD-07/17/19][frontend]` Added shared table empty rows, listing search bars, and canonical status chips across teacher, learner, support, and ops surfaces.
- `[P6-ADD-02/03/06/08/09][frontend]` Reworked Teacher Studio with horizontal tabs, dashboard filters, a revenue milestone strip, a status filter, and a create-course modal that routes into Course Builder.
- `[P6-ADD-12/13][frontend]` Added a read-only members-area preview route for Course Builder and a canonical Preview button in the builder header.
