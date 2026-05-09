# Skillset Foundation
## Multi-page product shell for Skillset

> **Version:** 0.1.0
> **Updated:** 2026-04-20

---

## What this is

This repository is no longer treated as a one-page Firebase prototype.

It now contains the first real application shell for `Skillset`, organized as a multi-page product with separate surfaces for:

- Public marketplace
- Student learning
- Teacher operations
- Admin and trust operations

---

## Current routes

### Public

- `/`
- `/courses`
- `/courses/[slug]`
- `/instructors`
- `/instructors/[slug]`
- `/about`
- `/contact`
- `/legal/privacy`
- `/legal/terms`

### Product surfaces

- `/platform`
- `/learn`
- `/teach`
- `/ops`

---

## Why this structure

### What

The project was reshaped into a route-based application instead of a single landing page.

### Why

Skillset is meant to become a real platform, not a marketing page with ambition. A multi-page structure is required now so later modules such as auth, checkout, course publishing, and moderation can attach to stable surfaces.

### How

The current build uses one Next.js app with separated product surfaces by route and feature folder. This is the fastest solo-buildable version of the larger long-term architecture.

---

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest
- Testing Library

---

## Legacy prototype

The original Firebase static prototype is still present as reference material in:

- `public/index.html`
- `public/css/style.css`

These files are no longer the primary application entrypoint.

---

## Local development

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/`

---

## Verification

```bash
npm test
npm run lint
npm run build
```

---

## Next implementation slices

1. Add real auth and role gating.
2. Replace mock data with a typed content layer.
3. Add course detail model and catalog search state.
4. Add teacher onboarding flow.
5. Add student lesson/player flow.
6. Add admin moderation primitives.
7. Decide deployment target beyond the legacy Firebase static setup.

