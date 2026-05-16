# Claude Design — Frontend / UX / Responsiveness Audit Brief

Last updated: 2026-05-16

Purpose: this brief is meant to be handed to an AI tool ("Claude Design") that
**has direct read access to the GitHub repository**. Unlike the macro/micro
master prompt in this same folder, this is a focused audit request: read the
real code, judge the real UI, and return a prioritized, file-referenced
improvement report for both desktop and mobile.

Copy everything between `BEGIN PROMPT` and `END PROMPT`.

---

## BEGIN PROMPT

You are a senior frontend architect and product designer. You have read access
to the GitHub repository `opatricksimon/skillset-foundation` (branch `main`).
Audit the actual code in the repo — do not reason from assumptions. When you
make a claim, cite the concrete file path (and component/line where useful).

### What Skillset is

Skillset is a premium international online-course marketplace plus learning
community. It has four surfaces: a public marketing site, a student/learner
portal, a teacher studio (creators build and sell courses), and an operations
console (admin/support). It earns via a platform fee on course sales (Stripe
Connect). The product is modeled on proven creator platforms (Cakto, Kiwify,
Hubla, Hotmart) but must feel original and premium, not like a clone.

### Stack and architecture (verify in repo, don't trust this blindly)

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, deployed on
  Firebase Hosting with SSR (Cloud Run). Auth/Firestore/Storage via Firebase.
- Design tokens live in `src/app/globals.css` (`:root` + `[data-theme="dark"]`).
  All color/spacing/shadow/radius decisions should flow through these tokens.
- Marketing/public site components: `src/components/site/*`
  (header, nav, account menu, footer).
- Authenticated platform shell: `src/components/platform/*`
  (`platform-shell.tsx`, `platform-nav.tsx`, `mobile-sidebar-drawer.tsx`,
  `session-card.tsx`) plus `src/components/auth/protected-surface.tsx`.
- Navigation data model: `src/data/site.ts` (`platformNav`, contexts/groups).
- Permissions/roles: `src/lib/permissions/`, `src/domain/auth.ts`.
- Profile + account: `src/components/account/*`, `src/lib/data/profile-media.ts`.
- Shared primitives: `src/components/shared/*` (e.g. `skillset-spinner.tsx`,
  `user-avatar.tsx`).
- Routes under `src/app/` — public pages, `/learn`, `/teach`, `/ops`,
  `/account`, `/onboarding`, `/welcome`, plus `sitemap.ts`/`robots.ts`.

### Recently settled — do NOT relitigate these (verify they hold, then move on)

These shipped intentionally; only flag them if they are genuinely broken:

1. The platform sidebar is now **context-aware and compact**: it renders one
   workspace context at a time (learner / teacher / ops), switched from the
   top-right account menu, with subtle hairline dividers between groups and no
   stacked uppercase section headers. It should fit desktop without scrolling.
2. Loading states are unified through one component (`SkillsetSpinner`).
3. The marketing header nav is deduped; no misleading dropdown carets.
4. The teacher activation banner is actionable (links to the accept flow).
5. A themed scrollbar was added in `globals.css`.
6. Profile photo upload accepts JPG/PNG/WebP up to 5 MB and persists to
   Storage + Firestore + Auth.

### What to evaluate

Across **both desktop and mobile** (mobile uses a bottom nav + slide-in
drawer — review `mobile-sidebar-drawer.tsx` and the `@media (max-width: 920px)`
rules in `globals.css`):

1. Information architecture and navigation — is the route/section hierarchy
   coherent for each role? Are learner vs teacher vs ops surfaces clearly
   differentiated? Dead ends, orphan routes, redundant paths, unclear labels.
2. Visual hierarchy and design consistency — typographic scale, spacing
   rhythm, token usage vs hardcoded values, component reuse vs one-off styles,
   consistency of cards/buttons/empty states across pages.
3. Frontend functionality and interaction quality — forms, loading/empty/error
   states, optimistic feedback, focus management, keyboard and screen-reader
   accessibility, color contrast, motion (respect `prefers-reduced-motion`).
4. Responsiveness — layout integrity from ~360px to wide desktop; touch target
   sizes; the mobile drawer and bottom nav; tables/grids on small screens.
5. Functional gaps — places where the UI promises something it doesn't deliver,
   or where a standard marketplace/creator-platform capability is missing or
   half-built. Distinguish "missing feature" from "present but broken".
6. Performance signals visible from code — oversized client components,
   unnecessary `"use client"`, unoptimized images, layout shift risks.

### Hard constraints

- Do not propose backend/auth/permission rewrites. Do not weaken Firestore or
  Storage security rules. Do not break SSR.
- Respect the existing design tokens; recommend new tokens rather than scattered
  hardcoded values.
- Anti-fake principle: never recommend showing instructors, courses, ratings,
  or testimonials that don't exist. Honest empty states are correct, not a bug.
- No regressions: changes must keep lint, the Vitest suite, and `next build`
  green. Prefer surgical changes over broad refactors.

### Deliverable format

Return, in this order:

1. A one-paragraph executive read of overall frontend quality and the single
   highest-leverage improvement.
2. A prioritized findings table with columns: `ID | Area | Surface
   (desktop/mobile/both) | Severity (P0–P3) | Problem | Evidence (file path) |
   Recommended change | Effort (S/M/L) | Regression risk`.
   P0 = broken/blocker, P1 = significant UX or functional gap, P2 = polish,
   P3 = nice-to-have.
3. A short narrative (max ~400 words) on information architecture and visual
   hierarchy specifically — what the mental model should be and where the
   current build diverges.
4. A "quick wins" list: ≤8 changes that are low effort, low risk, high impact,
   each with the exact file to touch.
5. Explicit non-goals / things you deliberately did not recommend and why.

Be specific and senior. No generic UX platitudes. Every recommendation must be
actionable by a CLI coding agent working in this repo.

## END PROMPT

---

## How the founder should use this

1. Open Claude Design (the tool with GitHub access to `skillset-foundation`).
2. Paste the prompt between BEGIN/END.
3. Point it at branch `main`.
4. Bring the findings table back here; we triage P0/P1 first, on a feature
   branch, with lint + tests + build gating every change before deploy.
