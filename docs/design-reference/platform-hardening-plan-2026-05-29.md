# Platform-Wide Hardening — Implementation Plan

> **Date:** 2026-05-29
> **Author:** Autonomous session (Claude, senior-engineer mode, founder-greenlit)
> **Mandate (verbatim intent):** recruit what needs doing across the whole platform, plan like a senior engineer, execute wave by wave **without pausing or asking for validation**, validate incrementally, then **deploy (functions+hosting together) and verify**.
> **Builds on:** `course-creation-ux-audit-2026-05-28.md` (course-creation backlog — 100% closed). This plan covers the *rest* of the 62-page platform.

**Objetivo:** Eliminar dead-ends, remover dados inventados, e fechar buracos de estado (loading/empty/error) nas superfícies de aluno, professor, conta, auth e marketing — deixando a plataforma honesta, navegável e green em todos os gates.

**Arquitetura da abordagem:** Ondas temáticas ordenadas por (1) desbloqueio de gate, (2) quebrado-antes-de-polido, (3) impacto. Commit por sub-grupo lógico, validação incremental (lint + tsc + tests; build nas fronteiras de onda). Deploy functions+hosting juntos no fim — **nunca hosting-only** (loop de autosave dos outcomes).

**Baseline (2026-05-29):** lint 0 · tests 70/70 · build EXIT 0 · **tsc 12 erros (só em test files)**.

---

## Guardrails (inalteráveis)

- **No invented data** — nada de métrica/receita/social-proof fabricada. Dado real do Firestore ou remove/rotula honestamente.
- **Loop-safe React** — `react-hooks` recommended-latest ativo (`set-state-in-effect`, `purity`, `refs`). Async só em event handlers; estado derivado puro no render.
- **Validar antes de commit** — lint + tsc + tests verdes por commit.
- **Deploy** — `firebase deploy --only functions,hosting` no fim. Nunca `deploy:hosting` sozinho.
- **Secrets** — nada credential-bearing no repo.

---

## Wave 0 — Green the typecheck (desbloqueia o gate tsc)

**Arquivos:** `vitest.config.ts` / `vitest.setup.*` / `tsconfig.json` (a confirmar), `src/app/marketing.test.tsx`, `src/app/platform-pages.test.tsx`.

- [ ] **0.1** Localizar setup do vitest + tsconfig de teste.
- [ ] **0.2** Ligar a augmentation de tipos do `@testing-library/jest-dom` no vitest (import `@testing-library/jest-dom/vitest` no setup + types no tsconfig) → `toBeInTheDocument` etc. tipados.
- [ ] **0.3** `npx tsc --noEmit` = 0 erros; `npm test` ainda 70/70; lint 0. Commit.

---

## Wave 1 — Broken core flows (P0 dead-ends, sem fake data)

- [ ] **1.1** `src/domain/enrollment.ts:75` — link de comunidade sempre aponta `/learn/community/creator?courseId=…`; cursos demo caem em "Course record not found". Ramificar href: demo slug → `/learn/community/[slug]`; creator → `/learn/community/creator`.
- [ ] **1.2** `src/components/teacher/teacher-wallet-panel.tsx:206` — "View sales" → `/teach/sales` (404, não existe list page). Repontar para superfície existente (ex.: `/account/payments`) ou criar list page mínima.
- [ ] **1.3** Cluster contato/suporte (maior win de marketing):
  - `src/app/contact/page.tsx` — sem mecanismo de contato. Adicionar `mailto:` por categoria (mínimo honesto) ou form.
  - `src/components/site/site-footer.tsx:30` + `src/app/support/page.tsx` — footer "Contact support" → `/support` auth-gated; deslogado bate em login. Repontar footer/help para canal público funcional.
  - `src/components/auth/protected-surface.tsx:46` — "Contact support" → `/contact`; corrigir junto.
- [ ] **1.4** `src/components/auth/login-form.tsx:127` & `signup-form.tsx:282` — botão "Continue with Apple" inerte ("opens next week"). Remover (ou gate por feature-flag) até OAuth existir.
- [ ] **1.5** `src/components/courses/course-enrollment-cta.tsx:145-160` — verificar se curso pago com `priceAmountMinor: null` pode escapar e ganhar acesso grátis; adicionar assertion free-only antes de `createManualEnrollment`.
- [ ] Validar (lint+tsc+tests) + commit por sub-grupo.

