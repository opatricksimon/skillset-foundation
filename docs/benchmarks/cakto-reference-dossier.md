---
tipo: dossie-referencia-benchmark
plataforma: Cakto
categoria: checkout / infoproduto (mercado BR)
fonte: screen recording 7m57s — 75 frames vistos via skill /watch
data_captura: 2026-05-31
capturado_por: JARVIS (Mega Brain) via /watch
proposito: inteligência competitiva para inspirar melhorias na SkillsetUSA
projeto_alvo: skillset-foundation
idioma: pt-BR (traduzível — fonte é plataforma brasileira)
confidencialidade: uso interno
tags: [benchmark, cakto, monetizacao, checkout, skillsetusa, design-reference]
---

# Dossiê de Referência — Cakto

> **O que é este documento:** a destilação fiel de uma gravação de tela de 7m57s da plataforma **Cakto** (checkout/infoproduto BR), capturada quadro a quadro. É o "lado Cakto" de uma análise comparativa cujo objetivo é inspirar melhorias na **SkillsetUSA** (`skillset-foundation`). Não é opinião de marketing da Cakto — é o que apareceu na tela.

> **Rastreabilidade (Article IV — No Invention):** tudo marcado **[VISTO]** apareceu literalmente nos frames. Tudo marcado **[INFERIDO]** é dedução de arquitetura a partir do que foi visto, e está sinalizado como tal. Nada aqui é invenção decorativa.

---

## 0. Identidade da plataforma

A Cakto é uma plataforma brasileira de **venda de infoprodutos via checkout próprio** — o foco gravitacional dela é a **camada de monetização e conversão** (checkout, order bump, upsell, afiliados, financeiro/saque), com uma área de membros (Cakto Members) acoplada para entrega de curso.

**Posicionamento vs os outros benchmarks:**
- **Skool** inspira *comunidade + consumo de curso*.
- **Hotmart** inspira *marketplace + checkout + área de membros*.
- **Cakto** inspira a **máquina de vender** — é nessa dimensão que ela tem mais a ensinar à SkillsetUSA.

---

## 1. Design visual `[VISTO]`

| Elemento | Observação |
|---|---|
| **Tema** | Claro **e** escuro, com toggle no topo. Default observado: escuro (verde-petróleo sobre quase-preto). |
| **Paleta** | Verde (CTAs/destaques "Salvar", "Continuar") + cinza-escuro (superfícies) + amarelo (banner de pendência) + verde-vivo (badges "Ativo"). |
| **Layout** | Shell clássico SaaS: **sidebar esquerda colapsável** + **topbar** (busca, theme-toggle, sino de notificação, avatar). Conteúdo em cards e tabelas. |
| **Sidebar** | Dashboard · Produtos · Vitrine · Minhas Vendas · Assinaturas · Relatórios · Equipe · Afiliados · Financeiro · Integrações · Cupons · Quiz · Funeleiro. Ícones + label; colapsa para só-ícones. |
| **Banners** | (a) onboarding amarelo fixo *"Para fazer sua primeira venda, complete seu cadastro"*; (b) banner promo rotativo (webhooks 2.0 / "VOCÊ NO CONTROLE" / "Funeleiro já está no ar"). |
| **Densidade** | Alta — muitos cards de métrica e tabelas. Estética "painel financeiro". |

---

## 2. UX / Frontend `[VISTO]`

