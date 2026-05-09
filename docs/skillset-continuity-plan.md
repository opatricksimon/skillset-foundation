# Skillset Continuity Plan

Last updated: 2026-04-26

## Product Direction

Skillset is a two-sided learning platform. Teachers create full course experiences, prepare modules, lessons, media, documents, recordings, and live-session materials, then submit the course for marketplace approval. Skillset performs a lightweight review before public listing. Approved courses become available in the marketplace. Students discover courses, enroll, learn, join course communities, attend events, and receive credentials.

The founder should not be the normal operator uploading every course. Founder-created content can exist only as seed/demo content or official Skillset programs. The scalable product loop is:

Teacher creates course -> teacher builds the complete course experience -> teacher submits for review -> Skillset approves, requests changes, or marks inactive -> approved course appears in the marketplace -> student enrolls -> student learns -> course community supports progress -> completion creates credential.

## Reference Priority

Primary reference for the teacher/course creation workflow: Hotmart/Kiwify creator commerce plus LearnHouse course-builder thinking.

Primary reference for community adjacency: Skool-like course community patterns, without copying Skool visuals or making community bigger than learning.

Primary reference for learning operations: ClassroomIO assignments, student dashboards, certificates, and course operations.

Primary reference for code discipline: OpenCourse-style separation of routes, domain types, data access, and API/data boundaries.

Supplemental frontend reference: `C:\Users\nicae\skool-clone-digidash23`.
Use it selectively for signup consent details, onboarding steps, dashboard ergonomics, course builder tabs, lesson editor affordances, media gallery patterns, preview panels, community/member structures, and creator workflow polish. Do not copy Skool branding, clone layout, color system, pricing claims, or source code wholesale.
Execution notes for this reference are captured in `docs/skool-clone-reference-gap-analysis.md`.

## Current Foundation

- Firebase Authentication is connected with email/password and Google sign-in.
- Firestore user profiles are created on login/signup.
- Firestore roles are in place for `student`, `teacher`, and future admin/support/moderator flows.
- Teacher Studio can create real course drafts in Firestore.
- Course Builder v0 can edit course basics, modules, and lesson outlines.
- Teachers can submit courses for Skillset review when ready for marketplace visibility.
- Ops can approve courses, request changes, or mark them inactive.
- Ops review shows structure, preview, and pricing readiness before approval.
- Ops can read user profiles for support lookup when the signed-in account has the `admin` role.
- Authenticated users can create support tickets, and ops can triage support tickets from `/ops`.
- Firestore rules block public writes and restrict marketplace publication to admin-level control.
- Platform navigation is role-aware at the UX layer.
- Public marketplace can expose filtered courses, pricing labels, and teacher-selected free preview lessons.
- Public marketplace can load admin-approved teacher courses from Firestore without requiring the founder to upload every course manually.
- Enrolled teacher-published courses can open through `/learn/courses/creator?courseId=...`, avoiding static-export route limitations for Firestore IDs.
- Enrolled teacher-published course communities can open through `/learn/community/creator?courseId=...`, also avoiding static demo slug limits.
- Ops can grant admin-created beta/support enrollments for published teacher courses without pretending checkout has happened.
- Teacher courses now carry marketplace setup fields for price, currency, platform fee, and selected free preview lesson.
- Uploading a `Course cover` asset now updates the course cover URL used by approved-course marketplace cards.
- Course asset upload UI, data layer, Firestore asset metadata rules, and Firebase Storage rules are implemented and deployed.
- Teachers can attach lesson media/material assets to specific lessons, and enrolled learners can see lesson-linked assets in the private course workspace.
- Enrollments are persisted in Firestore and drive learner dashboards plus private course routes.
- Lesson progress is persisted per enrollment and syncs completion state back into learner records.
- The learner course workspace now has a lesson content panel that distinguishes video, text, quiz, assignment, live recording, download, and external embed slots without pretending missing media exists.
- Course communities are persisted in Firestore and limited to enrolled users inside authenticated routes, with categorized posts and comments.
- Course events are persisted in Firestore. Teachers can schedule external live sessions for owned courses, enrolled students can view course-linked schedules and RSVP, and teachers can see attendance summaries.
- Paid course access is blocked until secure checkout is implemented. Direct self-enrollment is reserved for genuinely free courses.
- Order and payment domain types exist, and Firestore rules keep order/payment writes admin/system-controlled until Stripe webhooks are implemented.
- Stripe setup is documented in `docs/stripe-setup.md`; secrets are explicitly separated from frontend `NEXT_PUBLIC` values.
- Stripe Functions code exists for Checkout Session creation and webhook-based enrollment activation. Deployment is blocked until `secretmanager.googleapis.com` is enabled in the Firebase/GCP project and Stripe secrets are registered.
- Frontend checkout is protected by `NEXT_PUBLIC_PAYMENTS_CHECKOUT_ENABLED`. It defaults off, so Hosting can be deployed safely before Firebase Functions and Stripe webhooks are live.
- Students can no longer create `manual_demo` enrollments directly. Admin/system-created enrollment remains controlled through rules and future Functions/webhooks.
- Private course assets no longer require public `downloadUrl` records. The learner workspace loads protected Storage objects through Firebase-authenticated reads and temporary browser object URLs.
- Signup now requires terms/privacy acceptance and can store optional marketing consent.
- Signup and onboarding now support a professional account identity with username, bio, timezone, and user goals.
- A small console signature identifies Skillset as built by Patrick Simon. This is a brand signature, not a security boundary.
- Credential eligibility is visible to students when a course reaches completion. Actual certificate records remain admin/system-controlled.
- Onboarding now supports learner-only, teacher-only, or combined access in the same account.
- Authenticated platform areas now share a stronger app shell with active navigation, workspace header, role-aware quick actions, search placeholder, notification placeholder, and compact account identity.
- Course Builder now has tabbed sections for details, content, pricing, and review while preserving the existing Firestore model and review submission flow.
- Course Builder lesson creation now supports duration, optional text/instructions, optional external URL, and marking a lesson as the free public preview.
- Teachers now have a `/teach/media` media library for reviewing uploaded course assets by course, type, and search term.
- Learner community hub now has search and type filters for enrolled course communities.
- Course community spaces now have internal tabs for posts, about, members, and events while keeping access tied to enrollment.
- A profile settings page exists at `/learn/settings` so signed-in users can update username, bio, timezone, and goals after onboarding.
- Firebase Hosting was redeployed after the frontend reformulation pass with checkout feature-flagged off.

