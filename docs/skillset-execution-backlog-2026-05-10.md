# Skillset Execution Backlog

Last updated: 2026-05-10

This backlog extends the Claude Code review and the founder's additional
requirements. It is intentionally execution-oriented: each item should become a
small Codex task before implementation.

## Already Started Or Completed

- `DEPLOY-1`: Firebase Hosting Web Frameworks is enabled and deployed.
- `ROLES-1`: self-service teacher role now requires verified email and Teacher
  Terms acceptance; admin/support/moderator remain protected.
- `LEGAL-1`: signup now requires Terms and Privacy acceptance, stores legal
  versions, keeps marketing consent optional, and shows re-acceptance when the
  active legal versions change.
- `PAY-1`: checkout now follows Separate Charges and Transfers direction:
  Skillset charges on the platform account and records teacher release data in
  `payoutLedger`.
- `PAY-2`: student refund request Function and learner dashboard button exist
  for eligible paid enrollments inside the seven-day window.
- `PAY-3`: scheduled D+30 payout release Function and creator wallet ledger
  view exist.
- `PUB-1`: public pages exist for `/pricing`, `/fees-and-payouts`,
  `/how-it-works`, `/for-creators`, `/trust`, and `/help`.
- `CURRENCY-1`: currency types are no longer limited to `USD | BRL | GYD`; a
  supported Stripe currency list is centralized.
- `UX-3`: authenticated header switch started with avatar/account menu.
- `CERT-1` and `CERT-2`: public HTTP certificate verification endpoint and
  `/verify` UI are deployed.
- `DRIP-1`: course and lesson drip content policy exists in domain, builder,
  Firestore validation, and learner UI.
- `SEC-1`: protected video playback now has a dynamic learner watermark overlay
  with viewer identity and timestamp.
- `SEC-2`: idempotency keys and rate limiting exist for payment-sensitive
  Functions.
- `SEC-3`: HTTP security headers are configured. App Check still requires
  Firebase Console setup before enforcement.

## P0: Remaining Before Serious Public Launch

- Verify `LEGAL-1`, `PAY-1`, `PAY-2`, `PAY-3`, `PUB-1`, `CERT-1`, `CERT-2`,
  `DRIP-1`, and `SEC-2` end-to-end with real Firebase/Stripe test data.
- `MARKETPLACE-1`: remove public marketplace dependence on mock courses.
- `MARKETPLACE-2`: prevent public cards from showing "Pricing pending" or
  incomplete preview states.
- `DETAIL-1`: real published course detail pages using SSR/ISR.
- `SEC-3`: complete Firebase App Check setup and enforce it after console
  configuration; headers are already configured.
- `EMAIL-1`: transactional email provider and templates.
- `TEST-1`: Firestore rules test harness.

## P1: Teacher-Student Loop

- `CAL-1`: course calendar with RSVP and "Join now" external link.
- `COM-1`: course community likes and one-level replies.
- `LEARN-1`: student dashboard redesign with Continue Learning, Your Courses,
  This Week, and Discover More.
- `TEACH-1`: creator dashboard with KPIs, alerts, shortcuts, and course list.
- `NOTIF-1`: notification bell for course/community/calendar events.
- `PAY-4`: payout advance with extra fee.
- `COM-2`: course member directory with role filters.
- `SEC-4`: audit log for sensitive actions.
- Custom claims for roles.
- Short-lived signed URLs for protected media.

## P2: Growth And Polish

- `AFF-1`: reserve affiliate attribution on enrollments and payout ledger.
- `LEGAL-2`: GDPR/LGPD data export and account deletion.
- `PAY-5`: Stripe Tax activation path.
- `LIVE-1`: integrated live/video provider after external links prove demand.
- `SEARCH-1`: server-side search for marketplace and community.
- `INTEG-1`: outbound webhooks per teacher for n8n, Zapier, Make, Botpress.
- `ZOOM-1`: Zoom OAuth and meeting creation for live classes.
- WhatsApp Business Cloud API.
- Drag-and-drop course builder.

