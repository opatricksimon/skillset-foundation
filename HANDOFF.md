# HANDOFF — sessão autônoma 2026-05-19

Tratamento normal (sem "senhor"). Padrão de code review sênior aplicado.
Tudo validado e no GitHub. **Nada foi deployado** (deploy/LIVE = sua decisão).

## ✅ Concluído (P1 — 100%, com padrão de produção)

| Item | Estado | Commit |
|---|---|---|
| Taxa Stripe repassada ao professor | feito + testado | `01e8d5b` |
| Hold de payout 30 → 7 dias | feito | `01e8d5b` |
| `stripeFeeMinor` persistido no ledger | feito | `01e8d5b` |
| Módulo canônico `payment-split.ts` + 9 testes unitários | feito (obrigatório, padrão #8) | `978f63a` |
| Bug foto: erros deixam de ser engolidos, causa observável + fallback robusto | feito | `0a48290` |
| Retrofit: 8 catches de métricas agora logam com contexto (padrão #3) | feito | `5071f44` |
| STRIPE_CHECKLIST.md / TEST_RESULTS.md / script sim / BLOCKERS / DECISIONS | feito | `0a07b33` |
| INSPIRATION_SPEC.md (P2/P3/P5/P6) | feito | (este commit) |

Validação final: **lint 0 · 42/42 testes · next build OK · functions tsc OK.**
Split conferido: $100 USD → professor $81.80, plataforma $15.00, Stripe $3.20.

## ⛔ Bloqueado (precisa de você) — passo exato

Tudo detalhado em **`BLOCKERS.md`**. Resumo:
- **B1/B2/B3 — Stripe LIVE**: chaves + webhook secret estão no Claude Desktop
  (sem acesso). Siga `STRIPE_CHECKLIST.md` (campo por campo, onde clicar).
- **B6 — causa-raiz da foto de perfil**: `npm run dev` → trocar foto com
  DevTools/Console aberto → me mande a mensagem de erro real (agora ela
  aparece; antes era engolida). Fecho a causa em 1 fix.
- **B4 — e-mail**: NÃO bloqueia (usei Firebase nativo). Só se quiser template
  custom depois.

## 🧠 Decisões que tomei sozinho

Detalhe em **`DECISIONS.md`** (D1–D6). Destaques:
- D2: mantive `separate_charges_and_transfers` (sem `application_fee_amount`);
  fee refletido no transfer. Mudar arquitetura de cobrança sem você = risco.
- D5: bug da foto — corrigi defeitos provados + tornei observável; não
  "consertei no escuro" nem aleguei resolvido sem verificar.
- D6: P1 sólido > P2–P6 superficial. P2–P6 ficaram **especificados**
  (`docs/ai-handoff/INSPIRATION_SPEC.md`), não implementados às pressas.

## ▶️ Recomendado para a próxima sessão

1. Desbloquear B6 (5 min) — me dá o erro real do console; fecho o bug da foto.
2. Desbloquear B1–B3 — chaves Stripe TEST → rodar `scripts/stripe-test-e2e.mjs`
   em LIVE-TEST → validar split real → cutover LIVE.
3. P2 (homepage scroll single-page) seguindo INSPIRATION_SPEC — é o maior
   valor visível e não depende de você.
4. P3 onboarding reduzido (4–5 passos) + P4 e-mail nativo (já decidido).
5. P5/P6 dashboards (estender `platform-shell`/`platform-nav` já reformados).

## ⏱️ Esforço relativo por P (não horas reais)

- **P1**: ~85% do esforço da sessão (código + testes + validação + docs + bug).
- **P2–P6**: ~15% — análise de telas + spec acionável (implementação adiada
  conscientemente, ver D6).

## Estado git
`main` à frente do remoto anterior; pushes: `01e8d5b`, `0a07b33`, `978f63a`,
`0a48290`, `5071f44` (+ commit destes docs). Sem force push, sem reset,
nada deletado. Servidor dev pode ainda estar rodando em :3000 (background).
