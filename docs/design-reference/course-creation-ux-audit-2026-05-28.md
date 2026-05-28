# Course-Creation UX Audit — Teacher Builder & Student Classroom

> **Date:** 2026-05-28
> **Author:** Autonomous session (Claude)
> **Scope:** The course-creation loop the founder flagged as priority — *"configurar bem a parte onde você vai criar os cursos… principalmente pensando na experiência de usuário para ser fácil e intuitivo para ele criar um curso, e o aluno ver o curso, tudo muito fácil e simples."*
> **Builds on:** `skillset-design-v2-analysis-2026-05-22.md` (macro analysis). This doc does **not** repeat that one — it drills into the teacher builder + student classroom with file:line evidence and a risk-tagged roadmap.
> **North star:** `_proto-v6` (extracted inspiration prototype). The prototype is the *aspiration*, not a spec — it has empty/placeholder areas and is missing things the real app already has (Stripe, drip, protected video, certificates, discussion).

---

## 0. TL;DR

The builder is **further along than it looks at a glance**. It already has a 7-stage left-rail stepper with done-checkmarks, an overall progress bar, a "next best action" hint, per-stage completion logic, a review-readiness checklist with jump-to-fix, and (as of this session) **autosave + a live save-state pill + guided Back/Continue navigation**. The student classroom is genuinely strong (protected video, drip unlock, progress, per-lesson discussion, certificates, course resources).

The remaining course-creation friction is concentrated in a few concrete, fixable places:

1. **The course cover is in the wrong place, has no visual preview, and is mislabeled** — the single biggest "easy/intuitive" gap. *(P0)*
2. **The left-rail stepper is not fully honest** — clicking "Course cover" or "About" all dump onto the top of the Details tab with no scroll/anchor to the relevant section. *(P1)*
3. **No structured "what you'll learn" outcomes** — the prototype's Step 03 is outcome-led; the real app folds outcomes into one free-text summary. *(P2 — backend-coordinated)*
4. **Lesson editing is reachable from three overlapping surfaces** — Curriculum inline + the always-on "Lesson upload" aside + the Lesson Studio modal — which dilutes the mental model. *(P2)*

---

## 1. What shipped this session (already committed)

| Commit | Change | Why it matters for course creation |
|--------|--------|-----------------------------------|
| `368e44e` | **Autosave drafts** + live save-state pill (`BuilderSaveStatus`: saving / unsaved / saved / failed) + total-duration display | Teachers were losing lesson text/settings edits that "save with the course draft" (`lesson-content-modal.tsx:518`). Autosave + a visible status removes the silent data-loss trap. |
| `0babe0c` | **Guided Back / Continue** footer nav across the 4 builder tabs | Linear "what do I do next" flow, matching the prototype's stepper progression. |
| `d35b524` | **Course cover field with live preview** at the top of the Details tab (P0) | Reuses `uploadCourseAsset({ kind: "course_cover" })`; the stepper's "Course cover -> Details" stage is now honored with a visible 16:9 preview. No backend change. |
| `a191da7` | **Honest stepper navigation** (jump-and-scroll to each named section) + **live summary char counter** (P1) | Clicking "Course cover" / "About" now scrolls to that exact section. Hook-safe (ref + `activeTab` effect). Counter shows progress to the 20-char review minimum. |
| `56cb4a5` | **Reframe asset panel as "Course media library"** (P2, step 1 / non-destructive) | Retitled from "Lesson upload"; clarifies it is the catch-all media manager and that per-lesson video/text/settings live in the lesson studio. Copy-only. |

All validated: ESLint 0 problems, `next build` EXIT 0, `npm test` 67/67 on every commit. Loop-safe patterns throughout (shared serializer for autosave; ref-held scroll target read only in handler/effect) — no `react-hooks/set-state-in-effect` / `purity` / `refs` violations.

---

## 2. Teacher builder vs prototype — precise mapping

