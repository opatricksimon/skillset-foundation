# Skillset — Próximos Passos (grounded em verificação real)

Gerado pela sessão executora autônoma 2026-05-15. Base: tudo verificado no código + site live, não relatado.

## Estado real confirmado

- `main` deployado e live em https://skillsetusaofficial.web.app — 12 rotas públicas retornam 200, SSR funcionando.
- Fase 6 (31 commits) consolidada em main. Onboarding double-loop corrigido ponta a ponta.
- Stripe: TEST consistente, Connect habilitado, webhook LIVE pronto, runbook de cutover escrito.
- SEO: metadata por página (12) + sitemap.xml + robots.txt adicionados.
- Home e Pricing auditados como market-standard e completos.
- Lint, build (71 rotas), 33 testes: verdes.

## P1 — Antes de uso público sério (precisa de browser/QA real)

1. **QA de browser interativo** (não automatizável estaticamente): Lighthouse mobile nas páginas públicas, console-clean em DevTools, contraste do dark mode, fluxos reais Firebase (signup→onboarding→avatar upload→enrollment) e Stripe Connect em test mode com conta real.
2. **Rotas órfãs** `/onboarding` e `/platform`: manter `/onboarding` (agora é o gate de ativação teacher streamlined — NÃO deletar). `/platform` pode virar redirect para `/learn` (autenticado) ou `/` — precisa redirect testado.
3. **Seed de conteúdo real**: marketplace sem cursos reais. Founder precisa criar 2-3 cursos seed (não automatizável por código). Bloqueia validação do loop teacher→student.

## P2 — Qualidade de mercado

4. **OG images dedicadas** 1200×630 por surface-chave (home/pricing/promise/for-creators). Hoje usa o logo PNG como fallback. Requer geração de imagem (founder ou next/og).
5. **Copy diferenciador** no hero: "The marketplace for serious online courses" é correto mas genérico. Sem inventar números/cases. Opção: focar no diferencial real (review antes de publicar + 15% flat + payout transparente) no eyebrow/subhead.
6. **Microcopy de CTA**: "Get started free" não esclarece o que é grátis. Clarificar ("Free to join — pay only when you sell" para creators).

## P3 — Diferenciação

7. Stripe LIVE cutover (runbook pronto, 5 min) — somente após P1 QA passar.
8. Domínio próprio + DNS.
9. Observabilidade (Sentry/PostHog) — verificar se P5-BE-7 foi feito.

## Loop autônomo — ordem de continuação

A cada iteração: pegar o próximo item code-only/zero-regressão de P1→P3, executar, verificar (lint/test/build), commit, redeploy, registrar em changelog. Itens que exigem browser/founder ficam marcados como bloqueados e a sessão informa explicitamente.
