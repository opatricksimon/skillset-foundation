# ARCHITECTURE
## System design and infrastructure

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | CSS custom properties, Tailwind CSS 4 utilities |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore |
| File storage | Firebase Storage |
| Backend functions | Firebase Cloud Functions v2, Node.js 22 |
| Payments | Stripe Checkout, Stripe Connect Express, Stripe Billing |
| Hosting | Firebase Hosting with framework backend |
| Tests | Vitest, Testing Library, Firebase rules unit tests |

---

## Repository Structure

| Path | Purpose |
|------|---------|
| `src/app` | Next.js App Router pages and route surfaces. |
| `src/components` | UI components grouped by product area. |
| `src/domain` | Shared domain types, validation helpers, and unit-tested rules. |
| `src/lib/data` | Client-side Firestore, Storage, and callable function adapters. |
| `src/lib/firebase` | Firebase client initialization. |
| `functions/src/index.ts` | Backend callable functions, scheduled jobs, Stripe webhooks. |
| `firestore.rules` | Firestore authorization and validation rules. |
| `storage.rules` | Firebase Storage upload/read rules. |
| `docs` | Product, technical, operations, and investor documentation. |

---

## Runtime Boundaries

| Boundary | Runs Where | Notes |
|----------|------------|-------|
| Public marketing | Browser and Next.js server rendering | No secret access. |
| Authenticated app | Browser with Firebase client SDK | Uses Firestore rules and callable functions. |
| Business logic | Firebase Functions | Owns payment mutations, course creation, review submission, refunds, certificates. |
| Payment events | Stripe webhook to Firebase Function | Single source for successful payment fulfillment. |
| File access | Firebase Storage | Enforced by Storage rules and Firestore enrollment/course ownership checks. |

---

## Deployment Model

Firebase deploy publishes:

- Next.js app through Firebase Hosting framework backend.
- Firebase Functions from `functions`.
- Firestore rules.
- Storage rules.

The Firebase project currently targets the Skillset production web app domain.

---

## Architectural Principles

- Client code may request actions, but backend functions own critical writes.
- Course owners can edit drafts and editable course states only.
- Learners access protected assets only after enrollment.
- Payment success must be fulfilled from Stripe webhook events, not from client redirects alone.
- Documentation must follow implementation, not future wishes.

---

## Known Technical Decisions

| Decision | Current Choice | Reason |
|----------|----------------|--------|
| Marketplace payment model | Stripe Checkout | Fast, secure, production-grade checkout. |
| Teacher payouts | Stripe Connect Express | Lower compliance burden than custom payout handling. |
| Course media | Firebase Storage | Fast MVP upload path and access control through rules. |
| Course builder state | Firestore course document plus asset subcollection | Simple, real-time, and easy to secure. |
| Deployment | Firebase | Already integrated with Auth, Firestore, Storage, Functions, Hosting. |

