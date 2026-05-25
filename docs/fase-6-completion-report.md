# Fase 6 completion report

Date: 2026-05-11
Branch: `fase-6-organize`

## Summary

Fase 6 moved Skillset from a working prototype surface toward an organized creator/learner platform surface. The main changes are the refined marketing home, step-by-step onboarding, collapsible platform navigation, avatar refresh fix, role-aware account menu, teacher studio depth, operational exports, and workspace polish.

## Tickets completed

- `P6-HM-1`: Home purge, refined honest copy, PromisePreviewBand, and vertical rhythm updates.
- `P6-OB-1`: Typeform-style onboarding wizard with incremental profile answer saving.
- `P6-SB-1`: Collapsible sidebar, hover expansion, mobile bottom nav, and mobile drawer.
- `P6-AV-1`: Avatar upload now refreshes auth/session profile state.
- `P6-AM-1`: Shared AccountMenu with teacher/learner switch view.
- `P6-AN-1`: Reveal-on-view for marketing sections.
- `P6-CL-1`: Removed confirmed unused marketing components.
- `P6-ADD-01`: Authenticated setup status banner.
- `P6-ADD-02`: Horizontal tabs in Teacher Studio, billing, and ops.
- `P6-ADD-03`: Dashboard filters in Teacher Studio and ops.
- `P6-ADD-04`: Notification bell dropdown and empty state.
- `P6-ADD-05`: Workspace-only theme toggle.
- `P6-ADD-06`: Create course modal.
- `P6-ADD-07`: Table empty row component.
- `P6-ADD-08`: Status filter dropdown for teacher courses.
- `P6-ADD-09`: Revenue milestone strip.
- `P6-ADD-10`: Password strength checklist.
- `P6-ADD-11`: Phone input.
- `P6-ADD-12`: Members-area preview route.
- `P6-ADD-13`: Builder preview button.
- `P6-ADD-14`: Co-productions placeholder.
- `P6-ADD-15`: Inline contextual help.
- `P6-ADD-16`: Client-side CSV/JSON export controls.
- `P6-ADD-17`: Listing search bars.
- `P6-ADD-18`: Payment model selector in Course Builder.
- `P6-ADD-19`: Canonical status chips.
- `P6-ADD-20`: Plan selector cards.
- `P6-ADD-22`: Teacher sale detail page.
- `P6-ADD-23`: Refunds surface.
- `P6-ADD-24`: Coupons surface placeholder.
- `P6-ADD-25`: Team surface placeholder.
- `P6-ADD-26`: Integrations surface.
- `P6-ADD-27`: Floating help bubble.
- `P6-ADD-28`: Mobile sidebar drawer.

## Assumptions

- Client-side CSV/JSON export is used for currently loaded rows. Large dataset exports via Cloud Function and signed URL remain a scaling upgrade.
- Placeholder surfaces are explicit and honest where backend workflows are not ready.
- Dark mode is intentionally scoped to authenticated PlatformShell so public marketing pages remain visually consistent.
- Sale detail uses the fields currently present in `Order`; it does not invent customer email/name when those fields are unavailable.

## Verification

- `npm run lint`: passed.
- `npm test`: passed, 11 test files and 33 tests.
- `npm run build`: passed, 71 app routes generated.
- `npm --prefix functions run build`: passed.

## 2026-05-22 addendum

Follow-up founder QA found four practical MVP gaps: collapsed sidebar active icons, duplicate course CTAs, confusing Settings/Billing/Payouts hierarchy, and course flows that looked functional but still had missing enrollment guardrails.

Changes applied:

- Sidebar active icon now remains visible in collapsed mode.
- Teacher header now exposes one `New course` CTA only, opening the real create-course modal.
- Account pages now separate Settings from Billing and creator Payouts.
- Stripe setup banner now depends on both charges and payouts readiness and the Payouts panel can refresh Stripe status manually.
- Free creator courses can now enroll authenticated learners via a callable Function.
- Paid/free enrollment model is required before Course Builder submit and admin publish.
- Legacy `/learn/courses/<creatorCourseId>` links redirect into the creator-course workspace.
- `npm run build` now passes after fixing Turbopack root detection for the Windows workspace.

Verification on 2026-05-22:

- `npm run lint`: passed.
- `npx tsc --noEmit --pretty false --types vitest/globals`: passed.
- `npm --prefix functions run build`: passed.
- `npm run build`: passed, 72 app routes generated.

Deploy on 2026-05-22:

- `firebase deploy --only firestore:rules --project skillsetusaofficial --non-interactive`: passed.
- `firebase deploy --only functions --project skillsetusaofficial --non-interactive`: passed; `createFreeCourseEnrollment` was created.
- `firebase deploy --only hosting --project skillsetusaofficial --non-interactive`: passed; live Hosting URL is `https://skillsetusaofficial.web.app`.
- Stripe live webhook endpoint was verified as enabled and pointing to `https://stripewebhook-7foyhb2owa-uc.a.run.app`.
- Stripe live webhook events were restricted to `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`, `charge.refunded`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.payment_failed`.
- Firebase `STRIPE_WEBHOOK_SECRET` was updated from the founder-provided credentials file and `stripeWebhook` was redeployed.
- Post-deploy HTTP smoke: `/`, `/teach`, `/account/billing`, `/courses`, and `/welcome` returned `200`.
- Backend smoke: unauthenticated `createFreeCourseEnrollment` returned `401 UNAUTHENTICATED`; unsigned `stripeWebhook` returned `400 Missing Stripe signature`.

## Not verified in this pass

- Lighthouse scores were not captured.
- Browser screenshots were not captured.
- Real Firebase avatar upload, onboarding persistence, Stripe Connect, and Firestore live data flows were not manually exercised.
- A real paid Stripe checkout was not run to avoid creating live financial objects without explicit authorization.
- Console-clean smoke testing in DevTools was not performed.

## Remaining release blockers

- Run browser QA from `docs/qa-fase6-checklist.md`.
- Capture Lighthouse mobile scores for public pages.
- Test Firebase/Stripe flows against staging credentials.
- Review dark-mode contrast manually in real browser surfaces.
