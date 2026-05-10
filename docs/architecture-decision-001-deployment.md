# ADR 001: Firebase Web Frameworks Deployment

## Decision

Skillset uses Firebase Hosting with Web Frameworks support for the Next.js app.
The project no longer uses `output: "export"` or serves the static `out/`
directory as the primary deployment target.

## Why

Skillset needs real dynamic platform behavior:

- public course pages that can use SSR or ISR after teachers publish courses;
- future certificate verification pages;
- route-level metadata for marketplace SEO;
- Next.js image optimization;
- a single Firebase-centered operational model for Hosting, Auth, Firestore,
  Storage, and Functions.

Static export was useful for the first shell, but it blocks the course
marketplace from behaving like a real teacher-driven platform.

## Tradeoffs

- Firebase Web Frameworks introduces a Cloud Run-backed server layer.
- The deployment is no longer purely static, so runtime configuration matters
  more.
- If Firebase Web Frameworks becomes a blocker, Vercel SSR remains the fallback.

## Rollback

To return to static export, restore `output: "export"` in `next.config.ts`,
restore `"public": "out"` in `firebase.json`, and run `npm run build` before
`firebase deploy --only hosting`.
