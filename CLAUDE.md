# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Skillset is a multi-page online-course marketplace built as a single Next.js App Router
application backed by Firebase. It has four product surfaces (public marketplace, student
learning, teacher operations, admin/trust ops) plus Stripe-powered payments (Checkout,
Connect Express payouts, Billing subscriptions). The repo was deliberately reshaped from a
one-page Firebase static prototype into this route-based product shell so auth, checkout,
publishing, and moderation can attach to stable surfaces.

## Commands

```bash
npm run dev            # Next.js dev server on http://localhost:3000
npm run build          # Production build (run before claiming a change is done)
npm run lint           # ESLint (eslint-config-next, core-web-vitals + typescript)
npm test               # Vitest: all src/**/*.test.tsx + functions/src/**/*.test.ts
npm run test:watch     # Vitest watch mode

# Run a single test file or test
npx vitest run src/domain/payment-split.test.tsx
npx vitest run -t "computes platform fee"

# Firestore/Storage security-rules tests (needs Firebase emulators; separate vitest config)
npm run test:rules     # firebase emulators:exec → tests/firestore-rules.ts, tests/storage-rules.ts

# Cloud Functions (separate package under functions/)
npm --prefix functions run build   # tsc compile (predeploy step)
npm --prefix functions run lint    # tsc --noEmit type check

# Deploy (deploying is a human decision — do not deploy unless explicitly asked)
npm run deploy:hosting             # firebase deploy --only hosting
```

The standard verification gate used throughout this project's history is:
`npm run lint` · `npm test` · `npm run build` · `npm --prefix functions run build`, plus
`npm run test:rules` when touching `firestore.rules` or `storage.rules`.

Node version is pinned in `.nvmrc`. The app uses `@/*` import alias mapped to `./src/*`.

## Architecture

This is a **client-SDK + trusted-backend** model. Understanding the boundary is the single
most important thing before changing data flows:

- **The browser uses the Firebase client SDK directly** for reads and non-privileged writes,
  gated by `firestore.rules` / `storage.rules`. These rules files are the real authorization
  layer (`firestore.rules` is large — ~59KB — and enforces field-level validation).
- **All privileged/critical writes go through Cloud Functions** in `functions/src/index.ts`
  (callable `httpsCallable`, scheduled jobs, and the Stripe webhook). Money, course creation,
  review submission, refunds, payouts, and certificate issuance are owned by the server. The
  client may *request* these actions but never performs them directly.
- **Stripe `stripeWebhook` (onRequest) is the single source of truth for payment fulfillment.**
  Successful checkout, refunds, and transfer reversals are reconciled there — not in client code.

### Layer map

| Path | Role |
|------|------|
| `src/app` | App Router pages/routes. One Next app, surfaces split by route: public (`/`, `/courses`, `/instructors`, `/about`, `/legal/*`), `/learn` (student), `/teach` (teacher), `/ops` (admin/support), plus auth flow routes (`/login`, `/signup`, `/welcome`, `/onboarding`, `/loading`). |
| `src/domain` | **Pure domain logic**: types, validation, and the unit-tested business rules (e.g. `payment-split.ts`, `course-access.ts`, `enrollment.ts`, `certificate.ts`). Co-located `*.test.tsx` files live here. No Firebase imports — this is the testable core. |
| `src/lib/data` | Client-side Firestore/Storage/callable **adapters**, one module per collection (`teacher-courses.ts`, `enrollments.ts`, `orders.ts`, …). These wrap `onSnapshot`/`updateDoc` for reads and `httpsCallable(...)` for privileged writes. |
| `src/lib/firebase` | Client app init (`client.ts` exposes `getFirebaseApp/Auth/FirestoreDb/Storage/Functions`); functions region is `us-central1`. |
| `src/lib/permissions` | Role + permission model (see below). |
| `src/lib/feature-flags` | Feature-flag definitions with `defaultEnabled` and env-driven public overrides. |
| `src/lib/posthog`, `src/app/posthog-provider.tsx` | Product analytics; client `identify/reset` bound to auth in `auth-provider`, server events in `functions/src/posthog.ts`. |
| `src/data` | Static brand/site/plans content + `src/data/demo` mock content. |
| `src/components` | UI grouped by product area (`auth`, `courses`, `teacher`, `learn`, `admin`, `platform`, `site`, …). |
| `functions/src` | Backend. `index.ts` (all callables/schedules/webhook), `payment-rules.ts` (canonical fee/payout/refund rules, unit-tested in `payment-rules.test.ts`), `posthog.ts`. **Separate npm package**, separate tsconfig, Stripe SDK pinned to a different major than the web app. |

