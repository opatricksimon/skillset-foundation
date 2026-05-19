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

## D7 — P2 home: âncoras só nas seções que existem; Pricing = rota real
**Decisão:** o header da home vira scroll-âncora para as seções que JÁ existem
(How it works, Capabilities, Promise, For creators). "Pricing" continua link
de rota real (`/pricing`) — exceção permitida pela spec.
**Alternativa descartada:** criar uma seção de preços na home.
**Por quê:** não existe seção de preço na home e a reforma anterior removeu
explicitamente conteúdo fabricado (princípio anti-fake, padrão #4). Criar uma
seria inventar conteúdo. `/pricing` já é página real com conteúdo real.
**Implementação:** `SiteNav` ganhou prop opcional tipada `landingNav` (união
discriminada âncora|rota). Só a home passa → demais páginas inalteradas (zero
regressão). Scroll suave nativo via CSS já guardado por prefers-reduced-motion.

## D8 — P4 e-mail: já existia; só removi o silenciamento
**Decisão:** não reconstruí P4 — `signUpWithEmail` já enviava verificação e
há UI de status/reenvio em `security-settings-panel` e `onboarding-choice`.
Só corrigi o `.catch(()=>undefined)` (padrão #3).
**Por quê:** regra #2b — reusar o que já funciona, não recriar.

## D9 — P3: redução agressiva do onboarding (80/20)
**Contexto:** o wizard real é `OnboardingWizard` (/welcome), já estilo Cakto
(1 pergunta/passo, progresso, persiste `onboardingAnswers`). `OnboardingChoice`
(/onboarding, 710 linhas) é outra rota com referência — NÃO deletado (regra #1).
**Decisão:** reduzir as perguntas visíveis de até 7 (professor) / 4 (aluno)
para **2 (aluno: path + primaryGoal)** e **3 (professor: + alreadySold)**.
Removidas do fluxo: sourceOfDiscovery, monthlyRevenue, instagramHandle,
audienceSize — mas mantidas no código (tipos/renderer), reativáveis numa
linha em `getVisibleQuestions`.
**Alternativa descartada:** manter 4–5 (spec original) — você disse
explicitamente "tem muita pergunta… mais reduzido". Fui mais agressivo
conscientemente; trivial reverter.
**Por quê / cuidado:** mantém o maior valor de analytics (objetivo +
intenção de monetização) com mínimo atrito. Bug evitado: `OnboardingProgress`
tinha default 7 dots; passei `totalQuestions={questions.length}` para o
indicador acompanhar o total real.

## D10 — P5/P6: corrigir o contrato da sidebar (não reconstruir dashboards)
**Contexto:** a reforma anterior já entregou sidebar colapsável
(`useSidebarState`, `SidebarToggle`, `PlatformNav collapsed`) e os painéis
têm `*-overview-metrics`. `.platform-sidebar` já era `position: sticky`.
**Decisão:** P5/P6 = corrigir o **gap real** do contrato "sidebar fixa, só
o conteúdo rola": faltava `align-self:start` (a linha do grid esticava) e
limite de altura — em telas baixas/menu longo a sidebar era cortada. Uma
mudança de CSS na shell compartilhada atende P5 **e** P6 de uma vez.
**Alternativa descartada:** reescrever os dashboards de professor/aluno a
partir das imagens. Seria recriar o que a reforma já fez (regra #2b) e
arriscar regressão sem revisão sua.
**Por quê:** maior valor / menor risco. Polimento de conteúdo específico de
cada dashboard (cards extras das telas Cakto) fica como trabalho futuro
opcional — a casca e o contrato de layout estão corretos.

## D11 — Perfil no topo-direito do dashboard = reusar AccountMenu
**Contexto:** `PlatformHeader` não renderizava perfil nenhum (só sino + CTA);
avatar só vivia na sidebar. Queixa exata do founder.
**Decisão:** renderizar o `AccountMenu` JÁ existente (usado no site público)
no header do dashboard, ao lado do CTA. Não reescrevi o menu.
**Alternativa descartada:** criar um novo dropdown do zero.
**Por quê:** regra #2b (reusar antes de criar); zero regressão no `SiteNav`.

## D12 — Stripe Connect é "just-in-time", não no signup (resposta à pesquisa)
**Decisão/achado:** o código já NÃO força Connect no signup/login — só
bloqueia no momento em que um aluno tenta comprar de um professor sem
payout configurado (`createCheckoutSession`). O atrito hoje é só de
*mensagem* (how-it-works diz "connect Stripe Express"). Recomendação:
manter Connect adiado e só pedir quando o professor for publicar curso
pago/sacar. Padrão Stripe recomendado (deferred onboarding).
**Planos (Free/Starter/Pro/Plus):** são Stripe **Billing** (assinatura),
SUBSYSTEM SEPARADO de Connect. Modelo recomendado: Checkout
`mode:'subscription'` + Customer Portal p/ upgrade/downgrade; o tier
define o `platformFeeBps` (já existe em `payment-split.ts`: 8/4/1/0%).
Connect (receber) e Billing (pagar o plano) coexistem independentes.
Implementação plena depende de Price IDs do painel Stripe + confirmação
do mapeamento tier→fee (ver BLOCKERS B7).

## D13 — Logo: troca por tema via CSS, variante "mark", tamanho maior
**Decisão:** 3 assets em `public/brand/` (mark agnóstico, full-light navy,
full-dark branco). `LogoWordmark` renderiza ambas as full e mostra a certa
por `[data-theme="dark"]` em CSS puro (sem JS → sem flash/hydration). Nova
prop `variant="mark"` para a bola; sidebar colapsada usa a bola (não o "S").
Altura nav 20→32px (compact 40, default 48) — você disse "muito pequeno".
**Alternativa descartada:** trocar logo por hook de tema em JS (flash no
SSR) / um único arquivo (não cobre dark/light).
**Por quê:** CSS theme-swap é o padrão SSR-safe; reusa `LogoWordmark`
(regra #2b); `LinkLogo` mantido (sem deletar referência — regra #1), só
passou a renderizar a bola. Removido só o import `Link` que EU orfanei.

<!-- novas decisões anexadas conforme a sessão avança -->
