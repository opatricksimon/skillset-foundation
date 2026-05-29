# Course-Creation UX Audit — Teacher Builder & Student Classroom

> **Date:** 2026-05-28
> **Author:** Autonomous session (Claude)
> **Scope:** The course-creation loop the founder flagged as priority — *"configurar bem a parte onde você vai criar os cursos… principalmente pensando na experiência de usuário para ser fácil e intuitivo para ele criar um curso, e o aluno ver o curso, tudo muito fácil e simples."*
> **Builds on:** `skillset-design-v2-analysis-2026-05-22.md` (macro analysis). This doc does **not** repeat that one — it drills into the teacher builder + student classroom with file:line evidence and a risk-tagged roadmap.
> **North star:** `_proto-v6` (extracted inspiration prototype). The prototype is the *aspiration*, not a spec — it has empty/placeholder areas and is missing things the real app already has (Stripe, drip, protected video, certificates, discussion).

---

## 0. TL;DR

The builder is **further along than it looks at a glance**. It already has a 7-stage left-rail stepper with done-checkmarks, an overall progress bar, a "next best action" hint, per-stage completion logic, a review-readiness checklist with jump-to-fix, and (as of this session) **autosave + a live save-state pill + an unsaved-changes (`beforeunload`) guard + guided Back/Continue navigation + an in-place 16:9 cover preview + an honest jump-and-scroll stepper + structured "what you'll learn" outcomes that flow teacher → marketplace**. The student classroom is genuinely strong (protected video, drip unlock, progress, per-lesson discussion, certificates, course resources).

The remaining course-creation friction is concentrated in a few concrete, fixable places:

1. **The course cover is in the wrong place, has no visual preview, and is mislabeled** — the single biggest "easy/intuitive" gap. *(P0)*
2. **The left-rail stepper is not fully honest** — clicking "Course cover" or "About" all dump onto the top of the Details tab with no scroll/anchor to the relevant section. *(P1)*
3. **~~No structured "what you'll learn" outcomes~~** — ✅ shipped this session (`e8989fe`): outcomes editor → public/preview/workspace render. *(P2 — done; deploy functions+hosting together, see §3.3)*
4. **~~Lesson editing is reachable from three overlapping surfaces~~** — ✅ shipped `56cb4a5` + `e98939c`: aside scoped to `course_cover` + `module_cover` only; per-lesson uploads exclusively in the Lesson Studio modal. *(P2 — done)*

---

## 1. What shipped this session (already committed)

| Commit | Change | Why it matters for course creation |
|--------|--------|-----------------------------------|
| `368e44e` | **Autosave drafts** + live save-state pill (`BuilderSaveStatus`: saving / unsaved / saved / failed) + total-duration display | Teachers were losing lesson text/settings edits that "save with the course draft" (`lesson-content-modal.tsx:518`). Autosave + a visible status removes the silent data-loss trap. |
| `0babe0c` | **Guided Back / Continue** footer nav across the 4 builder tabs | Linear "what do I do next" flow, matching the prototype's stepper progression. |
| `d35b524` | **Course cover field with live preview** at the top of the Details tab (P0) | Reuses `uploadCourseAsset({ kind: "course_cover" })`; the stepper's "Course cover -> Details" stage is now honored with a visible 16:9 preview. No backend change. |
| `a191da7` | **Honest stepper navigation** (jump-and-scroll to each named section) + **live summary char counter** (P1) | Clicking "Course cover" / "About" now scrolls to that exact section. Hook-safe (ref + `activeTab` effect). Counter shows progress to the 20-char review minimum. |
| `56cb4a5` | **Reframe asset panel as "Course media library"** (P2, step 1 / non-destructive) | Retitled from "Lesson upload"; clarifies it is the catch-all media manager and that per-lesson video/text/settings live in the lesson studio. Copy-only. |
| `e98939c` | **Scope aside to course & module covers only** (P2, step 2 / full consolidation) | Removes `lesson_video`, `live_recording`, `lesson_material`, `lesson_thumbnail` from `CourseAssetUploader`. Per-lesson uploads are now exclusively in the Lesson Studio modal. Aside keeps the full asset list view. 5 insertions, 91 deletions, ESLint 0, build EXIT 0, 70/70 tests. |
| `b075927` | **`beforeunload` guard for unsaved edits** (completes the data-loss story) | Autosave's 1800ms debounce window and the **failed-save** state both leave edits unpersisted; the browser now warns before a close/reload while the draft is dirty. Listener attaches only while `draftIsDirty` (no ref, no setState in body → loop-safe). Client-only; no backend/deploy coordination. |
| `e8989fe` | **Structured "what you'll learn" outcomes** (P2 — full vertical slice, founder-greenlit) | Teachers add up to 8 outcomes in the About section; they render on the public creator course page, builder preview, and enrolled workspace (replacing the hardcoded placeholder bullets). Domain + CF + builder + 2 render surfaces + unit test, all symmetric. **⚠️ Requires functions+hosting deployed together — see §3.3.** |

