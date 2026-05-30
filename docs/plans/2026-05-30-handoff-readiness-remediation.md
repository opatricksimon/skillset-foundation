# Skillset — Handoff-Readiness Remediation Plan

**Objetivo:** Fechar todos os defeitos que impedem o fundador de entregar a plataforma a um investidor para logar e usar end-to-end — garantindo que cada botão leve a algum lugar e cada fluxo chegue ao fim, sem travar no meio.

**Origem:** Auditoria orquestrada (workflow `skillset-completeness-audit`, run `wf_319e2c44-db2`, 29 agentes, 8 superfícies front + back + varredura mecânica + verificação adversarial). 40 achados brutos → 40 dedup → 20 blocker/major verificados → 19 confirmados, 1 refutado, + 20 menores.

**Arquitetura:** Next.js 16 / React 19 / TS (SSR via firebase-frameworks) + Cloud Functions 2nd-gen (Node 22, us-central1) + Firestore rules + Stripe Connect marketplace + assinatura por tiers. Repo canônico: `C:/Users/nicae/aiox-core/projects/skillset-foundation` (NUNCA a cópia OneDrive).

**Veredito de prontidão (síntese do enxame):**
> Não. Padrão sistêmico "create-without-manage" + "buy-path dead-end" em toda superfície de receita. Maior risco = caminho do dinheiro: progresso `enrollment.progressPercent` é client-writable → aluno forja "completed" e mina certificado/refund-cap/review; admin não tem refund nenhum; GDPR (export/deleção) é escrito mas nunca cumprido; comprador não tem recibo. A transação central não é nem confiavelmente completável nem seguramente reversível.

---

## Classes de trabalho

- **CLASSE A — Defeitos reais** (consertar independente de tudo): integridade de dinheiro/credencial, lacunas de ciclo de vida (delete/cancel/revoke), filas de admin sem ação de cumprimento, recibos do comprador, hardening de webhook.
- **CLASSE B — Go-live de pagamento** (DECISÃO DO FUNDADOR): pagamento está intencionalmente desligado. Ligar exige flip de flags + publishable key + deploy de functions + fiar a CTA do catálogo + cursos demo reais + **$1 Stripe LIVE smoke (fisicamente do fundador)**. Pode ficar como "coming soon" honesto para o demo.

---

## DECISÃO ÚNICA NECESSÁRIA — Pagamento no demo do investidor

| Opção | O que acontece | Risco | Esforço |
|---|---|---|---|
| **A (recomendada) — "Coming soon" honesto** | Conserto TODA a Classe A. Pagamento fica desligado mas honesto: tiro/escondo botões "priced-but-unbuyable", deixo estados desabilitados claríssimos, removo páginas de curso demo pagas que parecem compráveis. Go-live vira passo separado que você dispara. | Baixo. Sem Stripe LIVE. | — |
| **B — Pagamento ao vivo no demo** | Tudo da A + fio a CTA do catálogo (`startCourseCheckout`), threado plano no signup→onboarding→upgrade, seto publishable key + `NEXT_PUBLIC_PAYMENTS_CHECKOUT_ENABLED=true`, sementeio cursos demo como docs reais, e **você roda o $1 LIVE smoke + cuida da key**. | Médio-alto (Stripe LIVE, key rotation). | +M |

> O resto do plano (Classe A) é idêntico nas duas opções. A escolha só muda a Onda 5.

---

## Ondas de execução

Cada onda é uma unidade coerente de deploy. Disciplina por onda: `cd functions && npx tsc --noEmit` → `npx eslint <arquivos>` (da raiz) → `npx vitest run` (da raiz, +testes novos) → `npm run deploy:full` (functions+hosting+rules juntos) → commit convencional → push main. **Atenção ao defeito `deploy:full &&`**: se `deploy:app` falhar, as rules são puladas — rodar `deploy:rules` separado e confirmar release.

### ONDA 1 — Integridade de dinheiro & credencial (BLOCKERS, security-critical) — back-heavy
**Por que primeiro:** é o risco que torna a transação central insegura; tudo que depende de progresso confiável vem depois disto.

1. **Progresso server-authoritative** (blocker) — mata `progressPercent` forjável.
   - Back: nova callable `recordLessonProgress` (ou trigger `onDocumentWritten('enrollments/{id}/progress/{lessonId}')`) que recomputa `progressPercent` + flag `completed` a partir da subcoleção `progress` vs `course.lessonCount`.
   - Rules: `firestore.rules` `userCanUpdateOwnedEnrollment` (≈673-688 / 1497) → proibir cliente escrever `progressPercent`/`status` (permitir só `lastLessonId`/`updatedAt`).
   - Front: `src/lib/data/enrollments.ts:132` `updateEnrollmentProgress` passa a chamar a callable em vez de `updateDoc`.
   - Efeito: `issueSkillsetCertificate` (index.ts:2045), refund-cap (index.ts:1725, cap=50 em payment-rules.ts:5), review-gate (index.ts:1477) passam a confiar em valor não-forjável.
