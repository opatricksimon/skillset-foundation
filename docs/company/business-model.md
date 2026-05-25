# BUSINESS MODEL
## Revenue, pricing, and economic logic

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Revenue Streams

Skillset can support two revenue streams:

| Revenue Stream | Current Direction | Notes |
|----------------|------------------|-------|
| Platform commission | Active product model | Skillset takes a percentage of paid course sales. |
| Paid creator plans | In product surface | Plans can reduce commission or unlock business features. |

---

## Current Pricing Logic

The public product messaging has used a simple creator promise:

- Free to start.
- Platform earns when the creator sells.
- Paid plans may reduce commission and add business value.

This should stay simple until the MVP has real usage data.

---

## Payment Actors

| Actor | Role |
|-------|------|
| Learner | Pays for a course or enrolls in a free course. |
| Skillset | Operates checkout, platform fee, marketplace, review, and records. |
| Teacher | Receives net creator revenue after fees and release window. |
| Stripe | Handles card processing, Checkout, Connect onboarding, tax/bank compliance, and transfer rails. |

---

## Unit Economics To Track After Launch

| Metric | Why It Matters |
|--------|----------------|
| Gross merchandise value | Total value of course sales. |
| Net revenue | Skillset fee revenue after refunds. |
| Stripe processing cost | Payment cost that affects margins. |
| Refund rate | Course quality and trust signal. |
| Creator activation rate | Percent of signed-up teachers who publish. |
| Learner purchase conversion | Marketplace demand quality. |
| Course completion rate | Learning quality and credential credibility. |

---

## Current Assumptions

- Stripe remains the payment infrastructure for MVP.
- Skillset uses Stripe Connect Express for teacher payout setup.
- Paid courses require teacher payout setup before public sale.
- Free and draft courses do not require payout setup.
- Subscription plans are useful, but should not block the first MVP launch.

