# Skillset Solo Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Version:** 0.1
> **Updated:** 2026-04-20

**Goal:** Replace the current static Firebase prototype with a solo-buildable product foundation that ships a premium public marketplace plus visual/functional shells for Student, Teacher, and Admin surfaces.

**Architecture:** Start with a single Next.js App Router codebase, not a full 4-app monorepo. Keep the 4 product surfaces logically separated by route groups, feature folders, layout shells, and role-aware navigation so the code can later split into subdomains without a rewrite.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, local mock data for now, Firebase project kept as deploy context, future-ready adapters for auth, payments, and storage.

---

## Scope Decision

### What
Build the first real application layer now, but cut the scope to a solo-feasible slice:

- Premium marketplace homepage and catalog shell
- Shared design system and layout primitives
- Student shell at `/learn`
- Teacher shell at `/teach`
- Admin shell at `/ops`
- Placeholder data layer and empty-state flows
- Route structure ready for later auth, checkout, uploads, and backend

### Why
The 4-app, multi-service architecture from the full plan is correct for scale, but wrong for a one-person build with no runway. Starting with one modular app gives speed without discarding the product model.

### How
Use one codebase with:

- `src/app/(marketing)` for public marketplace
- `src/app/(platform)` for internal authenticated surfaces
- `src/features/*` for domain separation
- `src/components/*` for shared UI
- `src/data/*` for typed seed/mock content

### Risks

- Later extraction to subdomains will require some routing work
- Mock data can leak into production if not clearly isolated
- Too much UI before backend can create false progress

### Acceptance Criteria

- All 4 surfaces exist with clear navigation boundaries
- The current brand direction is preserved and improved
- No hard dependency on live auth, payments, or database yet
- The codebase is ready for real backend integration next

---

## Task 1: Set Up the Application Foundation

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Modify: `firebase.json`
- Preserve: `public/index.html`
- Preserve: `public/css/style.css`

- [ ] **Step 1: Create the Next.js application foundation**

Use one app in the current project root. Do not delete the static prototype yet.

- [ ] **Step 2: Keep Firebase hosting context intact**

Preserve the existing Firebase config for now. Do not rewire deployment yet; only avoid breaking the current project folder.

- [ ] **Step 3: Add the root app layout**

Create a global layout with:

- metadata for `Skillset`
- shared font strategy
- body class strategy
- route-level theme support

- [ ] **Step 4: Add the global stylesheet**

Define:

- CSS reset
- brand tokens
- spacing scale
- type scale
- surface colors
- motion rules

- [ ] **Step 5: Verify the base app boots**

Run:

```bash
pnpm install
pnpm dev
```

Expected:

- Next.js dev server starts
- Root route renders
- No TypeScript or ESLint boot failures

---