All validated: ESLint 0 problems, `next build` EXIT 0, **functions `tsc --noEmit` EXIT 0**, `npm test` **70/70** (67 + 3 new normalizer tests). Loop-safe patterns throughout (shared serializer for autosave; ref-held scroll target read only in handler/effect; `beforeunload` keyed on the pure `draftIsDirty` signal; `learningOutcomes` added symmetrically to payload + signature) — no `react-hooks/set-state-in-effect` / `purity` / `refs` violations. *(Note: two transient Windows-only failures during validation — a Turbopack worker socket crash and a vitest worker-pool IPC crash — both cleared on retry / serialized run; neither was a code defect.)*

**Data-loss prevention is now complete & well-rounded:** autosave (happy path) → explicit "Save failed — use Save draft" pill + always-visible manual Save button (`:1243`, `:2277`) → `beforeunload` guard (tab close / reload). No further work needed on this surface.

---

## 2. Teacher builder vs prototype — precise mapping

**Real builder:** 4 working tabs (`course-builder-studio.tsx:71-75`) presented through a **7-stage left-rail stepper** (`:86-92`) so the teacher sees a 7-step mental model over 4 panels.

| Prototype step (`_proto-v6/screens/Builder.jsx`) | Real builder stage (`builderStages`) | Lands on tab | Status |
|---|---|---|---|
| 01 Foundations (title, subtitle, level) | `basics` — Title, category | `details` | ✅ Present (title + categories) — *no "level" field* |
| 02 Cover (hero image) | `cover` — Hero image | `details` | ⚠️ **Stepper points to Details, but Details has no cover control** (see §3.1) |
| 03 About (promise + 4+ outcomes) | `about` — Promise, outcomes | `details` | ✅ Summary textarea **+ structured outcomes editor** (up to 8) — shipped `e8989fe` (see §3.3) |
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

