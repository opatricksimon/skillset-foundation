# LOCAL DEVELOPMENT AND DEPLOY
## How to run, test, build, and ship Skillset

> **Version:** 0.1.0
> **Updated:** 2026-05-25
> **Status:** Living document

---

## Prerequisites

- Node.js compatible with Next.js and Firebase Functions runtime.
- npm.
- Firebase CLI authenticated to the Skillset project.
- Stripe CLI only when testing webhooks locally.
- Access to required Firebase Functions secrets in the Firebase project.

---

## Install

```bash
npm install
npm --prefix functions install
```

---

## Run App Locally

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

---

## Test

```bash
npm test
npm run lint
npm run build
```

Firestore rules tests:

```bash
npm run test:rules
```

---

## Build Functions

```bash
npm --prefix functions run build
```

---

## Deploy

Recommended production deploy:

```bash
firebase deploy
```

Targeted deploys:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

---

## Post-Deploy Smoke Checks

| Check | Expected |
|-------|----------|
| `/` | Public home loads. |
| `/auth` | Auth page loads. |
| `/teach` | Authenticated teacher surface loads. |
| `/teach/builder` | Course builder hub loads. |
| `/account/payments` | Payout setup surface loads. |
| Stripe webhook | Configured endpoint receives events. |

---

## GitHub

Repository:

```text
https://github.com/opatricksimon/skillset-foundation
```

Before pushing public code:

1. Run tests or explain why not.
2. Run a secret scan or targeted token search.
3. Confirm no `.env` or credential files are staged.
4. Commit with a clear message.
5. Push to GitHub.