### Auth & routing flow

`AuthProvider` (`src/components/auth/auth-provider.tsx`) wraps the app in `layout.tsx`,
listens to Firebase auth state, exposes `useAuth()`, and renders a `LegalAcceptanceGate`
that forces re-acceptance when `termsVersion`/`privacyVersion` are stale. Post-auth
destination is computed by `getPostAuthRoute` in `src/lib/auth/routing.ts`:
incomplete onboarding → `/welcome`; teacher-intent without teacher role → `/onboarding`;
admin/support → `/ops`; teacher → `/teach`; otherwise `/learn`. Auth "path intent"
(`student`/`teacher`) is carried via `?path=`/`?role=` query params.

### Permissions model

`src/lib/permissions/index.ts` defines six roles (`guest`, `student`, `teacher`, `admin`,
`support`, `moderator`) and a static `rolePermissionMatrix` over typed `area.action`
permission keys (e.g. `payments.refund`, `courses.publish`). Roles compose
(student ⊇ guest, teacher ⊇ student, etc.); `admin` gets all keys. Use `hasPermission`,
`hasAnyPermission`, `hasAllPermissions`, `hasRole` against a subject that may carry a
single `role`, multiple `roles`, and/or explicit `permissions`. When adding a capability,
add the permission definition and wire it into the matrix — don't gate UI on raw role strings.

### Payment/money invariants (treat as load-bearing)

These were decided deliberately (see `DECISIONS.md`) and should not be changed casually:

- **Platform fee is resolved server-side from the teacher's current plan**, ignoring any bps
  sent by the client: Free 800 bps, Starter 400, Pro 100, Plus 0. The order snapshots the
  fee at sale time. Canonical logic lives in `functions/src/payment-rules.ts`.
- Stripe processing-fee estimate: USD = 2.9% + $0.30; non-USD = 5.4% + $0.30 (conservative
  ledger estimate; exact fee only known from the Stripe balance later).
- Payout release is **D+10**; auto-refund window is **D+7** (`dailyReleaseTransfers` schedule).
- Uses `separate_charges_and_transfers` (fee reflected by reducing the transfer, no
  `application_fee_amount`). A refund after a payout was already `released` creates a
  proportional transfer reversal with an idempotency key.

## Conventions

- **Domain logic goes in `src/domain` and gets a co-located unit test.** Critical/financial
  rules in particular are extracted into pure, testable modules (the `payment-split.ts` /
  `payment-rules.ts` pattern) rather than living inline in components or functions.
- **Privileged writes belong in `functions/src/index.ts` behind a callable**, with the matching
  client adapter in `src/lib/data`. Don't write privileged data straight from the browser —
  it will (and should) be blocked by `firestore.rules`.
- When you change `firestore.rules` or `storage.rules`, run `npm run test:rules` and update
  the rule tests in `tests/`.
- Styling uses Tailwind 4 utilities plus CSS custom properties (`var(--color-...)`,
  `var(--shadow-...)`) defined in globals — follow existing class patterns rather than
  introducing a new styling approach.
- Secrets never ship to the browser. Only `NEXT_PUBLIC_*` values are client-safe; `.env.production`
  intentionally carries *only* the publishable PostHog/Firebase/Stripe keys. Server secrets
  (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) are Firebase Functions secrets via `defineSecret`.
- `.env.example` lists required client env vars; copy to `.env.local` for development.

## Project memory / state docs

This repo carries running engineering state in root markdown files — check them before large
changes (several are written in Portuguese):

- `HANDOFF.md` — what the last session did, validated, and what's next.
- `DECISIONS.md` — autonomous decisions made (D1, D2, …) with rationale and discarded alternatives.
- `BLOCKERS.md` — known blockers (often missing prod secrets/credentials).
- `STRIPE_CHECKLIST.md`, `STRIPE_*` runbooks, `TEST_RESULTS.md` — payment go-live state.
- `docs/technical/` — `architecture.md`, `data-model.md`, `payments.md`, `api-reference.md`,
  `security-and-compliance.md`. `docs/README.md` is the documentation entry point.

Deploying to production (`firebase deploy`, going LIVE) is treated as a human decision in this
project — do not deploy unless explicitly instructed.