**Real builder:** 4 working tabs (`course-builder-studio.tsx:71-75`) presented through a **7-stage left-rail stepper** (`:86-92`) so the teacher sees a 7-step mental model over 4 panels.

| Prototype step (`_proto-v6/screens/Builder.jsx`) | Real builder stage (`builderStages`) | Lands on tab | Status |
|---|---|---|---|
| 01 Foundations (title, subtitle, level) | `basics` — Title, category | `details` | ✅ Present (title + categories) — *no "level" field* |
| 02 Cover (hero image) | `cover` — Hero image | `details` | ⚠️ **Stepper points to Details, but Details has no cover control** (see §3.1) |
| 03 About (promise + 4+ outcomes) | `about` — Promise, outcomes | `details` | ⚠️ Summary textarea only — *no structured outcomes* (see §3.3) |
| 04 Modules (structure, covers, desc) | `modules` — Structure | `content` | ✅ Add-module form + module cover via media library |
| 05 Content (lessons) | `lessons` — Video, text, files | `content` | ✅ Add-lesson + Lesson Studio modal (4 tabs) + uploads |
| 06 Pricing | `pricing` — Access model | `pricing` | ✅ **Richer than prototype** — payment model, currency groups, installments, drip, free-preview selector |
| 07 Review (checklist w/ jump-to-fix) | `submit` — Review | `review` | ✅ `readinessItems` + `setActiveTab` jump-to (`:500`, `:1223`, `:1951`) |

**Net:** structurally the real builder already covers the prototype's 7 steps and exceeds it on pricing/drip/review. The gaps are **placement and fidelity**, not missing capability — except structured outcomes and a "level" field.

---

## 3. Confirmed course-creation gaps (evidence-cited)

### 3.1 — P0 · Course cover: wrong place, no preview, mislabeled
- The Details tab body renders **only** title, categories, summary (`course-builder-studio.tsx:1308-1363`). There is **no cover control there**, yet the stepper's `cover` stage targets `details` (`:87`) and completion is tracked on `course.coverImageUrl` (`:599`).
- The actual cover upload lives in `CourseAssetUploader`, rendered in the **always-visible aside** (`:2204-2206`) under a panel titled **"Lesson upload" / "Attach videos and materials"** (`course-asset-uploader.tsx:195-199`), where "Course cover" is **1 of 6 preset buttons** (`:82-87`).
- There is **no visual preview** of the chosen cover — only a text line "Course cover is set" (`course-asset-uploader.tsx:210-214`).
- The cover is high-stakes: it's the student classroom hero (`enrolled-course-workspace.tsx:436`), the enrollment card image (`lib/data/enrollments.ts:71`), and the public/marketplace image (`lib/data/published-courses.ts:89,126`).
- **Fix (low risk, no backend change):** add a dedicated **Course cover** field at the top of the Details tab with a 16:9 preview (or empty dropzone) and inline upload, reusing the proven `uploadCourseAsset({ kind: "course_cover" })` path — which already writes `coverImageUrl` server-side (`lib/data/course-assets.ts:140-142`) and propagates live via the existing course `onSnapshot`. Keep the full media library where it is.

### 3.2 — P1 · Stepper navigation isn't fully honest
- `basics`, `cover`, `about` all `setActiveTab("details")` (`:1223`), landing at the top of a single scroll. Clicking "About" doesn't take you to the About section. The 7-step promise is visually true but navigationally flat.
- **Fix:** give each stage a section anchor id; on click, switch tab then `scrollIntoView` the section (event handler, not render — no hooks risk). Pairs naturally with §3.1 and with adding section headers to the long Details tab (improves scannability).

### 3.3 — P2 · No structured "what you'll learn" outcomes
- Prototype Step 03 is outcome-led (`whatYouLearn`, 4+ bullets). Real app has one free-text `summary` (`:1348-1357`); the `about` sub-label "Promise, outcomes" (`:88`) is aspirational.
- **Why deferred:** outcomes need a new persisted field validated by the `updateTeacherCourseBuilder` Cloud Function. That's a backend-coordinated change (schema + CF validator + domain type + public course page render). Do it deliberately, not in a blind loop — flagged here so it isn't lost.

