# PAYMENTS
## Stripe Checkout, Connect, Billing, refunds, and payouts

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Current Stripe Model

Skillset currently uses:

| Stripe Product | Use |
|----------------|-----|
| Stripe Checkout | Learner course purchases and creator plan subscriptions. |
| Stripe Connect Express | Teacher payout onboarding and connected accounts. |
| Stripe Account Sessions | Embedded Connect onboarding inside Skillset. |
| Stripe Account Links | Hosted Connect onboarding fallback. |
| Stripe Webhooks | Payment fulfillment, subscription updates, and account state sync. |

---

## Why Stripe Connect Express

Teachers cannot receive marketplace payouts safely through Skillset bank handling alone.
Stripe Connect Express lets Stripe collect regulated identity, tax, and bank details while the teacher experiences the flow as part of Skillset.

Skillset should not directly store:

- Full bank account details.
- Government identification numbers.
- Sensitive tax identity data.
- Card numbers.

---

## Teacher Payout Setup

### Embedded Flow

Skillset requests a Stripe Account Session and renders onboarding inside the platform using Stripe Connect embedded components.

This is the preferred UX.

### Hosted Fallback

If embedded onboarding fails, Skillset can generate a Stripe Account Link and send the teacher to Stripe-hosted onboarding.

This is the reliability fallback.

---

## Course Purchase Flow

1. Learner clicks buy.
2. Client calls `createCheckoutSession`.
3. Backend validates the course, price, teacher, and payout readiness.
4. Backend creates a Stripe Checkout Session.
5. Learner completes payment on Stripe Checkout.
6. Stripe sends webhook to `stripeWebhook`.
7. Backend creates or updates order, enrollment, and payout ledger records.
8. Learner gets course access.

---

## Free Course Flow

1. Learner clicks enroll.
2. Client calls `createFreeCourseEnrollment`.
3. Backend validates course status.
4. Enrollment is created without payment.

---

## Payout Release Logic

Current product rule:

- Teacher payout is held until the refund window closes.
- Current automatic refund window is 7 days.
- Release job is `dailyReleaseTransfers`.

This reduces clawback risk when a learner refunds quickly after purchase.

---

## Refund Logic

Current product rule:

- Automatic refund window is 7 days.
- Refund eligibility also considers learner progress.
- Refund requests are processed through backend function logic and Stripe.

---

## Billing Plans

Creator plans are separate from course purchases.

| Payment Type | Stripe Surface |
|--------------|----------------|
| Course purchase | Stripe Checkout for one-time payment. |
| Creator plan | Stripe Billing Checkout and Billing Portal. |
| Teacher payout | Stripe Connect Express. |

---

## Open Decisions

| Topic | Decision Needed |
|-------|-----------------|
| Exact platform fee per plan | Confirm pricing model before public launch. |
| Tax handling for global learners | Confirm Stripe Tax or manual launch scope. |
| Video delivery at scale | Decide when to move beyond direct Firebase Storage delivery. |
| Refund policy copy | Align legal terms, checkout copy, and backend rules. |

