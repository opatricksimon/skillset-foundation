# BLOCKERS — precisa de você

> Sessão autônoma 2026-05-19. Itens que NÃO consigo fazer sozinho.
> Para cada um: o que é, por que travou, e o passo EXATO pra desbloquear.

## B1 — Chaves Stripe TEST + LIVE (P1)
**Por quê:** segredos reais não estão nesta sessão (estavam no Claude Desktop, sem acesso).
**Desbloqueio:** seguir `STRIPE_CHECKLIST.md` itens 1 e 2. Em resumo:
1. dashboard.stripe.com → Developers → API keys → copiar Secret key
2. terminal do projeto: `firebase functions:secrets:set STRIPE_SECRET_KEY`
3. Developers → Webhooks → criar endpoint `https://us-central1-skillsetusaofficial.cloudfunctions.net/stripeWebhook` com os 4 eventos listados
4. copiar Signing secret → `firebase functions:secrets:set STRIPE_WEBHOOK_SECRET`
**Status código:** pronto. Só falta o segredo.

## B2 — Confirmar URL real do webhook (P1)
**Por quê:** a URL Gen2 pode ter formato `*-uc.a.run.app` em vez de `cloudfunctions.net`.
**Desbloqueio:** rodar `firebase deploy --only functions` e usar a URL que ele imprime para `stripeWebhook` no endpoint do Stripe. Trivial, 1 min.

## B3 — Ativar LIVE na Stripe (P1)
**Por quê:** regra de execução #4 — ativar pagamento em produção é ação destrutiva/sensível; não faço sozinho.
**Desbloqueio:** `STRIPE_CHECKLIST.md` item 5, só depois do item 4 (TEST) verde.

## B4 — API key do provedor de e-mail (P4)
**Por quê:** envio de e-mail de verificação. **Mitigado:** implementei com **Firebase Auth `sendEmailVerification`** (nativo, NÃO precisa de provedor externo nem key). Só fica em aberto se você quiser e-mail transacional custom (template próprio) — aí precisaria de Resend/SendGrid key. Por ora NÃO é bloqueante; está usando o nativo.
**Desbloqueio (opcional, futuro):** decidir provedor e me dar a key; trocar o template.

## B5 — Imagens de inspiração (P2/P3/P5/P6)
**Por quê:** 140 screenshots — analisar todas estoura o contexto. Amostrei um subconjunto representativo.
**Desbloqueio:** não bloqueia; se algum detalhe específico ficou de fora, aponte a imagem exata na revisão e eu refino.

## B6 — Confirmar causa-raiz do bug da foto de perfil (P1)
**Por quê:** corrigi os defeitos de código e removi o silenciamento de erro,
mas não consigo autenticar como seu usuário para reproduzir em runtime.
**Desbloqueio (5 min quando acordar):**
1. `npm run dev`, logar, ir em conta → trocar foto de perfil.
2. Abrir DevTools → Console. Agora o erro real aparece (antes era engolido).
3. Me mandar a mensagem exata do console na próxima sessão. Com ela eu fecho
   a causa (regra Firestore, dado legado de username, ou bucket env) em 1 fix.
**Status:** defeitos de código corrigidos e no ar; falta só confirmar o gatilho.

## B7 — Sistema de planos/assinatura (Free/Starter/Pro/Plus)
**Por quê:** é um subsistema novo (Stripe Billing), não código solto.
Depende de você: (1) criar os **Products/Prices** no painel Stripe para
cada tier (recorrente mensal/anual) e me passar os Price IDs; (2) confirmar
o mapeamento tier→comissão (mencionou Free 8% / Starter 4% / Pro 1% /
Plus 0%) — isso liga no `platformFeeBps` que já existe.
**Desbloqueio:** Stripe Dashboard → Product catalog → criar 4 produtos com
preço recorrente → me dar os `price_...` IDs + confirmar os %.
**Quando desbloquear:** implemento Checkout `mode:subscription` + Customer
Portal + página "Planos e taxas" + badge "Upgrade" no menu de perfil +
seção de planos na home. Spec resumida em DECISIONS D12.
**Status:** menu de perfil já está no topo-direito (feito); a entrada
"Planos e taxas"/upgrade entra quando os Price IDs existirem.

---
_Atualizado conforme a sessão avança._