Client-side route gates are UX gates only. Real protection must stay in Firestore rules, Storage rules, and future server-side functions.

## Build Order

1. Course Builder v0
Goal: teachers can edit course structure, modules, lesson titles, lesson types, outcomes, and requirements.
Done: a teacher can create a draft, add modules/lessons, save changes, and submit for review.

2. Ops Course Review v0
Goal: admins can see submitted courses and approve, request changes, or mark inactive.
Done: an `in_review` course can be moved to `published`, `needs_changes`, or `inactive` by admin only.

3. Student Enrollment Shell
Goal: students can see enrolled courses and course detail inside `/learn`.
Done: enrollment records connect users to courses, the learner dashboard shows real enrolled courses, demo course routes open under `/learn/courses/[slug]`, and teacher-published Firestore courses open under `/learn/courses/creator?courseId=...`.

4. Course Player Shell
Goal: students can open a lesson, mark progress, and see next lesson.
Done: lesson progress is stored per enrollment, learners can open lesson slots by content type, mark lessons complete, and enrollment progress stays in sync with the dashboard.

5. Media Upload v0
Goal: teachers upload lesson thumbnails, PDFs, attachments, and eventually videos.
Done: Firebase Storage rules restrict writes to teacher-owned editable courses and reads to eligible users. Lesson assets can be attached to specific lessons and surfaced in the learner workspace.

6. Course Community v0
Goal: every published course can have a community space.
Done: enrolled users can open course-linked community feeds for demo and teacher-published courses, publish categorized posts, and reply with comments inside authenticated course spaces.

7. Events and Live Sessions
Goal: teachers can schedule live sessions using external links first.
Done: teachers can create course-linked live sessions with external links, students can view schedules for enrolled courses, RSVP to sessions, teachers can see RSVP summaries, and Firestore rules restrict reads/writes by owner/enrollment/admin status.

8. Payments and Enrollment Activation
Goal: Stripe Checkout creates an order and activates enrollment after webhook success.
Current: Checkout and webhook Functions are implemented in code and compile. Paid course CTAs call `createCheckoutSession`, and enrollment is granted only by `stripeWebhook` after Stripe reports paid checkout. Deployment is blocked by Secret Manager API enablement and Stripe secret registration.

9. Certificates Placeholder to Real Credential Flow
Goal: completion creates a Skillset Verified credential first.
Current: students can see credential eligibility after course completion, while certificate issue/revoke remains admin/system controlled.