| Padrão | Observação | Componente equivalente na SkillsetUSA |
|---|---|---|
| Navegação por **abas horizontais** no editor de produto (10 abas) | Geral · Configurações · Order Bump · Upsell/Downsell · Checkout · Co-Produção · Cupons · Afiliados · Cakto Members · Links | `src/components/shared/horizontal-tabs.tsx` |
| **Theme toggle** dark/light | topbar | `src/components/shared/theme-toggle.tsx` ✅ já existe |
| **Filtros de período** | Hoje / Ontem / Últimos 7 / Últimos 30 / Sempre (+ Tipo, Produtos) | `src/components/shared/dashboard-filters.tsx` ✅ |
| **Widget de ajuda flutuante** | *"Olá Patrick 👋 Como podemos ajudar?"* — abas Suporte / Sugerir Melhoria / Reportar BUG + Central de Ajuda | `src/components/platform/help-bubble.tsx` ✅ |
| **Popup NPS** | *"Como você avalia nosso serviço?"* (1–5) | ❌ não há equivalente |
| **Menu de conta** | Nome · Página Inicial · Meu Perfil · Planos e Taxas · **Mudar para painel do aluno** · Logout | `src/components/site/account-menu.tsx` ✅ |
| **Estados de loading** | spinner verde em telas pesadas (Financeiro, criação de curso) | `src/components/shared/skillset-spinner.tsx` ✅ |
| **Preview ao vivo** dentro dos modais | order bump e upsell mostram o card final renderizando em tempo real enquanto o usuário edita | ⚠️ a verificar |
| **Onboarding gating** | banner persistente força "completar cadastro" antes da 1ª venda | `src/components/auth/onboarding-*` (fluxo existe) |

---

## 3. Funcionalidades observadas `[VISTO]` + arquitetura `[INFERIDO]`

### 3.1 Dashboard de vendas `[VISTO]`
Cards: *Vendas realizadas (R$)*, *Quantidade de vendas*. Tabela **Meios de Pagamento** (Pix, Boleto, Cartão de crédito, Pix Pay, Apple Pay, Google Pay, SDG, **PIX Automático**) com colunas Conversão % e Valor. Cards laterais: *Abandono de Carrinho*, *Reembolsos*, *Charge Back %*, *MED*.

### 3.2 Catálogo de produtos `[VISTO]`
Tabs: Meus Produtos · Minhas Assinaturas · Minhas Co-Produções · Minhas Utilizações. Filtro Ativo/—. Botão **Adicionar Produto**.

### 3.3 Editor de produto — 10 abas `[VISTO]`
- **Geral:** nome, descrição (limite ~500 chars), categoria, tipo de pagamento (Único/recorrente), imagem (drag-drop, JPG/PNG ≤10MB, 300×250), tabela de preços, suporte ao cliente (Instagram).
- **Configurações:** entrega de conteúdo (tipos) + **Pixels de conversão** (Facebook, Google Ads, Google Analytics, TikTok) + toggle *"disparar evento Purchase ao gerar pix"* + valor de conversão %.
- **Order Bump:** lista (0/5) + modal com Produto, Oferta, Aplicar desconto, CTA *"SIM, EU ACEITO ESSA OFERTA ESPECIAL!"*, Título, Descrição, Exibir imagem, e **preview ao vivo** do bump.
- **Upsell/Downsell:** toggle de página de obrigado/upsell; campo URL "Cartão ou Pix aprovado"; toggle *"redirecionar upsell ignorando falhas de pagamento de order bumps (cartão)"*; botões **Gerador de Upsell** e **Funeleiro**; e-mail de confirmação (imediato vs após upsell).
  - **Modal Gerador de Upsell:** Produto, Oferta, "considerar como Upsell", ação ao aceitar/rejeitar (*Redirecionar para área de membros* / *Oferecer outro Downsell* / *Não aproveitar*), textos dos botões, cor, **preview ao vivo**.
- **Checkout:** (aba dedicada — config do checkout do produto).
- **Co-Produção:** tabela Data/Nome/Comissão/Validade/Status + **Convidar Co-Produtor**.
- **Cupons:** (aba dedicada).
- **Afiliados:** toggle **Habilitar programa de afiliados**.
- **Cakto Members** (badge *beta*): área de membros premium.
- **Links:** tabela Nome/URL/Oferta/Tipo/Preço/Status — ex.: *Oferta Principal · pay.cakto.com.br/… · Checkout · R$50,00 · Ativo* + **Adicionar Link**.

### 3.4 Checkout público `[VISTO]`
URL `pay.cakto.com.br/{id}`. Mostra: nome do produto, **"12× de R$ 5,17 ou R$ 50,00 à vista"**, bloco *Seus dados* (Nome, Email, CPF/CNPJ, Celular +55), *Pagamento* (Apple Pay, Boleto, Cartão de Crédito, Google Pay, +), lateral *Compra segura* + *"Veja o contato do vendedor"* + Total + *"cakto está processando este pagamento para o vendedor {email}"* + reCAPTCHA + Termos.