### 3.4 — P2 · Lesson editing has three overlapping entry points
- Curriculum inline controls + the always-on "Lesson upload" aside (`:2204`) + the Lesson Studio modal (`:2209`, `lesson-content-modal.tsx`) all edit lesson material. Functional but dilutes the "one obvious place" principle.
- **Fix (later):** make the Lesson Studio modal the single canonical lesson editor; demote the aside uploader to a course-level media library (covers/general files) and route per-lesson uploads through the modal.

### 3.5 — Minor
- No "level" (beginner/…/advanced) field (prototype Step 01). Low value, backend-coordinated — note only.
- Details "Course summary" has no min/explicit counter near the field, though submission enforces ≥20 chars (`:2186`). A small live counter would reduce review bounce. *(trivial, P1)*

---

## 4. Student classroom (`enrolled-course-workspace.tsx`) — state

**Strengths (keep):** hero with progress bar + meta chips (`:396-442`); player + "Now playing" dark stat card + Continue/Workspace-links sidebar (`:444-541`); curriculum module deck with per-lesson cards (thumbnail, type, duration, file count, done, mark-complete) and drip lock states (`:559-689`); lesson panel with protected video / trusted embed / text-first empty states (`:850-960`); per-lesson discussion with subscribe/add/delete (`:963-1107`); course resources list (`:750-808`); certificate issuance on 100% (`:358-371`). Analytics are gated and exclude preview mode (`:183-194`).

**Minor gaps / polish:**
- Empty-media lessons show helpful type-specific copy (`lessonTypeDescriptions`, `:720-728`) — good. But a brand-new course with no cover/thumbnails leans on `ProtectedAssetCover` fallback labels; §3.1's cover fix improves the very first student impression.
- Hero cover uses a raw `<img>` (`:435-436`, eslint-disabled). Acceptable; revisit only if LCP becomes an issue.
- The classroom is close to the prototype's "Classroom" intent already; no structural rebuild needed (consistent with the 2026-05-22 conclusion: *reorganize, don't rebuild*).

---

## 5. Prioritized roadmap

| # | Priority | Item | Risk | Backend? | Status |
|---|----------|------|------|----------|--------|
| 1 | **P0** | Course cover field in Details tab (preview + inline upload, reuse `uploadCourseAsset`) | Low | No | ✅ Shipped `d35b524` |
| 2 | P1 | Honest stepper → section anchors + live summary counter | Low | No | ✅ Shipped `a191da7` |
| 3 | P2 | Single canonical lesson editor (Lesson Studio modal); demote aside uploader | Medium | No | 🔶 Step 1 shipped `56cb4a5` (relabel to media library). Relocation needs founder OK — risk of breaking module-cover / thumbnail / video uploads. |
| 4 | P2 | Structured "what you'll learn" outcomes (field + CF validator + public render) | Medium | **Yes** | ⏸ Flagged — needs backend (Cloud Function) decision; not done in autonomous loop. |
| 5 | P3 | Course "level" field | Low | Yes | ⏸ Note only — backend-coordinated. |

---

## 6. Guardrails (honored this session)

- **No invented data / revenue** — covers, prices, progress all come from real Firestore/Storage paths.
- **No schema/Cloud-Function changes inside the autonomous loop** — items needing `updateTeacherCourseBuilder` contract changes (outcomes, level) are flagged, not silently attempted.
- **Loop-safe React** — `react-hooks` recommended-latest is strict here (`set-state-in-effect`, `purity`, `refs` all active); all new async lives in event handlers; derived UI state is computed purely in render.
- **Validate + commit incrementally** — lint + tsc + build + tests before each commit; never deploy (founder controls deploys).
- **Secrets** — keys leaked earlier in chat are to be rotated by the founder; nothing credential-bearing is written to the repo.