10. Frontend Reformulation Pass
Goal: improve product feel using validated patterns from the Digidash Skool reference without cloning it.
Scope: signup consent, onboarding steps, dashboard density, course builder tabs, lesson editor controls, upload/media gallery ergonomics, public marketplace card detail, community member/context panels, and creator preview panels.
Rules: preserve Skillset brand, white/blue/red system, course-first learning posture, teacher/student separation, Firebase-first architecture, and original copy voice.
Plan source: `docs/skool-clone-reference-gap-analysis.md`.
Current: first pass complete for signup identity, onboarding, app shell, course builder tabs, teacher media library, and community hub filters. Rich lesson editing and deeper community detail tabs remain next.

## Immediate Checklist

- [x] Connect Firebase Auth.
- [x] Connect Firestore user profiles.
- [x] Add Teacher Studio course draft creation.
- [x] Add course submit-for-review action.
- [x] Tighten Firestore rules around course publication.
- [x] Build Course Builder v0.
- [x] Build Ops review queue.
- [x] Add review readiness checks for structure, preview, and pricing.
- [x] Add read-only admin user lookup and first-admin setup documentation.
- [x] Add support ticket creation and ops support queue.
- [x] Add marketplace filters and free preview presentation.
- [x] Connect published teacher courses to the marketplace read-side.
- [x] Add commercial setup fields to teacher course builder.
- [x] Connect uploaded course cover assets to approved-course marketplace cards.
- [x] Attach lesson assets to specific lessons and show them in the learner workspace.
- [x] Document Stripe Connect marketplace payment architecture.
- [ ] Add Firestore indexes if review/course queries require them.
- [x] Add Firebase Storage and storage rules for course assets.
- [x] Add enrollment records and learner dashboard data.
- [x] Add private workspace route for enrolled teacher-published Firestore courses.
- [x] Add admin-only manual enrollment for beta/support access.
- [x] Add lesson-type content panels to the learner course workspace.
- [x] Add community data model and v0 UI.
- [x] Add community comments under course posts.
- [x] Add private community route for enrolled teacher-published Firestore courses.
- [x] Add events/live-session data model and v0 UI.
- [x] Add event RSVP records for enrolled learners.
- [x] Add teacher-facing RSVP summaries.
- [x] Block paid course enrollment until secure checkout is connected.
- [x] Add order/payment domain guardrails without fake checkout.
- [x] Document Stripe setup, environment variables, webhooks, and Connect direction.
- [x] Add Stripe Functions source for Checkout Session creation and webhook enrollment activation.
- [x] Connect creator course CTA to server-created Stripe Checkout.
- [x] Deploy hardened Firestore and Storage rules.
- [x] Add signup terms/privacy consent tracking.
- [x] Add username, bio, timezone, and goals to signup/onboarding profile setup.
- [x] Deploy Firestore rules for enriched user profile fields.
- [x] Add authenticated app shell refinements for `/learn`, `/teach`, and `/ops`.
- [x] Refactor Course Builder into tabs for details, content, pricing, and review.
- [x] Add richer lesson setup fields for duration, text/instructions, external URL, and free preview selection.
- [x] Add teacher media library route at `/teach/media`.
- [x] Add learner community hub search and type filters.
- [x] Add course community detail tabs for posts, about, members, and events.
- [x] Add `/learn/settings` for post-onboarding profile management.
- [x] Remove public download URL dependency for private lesson assets.
- [x] Add credential eligibility UI without unsafe client-side certificate issuance.
- [ ] Enable Secret Manager API for Firebase Functions.
- [ ] Register `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Firebase Secret Manager.
- [ ] Deploy Firebase Functions.
- [ ] Create Stripe webhook endpoint for `stripeWebhook`.
- [x] Add frontend checkout feature flag so paid checkout stays disabled until Functions are deployed.
- [x] Redeploy Firebase Hosting with the latest account, onboarding, app shell, builder, media, and community refinements.
- [ ] Run test purchase and confirm order -> payment -> enrollment.
- [ ] Execute frontend reformulation pass using Digidash reference patterns.

## Non-Negotiable Rules

- Teachers may create and edit drafts.
- Teachers may submit courses for review when ready for marketplace visibility.
- Teachers may continue improving approved courses, while marketplace visibility remains controlled by Skillset.
- Teachers may not publish courses directly.
- Teachers may not issue or revoke official certificates.
- Students may not access private course content without enrollment.
- Public visitors may only read published marketplace content.
- Admin/ops actions must not be implemented as client-only trust.
