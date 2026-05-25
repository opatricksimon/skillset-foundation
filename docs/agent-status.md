# Agent status

## 2026-05-22

- `[P6-fix][decision]` Kept Billing and Payouts as separate money surfaces: Billing is for account purchases/subscriptions/invoices; Payouts is for creator Stripe Connect, wallet, sales, and release status.
- `[P6-fix][decision]` Free creator courses now use a server-validated callable enrollment path instead of client-created Firestore enrollments, preserving security rules while making MVP enrollment functional.
- `[P6-fix][assumption]` Course review approval does not require a free-preview lesson yet; it blocks only missing structure and missing enrollment model. Preview quality remains a human review judgment.
- `[P6-reference][assumption]` `Skillset DESIGN V2 (2).zip` is treated as reference material, not production source. It is ignored by ESLint and used to guide future page hierarchy.
- `[deploy][status]` Firebase deploy succeeded for Firestore rules, app Functions, and Hosting. Hosting deploy also updated the Firebase Frameworks SSR function.
- `[deploy][stripe]` Located the needed Stripe credentials in the founder-provided credentials file without copying secrets into the repo. Used the restricted live key for CLI verification, updated the Firebase `STRIPE_WEBHOOK_SECRET`, and confirmed the live webhook endpoint is enabled for the backend-handled event set.
- `[deploy][blocker]` Full live payment smoke was not run because it would create real Stripe financial objects. The remaining go-live proof is a controlled low-value checkout that verifies `orders`, `payments`, and `enrollments` are written from live webhooks.
- `[P6-media][status]` Course Builder already supports modules, lessons, text content, external URLs, protected video uploads, and lesson assets. This pass adds trusted in-platform YouTube/Vimeo embeds and broader lesson material formats. Native video transcoding/streaming and true module-level cover binding remain P1 polish.
- `[P6-MVP][status]` MVP course loop is now implemented at code level: teacher creates a unique draft through a callable Function, configures categories/modules/lessons/pricing/assets, and enrolled learners open the real course workspace at `/learn/courses/{courseId}`.
- `[P6-MVP][assumption]` Course title uniqueness is global, not per-teacher. This is stricter and avoids marketplace ambiguity; teachers can still make names specific with subtitles.
- `[deploy][status]` Retried deploy in smaller steps. App Functions, including `createTeacherCourseDraft`, deployed successfully; Hosting and the Firebase Frameworks SSR function deployed successfully after retry. Published `/teach` returns HTTP 200.

## 2026-05-11

- `[P6-CL-1][assumption]` Deleted only confirmed unused marketing components in this batch. Deferred `/onboarding`, `/platform`, and demo-data archival until the onboarding/sidebar routes are replaced, to avoid breaking active flows.
- `[P6-OB-1][assumption]` Teacher onboarding questionnaire completion routes to the existing guarded `/onboarding?path=teacher` setup until the Fase 6 status-banner and teacher setup replacement is implemented. This preserves email verification and Teacher Terms safeguards.
- `[P6-ADD-06][assumption]` The create-course modal keeps the requested three visible fields. Because the current course schema still requires `category` and `summary`, new drafts use a default Management category and an explicit draft summary that creators replace in Course Builder before review.
- `[P6-ADD-16][assumption]` Export buttons use client-side CSV/JSON generation for rows already loaded in the current surface. The Cloud Function + signed URL export path remains a later scaling upgrade for large datasets.

## 2026-05-11 (executor)

- `[exec][decision]` Stripe NOT flipped to LIVE: product lacks browser QA; real money in untested flow = critical risk. Go-live is a documented 5-min cutover in `docs/stripe-go-live-runbook.md` once QA passes.
- `[exec][decision]` Did not deploy production this session: merge to main + push done; production deploy requires browser QA + Lighthouse per release blockers in fase-6 completion report.
- `[exec][fix]` Teacher onboarding double-loop resolved via streamlined activation mode in `onboarding-choice.tsx`. `/onboarding` and `/platform` orphan routes remain P1 (not deleted — needs tested redirects).
