# Deploying Skillset

> **The one rule that bites:** app code and security rules deploy **separately**.
> Whenever you change `storage.rules` or `firestore.rules`, you **must** run
> `npm run deploy:rules` — the app deploy does **not** include them.

Project: `skillsetusaofficial` · Manual deploy from a developer machine (no CI yet).

Policy origin: [`docs/design-reference/platform-hardening-plan-2026-05-29.md`](docs/design-reference/platform-hardening-plan-2026-05-29.md)
(Guardrails + §5.2). Web Frameworks deploy model: [ADR-001](docs/architecture-decision-001-deployment.md).

## npm scripts

| Script | Deploys | Use when |
|--------|---------|----------|
| `npm run deploy:app`     | `functions,hosting` (together) | App / UI / Functions changes |
| `npm run deploy:rules`   | `storage,firestore:rules`      | **Any** change to `storage.rules` or `firestore.rules` |
| `npm run deploy:full`    | app, **then** rules            | Releases / when in doubt |
| `npm run deploy:hosting` | alias → `deploy:app` (legacy)  | Back-compat only; prefer `deploy:app` |

```bash
# Most releases — ships everything safely:
npm run deploy:full

# App-only change (you did NOT touch rules):
npm run deploy:app

# Rules-only change:
npm run deploy:rules
```

`deploy:app` automatically prints a reminder (via the `predeploy:app` hook) that
rules deploy separately.

## Why the split?

- **App = `functions,hosting`, always together.** Deploying **hosting alone**
  re-triggers the outcomes autosave loop, so the project rule is "never
  `deploy:hosting` sozinho" — functions and hosting ship in one command.
- **Security rules ship on their own** (`storage,firestore:rules`). Rules-only
  deploys are safe — they do **not** trigger the autosave loop.
- Net effect: **the app deploy never carries rules.** Forget the rules deploy and
  production silently runs stale rules.

## The bug this prevents

Cover-image upload returned **HTTP 403** in production for a long time. Root cause:
`storage.rules` (hardened in commit `c80d2a3`, "harden dependency and upload
security") was committed but **never deployed**, because the standard app deploy
excludes storage/firestore rules. Encoding the rules deploy as a first-class script
(plus this doc and the `predeploy:app` reminder) makes that step non-forgettable.

## Before deploying rules

Rules logic is covered by emulator tests — run them when you touch rules:

```bash
npm run test:rules
```