---

## Wave 2 — Remove invented data (P0 no-invention)

- [ ] **2.1** `src/components/teacher/teacher-overview-metrics.tsx` — deltas hardcoded (`+0.0%`, `"vs prev period"`, l.118-140), card "Completion" stub `0%` (l.172-173), e sparklines decorativas `kpiSparks` (l.18-23,184). Computar real a partir de `paidOrders`/enrollments, ou remover delta/sparkline/completion até haver dado.
- [ ] **2.2** `src/components/account/account-settings-hub.tsx:212-293` — toggles de notificação/learning são `useState` local sem persistência. Persistir no profile do usuário **ou** rotular honestamente como preview + desabilitar. (Decidir por persistência se o write path já existir; senão preview.)
- [ ] **2.3** `src/lib/data/catalog.ts:94` & `src/lib/data/published-courses.ts:139` — verificar se "Preview coming soon" / "Created by an approved Skillset educator" são placeholders honestos vs social-proof fabricada. Se fabricada, derivar de dado real ou omitir.
- [ ] Validar + commit.

---

## Wave 3 — Missing async states + correctness (P1)

- [ ] **3.1** Error states em subscriptions silenciosas (`onError` = `() => {}`): `teacher-overview-metrics.tsx:37-74`, `teacher-studio-dashboard.tsx:28,36`, `teacher-studio-insights.tsx:50,58`, `learner-overview-metrics.tsx:57`. Adicionar UI de erro + `setLoading(false)` no `onError`.
- [ ] **3.2** Loading skeletons: `teacher-studio-dashboard.tsx:14-37` (flash "0 published courses"), `src/app/account/page.tsx:16` (`Suspense fallback={null}`).
- [ ] **3.3** `src/components/learn/learn-dashboard.tsx:212` — "Next lesson" hardcoded `modules[0].lessons[0]`; usar `getNextCourseLesson` com IDs completos (igual `enrolled-course-workspace.tsx:246`).
- [ ] **3.4** `src/app/account/billing/return/page.tsx:22-53` — afirma sucesso de pagamento sem verificar `session_id`. No mínimo tornar a copy honesta/condicional; idealmente resolver server-side.
- [ ] **3.5** `src/components/account/account-panel.tsx:43` + `src/app/account/email/page.tsx:4` — link de email → `tab=security`; corrigir para `tab=account`.
- [ ] **3.6** `src/components/teacher/sale-detail.tsx:283-291` — "Issue refund" permanentemente disabled e `/teach/refunds` só redireciona; linkar fluxo real ou esconder o botão.
- [ ] **3.7** `src/components/teacher/teacher-studio-insights.tsx:107-117` — tabs de range (30d/3m/12m/All) sem `onClick`; ligar ao state ou renderizar como label estático.
- [ ] **3.8** `learn-events-hub.tsx:287` (+ community events) — "Join external session" sem guard de URL vazia → no-op silencioso; renderizar só com URL.
- [ ] Validar + commit por sub-grupo.

---

## Wave 4 — Polish, a11y, consistency (P2)

- [ ] **4.1** `src/app/teach/{coupons,team,co-productions,integrations,media}/page.tsx` — 5 stubs `redirect()` (bounce silencioso) → renderizar `TeacherComingSoonPanel` (honesto, já existe).
- [ ] **4.2** a11y: `account-settings-hub.tsx:347-354` ToggleRow sem nome acessível (`aria-label`); `course-review-panel.tsx:93` rating → `role=radiogroup/radio` + `aria-checked`.
- [ ] **4.3** `src/components/teacher/teacher-media-library.tsx:184` — CTA `/teach?newCourse=1` ignorado → `/teach/builder?newCourse=1`.
- [ ] **4.4** `src/app/learn/community/[slug]/page.tsx:18-24` — nome/desc genéricos; resolver título real do catálogo por slug.
- [ ] **4.5** `src/components/teacher/sale-detail.tsx:179,199` — order# = doc ID cru e learner só "User ID"; ref amigável + resolver profile (se houver dado).
- [ ] **4.6** `learn-events-hub.tsx:182` — RSVP travado em "Checking your RSVP..." quando sem user; resetar loading.
- [ ] **4.7** `src/components/teacher/revenue-milestone-strip.tsx` — componente morto; wire com dado real ou deletar.
- [ ] **4.8** `src/components/site/site-nav.tsx:17-19` — comentário stale sobre `/courses` vazio; atualizar.
- [ ] Validar + commit.

