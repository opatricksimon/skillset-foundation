# DECISIONS — escolhas feitas sozinho

> Sessão autônoma 2026-05-19. Onde houve ambiguidade, escolhi a opção mais
> simples/conservadora. Você revisa e reverte se discordar.

## D1 — Taxa Stripe: heurística US vs internacional
**Decisão:** `currency === "USD"` ⇒ 2.9%+$0.30; qualquer outra moeda ⇒ 3.9%+$0.30.
**Alternativa descartada:** detectar país real do cartão (só conhecido após o pagamento, tarde demais pro cálculo do ledger).
**Por quê:** simples, determinístico no checkout, erra a favor da plataforma em borda.

## D2 — Sem application_fee_amount
**Decisão:** manter `separate_charges_and_transfers`; taxa refletida reduzindo o transfer (`netAmountMinor`).
**Alternativa descartada:** migrar para destination charges com `application_fee_amount`.
**Por quê:** mudança de arquitetura de cobrança sem sua supervisão é arriscada. Funcionalmente equivalente para o resultado financeiro. Anotado para sua revisão.

## D3 — Hold de payout = 7 dias exatos
**Decisão:** `payoutReleaseDelayDays = 7`, igual à janela de reembolso.
**Alternativa descartada:** 7 + folga (ex.: 8-10) para garantir que o reembolso processou.
**Por quê:** você pediu explicitamente "logo após D+7". Conservador o suficiente; revisável numa linha.

## D4 — E-mail de verificação via Firebase nativo
**Decisão:** usar `sendEmailVerification` do Firebase Auth no fim do cadastro.
**Alternativa descartada:** Resend/SendGrid (exigiria sua API key — bloquearia P4).
**Por quê:** zero dependência externa, zero decisão sua, já temos Firebase. Template custom fica para depois (ver BLOCKERS B4).

<!-- novas decisões anexadas conforme a sessão avança -->
