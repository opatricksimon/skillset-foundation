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
2. **Rotas `/onboarding` e `/platform`: NÃO mexer (verificado 2026-05-15).** `/onboarding` agora é o gate de ativação teacher streamlined. `/platform` foi VERIFICADO como o "Home" autenticado ativo — referenciado em sidebar nav (`data/site.ts`), mobile drawer, path "Use both sides" do onboarding, `not-found.tsx` e teste. NÃO é órfão; redirect/deleção quebraria navegação. Recomendação anterior de redirect CANCELADA.
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

## Verificação de surfaces Cakto-modelados (2026-05-15, executor)

Revisão estática profunda dos surfaces autenticados (nunca testados por browser, per completion report):
- `status-banner.tsx`: CORRETO. `user.emailVerified` existe em SkillsetUser e mapFirebaseUser seta. Banners (email/teacher-terms/stripe) funcionam.
- `platform-shell.tsx`: CORRETO. Sidebar colapsável + hover-expand + StatusBanner + MobileDrawer + HelpBubble + ThemeProvider corretamente wired.
- Componentes Cakto verificados existir e estar mergeados em main (e84701e) e deployados hoje.
- Conclusão: implementação Fase 6 é de boa qualidade. Não há defeitos de código-only de alto valor restantes. Loop autônomo de código atingiu término legítimo.

## PLANO DE AÇÃO — o que falta para o aprimoramento (precisa do founder, não de mais código)

**P0 — Validação (só você ou browser interativo):**
1. Entrar LOGADO em https://skillsetusaofficial.web.app, ir a /teach e /learn. Ver a sidebar colapsável, status banner, notification bell, revenue milestone, dashboard — telas Cakto-modeladas que suas screenshots de 13-14 mai NÃO mostravam (pré-deploy).
2. QA de browser: clicar tudo, colapsar sidebar, dark mode toggle, criar curso via modal, fluxo onboarding wizard. Anotar defeitos REAIS.
3. Mandar screenshots SÓ dessas telas autenticadas pós-deploy se houver problema.

**P1 — Conteúdo (só você):**
4. Criar 2-3 cursos seed reais (Teacher Studio). Sem isso dashboard/marketplace ficam vazios mesmo bem modelados. Valida loop teacher→student.

**P2 — Go-live (após P0/P1):**
5. Cutover Stripe LIVE via docs/stripe-go-live-runbook.md (5 min, runbook pronto).
6. QA de pagamento real ($1 test).

**Como o loop retoma:** você desbloqueia um item (ex: "fiz QA, /teach tem bug X" ou "criei os cursos seed") e eu sigo a cadeia de polish a partir de defeito REAL observado — não de suposição.
