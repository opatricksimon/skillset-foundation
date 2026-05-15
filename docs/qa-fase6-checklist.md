# Fase 6 QA checklist

Date: 2026-05-11

## Automated verification

- [x] `npm run lint` passed.
- [x] `npm test` passed: 11 files, 33 tests.
- [x] `npm run build` passed: 71 app routes generated.
- [x] `npm --prefix functions run build` passed.

## Implemented surfaces

- [x] Home page has refined hero, HowItWorks, Capabilities, PromisePreviewBand, ForCreators, and SiteFooter.
- [x] Home copy avoids fake course, creator, or revenue proof.
- [x] Onboarding wizard replaces the minimal welcome choice and saves answers incrementally.
- [x] PlatformShell sidebar is collapsible with persistent state, hover expansion, mobile bottom nav, and mobile drawer.
- [x] Avatar upload refreshes authenticated session state after profile photo update.
- [x] AccountMenu has role-aware switch view for teacher/learner contexts.
- [x] Reveal-on-view is applied to marketing sections and respects reduced motion.
- [x] StatusBanner renders for incomplete authenticated account setup.
- [x] NotificationBell renders badge, dropdown, empty state, and mark-read actions.
- [x] HelpBubble renders on authenticated platform surfaces.
- [x] Horizontal tabs exist for Teacher Studio, billing, and ops.
- [x] Dashboard filters exist for Teacher Studio and ops.
- [x] CreateCourseModal opens, validates title, and creates a draft route into Course Builder.
- [x] StatusChip taxonomy is centralized and reused across listing surfaces.
- [x] ListingSearchBar exists in teacher, learner, and ops surfaces.
- [x] TableEmptyRow component exists for tabular empty states.
- [x] PasswordStrengthChecklist is integrated into signup and account security.
- [x] PhoneInput is integrated into profile settings.
- [x] Course Builder has payment model selector, free course support, and installment controls.
- [x] Members-area preview route exists at `/teach/builder/[courseId]/preview`.
- [x] Builder Preview button opens the preview route.
- [x] Placeholder surfaces exist for co-productions, coupons, team, refunds, and integrations.
- [x] InlineHelp appears in Course Builder, payouts, and integrations.
- [x] ExportTableButton appears in payments, support tickets, and course review queues.
- [x] Sale detail route exists at `/teach/sales/[orderId]`.
- [x] Workspace light/dark toggle exists and is scoped to authenticated PlatformShell.

## Manual/browser verification still required

- [ ] Visual smoke on desktop 1280px for `/`, `/auth`, `/welcome`, `/learn`, `/teach`, `/ops`, `/account/profile`.
- [ ] Visual smoke on mobile 375px for `/`, `/auth`, `/welcome`, `/learn`, `/teach`.
- [ ] Avatar upload end-to-end against real Firebase Storage.
- [ ] Signup wizard end-to-end against a real Firebase user.
- [ ] Stripe Connect onboarding return flow against staging credentials.
- [ ] Notification read/mark-all behavior against live Firestore data.
- [ ] Course creation, save, submit, review, and preview against live Firestore data.
- [ ] Lighthouse mobile Performance, Accessibility, SEO, Best Practices on public pages.
- [ ] Browser console smoke for public and authenticated pages.
- [ ] Manual dark-mode visual review across workspace surfaces.

## Notes

Automated checks are green. Browser/Lighthouse checks were not executed in this terminal-only pass and must remain open until verified in a browser session.
