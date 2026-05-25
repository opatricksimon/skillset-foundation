# SECURITY AND COMPLIANCE
## Security posture, data handling, and compliance notes

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Current Security Model

| Layer | Protection |
|-------|------------|
| Auth | Firebase Authentication. |
| Database | Firestore security rules with role and ownership checks. |
| Storage | Storage rules tied to course ownership and enrollment. |
| Payments | Stripe-hosted and Stripe-embedded regulated flows. |
| Hosting | Security headers configured in `firebase.json`. |
| Backend secrets | Firebase Functions secrets. |

---

## Sensitive Data Policy

Do not commit or expose:

- Stripe secret keys.
- Stripe restricted keys.
- Stripe webhook secrets.
- GitHub tokens.
- Firebase service account JSON.
- Private user data exports.
- Full bank, tax, or identity documents.

---

## Payment Compliance

Skillset uses Stripe to avoid directly handling regulated payment information.

| Data Type | Handler |
|-----------|---------|
| Card data | Stripe Checkout. |
| Bank details | Stripe Connect. |
| Teacher identity verification | Stripe Connect. |
| Teacher tax/bank onboarding | Stripe Connect. |
| Platform records | Firestore stores safe status and IDs only. |

---

## Access Control Principles

- Users can only update safe profile fields.
- Backend functions own payment-sensitive fields.
- Course owners can upload and edit course assets while the course is editable.
- Learners can read protected assets only through active/completed enrollment.
- Admin and ops roles must be restricted to trusted accounts only.

---

## Launch Security Checklist

| Check | Required Before Public Launch |
|-------|-------------------------------|
| Production Stripe webhook secret configured | Yes |
| Firebase rules deployed | Yes |
| Storage rules deployed | Yes |
| No `.env` files committed | Yes |
| No live secrets in docs or source | Yes |
| Admin account list verified | Yes |
| Refund policy matches backend behavior | Yes |
| Terms and privacy copy reviewed | Yes |

---

## Open Risks

| Risk | Mitigation |
|------|------------|
| Public repository could expose accidental future secrets | Keep `.env*` ignored and run secret scanning before pushes. |
| Video files may be large and costly | Add file size controls, storage monitoring, and future streaming plan. |
| Global tax complexity | Keep launch scope narrow or add Stripe Tax before scale. |
| User-generated content moderation | Add report and admin moderation workflows before large public traffic. |

