# RELEASE CHECKLIST
## MVP launch gates

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Product Gates

| Gate | Required |
|------|----------|
| Teacher signup and onboarding work | Yes |
| Teacher can create a course | Yes |
| Teacher can add modules and lessons | Yes |
| Teacher can upload video and materials | Yes |
| Teacher can add external video URL | Yes |
| Teacher can submit course for review | Yes |
| Admin can publish course | Yes |
| Learner can enroll in free course | Yes |
| Learner can buy paid course | Yes |
| Learner can watch lesson content | Yes |
| Learner can download supporting material | Yes |
| Orders and enrollments are recorded | Yes |
| Payout setup is understandable | Yes |

---

## Technical Gates

| Gate | Required |
|------|----------|
| `npm test` passes | Yes |
| `npm run lint` passes | Yes |
| `npm run build` passes | Yes |
| Firestore rules deployed | Yes |
| Storage rules deployed | Yes |
| Functions deployed | Yes |
| Stripe webhook deployed and verified | Yes |
| No known public secret exposure | Yes |

---

## Payment Gates

| Gate | Required |
|------|----------|
| Stripe Checkout creates paid session | Yes |
| Webhook fulfills paid order | Yes |
| Free enrollment works without checkout | Yes |
| Stripe Connect Express onboarding works | Yes |
| Embedded onboarding fallback works | Yes |
| Refund request path works | Yes |
| Payout ledger records are created | Yes |

---

## Business Gates

| Gate | Required |
|------|----------|
| Public terms available | Yes |
| Privacy policy available | Yes |
| Teacher terms available | Yes |
| Pricing and fee copy aligned with backend | Yes |
| Support path visible | Yes |
| Founder can demo complete course lifecycle | Yes |

---

## Launch Decision

Skillset is not ready for a broad public launch until the teacher-to-learner course loop works in production.

If needed, launch first as a controlled beta with a small number of invited teachers.