### 3.5 Área de membros (Cakto Members) `[VISTO]`
`aluno.cakto.com.br/auth/login` — *"Bem-vindo de volta"*, **Login sem Senha** (link mágico) / E-mail e Senha, *"Entrar com a Cakto"*, *"Criar uma conta"*. Hero com mockup (pessoa + tablet, fundo roxo).

### 3.6 Vendas, Assinaturas, Relatórios `[VISTO]`
- **Minhas Vendas:** Vendas aprovadas, Valor líquido, Total comissões, Vendas únicas, % reembolso, Chargeback; tabs Aprovados/Reembolsados/Chargeback/MED/Todas; busca, filtros, **Exportar**.
- **Assinaturas:** Ativas, Canceladas, Renovações, **LTV**, **Churn Rate**.
- **Relatórios:** tabs Receita Da Co-Produção · Receita Por Produto · Vendas Abandonadas · Receita Por Afiliado · **Saldo A Retirar**; date-range com **calendário**; gráfico (Barras); **Exportar**.

### 3.7 Financeiro `[VISTO]` + `[INFERIDO]`
**Saldo Disponível** vs **Saldo Reservado** + **Efetuar Saque**; tabs Extrato / Dados Bancários / Identidade. Gate: *"você precisa verificar sua identidade antes de alterar os dados bancários"* + formulário CPF com aviso *"não poderá alterar após o envio"* (KYC).
> `[INFERIDO]` "Saldo Reservado" = período de retenção de payout. **Conceito-gêmeo do `payoutReleaseDelayDays` da SkillsetUSA** (`functions/src/payment-rules.ts`).

### 3.8 Vitrine de Afiliação `[VISTO]`
Marketplace interno *"Mais quentes que o deserto 🔥"* com cards de produtos de terceiros para afiliação, filtros por categoria / "mais quentes".

### 3.9 Equipe & Integrações `[VISTO]`
Equipe: Convites Enviados/Recebidos. Integrações + Webhooks 2.0 (*"monitore, depure e reenvie integrações em tempo real"*).

---

## 4. Modais & componentes notáveis `[VISTO]`

| Modal/Componente | Por que importa |
|---|---|
| **Adicionar Produto** (wizard) | criação rápida com validação inline (campos obrigatórios em vermelho) |
| **O que você vai vender?** (escolha de entrega) | 7 tipos: Membros Externa, Cakto Members, Cakto V1 (legado), Telegram, Discord, Acesso por e-mail, Link de pagamento |
| **Order Bump** com preview ao vivo | conversão pós-carrinho |
| **Gerador de Upsell** com preview ao vivo | conversão 1-clique pós-compra |
| **Date-picker calendário** | filtro de relatórios |
| **Menu de conta** com "trocar para painel do aluno" | dual-role num clique |

---

## 5. ⭐ Matriz Cakto → SkillsetUSA (o coração da inspiração)

> Mapeamento dos elementos da Cakto contra arquivos **reais** do repo `skillset-foundation` (git `main`, commit `940cde0`). Legenda: ✅ existe · 🟡 parcial · ❌ falta.