## Task 2: Build the Shared Design System Layer

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/shell.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/components/ui/empty-state.tsx`
- Create: `src/components/ui/stat-chip.tsx`
- Create: `src/lib/cn.ts`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add a `cn()` helper**

Use a minimal `clsx`/string merge helper so shared components stay clean.

- [ ] **Step 2: Create the reusable UI primitives**

Implement small composable primitives, not giant page-specific components.

- [ ] **Step 3: Encode the brand system**

Preserve the premium direction from the prototype:

- deep navy foundation
- warm red/gold accent discipline
- editorial headings
- calm spacing
- restrained shadows

- [ ] **Step 4: Verify primitives render in real pages**

Do not leave design tokens abstract. Use them immediately in the homepage and shells.

---

## Task 3: Create the Domain-Oriented Mock Data Layer

**Files:**
- Create: `src/data/site.ts`
- Create: `src/data/courses.ts`
- Create: `src/data/instructors.ts`
- Create: `src/data/community.ts`
- Create: `src/data/nav.ts`
- Create: `src/types/course.ts`
- Create: `src/types/user.ts`
- Create: `src/types/community.ts`

- [ ] **Step 1: Define the core TypeScript types**

Include only the fields needed for the first UI slice:

- `CourseSummary`
- `InstructorSummary`
- `CommunityPreview`
- `DashboardCard`

- [ ] **Step 2: Add clean mock data**

Seed empty-friendly but believable data for:

- featured courses
- categories
- trust logos
- teacher onboarding checklist
- student dashboard modules
- admin review queues

- [ ] **Step 3: Make emptiness intentional**

At least one section in each product surface should deliberately show an elegant empty state, because the user said the launch may happen before real courses exist.

---

## Task 4: Implement the Public Marketplace Surface

**Files:**
- Create: `src/app/(marketing)/layout.tsx`
- Create: `src/app/(marketing)/page.tsx`
- Create: `src/app/(marketing)/courses/page.tsx`
- Create: `src/components/marketing/marketing-nav.tsx`
- Create: `src/components/marketing/hero.tsx`
- Create: `src/components/marketing/trust-strip.tsx`
- Create: `src/components/marketing/course-grid.tsx`
- Create: `src/components/marketing/category-grid.tsx`
- Create: `src/components/marketing/instructor-strip.tsx`
- Create: `src/components/marketing/cta-band.tsx`

- [ ] **Step 1: Rebuild the homepage in React**

Do not port the HTML blindly. Recompose it into sections:

- hero
- trust
- featured learning paths
- instructor proof
- platform positioning
- final CTA

- [ ] **Step 2: Add a catalog page**

Create `/courses` with:

- search input UI
- category pills
- empty-state handling
- course cards ready for later filtering logic

- [ ] **Step 3: Replace weak copy**

Remove any hard claim that depends on an unsigned City & Guilds agreement. Use neutral copy such as:

- "career-aligned learning"
- "credential-ready pathways"
- "institutional-grade delivery"

- [ ] **Step 4: Verify the public surface**

Expected:

- `/` feels premium
- `/courses` exists and is navigable
- all buttons route somewhere meaningful

---

## Task 5: Implement the Student Surface

**Files:**
- Create: `src/app/(platform)/learn/page.tsx`
- Create: `src/app/(platform)/learn/layout.tsx`
- Create: `src/components/platform/platform-sidebar.tsx`
- Create: `src/components/student/student-dashboard.tsx`
- Create: `src/components/student/learning-rail.tsx`
- Create: `src/components/student/community-panel.tsx`
- Create: `src/components/student/credential-panel.tsx`

- [ ] **Step 1: Create the platform shell**

Build a shared shell with:

- sidebar
- top bar
- content container
- mobile-friendly stacked layout

- [ ] **Step 2: Build `/learn`**

Show:

- welcome panel
- current learning area
- progress placeholders
- community activity preview
- credentials preview

- [ ] **Step 3: Treat no-course state as first-class**

The main student empty state should explain the future flow:

1. discover a course
2. enroll
3. start learning
4. earn a credential

---

## Task 6: Implement the Teacher Surface

**Files:**
- Create: `src/app/(platform)/teach/page.tsx`
- Create: `src/components/teacher/teacher-home.tsx`
- Create: `src/components/teacher/publishing-checklist.tsx`
- Create: `src/components/teacher/course-drafts.tsx`
- Create: `src/components/teacher/revenue-panel.tsx`
- Create: `src/components/teacher/support-panel.tsx`

- [ ] **Step 1: Build `/teach` as a real operating system shell**

It must not look like a generic dashboard. It should feel like a calm professional workspace.

- [ ] **Step 2: Expose the teacher success angle**

Include sections for:

- publishing checklist
- draft courses
- revenue overview placeholder
- support/help handoff
- community management preview

- [ ] **Step 3: Verify the teacher surface communicates the product thesis**

The page should clearly say:

- Skillset is not only for selling
- it helps teachers publish, manage, and support learning businesses

---

## Task 7: Implement the Admin / Trust Surface

**Files:**
- Create: `src/app/(platform)/ops/page.tsx`
- Create: `src/components/admin/admin-home.tsx`
- Create: `src/components/admin/review-queue.tsx`
- Create: `src/components/admin/risk-panel.tsx`
- Create: `src/components/admin/support-inbox.tsx`
- Create: `src/components/admin/audit-summary.tsx`

- [ ] **Step 1: Build `/ops`**

Show:

- moderation queue
- creator approvals
- support inbox preview
- payout/risk snapshots
- audit and trust indicators

- [ ] **Step 2: Keep the UI high-trust**

Use quieter visuals, denser information, and clearer status chips than the public surface.

- [ ] **Step 3: Make role separation obvious**

From the user’s perspective, Admin must feel like a protected operational surface, not another marketing page.

---

## Task 8: Add Basic Verification and Handoff Notes

**Files:**
- Create: `README.md`
- Create: `src/app/not-found.tsx`
- Create: `src/app/(platform)/page.tsx`

- [ ] **Step 1: Add a useful README**

Document:

- what this new app is
- what remains from the legacy prototype
- how to run locally
- what to build next

- [ ] **Step 2: Add a platform index route**

Use `/platform` or a logical redirect/index page that lets a reviewer jump to:

- marketplace
- student
- teacher
- ops

- [ ] **Step 3: Verify the build**

Run:

```bash
pnpm lint
pnpm build
```

Expected:

- lint passes
- production build passes
- all main routes compile

---

## Recommended Execution Order

### What
Implement in this order:

1. foundation
2. tokens + primitives
3. data layer
4. marketplace
5. platform shell
6. student
7. teacher
8. admin
9. README + verification

### Why
This preserves momentum and ensures every later surface inherits the same visual and structural system.

### How
Do not start with auth, payments, or Firebase rewiring. First make the product shape real.

### Risks

- Jumping ahead to backend will stall the visible product
- Over-polishing the homepage before the internal shells exist will recreate the current problem

### Acceptance Criteria

- By the end of this plan, the project is no longer “a landing page with ambitions”
- It becomes “the first working product shell of Skillset”

