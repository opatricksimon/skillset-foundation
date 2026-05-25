# MVP SCOPE
## What must work before launch

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## MVP Definition

The Skillset MVP is launchable when a real teacher and a real learner can complete the core education commerce loop without manual engineering intervention.

---

## Must Work

| Area | MVP Requirement |
|------|-----------------|
| Authentication | Email and Google sign-in create usable profiles. |
| Onboarding | New users choose learner or teacher path and complete core questions. |
| Teacher studio | Teacher sees a clear dashboard with useful zero-state metrics. |
| Course creation | Teacher creates a draft course with unique title, summary, category, and payment type. |
| Builder | Teacher creates modules, lessons, pricing, drip/release settings, and preview lesson. |
| Uploads | Teacher uploads course cover, lesson videos, thumbnails, and supporting materials. |
| Embeds | Teacher can add an external lesson URL such as YouTube. |
| Review | Teacher submits course for Skillset review. |
| Marketplace | Published courses are visible publicly. |
| Checkout | Learner can buy paid course through Stripe Checkout. |
| Free enrollment | Learner can enroll in free course without Stripe payment. |
| Learning area | Learner can access enrolled course, modules, lessons, and materials. |
| Progress | Learner progress can be tracked. |
| Payments | Teacher payout readiness is visible and understandable. |
| Refunds | Refund request logic is available and recorded. |
| Admin/Ops | Admin can review courses and inspect operational surfaces. |

---

## Out Of Scope For MVP

| Feature | Reason |
|---------|--------|
| Full affiliate program | Adds payment and fraud complexity. |
| Complex coupon engine | Useful later, not needed for first paid validation. |
| Full live cohort engine | Can start with external links. |
| Native video transcoding pipeline | Firebase Storage can support upload first; advanced streaming can come later. |
| Full mobile app | Responsive web is enough for MVP. |
| Automated tax advisory | Stripe handles regulated collection surfaces; Skillset should not give tax advice. |

---

## Launch Gate

The MVP should not launch publicly until the following flow succeeds in production:

1. Create teacher account.
2. Create course.
3. Add one module.
4. Add one video lesson.
5. Upload one supporting file.
6. Submit course for review.
7. Admin publishes course.
8. Learner purchases or enrolls.
9. Learner opens the course and watches the lesson.
10. Order, enrollment, and payout ledger records are correct.

