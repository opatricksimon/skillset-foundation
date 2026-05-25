# SKILLSET DOCUMENTATION INDEX
## Startup-grade documentation map

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living documentation

---

## Purpose

This folder is the source of truth for Skillset as a serious startup project.
It is designed for four audiences:

- Founders and operators who need clarity on product direction.
- Engineers and AI coding agents who need implementation context.
- Future investors who need a credible company narrative.
- Future hires who need to understand how the platform works.

This documentation should be updated while the product is being built, not only at the end.

---

## Core Documents

| Area | Document | Purpose |
|------|----------|---------|
| Company | [Product Vision](company/product-vision.md) | Defines the problem, solution, customer, and strategic position. |
| Company | [Business Model](company/business-model.md) | Explains revenue model, plans, fees, and economic logic. |
| Product | [MVP Scope](product/mvp-scope.md) | Defines what must work before launch and what stays out. |
| Product | [Core Workflows](product/core-workflows.md) | Documents teacher, learner, marketplace, and admin flows. |
| Technical | [Architecture](technical/architecture.md) | Explains stack, infrastructure, boundaries, and deployment model. |
| Technical | [Data Model](technical/data-model.md) | Documents Firestore collections, entities, and ownership rules. |
| Technical | [API Reference](technical/api-reference.md) | Lists callable functions, webhooks, request payloads, and outcomes. |
| Technical | [Payments](technical/payments.md) | Documents Stripe Checkout, Stripe Connect, fees, payouts, and refunds. |
| Technical | [Security and Compliance](technical/security-and-compliance.md) | Captures security posture, data handling, and open risks. |
| Operations | [Local Development and Deploy](operations/local-development-and-deploy.md) | Documents how to run, test, build, and deploy. |
| Operations | [Release Checklist](operations/release-checklist.md) | Defines launch readiness gates. |
| Investor | [Investor One-Pager](investor/investor-one-pager.md) | Initial investor-facing company summary. |
| Investor | [Risk Register](investor/risk-register.md) | Tracks strategic, technical, legal, and operational risks. |

---

## Documentation Rules

- Keep documents factual. Do not claim traction, revenue, or partnerships that do not exist.
- Mark assumptions explicitly.
- Update technical documents when implementation changes.
- Keep investor documents separate from operational documents.
- Never place API keys, private tokens, live Stripe secrets, or Firebase service credentials in documentation.

---

## Current Startup Priority

The documentation supports the main product priority:

1. Teacher can create a course.
2. Teacher can create modules and lessons.
3. Teacher can upload videos and supporting materials.
4. Learner can enroll, access, and watch the course.
5. Payments, platform fees, refunds, and payouts are clear and functional.
6. The platform has enough operational documentation to be maintained by future engineers.

