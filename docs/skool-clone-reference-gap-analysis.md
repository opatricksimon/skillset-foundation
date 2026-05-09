# Skool Clone Reference Gap Analysis

Last updated: 2026-04-26

Source reviewed: `C:\Users\nicae\skool-clone-digidash23`

## Purpose

This document captures what Skillset should learn from the local Digidash Skool clone reference without becoming a Skool clone. The goal is to identify missing product details, UX patterns, and frontend structures that can make Skillset feel more complete, professional, and conversion-ready.

No Docker is required for this analysis. This is a code and product inspection only.

## License And Reuse Position

The clone README claims MIT licensing, but a root `LICENSE` file was not visible in the local project listing during inspection. Treat the project as a reference first. Direct code reuse should only happen after license verification. Even if reuse is allowed, Skillset should reimplement patterns inside its own Firebase-first architecture, design language, and domain model.

LearnHouse remains AGPL-3.0 and must be treated as product and architecture inspiration only unless explicit legal approval accepts AGPL obligations.

## What The Clone Does Well

The clone is useful because it adds many product details that a real creator/community platform needs:

| Area | Useful pattern | Skillset status | Priority |
|---|---|---|---|
| Signup | Full name, username, terms acceptance, marketing consent, social auth | Full name, terms, marketing, Google exist; username missing | Now |
| Onboarding | Multi-step profile setup with progress and goals | Skillset has role selection, but not profile/goals/timezone | Now |
| Dashboard shell | Sidebar, header search, create dropdown, notifications, user menu | Skillset has route shells, but less mature dashboard ergonomics | Now |
| Course builder | Tabs for Details, Content, Pricing, Settings | Skillset builder works but is too linear | Now |
| Lesson editor | Lesson types, rich content, attachments, free preview settings | Skillset has lesson outlines/assets, not rich editor flow | Next |
| Upload UX | Dropzone, progress, validation, file status | Skillset has uploads, but can improve feedback and media library | Next |
| Media gallery | Search/filter uploaded assets, copy URL, preview/delete | Skillset does not have a proper teacher media library yet | Next |
| Community listing | Filters, tabs, grid/list view, joined/my communities | Skillset has course communities, but not a polished discovery/list view | Next |
| Community detail | Header/banner, posts/courses/events/about tabs, member sidebar | Skillset has v0 community feed, needs richer structure | Next |
| Events | Event cards, RSVP thinking, community adjacency | Skillset has Firebase-backed events and RSVP records | Refine |
| Notifications | Model and UI entry points for user updates | Skillset does not have notifications yet | Later |
| Gamification | Points, levels, badges, leaderboard | Not core to Skillset MVP | Later |
| Privacy ops | Data export request model | Not implemented | Later |

## What Skillset Should Adopt

### 1. Username During Signup

Skillset should add a username field to account creation and onboarding. It helps public profiles, teacher pages, community identity, and future member URLs.

Implementation direction:

- Add `username?: string` to `UserProfile`.
- Normalize usernames to lowercase URL-safe handles.
- Require uniqueness before this becomes public-facing.
- In the first safe implementation, store username as optional and validate basic format client-side.
- Add a later server-side uniqueness enforcement path through Cloud Functions before using usernames as public route IDs.

Avoid:

- Trusting client-only uniqueness checks.
- Letting username become the primary auth identifier.
- Blocking early users if username uniqueness infrastructure is not ready.

### 2. Stronger Onboarding

The clone has a more complete onboarding flow. Skillset should transform this into a professional onboarding sequence:

1. Choose path: learner, educator, or both.
2. Complete profile: display name, username, bio, timezone.
3. Select goals: career growth, certification, teaching, community, mentorship.
4. Finish with next action: explore courses, create first draft, or complete teacher profile.

This should not feel playful. Use Skillset's premium white/blue/red system, serious microcopy, and compact progress indicators.

### 3. Dashboard Shell Ergonomics

Skillset should adopt the structural idea of a real app shell:

- Left sidebar for authenticated areas.
- Top header with search, create action, notifications placeholder, user menu.
- Surface-specific navigation for `/learn`, `/teach`, and `/ops`.
- Clear primary action per surface.

The shell must remain restrained. Avoid emoji icons, noisy badges, and gamer-style levels as the main identity.

### 4. Course Builder Tabs

The current Skillset course builder works, but it should become easier to understand. Adopt a tabbed builder:

- `Details`: title, slug, category, summary, outcomes, requirements, cover.
- `Content`: modules, lessons, lesson type, duration, free preview, attachments.
- `Pricing`: free/paid, price, currency, platform fee, checkout readiness.
- `Community`: course community visibility, discussion categories, event links.
- `Review`: readiness checklist, submit for review, status history.

This matches creator commerce tools like Hotmart/Kiwify while keeping the LearnHouse-style course structure.

### 5. Rich Lesson Editing

The clone's lesson editor points to missing affordances in Skillset. Skillset should add:

- Rich text body for text lessons.
- Lesson duration field.
- `isFreePreview` per lesson.
- Lesson asset list grouped by video, document, download, thumbnail.
- Lesson status: draft, ready, published inside approved course.
- Optional external embed URL for Zoom replay, YouTube unlisted, Vimeo, or other providers.