---

## Wave 5 — Final validation + deploy

- [ ] **5.1** Full gate: lint 0 · `tsc --noEmit` 0 · tests verdes · `next build` EXIT 0.
- [ ] **5.2** `firebase deploy --only functions,hosting --project skillsetusaofficial` (functions+hosting juntos).
- [ ] **5.3** Verificar produção: home + uma rota de cada cluster carregam sem erro de console; confirmar.
- [ ] **5.4** Relatório de sessão + atualizar este plano com commits.

---

## Execution mode

**Execução Direta autônoma, esta sessão** (founder pré-autorizou sem pausas). Disciplina `executing-plans`: um sub-grupo por vez, validação incremental, commit atômico, sem pedir aprovação entre ondas.

---

## Execution Log — 2026-05-29 (COMPLETO)

**Resultado:** todas as 6 ondas (0–5) executadas e deployadas. Gate final verde, produção confirmada.

### Commits por onda

| Onda | Commit(s) | Resumo |
|------|-----------|--------|
| 0 — Green tsc | `8c03a6f` | jest-dom matcher types → `tsc --noEmit` 0 erros |
| 1 — Broken flows | `d6b6a25`, `d80ec0c`, `8c5eaed` | contato/suporte acessível + remoção do Apple sign-in inerte; enrollment demo → community por slug; `/teach/sales` list page (fecha 404 do wallet) |
| 2 — No invented data | `88f9839` | métricas reais (deltas/sparklines/completion) + persistência real dos toggles de settings |
| 3 — Async + correctness | `7ca7fb4` | onError em subscriptions (logSubscriptionError); skeletons; next-lesson real; billing/return condicional ao session_id; email tab fix; refund mailto; revenue range tabs; **guard de URL (getSafeExternalUrl) anti-stored-XSS em 5 sites** |
| 4 — Polish/a11y | `63cf22e` | 5 stubs redirect → ComingSoonPanel (e `/teach/media` agora renderiza a media library real); rating radiogroup; community title real por slug; order ref amigável + account ID copiável; RSVP loading fix; deleta revenue-milestone-strip morto; comentário stale do site-nav |

### Gate final (5.1)

- lint: **0** · `tsc --noEmit`: **0** · vitest: **74/74** · `next build`: **EXIT 0**
- (baseline da sessão era 70/70; +3 testes `getSafeExternalUrl` +1 `getNextCourseLessonAfter`)

### Deploy (5.2) — functions + hosting JUNTOS

- `firebase deploy --only functions,hosting --project skillsetusaofficial` → **EXIT 0**
- 20 Cloud Functions atualizadas (stripeWebhook, createCheckoutSession, requestRefund, billing/connect, certificates, dailyReleaseTransfers, …) **+** SSR `ssrskillsetusaofficial` (Node 24)
- Nunca `deploy:hosting` sozinho → landmine do loop de autosave dos outcomes evitada.
- Hosting URL: https://skillsetusaofficial.web.app

### Verificação de produção (5.3)

- HTTP 200 em `/`, `/pricing`, `/courses`, `/promise`, `/auth`, `/legal/terms`, `/teach`, `/learn`, `/account` (SSR saudável, sem 500).
- Home renderiza a landing real; `/courses` entrega heading + marketplace (cards hidratam client-side sob Suspense, por design).

### Desvios deliberados (melhor resultado que o plano literal)

1. **4.1 `/teach/media`**: em vez de ComingSoonPanel, passou a renderizar a `TeacherMediaLibrary` real (componente Firestore-backed completo, estava órfão) — mais honesto que "em breve".
2. **4.7 `revenue-milestone-strip`**: deletado (não-usado; seedado em $0 renderizaria "$0/$100" decorativo) em vez de wire — alinhado ao guardrail no-invented-data.
3. **3.4 billing/return** e **4.5 sale-detail learner**: resolvido server-side só o que existe honestamente (session_id presente; nenhum profile de learner exposto ao seller por rules/privacidade) — sem inventar dados.