2. **Refund de admin** (blocker) — operador consegue servir cliente.
   - Back: `issueAdminRefund({orderId, amountMinor?})` onCall — checa role `admin`, carrega order, `stripe.refunds.create` em `order.paymentIntentId` (total/parcial), atualiza order+enrollment+payoutLedger, `recordAuditEvent(AUDIT_ACTIONS.REFUND_ISSUED)` (ação já existe em functions/src/audit-log.ts).
   - Front: botão "Refund" por order em `src/components/admin/payment-operations-panel.tsx:70` (confirm + valor), nova fn em `src/lib/data/orders.ts`, espelhando o confirm de `managed-course-panel.tsx`.
3. **Race do payout na janela 'releasing'** (major) — refund pode transferir sem reverter.
   - Back: `releaseLedgerTransfer` (≈index.ts:1972/1991) re-lê o ledger em transação antes/depois de `transfers.create`; escreve `status:'released'` só se ainda `'releasing'`; OU amplia `shouldReverseReleasedTransfer` p/ tratar `'releasing'` reconciliando o estado real do transfer no Stripe (`handleChargeRefunded` index.ts:2490).
4. **Semântica de auditoria do refund** (minor, junto do #2) — `requestRefund` (index.ts:1818) renomeia ação de request-time p/ `REFUND_REQUESTED`; emite `REFUND_ISSUED/FULFILLED` dentro de `handleChargeRefunded` quando o estado realmente transita.

### ONDA 2 — Cumprimento GDPR + filas de admin acionáveis (compliance + operador serve cliente)
5. **GDPR cumprido** (blocker) — `requestDataExport`/`requestAccountDeletion` (index.ts:623/636) hoje só gravam `status:'pending'`, nada cumpre.
   - Back: `onDocumentCreated('accountActionRequests/{id}')` ou processador agendado — `data_export`: monta dados + envia/linka + `status:'completed'`; `account_deletion`: cascade transacional (disable auth user; delete/anonimiza users/{uid}, enrollments, reviews…) + status.
   - Front: controles Approve/Processing/Complete/Reject em `src/components/admin/account-action-requests-panel.tsx:46` via `updateAccountActionRequestStatus(id,status)` (rules:1629 já permitem isAdmin update/delete). Até o back pronto, copy honesta ("processado manualmente").
6. **Resposta de suporte** (major) — fila só muda status; usuário nunca recebe resposta (Promise page promete e-mail real em 24h).
   - Back/data: subcoleção `responses` ou callable `respondToSupportTicket({ticketId, message})` que grava resposta, transita status, e-mail ao requester (afrouxar `supportCanUpdateTicketStatus` rules:1040 ou rule/callable dedicada).
   - Front: textarea + Send no card de `src/components/admin/support-ticket-queue.tsx:51` + superfície de resposta no `support-ticket-center.tsx`.
7. **Dunning `invoice.payment_failed`** (major) — index.ts:2271 só `logger.warn`.
   - Back: gravar marker (`subscriptions/{id}.paymentState='past_due'` ou `users/{uid}.billingAlert=true`) p/ wallet renderizar banner; decidir política de comissão/entitlement antes do `subscription.updated` final.

### ONDA 3 — Create-without-manage (a classe do "botão delete", repetida)
8. **Delete de asset de curso** (major) — `src/lib/data/course-assets.ts:160` só upload/get/subscribe; vídeo/PDF/thumb errado fica preso.
   - Back: callable `deleteCourseAsset` (checa `uid===course.ownerId` + status editável, deleta Storage object + `courses/{id}/assets/{assetId}`, limpa `coverImageUrl` se era capa).
   - Front: `deleteCourseAsset(courseId, assetId)` + botões Delete/Replace em `lesson-content-modal.tsx:598-624` e `course-asset-uploader.tsx:360-426` (confirm, guarded by isEditable).
9. **Gestão de eventos ao vivo** (major) — `teacher-event-studio.tsx:103` só cria; data/Zoom errado fica preso na agenda do aluno.
   - Data: `updateCourseEvent(eventId, patch)` + `deleteCourseEvent(eventId)` em `src/lib/data/course-events.ts` (rules:1567-1570 já autorizam owner update/delete).
   - Front: Edit (reusa form) + Cancel/Delete por card; preferir `status:'cancelled'` (label já existe) p/ quem deu RSVP.
10. **Revogar enrollment manual de admin** (major) — `admin-enrollment-panel.tsx:53` só cria.
    - Front: lista "Granted enrollments" (`source in ['admin','manual_demo']`) + botão Revoke chamando fn que deleta/atualiza enrollment (rules:1499 já permitem isAdmin delete).
11. **Rule de moderação de curso** (major, rules-only) — admin approve/reject/unpublish caem no branch pesado `validCourseShape()` (~26 campos, ~1000-expr) e dão PERMISSION_DENY em docs legados.
    - Rules: adicionar `adminCanUpdateCourseStatus() = isAdmin() && validCourseStatus() && courseChangedOnly(['status','reviewNote','updatedAt'])` PRIMEIRO no update de courses (antes de validCourseShape), igual aos predicados de teacher. Sem mudança de front.

### ONDA 4 — Recibos do comprador + higiene de checkout
12. **Histórico de compras/invoices** (major) — `billing-tabs.tsx:48-66` são empty states estáticos mesmo com orders existindo; compra avulsa não aparece nem no portal Stripe.
    - Front: aba Purchases assina orders do usuário (query buyer-scoped em `src/lib/data/orders.ts` por uid de `src/domain/order.ts`), renderiza título/valor/status/data/recibo; Invoices via `openBillingPortal()` (assinaturas) + recibos avulsos das orders.
    - Back: confirmar rules de leitura do próprio order + índice composto.
13. **Certificado: emissão confiável** (major) — `learn-credentials-hub.tsx:283-287` tem botão "Issuance queued" permanentemente DESABILITADO; emissão só dispara 1x em `enrolled-course-workspace.tsx:359-372` sem retry.
    - Front: trocar por botão ativo que chama `issueSkillsetCertificate(candidate.enrollmentId)` (já importado em `src/lib/data/certificates.ts`) com loading/erro/sucesso; `onSnapshot` vira p/ 'issued' sozinho. + "Retry issuance" quando elegível.
    - Back (resiliência, opcional): emitir também via webhook/reconciler agendado.
14. **Orders pendentes órfãs** (minor) — `index.ts:1246` cria order 'pending' antes do Stripe; abandono pode orfanar.
    - Back: sweeper agendado marcando pending >24-48h 'expired' (ou deferir criação p/ `checkout.session.completed`); corrigir `cancel_url`.

### ONDA 5 — Pagamento (depende da DECISÃO acima)
**Se Opção A (coming soon honesto):**
- Front: estados desabilitados inequívocos; parar de static-gerar páginas de curso demo pagas compráveis (drop `generateStaticParams` p/ demos pagos ou redirect p/ marketplace live), p/ nenhuma página "priced-but-unbuyable" ser servida (`course-enrollment-cta.tsx:129-143`, `src/app/courses/[slug]/page.tsx`, `src/data/demo/courses.ts`). Documentar em DEPLOY.md.

**Se Opção B (ao vivo):**
- Front: `course-enrollment-cta.tsx` branch `paid_checkout_required` → botão ENABLED chamando `startCourseCheckout(course.id)` (espelha `creator-course-detail.tsx:153`) com isSubmitting/erro; OU rotear todo curso pago do catálogo pelo checkout do CreatorCourseDetail (caminho único de compra). Garantir que demoCourses tenham `courseId` resolvível por `createCheckoutSession`, OU sementear demos como cursos publicados reais.
- Front: threled `plan` query param: `pricing/page.tsx:125` → `/auth?...&plan=<id>` → signup-form → onboarding; `completeUserOnboarding` (user-profiles.ts:208) redireciona seleção paga p/ `/account/billing/upgrade?plan=<id>`.
- Config: `NEXT_PUBLIC_PAYMENTS_CHECKOUT_ENABLED=true` + publishable key em `.env.production` (DEPOIS da fiação da CTA, senão flag ligada ainda dá botão desabilitado).
- **FUNDADOR:** $1 Stripe LIVE smoke + key handling/rotation.

### ONDA 6 — Polimento (lote de minores visíveis ao investidor)
Cherry-pick dos investor-visible: Help search (`help/page.tsx:146`) habilitar filtro client-side ou remover barra "coming soon"; `/instructors` placeholder (`instructors/page.tsx:13`) condicionar a fetch real; download/print do certificado emitido (`learn-credentials-hub.tsx:288-295`); 2FA stub (`security-settings-panel.tsx:238-244`) atrás de flag/Roadmap; rate-limit em `verifySkillsetCertificate` (index.ts:2108); log explícito quando `POSTHOG_SERVER_KEY` ausente (posthog.ts:27); validação de `PLAN_PRICE_MAP` (index.ts:2611). Backlog (não-visível): campos de schema mortos (`thumbnailAssetId`/`coverAssetId`), `createTeacherStripeAccountLink` deprecado, TODO de analytics em `billing/return/page.tsx:27`.

---

## Protocolo de validação & deploy (toda onda)
1. `cd functions && npx tsc --noEmit`
2. `npx eslint <arquivos tocados>` (da raiz)
3. `npx vitest run` (da raiz) — adicionar testes p/ novos helpers puros / domínio (callables não são unit-testadas; só helpers puros são).
4. `npm run deploy:full` (functions+hosting+rules). Se `deploy:app` falhar → rodar `deploy:rules` separado e confirmar release.
5. Commit convencional + `git push origin main`.
6. Onda que toca `firestore.rules` → confirmar "rules released".

## Founder-gated (eu paro aqui)
- $1 Stripe **LIVE** smoke; rotação de keys; teste real de login de professor na máquina do fundador; qualquer coisa que precise da máquina/credencial física do fundador. Onda 5-B inteira depende disto.

## Refutado (não mexer)
- "Checkout onboarding guard bypassável por stale account" — `course.stripeConnectedAccountId` nunca é setado em lugar nenhum, então a igualdade sempre cai no owner e o guard sempre roda. Gap defensivo latente, não fluxo quebrado.