Do not add TipTap immediately unless the current Sprint is specifically a rich-editor sprint. A structured textarea plus content-block model can come first.

### 6. Upload Feedback And Media Library

Skillset already has Firebase Storage integration. The next improvement is feedback:

- Show accepted file types.
- Show max file size.
- Show upload progress.
- Show upload status: queued, uploading, complete, failed.
- Create `/teach/media` as a teacher media library.
- Let teachers attach existing media to lessons.

Security remains unchanged: private course assets should not get public download URLs by default.

### 7. Community UI Refinement

Skillset should keep communities course-adjacent, but adopt the clone's clarity:

- Community list with search and filters.
- Tabs: all, joined, teaching, archived.
- Community detail tabs: posts, lessons/course, events, members, about.
- Post categories: announcement, discussion, question, resource.
- Member sidebar showing teacher/moderator/student roles.
- Report action visible but not dominant.

Avoid:

- Making community the main product.
- Copying Skool layout or brand feel.
- Leaderboards as a first-order feature.

## What Skillset Should Not Adopt Now

Do not bring these into the current build:

- Docker-based workflow.
- PostgreSQL/Prisma pivot just because the clone uses Prisma.
- Redux Toolkit unless state complexity justifies it.
- GitHub OAuth before Google/email auth is stable.
- Trial claims or SaaS subscription copy.
- Gamer-style points/levels as a core dashboard mechanic.
- Emoji icons as the main visual language.
- Purple gradient identity.
- Pixel-perfect Skool page structure.
- Full custom checkout before Stripe Checkout and webhooks are live.
- Direct code copying before license verification.

## Combined LearnHouse + Clone Design Direction

LearnHouse is useful for product maturity: blocks, permissions, groups, certificates, discussions, organization settings, and learning architecture.

The Digidash clone is useful for app ergonomics: signup detail, onboarding, dashboard shell, course builder tabs, media handling, and community navigation.

Skillset should synthesize both this way:

- Product depth from LearnHouse.
- Creator workflow clarity from Hotmart/Kiwify.
- Community adjacency from Skool-like patterns.
- Dashboard ergonomics from the Digidash clone.
- Visual identity from Skillset only.

The final UI should be white-first, institutional blue-dominant, red as accent, compact headers, moderate radii, strong button contrast, restrained cards, and no internal strategy language in public copy.

## Implementation Batches

### Batch A: Account Identity And Onboarding

Goal: make account creation feel complete and professional.

Tasks:

- Add username to user profile domain type.
- Add username input to signup or onboarding.
- Add username format validation.
- Add bio/timezone/goals fields to onboarding.
- Convert onboarding from single-choice screen into a multi-step flow.

Acceptance:

- New users accept terms, can choose learner/teacher/both, and finish profile setup.
- Existing users are not broken if username is missing.
- Firestore rules accept the new safe profile fields.

### Batch B: Authenticated App Shell

Goal: make `/learn`, `/teach`, and `/ops` feel like a real platform, not disconnected pages.

Tasks:

- Add shared authenticated shell primitives.
- Add surface-aware sidebar and header.
- Add search placeholder and create dropdown where appropriate.
- Add notifications placeholder without claiming real notification delivery yet.

Acceptance:

- Learner, teacher, and ops areas have coherent navigation.
- No route protection relies on client UI alone.

### Batch C: Course Builder Reformulation

Goal: upgrade the teacher workflow without changing the core Firestore model unnecessarily.

Tasks:

- Refactor builder into tabs.
- Add richer lesson fields.
- Add readiness checklist per tab.
- Add preview/sidebar summary.
- Keep submit-for-review controlled by readiness and ownership.

Acceptance:

- A teacher can understand what is missing before submitting.
- Pricing, content, and review status are visible without scrolling through one long form.

### Batch D: Media Management

Goal: make uploads feel trustworthy and reusable.

Tasks:

- Improve upload status UI.
- Add media library page under `/teach/media`.
- Add asset filtering by type/course/lesson.
- Let teachers attach existing assets to lessons.

Acceptance:

- Teachers can see what was uploaded and where it is used.
- Private assets stay protected.

### Batch E: Community Refinement

Goal: make community useful without overshadowing courses.

Tasks:

- Add community list filters.
- Add community detail tabs.
- Add member role display.
- Add events and course context panels.

Acceptance:

- Students can understand the relationship between course, community, events, and members.
- Community remains tied to enrollment and course context.

### Batch F: Later Maturity Layer

Goal: add sophistication after the core loop is stable.

Candidates:

- Notifications.
- Data export request.
- Badges and achievements.
- Leaderboard.
- Teacher success center.
- Certificate template customization.
- Cohorts/groups.

These should not block Stripe checkout, course publishing, or learner access.

## Next Recommended Local Execution

Start with Batch A. It is low-risk, aligned with the user's latest request, and improves real product readiness before deeper UI refactors.

Recommended first task:

Add username, bio, timezone, and learning/teaching goals to the user profile/onboarding flow, with safe optional fields and Firestore rule updates.

Files likely affected:

- `src/domain/user-profile.ts`
- `src/lib/data/user-profiles.ts`
- `src/components/auth/signup-form.tsx`
- `src/app/onboarding/page.tsx`
- `firestore.rules`

Verification:

- `npm run lint`
- `npm run build`
- `firebase deploy --only firestore:rules`

