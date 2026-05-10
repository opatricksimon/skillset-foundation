# Skillset Execution Backlog

Last updated: 2026-05-10

This backlog extends the Claude Code review and the founder's additional
requirements. It is intentionally execution-oriented: each item should become a
small Codex task before implementation.

## Already Started Or Completed

- `DEPLOY-1`: Firebase Hosting Web Frameworks is enabled and deployed.
- `ROLES-1`: self-service teacher role now requires verified email and Teacher
  Terms acceptance; admin/support/moderator remain protected.
- `CURRENCY-1`: currency types are no longer limited to `USD | BRL | GYD`; a
  supported Stripe currency list is centralized.
- `UX-3`: authenticated header switch started with avatar/account menu.

## P0: Required Before Serious Public Launch

- `LEGAL-1`: signup must require Terms of Service and Privacy Policy acceptance
  before account creation. Marketing consent must remain optional and separate.
- `PAY-1`: migrate checkout to Separate Charges and Transfers so Skillset
  charges on the platform account and releases teacher money later.
- `PAY-2`: add seven-day refund request flow with server-side eligibility.
- `PAY-3`: create `payoutLedger` and scheduled D+30 transfers.
- `PUB-1`: add public institutional pages: `/pricing`,
  `/fees-and-payouts`, `/how-it-works`, `/for-creators`, `/trust`, `/help`.
- `MARKETPLACE-1`: remove public marketplace dependence on mock courses.
- `MARKETPLACE-2`: prevent public cards from showing "Pricing pending" or
  incomplete preview states.
- `DETAIL-1`: real published course detail pages using SSR/ISR.
- `CERT-1`: public certificate verification endpoint.
- `CERT-2`: public `/verify` UI connected to certificate verification.
- `DRIP-1`: drip content policy for paid courses.
- `SEC-1`: dynamic learner watermark in the video player.
- `SEC-2`: idempotency keys and rate limiting for payment-sensitive Functions.
- `SEC-3`: App Check and HTTP security headers.
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

## Drip Content Direction

Courses support:

- `instant`
- `sequential_progress`
- `time_drip_lesson`
- `time_drip_module`
- `time_drip_custom`

The core implementation is a pure `isLessonUnlocked(enrollment, lesson, course,
now)` function reused by UI and backend signed-media access.
