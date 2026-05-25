# RISK REGISTER
## Startup, product, technical, and operational risks

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Risk Summary

| Risk | Severity | Current Mitigation |
|------|----------|--------------------|
| MVP feels like UI without function | High | Prioritize real course creation, upload, payment, and learner access. |
| Payment compliance complexity | High | Use Stripe Checkout and Stripe Connect Express. |
| Course media cost or delivery quality | Medium | Start with Firebase Storage, monitor usage, plan streaming upgrade. |
| Marketplace trust without supply | High | Avoid fake data and use reviewed course positioning. |
| Legal terms mismatch product behavior | High | Align refund, payout, teacher terms, and checkout copy. |
| Public repo secret exposure | High | Keep secrets out of Git and scan before push. |
| Founder bottleneck | Medium | Maintain clear docs and code structure for future contributors. |
| Too many surfaces before MVP loop works | High | Reduce clutter; prioritize course builder, classroom, checkout, payouts. |

---

## Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Firestore rules block real users | Users cannot complete flows | Keep rules tests and production smoke checks. |
| Stripe webhook mismatch | Paid users may not receive access | Treat webhook fulfillment as source of truth. |
| Upload file type gaps | Teachers cannot upload materials | Keep allowed MIME list aligned with product promise. |
| Large video uploads | Cost and performance issues | Enforce limits and add streaming/transcoding later. |

---

## Business Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| No initial teacher supply | Marketplace looks empty | Launch controlled beta with selected teachers. |
| Unclear pricing | Creators hesitate | Keep fee model simple for MVP. |
| Weak learner demand | Low revenue | Start with focused niches and founder-led acquisition. |
| Competitive pressure | Hard differentiation | Emphasize trust, review, international payments, and creator promise. |

---

## Compliance Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tax obligations across countries | Legal and financial exposure | Use Stripe where possible and limit launch scope if needed. |
| Refund disputes | Support load and chargebacks | Clear refund policy and backend enforcement. |
| User-generated content | Moderation risk | Add reporting, admin review, and content standards. |

---

## Immediate Risk Reduction Priorities

1. Prove the full teacher-to-learner course loop in production.
2. Confirm Stripe Checkout and webhook fulfillment.
3. Confirm Stripe Connect onboarding works with real teacher account.
4. Clean navigation hierarchy so teacher and learner tasks do not mix.
5. Keep launch as controlled beta until the first course purchase succeeds.

