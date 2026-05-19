# INSPIRATION SPEC — Cakto-modeled (P2, P3, P5, P6)

> Sessão autônoma 2026-05-19. Contrato de design acionável para a próxima
> sessão. Fonte: amostra de 3 telas representativas de ~140 screenshots de
> `cakto.com.br` / `app.cakto.com.br` (marketing, signup, dashboard).
> Inspirar na ESTRUTURA, não copiar. Marca/conteúdo = Skillset.
>
> ⚠️ NÃO replicar: a arte do mascote/carro Porsche no painel do signup — é
> patrocínio de uma corrida, não faz parte do produto (instrução do founder).
> Usar no lugar um painel de marca Skillset (gradiente + claim + prova social).

## P2 — Homepage estilo landing com scroll

Observado (cakto.com.br): tema escuro premium, header fixo com nav
(Taxas, Integrações, Planos, Diferenciais, Blog, Login, CTA "Criar conta"),
hero com claim forte de uma linha + subtítulo de prova social, mockup do
produto com cards de notificação de venda flutuando.

Contrato:
- Header fixo; itens de nav NÃO navegam para páginas — fazem **scroll suave
  até a âncora** da seção correspondente na mesma página (single-page).
  Exceção: "Login"/CTA vão para rotas reais.
- Seções âncora mínimas: Hero · Como funciona · Para professores ·
  Preços/Taxas · Prova social · CTA final · Footer.
- CTA do canto superior direito abre signup (rota real).
- Reuso obrigatório: tokens de `src/app/globals.css`, componentes de
  `src/components/site/*` já existentes (não criar header novo do zero —
  estender `site-nav.tsx`).
- Aceite: navbar com 1 item por seção; clicar rola com `scroll-behavior:smooth`
  e atualiza `#hash`; mobile = mesma lista no drawer; sem regressão de SEO
  (manter metadata/sitemap já existentes).

## P3 — Onboarding multi-step (versão reduzida 80/20)

Observado (app.cakto.com.br/auth/register): layout split — painel de marca à
esquerda, formulário à direita; **uma pergunta por passo**, indicador de
progresso por dots (~10 passos no Cakto), botão único "Próximo", link
"Já possui conta? Entrar", checkbox de consentimento legal.

Contrato:
- Manter o split, painel esquerdo = marca Skillset (sem mascote/carro).
- **Reduzir para 4–5 passos** (80/20): (1) nome, (2) e-mail + senha,
  (3) papel: aprender ou ensinar, (4) 1–2 perguntas de objetivo p/ analytics,
  (5) aceite legal + criar conta.
- Respostas persistidas em `users/{uid}.onboardingAnswers` (campo já existe
  na allow-list das regras) para pesquisa de público.
- Progresso por dots; voltar/avançar; validação inline por passo; estados
  loading/erro/sucesso (padrão #6).
- Reuso: lógica já reformada de `signup-form.tsx` (username derivado, aceite
  único) — estender, não reescrever.
- Aceite: criar conta em ≤5 passos; refresh no meio não perde respostas;
  e-mail de verificação disparado no fim (ver P4).

## P4 — E-mail de verificação automático (decidido, sem bloqueio)

Usar **Firebase Auth `sendEmailVerification`** nativo no fim do cadastro
(zero dependência externa — ver DECISIONS D4). Template custom (Resend/
SendGrid) fica como melhoria futura opcional (BLOCKERS B4).
Aceite: ao concluir signup, e-mail de verificação enviado; tela informa
"verifique seu e-mail"; reenvio disponível.

## P5 — Dashboard do professor

Observado (app dashboard, tema claro): sidebar **fixa, sem scroll próprio**,
todos os itens sempre visíveis, item ativo com acento verde à esquerda + bg
verde-claro; logo no topo; mini-card de faturamento com progresso; topo
limpo (busca, tema, notificações, avatar à direita — sem poluição); área de
conteúdo à direita é a única que rola; banner de nudge de onboarding quando
cadastro incompleto; cards de métrica + breakdown de meios de pagamento.

Contrato:
- Sidebar fixa colapsável (recolhe para só-ícones, estética limpa) — o app
  já tem `platform-nav.tsx` / `platform-shell.tsx` reformados; ESTENDER.
- Conteúdo rola independente; sidebar permanece.
- Item ativo destacado (já implementado via `pathname`).
- Cards: vendas, nº de vendas, líquido após taxa (usar `computePaymentSplit`),
  payouts pendentes (payout ledger), cursos publicados/em revisão.
- Estados loading/empty/erro reais (já há `*-overview-metrics.tsx`).
- Aceite: sidebar não rola; colapso fluido; conteúdo rola; sem layout shift
  360px→wide.

## P6 — Dashboard do aluno

Mesma casca do P5 (sidebar fixa colapsável + topo limpo), conteúdo:
cursos em progresso, sessões ao vivo da semana, credenciais emitidas
(já existe `learner-overview-metrics.tsx`), continuar de onde parou.
Aceite: idem P5, com IA de aprendizado (não de venda).

---
### Amostra analisada (transparência)
Vistas: `...231504` (home/hero dark), `...232014` (signup split multi-step),
`...232633` (app dashboard light, sidebar fixa). As ~137 restantes não foram
abertas (custo de contexto) — se algum detalhe específico importar, aponte a
imagem na revisão e eu refino esta spec.
