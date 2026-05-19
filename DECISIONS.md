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

## D5 — Bug da foto de perfil: corrigir defeitos comprováveis + tornar observável
**Contexto:** "foto não sobe / não aparece". Raciocínio profundo: o fluxo tem
**3 pontos que engoliam o erro** (`.catch(()=>undefined)` no mirror Auth, `catch {}`
vazio no painel mostrando "imagem muito grande" mesmo quando o problema é outro,
e `??` que não trata string vazia). Sem rodar como seu usuário (sem credencial),
não dá pra afirmar deterministicamente qual branch dispara (regra Firestore vs
dado legado de `username` inválido de signups antigos vs bucket env).
**Decisão:** corrigir os defeitos de código provados (logging com contexto,
mensagem de erro real, fallback de string vazia, null-guard de pathname) e
**tornar a causa observável** no seu próximo teste, em vez de "consertar no
escuro" e alegar resolvido sem verificação.
**Alternativa descartada:** mexer nas regras do Firestore por chute (poderia
enfraquecer segurança sem evidência).
**Por quê:** honestidade de engenharia — não afirmo "resolvido" sem verificar.
Ver BLOCKERS B6.

## D6 — Escopo da noite: P1 100% sólido > P2–P6 superficial
**Decisão:** entregar P1 completo com padrão de code review (testes, sem
gambiarra) e, para P2–P6, produzir `INSPIRATION_SPEC.md` (contrato de design
acionável) em vez de implementar UI de 140 telas às pressas.
**Alternativa descartada:** implementar parcialmente homepage/onboarding/
dashboards numa única sessão.
**Por quê:** suas próprias regras — "termina cada P o máximo que dá sozinho
antes de pular" e "Qualidade > velocidade. Sempre." UI meia-feita a partir de
imagens sem revisão seria a gambiarra que você proibiu. P2–P6 ficam
especificados e prontos para execução na próxima sessão.

<!-- novas decisões anexadas conforme a sessão avança -->
