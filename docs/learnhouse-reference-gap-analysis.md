# LearnHouse Reference Gap Analysis

Last updated: 2026-04-26

## Purpose

This document compares the local LearnHouse reference at `C:\Users\nicae\learnhouse` against the current Skillset implementation. The goal is to identify useful product and architecture patterns that Skillset can adopt without cloning LearnHouse or copying AGPL-licensed source code.

LearnHouse is licensed under AGPL-3.0. Treat it as product, UX, data-model, and architecture inspiration only unless the founder explicitly accepts AGPL implications or gets separate legal approval.

## Current Skillset Baseline

Skillset currently has:

- Firebase Auth with email/password and Google sign-in.
- Firestore user profiles and roles.
- Teacher course draft creation.
- Course Builder v0 for course basics, modules, lessons, pricing, and free preview selection.
- Submit-for-review workflow.
- Firestore rules that restrict public course publication to admin-level control.
- Firebase Storage rules for course assets.
- Protected lesson asset preview without leaking private download URLs.
- Student learning shell, events, community, support, and credentials routes.
- Stripe Checkout/Functions source code prepared, but Functions deploy is blocked until Firebase Secret Manager/Blaze setup is completed.

## What LearnHouse Has That Skillset Does Not Yet Have

| Area | LearnHouse Pattern | Skillset Gap | Priority |
|---|---|---|---|
| Block-based content editor | Notion-like editor with blocks for video, document, embed, markdown, image, audio, quiz/custom content | Skillset lessons are still simple outlines plus assets | High |
| Activity model | Course -> chapter -> activity -> blocks with activity type/subtype | Skillset has modules/lessons but no granular activity/block layer | High |
| Lesson access locks | Public/authenticated/restricted lock type at chapter and activity levels | Skillset has course enrollment protection, but not per-module/per-lesson access rules | High |
| User groups | Groups linked to resources for access control | Skillset has roles but no cohort/group/tier access model yet | High |
| Collections/bundles | Collections connect multiple courses | Skillset has individual courses only | Medium |
| Organization model | Org profile, slug, branding, config, features, custom domains | Skillset is single-platform with no academy/provider organization layer yet | Medium |
| Config/feature gates | Org-level feature config and admin toggles | Skillset has feature flags, but not per-teacher/per-org feature limits | Medium |
| Community maturity | Discussions, labels, votes, pinned/locked posts, comments, moderation settings | Skillset community v0 is simpler: posts/comments/categories | Medium |
| Assignments | Tasks, grading types, submissions, status, feedback | Skillset has assignment lesson type but no submission/grading workflow | Later |
| Certificates | Certification config and user certificate records | Skillset has certificate placeholder/domain, but no configurable templates/issue flow | Medium |
| Analytics | Engagement, retention, completion velocity, drop-off, course funnel, top learners | Skillset has no real analytics layer yet | Later |
| Course SEO | Course-level SEO metadata and OG fields | Skillset has public pages but no teacher-configurable SEO metadata | Medium |
| Payments dashboard | Payment configuration, offers, customers, groups | Skillset has Stripe Checkout source but no teacher wallet/offers dashboard yet | High after Stripe deploy |
| Safe reusable UI | SafeImage, user avatar, profile popup, tooltips, content placeholders | Skillset has shared components but fewer defensive UI primitives | Medium |
| Onboarding | Welcome/onboarding components for org dashboard | Skillset onboarding exists but can be more guided | Medium |
| CLI/doctor/backup | Setup, start/stop, logs, backup, doctor commands | Not relevant for Firebase-first MVP | Not now |
| Real-time collaboration | Hocuspocus/Yjs server for collaborative editing and boards | Too heavy for current bootstrap build | Not now |
| AI/copilot/playgrounds/code execution | Course planning, magic blocks, RAG, code execution | Too heavy and not core for first marketplace loop | Not now |
| Podcasts/boards | Additional content products | Not aligned with course-first MVP | Not now |

## Recommended Adoption For Skillset

### 1. Upgrade Course Builder From Outline Editor To Structured Activity Builder

Skillset should keep the current course model but extend lesson editing toward a block/activity pattern:

- Course contains modules.
- Module contains lessons.
- Lesson has a type and publication status.
- Lesson content can contain ordered blocks.
- Blocks can be video, text, download, embed, quiz, assignment placeholder, or resource.

This gives teachers the feeling of a real professional course editor instead of a simple form.

Implementation path:

- Add `LessonBlock` domain type.
- Add `contentBlocks` to `TeacherLesson`.
- Build a lesson editor panel in `/teach/builder`.
- Start with text, video reference, file/resource, embed, and quiz placeholder blocks.
- Do not add collaborative editing or AI blocks yet.

### 2. Add Per-Lesson Access Controls

LearnHouse's `public`, `authenticated`, and `restricted` lock pattern maps well to Skillset:

- `public_preview`: visible to guests as free preview.
- `enrolled_only`: visible only after enrollment.
- `scheduled_release`: visible after date/time.
- `group_only`: visible to a cohort/tier/group later.

Skillset already has `freePreviewLessonId`, but this should become more flexible.

Implementation path:

- Add `accessRule` to lessons.
- Preserve current free preview behavior as a first UI shortcut.
- Later add drip release and cohort/group access.

### 3. Add User Groups / Cohorts / Offer Tiers

This is important for Hotmart/Kiwify-style members area behavior.

Skillset should implement a simplified version:

- `StudentGroup`
- `StudentGroupMember`
- `CourseAccessRule`
- `OfferAccess`

Use cases:

- Teacher sells Basic, Pro, Mentorship tiers.
- Teacher releases different modules to different groups.
- Cohorts get live-session access.
- Admin/support can see why a student has access.

Implementation path:

- Start with Firestore collections for groups and memberships.
- Link groups to offers/enrollments later.
- Do not expose complex permission builders in MVP.

### 4. Add Collections / Bundles

LearnHouse collections are a direct reference for Skillset programs and bundles:

- Public collection: "Business Essentials"
- Private collection: internal curriculum or cohort pack
- Paid bundle: multiple courses under one offer

Implementation path:

- Add `CourseCollection` domain type.
- Add marketplace collection pages later.
- Add teacher bundle creation after checkout/enrollment loop works.

### 5. Strengthen Community v0

LearnHouse community has labels, upvotes, pinned/locked discussions, comments, and moderation controls. Skillset should adopt the pattern, not the UI.

Add:

- `pinned`
- `locked`
- `reactionCount`
- `commentCount`
- category labels refined as `announcement`, `question`, `discussion`, `resource`, `showcase`
- teacher/admin moderation actions

This makes the community feel intentional without turning Skillset into a Skool clone.

### 6. Improve Certificate Model

LearnHouse separates certification configuration from issued user certificate records. Skillset should do the same:

- `CertificateTemplate`
- `IssuedCertificate`
- `CertificateVerification`

Teacher can configure completion criteria, but Skillset/system controls issuance and revocation.

### 7. Add Teacher Analytics Later, But Design For It Now

LearnHouse has much more analytics than Skillset needs immediately. Skillset should not build Tinybird-level analytics now, but should start collecting events:

- course viewed
- checkout started
- enrolled
- lesson started
- lesson completed
- course completed
- certificate issued
- community post created
- live session RSVP

This gives future analytics a clean base.

### 8. Add Org/Academy Layer Later

Skillset should not become multi-tenant too early, but the model should prepare for it:

- `organizationId` on courses, users, events, groups, assets, orders, certificates.
- Default organization: `skillset`.
- Teacher profiles can later become provider organizations/academies.

## What Not To Add Now

Do not add these from LearnHouse into the current Skillset build:

- Collaborative Yjs/Hocuspocus editor.
- Boards/whiteboards.
- Podcasts.
- Code execution playgrounds.
- RAG/copilot/magic AI everywhere.
- Full organization billing plans.
- Custom domains for every teacher.
- CLI setup/backup/doctor.
- SCORM support.
- Tinybird analytics stack.

These are useful later, but they would distract from the current critical path: teacher publishes course, Skillset reviews, student buys, student learns, teacher receives revenue.

## Immediate Implementation Queue

1. Finish Firebase/Stripe deployment blockers.
2. Add `LessonBlock` domain model and update Course Builder UI.
3. Add per-lesson access rule fields.
4. Add richer community post metadata: pinned, locked, counts, reactions.
5. Add certificate template versus issued certificate split.
6. Add event tracking model for future analytics.
7. Add collections/bundles after checkout and enrollment work end-to-end.
8. Add student groups/cohorts after basic enrollment is stable.

## Decision

Use LearnHouse as a maturity map, not as a code source. The highest-value ideas for Skillset right now are:

- block-based lesson builder,
- access rules,
- groups/cohorts,
- stronger community discussions,
- certificate templates,
- event analytics foundation,
- collections/bundles.

Everything else stays later.