### 3.3 — P2 · Structured "what you'll learn" outcomes — ✅ SHIPPED `e8989fe` (founder-greenlit)
- Prototype Step 03 is outcome-led (`whatYouLearn`, 4+ bullets). The real app previously had only one free-text `summary`; the `about` sub-label "Promise, outcomes" (`:88`) was aspirational. **Now delivered as a full vertical slice.**
- **What shipped (5 surfaces + test, all symmetric):**
  - **Domain** (`src/domain/teacher-course.ts`): `learningOutcomes?: string[]` on `TeacherCourse` + `UpdateTeacherCourseBuilderInput`, plus a shared `normalizeLearningOutcomes()` (trim, drop blanks, cap **8** × **120 chars**, preserve order) and exported `MAX_*` constants — one source of truth for client + render.
  - **Cloud Function** (`functions/src/index.ts`): CF-local mirror of the same normalizer; sanitize in `updateTeacherCourseBuilder` after `summary`, persist in the `transaction.update`, seed `[]` in `createTeacherCourseDraft`, and `learningOutcomes?` on `TeacherCourseRecord`. (CF can't import `@/`, so the rule is duplicated verbatim — keep the two in lockstep.)
  - **Builder editor** (`course-builder-studio.tsx`): an "What students will learn" editor in the About section — add/edit/remove rows, live `n/8` counter, empty state, disabled-at-max Add button. All mutations in event handlers (loop-safe).
  - **Loop-safe autosave**: `learningOutcomes` added **symmetrically** to `buildBuilderDraftPayload` *and* `builderDraftSignatureFromCourse` — payload and hydration baseline now agree, so the CF echo can't desync the dirty signal.
  - **Render**: public creator page (`creator-course-detail.tsx`, new "What you'll learn" section, hidden when empty) + builder preview + enrolled workspace (`lib/data/published-courses.ts` feeds the pre-existing `Course.outcomes` slot real data, with a 3-line generic fallback only when a teacher set none). 3 normalizer unit tests (`src/domain/learning-outcomes.test.tsx`).
- **⚠️ Deploy requirement that REMAINS (the footgun this slice was built around):** the builder's autosave baseline re-hydrates from the course `onSnapshot` on every echo, and the repo's only deploy script is `deploy:hosting` (functions deploy separately). If a **hosting-only** deploy ships the client without the matching CF, the loop is: dirty → autosave → CF drops `learningOutcomes` → snapshot echoes back *without* it → baseline recomputed without it → **dirty again → autosave loops forever** (burning writes, flickering the save pill). **Therefore this must be deployed functions-first, or functions+hosting together** — `firebase deploy --only functions,hosting`. Never hosting-only for this release. (Founder's review-before-deploy gate is the backstop; this note makes the ordering explicit so it isn't lost.)

### 3.4 — P2 · Lesson editing has three overlapping entry points — ✅ SHIPPED `56cb4a5` + `e98939c`
- Curriculum inline controls + the always-on "Lesson upload" aside (`:2204`) + the Lesson Studio modal (`:2209`, `lesson-content-modal.tsx`) all edit lesson material. Functional but dilutes the "one obvious place" principle.
- **What shipped (2 commits, non-destructive):**
  - `56cb4a5` — Retitled aside from "Lesson upload" / "Attach videos and materials" to **"Course media library"** with updated copy directing teachers to the Lesson Studio for per-lesson content. Copy-only, no logic changed.
  - `e98939c` — Scoped `CourseAssetUploader` to `course_cover` + `module_cover` only. Removed `lesson_video`, `live_recording`, `lesson_material`, `lesson_thumbnail` from `assetKinds`, `uploadPresets`, and `moduleTargetKinds`; removed `lessonId` state + `requiresLessonTarget` + lesson `<select>` JSX. `lessonId: null` is now hardcoded in the upload call. The asset list view (`AssetGroup`) still shows all existing lesson assets (read-only display — `allLessons` retained for name resolution). Net: 5 insertions, 91 deletions. ESLint 0, `next build` EXIT 0, 70/70 tests.
- **Result:** Per-lesson uploads (video, materials, thumbnail) are now exclusively in the Lesson Studio modal. The aside is the course-level media library. One obvious place per concern.

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
| 3 | P2 | Single canonical lesson editor (Lesson Studio modal); demote aside uploader | Medium | No | ✅ Shipped `56cb4a5` + `e98939c` — aside scoped to `course_cover` + `module_cover` only; per-lesson uploads exclusively in Lesson Studio modal. |
| 4 | P2 | Structured "what you'll learn" outcomes (field + CF validator + public render) | Medium | **Yes** | ✅ Shipped `e8989fe` — full vertical slice (domain + CF + builder editor + public/preview/workspace render + 3 unit tests), loop-safe. **⚠️ Deploy functions+hosting together (functions-first if separate) — a hosting-only deploy would loop autosave. See §3.3.** |
| 6 | P1 | `beforeunload` guard for unsaved builder edits | Low | No | ✅ Shipped `b075927` — completes the data-loss-prevention story (autosave + manual recovery + tab-close guard). |
| 5 | P3 | Course "level" field | Low | Yes | ⏸ Note only — backend-coordinated. |

---

## 6. Guardrails (honored this session)

- **No invented data / revenue** — covers, prices, progress all come from real Firestore/Storage paths.
- **No schema/Cloud-Function changes inside the autonomous loop** — items needing `updateTeacherCourseBuilder` contract changes (outcomes, level) are flagged, not silently attempted.
- **Loop-safe React** — `react-hooks` recommended-latest is strict here (`set-state-in-effect`, `purity`, `refs` all active); all new async lives in event handlers; derived UI state is computed purely in render.
- **Validate + commit incrementally** — lint + tsc + build + tests before each commit; never deploy (founder controls deploys).
- **Secrets** — keys leaked earlier in chat are to be rotated by the founder; nothing credential-bearing is written to the repo.
