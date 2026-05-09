# Skillset Implementation Status

Last updated: 2026-04-26

## Current Live URL

https://skillsetusaofficial.web.app

## What Is Live

- Firebase Hosting is serving the static exported Next.js app.
- Firebase Authentication is connected for email/password and Google sign-in.
- Firestore stores user profiles, roles, teacher courses, enrollments, community records, orders, and payments.
- Firebase Storage is configured for teacher course assets with protected rules.
- Teacher Studio supports course draft creation, builder editing, media uploads, free preview selection, and submit-for-review.
- Ops supports course review, manual beta enrollment, support queue shell, user lookup, and payment/order monitoring.
- Student area supports enrolled course cards, private creator-course workspace, progress shell, resources, events, community, and inactive-access handling.
- Stripe Checkout Functions are deployed.
- Stripe webhook endpoint is configured in Stripe test mode.
- Stripe Connect onboarding Functions are deployed for teacher payouts.
- Teacher wallet now shows Stripe onboarding status and initial sales/order reporting.
- Creator-course lesson workspaces now render teacher-authored lesson descriptions, text content, protected assets, and external lesson/resource links.
- Course communities now support post/comment reporting with an Ops moderation queue and role-protected report status updates.
- Certificate issuance is moving from placeholder-only to a server-validated callable flow through `issueSkillsetCertificate`.
- Public credential verification is moving into `/verify` through `verifySkillsetCertificate`, returning safe course-level certificate data only.

## Permanent Cloud Functions

- `createCheckoutSession`
- `stripeWebhook`
- `createTeacherStripeAccountLink`
- `refreshTeacherStripeAccount`
- `issueSkillsetCertificate`
- `verifySkillsetCertificate`

## Payment Rules

- Paid creator course checkout is server-created only.
- Access is granted only after Stripe webhook confirmation.
- Refunds can mark orders/payments/enrollments as refunded.
- Paid checkout is blocked until the teacher has completed Stripe Connect onboarding.
- The platform fee defaults to `1500` basis points, meaning 15%.

## Founder/Admin Access

The founder account was promoted to:

```json
["student", "teacher", "admin"]
```

The temporary bootstrap function used for this was removed and its temporary secret was destroyed.

## Documents Created For Family/Stakeholder Presentation

- `docs/grandfather-brief/Skillset_Project_Brief_for_Grandfather_EN.docx`
- `docs/grandfather-brief/Skillset_Presentation_Script_PT_EN.docx`

Both were rendered and visually checked.

## Next Engineering Priorities

1. Run a full Stripe test purchase using a real teacher-created, published, paid course after Stripe Connect onboarding is completed.
2. Run a live Firebase/Stripe smoke test with a paid creator course and a connected teacher account.
3. Add a cleanup pass on public copy and mobile layout after the next visual review.
4. Add deeper teacher community controls after moderation smoke testing.
5. Add certificate PDF rendering after verification smoke testing.