| Dimensão Cakto | Equivalente SkillsetUSA (path real) | Status |
|---|---|---|
| Shell sidebar+topbar | `src/components/platform/platform-shell.tsx` · `platform-nav.tsx` · `platform-header.tsx` · `sidebar-toggle.tsx` | ✅ |
| Theme dark/light | `src/components/shared/theme-toggle.tsx` | ✅ |
| Abas do editor | `src/components/shared/horizontal-tabs.tsx` | ✅ |
| Filtros de período | `src/components/shared/dashboard-filters.tsx` | ✅ |
| Widget de ajuda | `src/components/platform/help-bubble.tsx` | ✅ |
| Menu de conta + dual-role | `src/components/site/account-menu.tsx` | ✅ |
| Dashboard de vendas | `src/components/teacher/teacher-studio-dashboard.tsx` · `teacher-overview-metrics.tsx` · `teacher-studio-insights.tsx` | ✅ |
| Minhas Vendas (lista+detalhe) | `src/components/teacher/sale-list.tsx` · `sale-detail.tsx` · rota `/teach/sales` | ✅ |
| Criar produto/curso | `src/components/teacher/create-course-start.tsx` · `course-builder-studio.tsx` · `teacher-course-studio.tsx` · `/teach/builder/[courseId]` | ✅ |
| Cupons | `/teach/coupons` | ✅ |
| Co-Produção | `/teach/co-productions` | ✅ |
| Integrações / pixels | `/teach/integrations` · `functions/src/posthog.ts` | 🟡 (pixels FB/Google/TikTok a verificar) |
| Área de membros (entrega de curso) | `/learn/*` · `enrolled-course-workspace.tsx` · `watermarked-video-player.tsx` | ✅ |
| Checkout público | `src/components/account/embedded-checkout-panel.tsx` (Stripe embedded) | ✅ (Stripe, não Pix) |
| Financeiro / Saque / Saldo | `src/components/teacher/teacher-wallet-panel.tsx` · `functions/src/payment-rules.ts` | ✅ |
| KYC / dados bancários | `src/components/teacher/teacher-connect-onboarding.tsx` (Stripe Connect) | ✅ |
| Relatórios / analytics | `functions/src/course-analytics.ts` · `teacher-studio-insights.tsx` | 🟡 |
| Marketplace / vitrine | `src/components/courses/course-marketplace.tsx` · `/courses` | ✅ |
| Assinaturas / planos | `src/components/account/plans-panel.tsx` · `plan-selector-cards.tsx` · `/account/plans` | ✅ |
| Export de tabelas | `src/components/shared/export-table-button.tsx` | ✅ |
| Badges de status | `src/components/shared/status-chip.tsx` | ✅ |
| **Order Bump** | — | ❌ **FALTA** |
| **Upsell / Downsell (1-clique)** | — | ❌ **FALTA** |
| **Programa de Afiliados** | — | ❌ **FALTA** (existe co-produção, não afiliados) |
| **Gerador de Upsell c/ preview** | — | ❌ **FALTA** |
| NPS in-app | — | ❌ falta |

---

## 6. 🎯 As "armas de conversão" que a SkillsetUSA NÃO tem (priorizado)

> A maior lição da Cakto. Ordenado por impacto-em-receita × distância-do-que-já-existe.

1. **Order Bump** — oferta complementar no checkout (1 toggle no carrinho). Alto impacto em AOV, baixo atrito. A SkillsetUSA já tem checkout Stripe (`embedded-checkout-panel.tsx`) — é onde encaixaria.
2. **Upsell / Downsell 1-clique pós-compra** — página de obrigado que oferece o próximo produto sem re-digitar cartão. Exige suporte do backend de pagamento (`payment-rules.ts`).
3. **Programa de Afiliados** — diferente de co-produção; é rede de promotores com tracking de comissão + a "Vitrine de Afiliação". Motor de aquisição.
4. **Preview ao vivo nos modais de oferta** — UX que reduz erro de configuração (o vendedor vê o que o comprador verá).
5. **Pixels de conversão multi-plataforma** (FB/Google/TikTok) na aba de integrações — se ainda não cobertos além do PostHog.

---

## 7. Limitações desta captura (honestidade epistêmica)

- **Amostragem, não vídeo contínuo:** 75 frames de ~28.600 reais. Eventos < 6s entre frames podem ter escapado. Cobertura sem buraco > 10s.
- **Só a superfície:** vi o **frontend**. Todo "backend" aqui é `[INFERIDO]` a partir das telas — não vi código nem APIs da Cakto.
- **Conta de teste:** o produto "thepatrick" R$50 era teste (descrições aleatórias). Os números (R$0,00, 0 vendas) são de conta zerada, não refletem a plataforma em uso.
- **Pagamento BR ≠ US:** a Cakto é Pix/Boleto/cartão-BR; a SkillsetUSA é Stripe/US. Padrões de checkout NÃO se transferem 1:1 — a inspiração é de **fluxo e UX**, não de meio de pagamento.

---

*Fonte: gravação de tela `Cakto _ Dashboard … 2026-05-31 05-04-51.mp4`, lida via skill /watch (Mega Brain/JARVIS). Frames de trabalho em `C:\Users\nicae\Videos\Captures\_watch_test\`.*
