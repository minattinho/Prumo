# Prumo

Marketplace brasileiro de profissionais de construção e reforma. Conecta contratantes que precisam de serviços a profissionais verificados, com portfólio, avaliações e comunicação direta.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Objetivos do Produto](#objetivos-do-produto)
3. [Stack Técnica](#stack-técnica)
4. [Arquitetura](#arquitetura)
5. [Telas e Funcionalidades](#telas-e-funcionalidades)
6. [Regras de Negócio](#regras-de-negócio)
7. [Monetização](#monetização)
8. [Banco de Dados](#banco-de-dados)
9. [APIs Externas](#apis-externas)
10. [Variáveis de Ambiente](#variáveis-de-ambiente)
11. [Como Rodar Localmente](#como-rodar-localmente)

---

## Visão Geral

O Prumo é um marketplace SaaS focado no mercado de construção civil e reforma residencial/comercial. Ele resolve dois problemas:

- **Contratante**: dificuldade em encontrar profissionais confiáveis e verificados na sua região
- **Profissional**: falta de uma vitrine digital acessível para divulgar seu trabalho, portfólio e receber clientes

A plataforma funciona com dois perfis distintos de usuário: **Contratante** (quem contrata) e **Profissional** (quem oferece o serviço). Profissionais pagam uma assinatura mensal para manter seu perfil ativo e visível na busca. Contratantes acessam gratuitamente.

---

## Objetivos do Produto

- Centralizar a busca por profissionais de serviços gerais de construção/reforma
- Garantir confiança com validação de CPF/CNPJ via SERPRO (Receita Federal)
- Permitir avaliações verificadas (somente contratantes que efetivamente contataram o profissional podem avaliar)
- Dar ao profissional uma vitrine digital com portfólio de imagens e vídeos
- Facilitar orçamentos via sistema de solicitações e propostas dentro da plataforma
- Monetizar via assinatura recorrente dos profissionais

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Banco de dados | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/senha + Google OAuth) |
| Storage | Supabase Storage |
| Mídia (imagens/vídeos) | Cloudinary |
| Pagamentos | Stripe |
| Email | Resend |
| Analytics | PostHog |
| Validação de documentos | SERPRO API (CPF/CNPJ via Receita Federal) |
| Cidades brasileiras | IBGE API |
| Geocodificação | BigDataCloud |
| Mapas | Leaflet + React-Leaflet |
| Formulários | React Hook Form + Zod |
| Componentes | Radix UI + shadcn/ui |

---

## Arquitetura

O projeto usa o **App Router** do Next.js com grupos de rotas para separar contextos de autenticação e autorização:

```
src/app/
├── (public)/          # Acesso irrestrito
├── (auth)/            # Login e cadastro
├── (professional)/    # Requer autenticação + role=professional
├── (contractor)/      # Requer autenticação + role=contractor
└── api/               # API Routes (REST)
```

### Proteção de rotas

A autorização é feita via **layouts server-side**: cada grupo de rotas tem um `layout.tsx` que consulta o Supabase Server Client, verifica a sessão e o papel (role) do usuário, e redireciona para `/contratante` ou `/profissional` quando necessário. Não há middleware Edge — a proteção acontece no servidor antes de renderizar a página.

### Clientes Supabase

- `src/lib/supabase/server.ts` — Client SSR para Server Components e Route Handlers (usa cookies)
- `src/lib/supabase/client.ts` — Client browser para Client Components

---

## Telas e Funcionalidades

### Área Pública

#### `/` — Home

Página de entrada do produto. Contém:

- **HeroSearch**: campo de busca com autocomplete de categorias e cidades
- **HeroMap**: mapa interativo (Leaflet) mostrando profissionais ativos com geolocalização do visitante como centro
- **Categorias em destaque**: grid com as 13 categorias de serviço disponíveis, clicáveis para filtrar a busca
- **Como funciona**: fluxo visual explicando o processo (buscar → contatar → contratar → avaliar)
- **Depoimentos**: avaliações de contratantes reais

#### `/profissionais` — Busca de Profissionais

Listagem paginada com busca full-text e filtros via query string:

| Parâmetro | Descrição |
|---|---|
| `q` | Texto livre (nome, especialidade) |
| `categoria` | Categoria de serviço |
| `cidade` | Cidade de atuação |
| `ordem` | Critério de ordenação (avaliação, recência) |
| `avaliacao` | Nota mínima (1–5) |
| `verificacao` | Apenas profissionais verificados (CNPJ/CPF validado) |
| `tipo` | Pessoa Física ou Jurídica |
| `pagina` | Paginação |

Cada card exibe: foto, nome, especialidades, cidade, nota média, badge de verificação e preview do portfólio.

#### `/profissionais/[slug]` — Perfil do Profissional

Página pública e indexável (SEO) de cada profissional. Contém:

- Foto, nome, bio, cidade, raio de atendimento
- Badges de verificação (VERIFIED, TRUSTWORTHY, CERTIFIED)
- Especialidades e affinities (tags livres)
- Portfólio: projetos com galeria de imagens/vídeos, título, categoria, cidade de execução
- Canais de contato: WhatsApp, Telefone, Email, Instagram, Facebook, Site (cada visualização gera um `contact_log`)
- Redes sociais: Instagram, Facebook, TikTok, LinkedIn, YouTube
- Avaliações de contratantes com notas, comentários e resposta do profissional

#### `/seja-profissional` — Cadastro de Profissional

Formulário de 3 etapas para registro de novos profissionais:

1. **Conta**: email, senha (ou Google OAuth), nome completo, telefone
2. **Perfil**: especialidade principal, cidade, foto, bio
3. **Documentos**: CPF ou CNPJ validado via SERPRO em tempo real

Ao concluir, o usuário é redirecionado para o painel com status `PENDING` e trial de 30 dias iniciado.

---

### Área de Autenticação

#### `/contratante` — Login e Cadastro de Contratante

Rota única para contratantes. Abre em login por padrão e usa `?modo=cadastro` para exibir o cadastro na mesma tela. Suporta:

- Email + senha
- Google OAuth

Após login, contratantes são redirecionados para a rota anterior via `next` ou para a home. O cadastro cria um perfil com `role=contractor`.

#### `/profissional` — Login de Profissional e Admin

Login para profissionais e administradores. Após login, profissionais são redirecionados para `/painel` quando não houver `next`, e admins para `/admin`.

---

### Painel do Profissional (`/painel`)

Área protegida acessível somente a usuários autenticados com `role=professional`. Inclui sidebar de navegação e tour de onboarding para novos usuários.

#### `/painel` — Dashboard

Visão consolidada do desempenho. Exibe:

- **Status da assinatura**: trial ativo (com dias restantes), assinatura ativa ou suspensa
- **Completude do perfil**: barra de progresso com checklist (foto, bio, especialidades, canais de contato, projetos no portfólio)
- **Métricas de performance**: visualizações de perfil, contatos recebidos, nota média, número de avaliações
- **Atalhos**: links diretos para editar perfil, portfólio, serviços e solicitações

#### `/painel/perfil` — Editor de Perfil

Edição completa do perfil público. Campos:

- Foto de perfil (upload para Cloudinary)
- Bio / descrição pessoal
- Especialidades (múltiplas, das 13 categorias disponíveis)
- Affinities: tags livres para descrever serviços específicos
- Canais de contato: WhatsApp, Telefone, Email, Instagram, Facebook, Site, Outro (com marcação de canal primário)
- Redes sociais: handles de Instagram, Facebook, TikTok, LinkedIn, YouTube
- Cidade, estado e raio de atendimento em km

#### `/painel/portfolio` — Portfólio

Gerenciamento dos projetos exibidos no perfil público. Funcionalidades:

- Criar/editar projetos com: título, categoria, cidade onde foi executado, descrição
- Upload de múltiplas imagens e vídeos por projeto (Cloudinary)
- Reordenar imagens via drag-and-drop
- Marcar até **3 projetos como destaque** (aparecem em posição privilegiada no perfil)
- Toda mídia passa por moderação antes de ser publicada (status: PENDING → APPROVED/REJECTED)

#### `/painel/servicos` — Serviços Realizados

Histórico de serviços concluídos (separado do portfólio). Permite registrar:

- Nome do cliente, tipo de serviço, valor cobrado, data de execução
- Origem: via Prumo, indicação ou outro canal
- Status: em andamento ou concluído
- Fotos do serviço (com opção de mover para o portfólio)

#### `/painel/solicitacoes` — Solicitações de Orçamento

Caixa de entrada de pedidos de orçamento enviados por contratantes. Cada solicitação mostra:

- Nome do contratante, mensagem, data
- Status: NOVA, RESPONDIDA, EM NEGOCIAÇÃO, RECUSADA

#### `/painel/solicitacoes/[id]/proposta` — Criar Proposta

Formulário de resposta a uma solicitação de orçamento. Campos:

- Valor total do serviço
- Prazo estimado (em dias)
- Descrição da abordagem/metodologia
- Etapas de pagamento (até 3 parcelas com percentual e condição)

#### `/painel/avaliacoes` — Avaliações Recebidas

Lista de avaliações feitas por contratantes. Para cada avaliação:

- Nota (1–5 estrelas), comentário, data
- Opção de **responder publicamente** à avaliação
- Status de disputa: ABERTA / RESOLVIDA (se o profissional contestar)

#### `/painel/assinatura` — Assinatura

Gerenciamento do plano de assinatura. Exibe:

- Status atual: TRIAL / ATIVO / CANCELADO / SUSPENSO
- Dias restantes do trial ou data de renovação
- Preço: R$79/mês (plano MVP_79)
- Botão de assinar (redireciona para Stripe Checkout)
- Histórico de pagamentos

#### `/painel/acessos` — Logs de Acesso

Lista de contratantes que acessaram o perfil do profissional, com tipo de evento (perfil visualizado, contato visualizado) e data.

#### `/painel/configuracoes` — Configurações

Preferências da conta: notificações, privacidade, exclusão de conta.

---

### Área do Contratante

#### `/minha-conta` — Minha Conta

Dashboard do contratante com:

- Histórico de contatos com profissionais (contact_logs)
- Avaliações que já deu
- Dados da conta (nome, email, telefone)

---

## Regras de Negócio

### Status do Profissional

```
PENDING → ACTIVE → SUSPENDED → BANNED
```

| Status | Descrição |
|---|---|
| `PENDING` | Recém-cadastrado, aguardando validação |
| `ACTIVE` | Visível na busca e no mapa |
| `SUSPENDED` | Temporariamente fora do ar (pagamento inadimplente ou infração) |
| `BANNED` | Banido permanentemente |

Somente profissionais com `status=ACTIVE` aparecem nos resultados de busca e no mapa.

### Status da Assinatura

```
TRIAL → ACTIVE → CANCELLED / SUSPENDED
```

| Status | Descrição |
|---|---|
| `TRIAL` | 30 dias gratuitos a partir do cadastro |
| `ACTIVE` | Assinatura paga e vigente |
| `CANCELLED` | Cancelado pelo profissional |
| `SUSPENDED` | Pagamento falhou; perfil suspenso |

### Avaliações

- Cada par contratante-profissional pode gerar **no máximo uma avaliação** (constraint `UNIQUE` no banco)
- O contratante só pode avaliar um profissional se houver um `contact_log` registrado para esse par — ou seja, ele precisa ter efetivamente visualizado um canal de contato do profissional

### Portfólio

- Cada projeto pode ter múltiplas imagens e vídeos
- **Máximo de 3 projetos em destaque** por profissional (aplicado por trigger/constraint no banco)
- Toda mídia enviada inicia com status `PENDING` e precisa ser aprovada pela moderação antes de aparecer publicamente

### Moderação de Conteúdo

```
PENDING → APPROVED
         → REJECTED
```

Mídia rejeitada gera uma **infração** no profissional. Infrações acumuladas podem levar a:

| Infração | Tipo | Consequência |
|---|---|---|
| Conteúdo rejeitado | `CONTENT_REJECTION` | Revisão manual obrigatória |
| Plágio detectado | `PLAGIARISM` | Suspensão |
| Fraude identificada | `FRAUD` | Banimento |

### Validação de Documentos

CPF e CNPJ são validados em duas etapas:
1. **Pré-validação local**: checksum algorítmico (Receita Federal rules)
2. **Validação SERPRO**: consulta à API da Receita Federal em tempo real, com cache de 24h no banco

O resultado é armazenado em `cpf_validations` com o payload completo da resposta do SERPRO.

### Geolocalização no Mapa

O mapa da home exibe todos os profissionais com `status=ACTIVE` que têm cidade e estado cadastrados. A resposta é cacheada por 5 minutos (Cache-Control: `public, max-age=300, stale-while-revalidate=60`).

---

## Monetização

O modelo de monetização é **SaaS B2B de assinatura**, cobrado exclusivamente dos profissionais. Contratantes usam a plataforma gratuitamente.

| Item | Valor |
|---|---|
| Plano único (`MVP_79`) | R$79/mês |
| Trial gratuito | 30 dias |
| Cobrança | Recorrente via Stripe |

### Fluxo de Pagamento

1. Profissional clica em "Assinar" no `/painel/assinatura`
2. Redirecionado para **Stripe Checkout**
3. Ao concluir o pagamento, Stripe dispara webhook `checkout.session.completed`
4. Handler em `/api/stripe/webhook` atualiza `subscription_status=ACTIVE` e `subscription_paid_until`
5. Renovações mensais: webhook `invoice.payment_succeeded` renova o período
6. Falha no pagamento: webhook `invoice.payment_failed` suspende o perfil
7. Cancelamento: webhook `customer.subscription.deleted` marca como `CANCELLED`

### Tabelas de Controle

- **`professional_subscriptions`**: histórico de assinaturas com IDs do Stripe
- **`payment_transactions`**: registro de cada transação (valor, status, IDs do Stripe)

---

## Banco de Dados

25 tabelas PostgreSQL no Supabase, todas com **Row Level Security (RLS)** habilitada.

### Tabelas Principais

| Tabela | Descrição |
|---|---|
| `profiles` | Espelho dos usuários do Supabase Auth (id, email, nome, telefone, role) |
| `contractor_profiles` | Dados específicos do contratante |
| `professional_profiles` | Dados do profissional (slug, CPF/CNPJ, foto, bio, cidade, status, assinatura) |
| `professional_specialties` | Categorias de serviço do profissional |
| `professional_affinities` | Tags livres do profissional |
| `professional_contact_channels` | Canais de contato (WhatsApp, Telefone, Email, etc.) |
| `professional_social_networks` | Redes sociais |
| `portfolio_projects` | Projetos do portfólio |
| `portfolio_images` | Imagens dos projetos (Cloudinary) com status de moderação |
| `portfolio_videos` | Vídeos dos projetos (Cloudinary) com status de moderação |
| `budget_requests` | Solicitações de orçamento de contratantes |
| `proposals` | Propostas dos profissionais em resposta a orçamentos |
| `completed_services` | Histórico de serviços realizados |
| `service_photos` | Fotos de serviços concluídos |
| `evaluations` | Avaliações (nota 1–5, comentário, disputa) |
| `evaluation_photos` | Fotos de evidência em avaliações |
| `evaluation_responses` | Respostas do profissional às avaliações |
| `professional_metrics` | Cache de métricas (views, contatos, nota média) |
| `verification_badges` | Badges de confiança (VERIFIED, TRUSTWORTHY, CERTIFIED) |
| `professional_subscriptions` | Assinaturas Stripe dos profissionais |
| `payment_transactions` | Transações financeiras |
| `cpf_validations` | Histórico de validações de documentos via SERPRO |
| `content_reports` | Denúncias de conteúdo inadequado |
| `professional_infractions` | Infrações cometidas por profissionais |
| `contact_logs` | Log de quando um contratante visualizou um canal de contato |
| `profile_activity_logs` | Log de acessos ao perfil |

### Políticas RLS Principais

- Perfis de profissionais com `status=ACTIVE`: leitura pública
- Portfólio aprovado: leitura pública
- Canais de contato: visíveis para usuários autenticados
- Dados sensíveis (assinatura, métricas, logs): visíveis apenas para o próprio usuário
- Avaliações: somente contratantes que contataram o profissional podem inserir

### Storage Buckets

| Bucket | Uso | Acesso |
|---|---|---|
| `profiles` | Fotos de perfil dos profissionais | Leitura pública, escrita pelo dono |
| `portfolio` | Imagens e vídeos de portfólio | Leitura pública, escrita pelo dono |

---

## APIs Externas

### SERPRO (Receita Federal)
- **Endpoint**: validação de CPF (`/api/serpro/validate`) e CNPJ
- **Fluxo**: pré-validação local por checksum → consulta SERPRO → cache de 24h em `cpf_validations`
- **Dados retornados**: nome da pessoa, status da situação cadastral, mensagem

### IBGE
- **Uso**: autocomplete de cidades brasileiras no componente `CityInput`
- **Endpoint público**: `servicodados.ibge.gov.br`

### BigDataCloud
- **Uso**: geocodificação reversa (latitude/longitude → cidade e estado)
- **Endpoint**: `/api/geocode?lat=X&lon=Y`
- **Retorna**: cidade e sigla do estado (ex.: "São Paulo", "SP")

### Stripe
- **Uso**: checkout de assinatura, gestão de faturas e webhooks
- **Eventos tratados**:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`

### Cloudinary
- **Uso**: upload, armazenamento e CDN de imagens e vídeos do portfólio e perfil
- **Fluxo**: client faz POST em `/api/upload`, que envia para Cloudinary e retorna a URL pública

### Resend
- **Uso**: emails transacionais (boas-vindas, notificações, propostas)
- **Endpoint interno**: `/api/emails`

### PostHog
- **Uso**: analytics de comportamento de usuário (page views, eventos de contato, conversão)

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz com as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend
RESEND_API_KEY=

# SERPRO
SERPRO_API_KEY=
SERPRO_BASE_URL=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# BigDataCloud
BIGDATACLOUD_API_KEY=
```

---

## Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher as variáveis acima

# 3. Aplicar schema no Supabase
# Execute o conteúdo de supabase/schema.sql no Supabase SQL Editor

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

### Estrutura de URLs

| URL | Ambiente |
|---|---|
| `localhost:3000` | Área pública + cadastro de contratantes |
| `localhost:3000/painel` | Painel do profissional |
| `app.prumo.com.br` | Domínio de produção do painel profissional |

---

## Categorias de Serviço

A plataforma suporta 13 categorias:

| Categoria | Exemplos de serviço |
|---|---|
| Construção | Alvenaria, fundação, estrutura |
| Elétrica | Instalações elétricas, SPDA |
| Hidráulica | Encanamento, esgoto, cisternas |
| Acabamento | Pintura, gesso, drywall |
| Pisos | Porcelanato, madeira, epóxi |
| Serralheria | Grades, portões, escadas metálicas |
| Marcenaria | Móveis planejados, esquadrias |
| Jardinagem | Paisagismo, irrigação |
| Limpeza | Pós-obra, fachadas |
| Projeto | Arquitetura, design de interiores |
| Engenharia | Cálculo estrutural, laudos |
| Tecnologia | Automação residencial, CFTV |
| Climatização | Ar-condicionado, ventilação |
