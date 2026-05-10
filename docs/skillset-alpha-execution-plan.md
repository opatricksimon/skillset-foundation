# Skillset Alpha Execution Plan

Last updated: 2026-05-10

This document is the working source of truth for the next Skillset alpha phase. It consolidates the current strategy, operating model, and ordered execution queue.

## Strategic Pre-Brief

Skillset is not trying to be another generic Hotmart, Skool, Kajabi, Teachable, Udemy, Whop, Mighty, Circle, Domestika, or Thinkific alternative. The competitive position is contractual integrity for creators: transparent fees, exportability, course-linked communities, verifiable certificates, payout clarity, and human support for financial issues.

North Star Metric: monthly GMV per active creator.

90-day allocation:
- 45% teacher-student loop.
- 25% public trust: Creator Promise, institutional pages, emails.
- 15% premium UX polish.
- 10% compliance and security.
- 5% plumbing.

Explicit cuts for the first 90 days:
- No AI features.
- No mobile app.
- No sales page builder.
- No affiliates.
- No white-label.
- No custom live transcoding.

Positioning line:

> Skillset is the first international marketplace where independent experts launch professional courses with built-in protection: drip-released content, deferred payouts, course-linked communities, verifiable certificates, and a Creator Promise written into contract.

## Product Surfaces

Skillset has four connected surfaces:
- Public Marketplace.
- Student Portal.
- Creator Studio.
- Trust Operations.

Critical seams:
- Course -> Marketplace: publication must expose the course publicly and safely.
- Purchase -> Enrollment -> Drip -> Player: each step gates the next.
- Refund x Drip: drip protects creators from refund abuse while refund protects students from bad courses.
- Payment -> Ledger -> Payout -> Email: every financial transition needs audit and notification.

## Agent Operating Model

Current local execution is controlled by Codex as coordinator. Subagents are only used when work can be cleanly split without conflict.

Agent ownership model:
- Frontend Agent: `src/app/**`, `src/components/**`, copy, layout, Tailwind, public UX.
- Backend Agent: `functions/src/**`, `firestore.rules`, `storage.rules`, `src/domain/**`, Stripe, Firebase data contracts.
- DevOps Agent: `firebase.json`, workflows, deploy, secrets, environments.
- QA Agent: `tests/**`, `**/*.test.tsx`, smoke checklists, Lighthouse, regression tests.
- Coordinator Agent: source-of-truth decisions, sequencing, reviews, conflict resolution.

Rules:
- Domain type changes require coordinator approval because they affect frontend, backend, and tests.
- Firestore rule changes require matching tests where feasible.
- Financial Functions require idempotency, rate limit, and audit logging when the audit system is available.

## P0 Queue

### P0-1: Fix Login

Goal: unblock login failures caused by user profile updates being rejected when an existing admin/support/moderator profile updates non-role fields.

Files:
- `firestore.rules`
- `src/lib/data/user-profiles.ts`
- `tests/firestore-rules.ts`

Acceptance:
- Existing admin can login and route to `/ops`.
- New student can login and route to `/onboarding`.
- Client-side self-assignment of `admin`, `support`, or `moderator` remains rejected.

### P0-2: Skillset Creator Promise

Create `/promise` and `/promise/changelog` with six public commitments:
- 24-month fee lock.
- Feature parity for everyone.
- One-click data portability.
- One-click cancellation.
- Funds protection by contract.
- Human support SLA.

Update public navigation to include Promise.

### P0-3: Hero Redesign

Replace image-dependent hero with a CSS-only premium hero grounded in the Creator Promise.

### P0-4: Home Redesign

Home becomes:
- Marketing hero.
- How it works.
- Capabilities.
- For creators band.
- Global footer.

No fake course or instructor showcase on the public home until real data exists.

### P0-5: Honest Empty States

`/courses` and `/instructors` must not show mock inventory. Empty states should convert creator traffic honestly.

### P0-6: Pricing

Create `/pricing` with 15% fee, 24-month lock, no feature paywalls, D+30 payouts, and comparison table without naming competitors.

### P0-7: Promise Stubs

Add account export and account deletion request stubs so Promise items are operational, even if manually processed at first.

### P0-8: QA, Seed Courses, Smoke Test

Founder/admin publishes 2-3 real seed courses, validates checkout, enrollment, refund, student portal, ops, verification, and Lighthouse baselines.

## P1 Queue

- Complete drip gates and signed lesson asset URLs.
- Scheduled D+30 payout release.
- Payout advance.
- Resend transactional emails.
- App Check and reCAPTCHA Enterprise.
- Sentry and PostHog.
- Custom claims for roles.
- GitHub Actions CI.
- Full technical implementation of the Creator Promise.
- Notification bell, improved learner dashboard, creator dashboard, course calendar, and course community likes.

## P0 Release Criteria

- Login works for admin, student, and teacher.
- `/promise` is indexable with six commitments.
- `/pricing` is indexable with the comparison table.
- Home does not depend on mock course/instructor data.
- `/courses` shows real published courses or an honest creator empty state.
- `/instructors` shows an honest empty state.
- Export/delete account request stubs are visible and create trackable requests.
- Signup requires Terms and Privacy acceptance.
- Teacher Terms are required when a user becomes a creator.
- Stripe checkout works.
- Refund D+0 works.
- Certificate verification works.
- Lighthouse mobile baselines pass on public pages.
- Legal pages are no longer placeholder copy.
- Footer is present on public pages.
- No console errors in smoke test.
- No mobile horizontal overflow on public pages.