## P3: Differentiation

- `BUILDER-1`: teacher sales page builder.
- `AI-1`: lesson summaries, auto-quiz generation, study copilot.
- `MOBILE-1`: dedicated Expo app.
- `COHORT-1`: cohort-based courses with drip scheduling.
- Public API with OAuth2.
- Mux/Bunny video pipeline and DRM if volume justifies it.

## Payment Policy Direction

Skillset should migrate from direct destination charges to Separate Charges and
Transfers:

- Student pays Skillset platform account.
- Enrollment becomes active after confirmed payment.
- `payoutLedger` entry is created with `status: "in_release"`.
- Default release is D+30.
- Seven-day refund window runs before release.
- Scheduled Function releases net funds to the teacher.
- Payout advance can release early with an extra fee.
- Admin-only forced refunds after payout require transfer reversal.

Stripe Radar, 3D Secure, idempotency keys, rate limits, App Check, security
headers, audit logs, and transactional security emails are mandatory hardening
items before serious public traffic.

## Legal And Account Direction

- Signup requires two mandatory legal checkboxes: Terms of Service and Privacy
  Policy. They are never pre-checked.
- Marketing consent is optional and separate from required legal consent.
- Legal acceptance is versioned through `termsVersion` and `privacyVersion`.
- When versions change, the next authenticated session must show a re-acceptance
  interstitial before the user continues into the product.
- Teacher access remains self-service for now, but teacher creation requires
  verified email plus accepted Teacher Terms before course creation.

## Header And Context Switch Direction

- Anonymous users see direct `Sign in` and `Get started` actions.
- Authenticated users see avatar, display name, and current context.
- Account menu must expose `My Learning`, `My Studio` for teachers, `Become a
  creator` for non-teachers, `Settings`, and `Sign out`.
- The old anonymous Learner/Educator dropdown should not appear for logged-in
  users.

## Public Trust Pages Direction

The footer and public IA must support:

- `/pricing`: explains creator-set prices and Skillset fee.
- `/fees-and-payouts`: 15% default Skillset fee, D+30 payout, seven-day refund,
  optional payout advance, and Stripe Adaptive Pricing.
- `/for-creators`: creator landing page for course builder, community,
  certificates, checkout, and payouts.
- `/how-it-works`: learner journey in four steps.
- `/trust`: course review, moderation, privacy, payments, and credential trust.
- `/help`: static help center first, searchable support later.

## Drip Content Direction

Courses support:

- `instant`
- `sequential_progress`
- `time_drip_lesson`
- `time_drip_module`
- `time_drip_custom`

The core implementation is a pure `isLessonUnlocked(enrollment, lesson, course,
now)` function reused by UI and backend signed-media access.

## Community And Calendar Direction

- Community remains course-scoped in MVP; no global social feed yet.
- P1 community adds post likes, comment likes, one-level replies, author role
  badges, and feed sorting by `New` and `Top`.
- Course calendar adds live classes, mentorship, office hours, webinars, and
  deadlines.
- Live classes use external URLs first, with `Join now` shown around the event
  window and recordings attached later through `recordingAssetId`.
- Notifications should cover replies, new posts in enrolled courses, live class
  reminders, refunds, and course review outcomes.

## Security And Integration Direction

- Keep Firestore now; do not migrate to Postgres until real reporting, search,
  cost, or relational constraints justify it.
- Add signed media URLs with short TTL before serious paid video traffic.
- Add dynamic watermark in the player to discourage casual content leakage.
- Add audit logs for refunds, payout advance, role changes, course deletion,
  and moderation actions.
- Add Resend or Postmark for transactional email before full public launch.
- Add Sentry and product analytics after core loop stabilization.
- WhatsApp, Zoom, Google Meet, outbound webhooks, Algolia, Mux/Bunny, and public
  API remain P2/P3 integrations, not MVP blockers.
