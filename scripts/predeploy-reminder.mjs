#!/usr/bin/env node
/**
 * predeploy-reminder.mjs
 *
 * Runs automatically before `npm run deploy:app` (via the npm `predeploy:app`
 * hook). Its only job is to make the SEPARATE security-rules deploy a
 * non-forgettable step.
 *
 * Why this exists (the cover-upload 403 incident):
 *   Deploys are split on purpose. The app deploy ships only
 *   `--only functions,hosting` (both together — deploying hosting alone
 *   re-triggers the outcomes autosave loop). Security rules (`storage.rules` /
 *   `firestore.rules`) ship on their own via `--only storage,firestore:rules`.
 *   That means the app deploy NEVER carries rules — so rules changes silently
 *   miss production unless the rules deploy is run too. That is exactly how the
 *   cover-image upload sat broken at HTTP 403 for a long time: storage.rules
 *   (hardened in commit c80d2a3) was committed but never deployed.
 *
 * Policy: docs/design-reference/platform-hardening-plan-2026-05-29.md
 * Full reference: DEPLOY.md
 * This script is print-only and must NEVER fail the deploy (always exits 0).
 */

const tty = process.stdout.isTTY;
const yellow = (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s);
const dim = (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s);
const line = "────────────────────────────────────────────────────────────";

console.log(`
${yellow(line)}
  ${yellow("deploy:app = functions + hosting ONLY — security rules are NOT shipped")}

  Changed storage.rules or firestore.rules? Also run the rules deploy:
    ${yellow("npm run deploy:rules")}   ${dim("# storage + firestore rules")}
  or deploy everything in order:
    ${yellow("npm run deploy:full")}    ${dim("# app, then rules (recommended)")}

  ${dim("Why: the app deploy never includes rules. See DEPLOY.md.")}
${yellow(line)}
`);
