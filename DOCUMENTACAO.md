# Prumo — Documentação Completa do Produto

> Marketplace de serviços para construção e reforma que conecta contratantes e profissionais qualificados via contato direto.

---

## Sumário

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Banco de Dados](#4-banco-de-dados)
5. [Integrações Externas](#5-integrações-externas)
6. [Variáveis de Ambiente](#6-variáveis-de-ambiente)
7. [API Endpoints](#7-api-endpoints)
8. [Fluxos de Usuário](#8-fluxos-de-usuário)
9. [Regras de Negócio](#9-regras-de-negócio)
10. [Categorias de Serviço](#10-categorias-de-serviço)
11. [Roadmap](#11-roadmap)

---

## 1. Visão Geral do Produto

### O que é o Prumo

Prumo é um **marketplace de prestadores de serviços** focado em construção e reforma. A plataforma conecta pessoas que precisam de serviços (contratantes) com profissionais qualificados (pedreiros, eletricistas, encanadores, etc.) por meio de **contato direto**, sem intermediação de pagamento.

### Proposta de Valor

| Para Contratantes | Para Profissionais |
|---|---|
| Encontrar profissionais verificados | Ter presença digital profissional |
| Ver portfólio de obras reais | Receber clientes sem custo por lead |
| Ler avaliações autênticas (pós-contato) | Construir reputação verificada |
| Contato direto sem taxas | Assinatura mensal fixa (sem comissões) |

### Modelo de Negócio

- **Contratantes:** acesso gratuito à plataforma
- **Profissionais:** assinatura de **R$ 79/mês** com trial de **30 dias gratuitos**
- Sem comissão sobre serviços — o profissional fica com 100% do valor cobrado ao cliente
- Monetização futura: escrow de pagamentos, planos premium

### Tipos de Usuário

| Tipo | Descrição | Custo |
|---|---|---|
| Visitante | Navega e busca profissionais sem login | Grátis |
| Contratante | Contata e avalia profissionais | Grátis |
| Profissional (Trial) | Perfil em período gratuito de 30 dias | Grátis (30 dias) |
| Profissional (Ativo) | Perfil público, recebe contatos | R$ 79/mês |
| Profissional (Suspenso) | Pagamento falhou ou cancelado | — |
| Profissional (Banido) | Infrações graves | — |

### Status do Produto

MVP em fase de validação de mercado. A estrutura técnica está preparada para escalar, faltando principalmente integrações de pagamento automático (webhooks Stripe) e ferramentas de moderação administrativa.

---

## 2. Stack Tecnológico

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.2.2 | Framework principal (App Router) |
| React | 19.2.4 | UI Components |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Estilização (via PostCSS) |
| Radix UI | — | Componentes acessíveis (Dialog, Dropdown, Tabs, etc.) |
| React Hook Form | — | Formulários tipados |
| Zod | — | Validação de schemas |
| Lucide React | — | Ícones |
| dnd-kit | — | Drag & drop (portfolio) |
| date-fns | 4.1.0 | Manipulação de datas |
| next-cloudinary | 6.17.5 | Upload de mídia |

### Backend

| Tecnologia | Versão | Uso |
|---|---|---|
| Supabase | — | PostgreSQL + Auth + Storage |
| @supabase/ssr | 0.10.0 | Cliente server-side |
| Stripe | 21.0.1 | Pagamentos e assinaturas |
| @stripe/stripe-js | 9.0.1 | Stripe client-side |
| Cloudinary | 2.9.0 | Armazenamento de mídia |
| Resend | 6.10.0 | Envio de emails |
| PostHog | — | Analytics |

### Utilitários

| Lib | Uso |
|---|---|
| clsx + tailwind-merge | Merge de classes CSS |
| posthog-js / posthog-node | Analytics client e server |

---

## 3. Arquitetura do Sistema

### Estrutura de Pastas

```
prumo/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (public)/               # Rotas públicas (sem auth)
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── profissionais/      # Busca e perfil público
│   │   │   ├── entrar/             # Login
│   │   │   ├── cadastro/           # Registro de contratante
│   │   │   └── seja-profissional/  # Registro de profissional
│   │   ├── (contractor)/           # Rotas do contratante (auth)
│   │   │   └── minha-conta/        # Painel do contratante
│   │   ├── (professional)/         # Rotas do profissional (auth)
│   │   │   └── painel/             # Dashboard + subpáginas
│   │   ├── api/                    # API Route Handlers
│   │   │   ├── serpro/             # Validação CPF/CNPJ
│   │   │   ├── stripe/             # Webhooks de pagamento
│   │   │   ├── upload/             # Upload de mídia
│   │   │   └── emails/             # Envio de emails
│   │   └── auth/callback/          # OAuth callback (Supabase)
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── layout/                 # Header, Footer, Logo
│   │   ├── city-input.tsx          # Autocomplete de cidades (IBGE)
│   │   └── providers/              # PostHog provider
│   ├── lib/                        # Integrações e utilitários
│   │   ├── supabase/               # Cliente Supabase (server/client)
│   │   ├── stripe/                 # Cliente Stripe
│   │   ├── serpro/                 # Validação CPF/CNPJ
│   │   ├── cloudinary/             # Config de pastas e uploads
│   │   ├── resend/                 # Cliente email + templates
│   │   ├── posthog/                # Cliente analytics
│   │   ├── ibge.ts                 # Busca de municípios
│   │   └── utils.ts                # Funções auxiliares
│   ├── types/
│   │   └── index.ts                # Tipos TypeScript do domínio
│   └── proxy.ts                    # Middleware de autenticação e roteamento
├── supabase/
│   └── schema.sql                  # Schema completo do banco de dados
├── public/                         # Assets estáticos
├── next.config.ts
├── tailwind.config.ts
└── REGRASDENEGOCIOS.MD             # Regras de negócio detalhadas
```

### Rotas da Aplicação

#### Rotas Públicas (`/`)

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `page.tsx` | Homepage com hero, categorias, como funciona |
| `/profissionais` | `page.tsx` | Busca de profissionais com filtros |
| `/profissionais/[slug]` | `page.tsx` | Perfil público do profissional + portfólio |
| `/entrar` | `page.tsx` | Login (email/senha ou Google OAuth) |
| `/cadastro` | `page.tsx` | Cadastro de contratante |
| `/seja-profissional` | `page.tsx` | Cadastro de profissional (3 etapas) |

#### Rotas do Contratante (`/minha-conta`)

| Rota | Descrição |
|---|---|
| `/minha-conta` | Painel com histórico de contatos e avaliações deixadas |

#### Rotas do Profissional (`/painel`)

| Rota | Descrição |
|---|---|
| `/painel` | Dashboard com status, métricas e checklist de completude |
| `/painel/perfil` | Editar perfil, especialidades, contatos e redes sociais |
| `/painel/portfolio` | Gerenciar projetos, fotos e vídeos |
| `/painel/portfolio/criar` | Criar novo projeto |
| `/painel/servicos` | Registrar serviços concluídos |
| `/painel/solicitacoes` | Listar e responder orçamentos recebidos |
| `/painel/solicitacoes/[id]/proposta` | Enviar proposta detalhada |
| `/painel/avaliacoes` | Ver avaliações recebidas e responder |
| `/painel/acessos` | Log de visualizações e contatos ao perfil |
| `/painel/assinatura` | Status da assinatura e histórico de pagamentos |
| `/painel/configuracoes` | Dados da conta e segurança |

### Middleware e Roteamento

O arquivo `src/proxy.ts` intercepta todas as requisições e:

- Protege `/painel/*` — exige autenticação com `role = professional`
- Protege `/minha-conta/*` — exige autenticação com `role = contractor`
- Realiza refresh automático da sessão Supabase
- Redireciona para `/entrar` quando não autenticado

### Funções Utilitárias (`src/lib/utils.ts`)

```typescript
cn(classes)          // Merge de classes Tailwind (clsx + tailwind-merge)
formatCurrency(value) // 79.00 → "R$ 79,00"
formatPhone(phone)    // "11999999999" → "(11) 99999-9999"
slugify(text)         // "João Silva" → "joao-silva"
formatDate(date)      // Date → "07/04/2026" (pt-BR)
```

### Design System

Cores customizadas definidas no Tailwind:

| Token | Uso |
|---|---|
| `azul-noite` | Cor primária escura (header, CTAs) |
| `azul-principal` | Azul principal da marca |
| `azul-claro` | Fundos claros e hover states |
| `laranja-obra` | Cor de destaque e accent |
| `cinza-texto` | Texto secundário |

---

## 4. Banco de Dados

O banco é PostgreSQL gerenciado pelo Supabase com Row Level Security (RLS) em todas as tabelas.

### ENUMs

```sql
professional_status:    PENDING | ACTIVE | SUSPENDED | BANNED
subscription_status:    TRIAL | ACTIVE | CANCELLED | SUSPENDED
contact_channel_type:   WHATSAPP | PHONE | EMAIL | INSTAGRAM | FACEBOOK | SITE | OTHER
social_network_type:    INSTAGRAM | FACEBOOK | TIKTOK | LINKEDIN | YOUTUBE
budget_request_status:  NEW | REPLIED | IN_NEGOTIATION | REFUSED
media_moderation_status: PENDING | APPROVED | REJECTED
service_origin:         PRUMO | REFERRAL | OTHER
service_status:         IN_PROGRESS | COMPLETED
badge_type:             VERIFIED | TRUSTWORTHY | CERTIFIED
contact_log_type:       VIEWED_WHATSAPP | VIEWED_PHONE | VIEWED_EMAIL
infraction_consequence: MANUAL_REVIEW_REQUIRED | SUSPENDED | BANNED
payment_status:         PENDING | COMPLETED | FAILED | REFUNDED
```

### Tabelas

#### Autenticação e Perfis

**`profiles`**
Espelho do `auth.users` do Supabase com role do usuário.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | Mesmo ID do auth.users |
| email | text | Email do usuário |
| full_name | text | Nome completo |
| phone | text | Telefone |
| role | text | `contractor` ou `professional` |
| created_at | timestamptz | Data de criação |

**`contractor_profiles`**
Dados adicionais do contratante.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK, FK → profiles) | ID do usuário |
| cpf | text | CPF do contratante |
| created_at | timestamptz | Data de criação |

**`professional_profiles`**
Perfil completo do profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK, FK → profiles) | ID do usuário |
| slug | text (UNIQUE) | URL amigável (ex: `joao-silva-sp`) |
| cpf | text | CPF (criptografado) |
| cnpj | text | CNPJ (opcional) |
| person_type | text | `PF` ou `PJ` |
| photo_url | text | URL da foto de perfil (Cloudinary) |
| personal_description | text | Descrição pessoal (bio) |
| city | text | Cidade de atuação |
| state | text | Estado (UF) |
| service_radius_km | integer | Raio de atendimento em km |
| status | professional_status | PENDING / ACTIVE / SUSPENDED / BANNED |
| stripe_customer_id | text | ID do cliente no Stripe |
| onboarding_completed_at | timestamptz | Quando completou o onboarding |
| created_at | timestamptz | Data de criação |

#### Dados do Profissional

**`professional_specialties`**
Categorias de serviço que o profissional oferece.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK → professional_profiles) | Profissional |
| category | text | Categoria (ex: `eletrica`) |
| created_at | timestamptz | Data |

**`professional_affinities`**
Tags livres que descrevem características do profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| tag | text | Tag (ex: "Trabalho aos finais de semana") |
| created_at | timestamptz | Data |

**`professional_contact_channels`**
Canais de contato do profissional (obrigatório 1 primário).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| type | contact_channel_type | Tipo de canal |
| value | text | Número, email ou URL |
| is_primary | boolean | Canal principal (apenas 1 por profissional) |
| created_at | timestamptz | Data |

**`professional_social_networks`**
Redes sociais do profissional (exibidas no perfil público).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| platform | social_network_type | Rede social |
| handle_or_url | text | @ ou URL do perfil |
| created_at | timestamptz | Data |

**`professional_metrics`**
Cache de métricas calculadas (atualizado por triggers/jobs).

| Coluna | Tipo | Descrição |
|---|---|---|
| professional_id | uuid (PK, FK) | Profissional |
| average_rating | numeric(3,2) | Nota média |
| total_evaluations | integer | Total de avaliações |
| profile_views | integer | Total de visualizações do perfil |
| contacts_received | integer | Total de contatos recebidos |
| updated_at | timestamptz | Última atualização |

**`verification_badges`**
Badges de verificação atribuídos pelo admin.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| type | badge_type | VERIFIED / TRUSTWORTHY / CERTIFIED |
| issued_at | timestamptz | Data de emissão |
| expires_at | timestamptz | Data de expiração (opcional) |

#### Portfólio

**`portfolio_projects`**
Projetos do portfólio do profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| title | text | Título do projeto |
| category | text | Categoria do serviço |
| city_executed | text | Cidade onde foi executado |
| description | text | Descrição do projeto |
| is_featured | boolean | Projeto em destaque (máx. 3) |
| display_order | integer | Ordem de exibição |
| view_count | integer | Visualizações do projeto |
| created_at | timestamptz | Data |

**`portfolio_images`**
Imagens de projetos do portfólio.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| project_id | uuid (FK → portfolio_projects) | Projeto |
| cloudinary_url | text | URL da imagem no Cloudinary |
| cloudinary_id | text | ID no Cloudinary (para deleção) |
| moderation_status | media_moderation_status | PENDING / APPROVED / REJECTED |
| display_order | integer | Ordem de exibição |
| created_at | timestamptz | Data |

**`portfolio_videos`**
Vídeos de projetos (requerem revisão manual em até 24h).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| project_id | uuid (FK → portfolio_projects) | Projeto |
| cloudinary_url | text | URL do vídeo no Cloudinary |
| cloudinary_id | text | ID no Cloudinary |
| duration_seconds | integer | Duração do vídeo |
| moderation_status | media_moderation_status | PENDING / APPROVED / REJECTED |
| manual_review_date | timestamptz | Data de revisão manual |
| created_at | timestamptz | Data |

#### Contatos e Atividade

**`contact_logs`**
Registro de quando um contratante acessa o contato de um profissional. Necessário para poder avaliar.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| contractor_id | uuid (FK) | Contratante |
| contact_type | contact_log_type | Tipo de contato acessado |
| created_at | timestamptz | Data do acesso |

**`profile_activity_logs`**
Log de todos os eventos de atividade no perfil do profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| actor_id | uuid | Usuário que gerou o evento (nullable para visitantes) |
| event_type | text | PROFILE_VIEWED / CONTACT_VIEWED |
| metadata | jsonb | Dados adicionais do evento |
| created_at | timestamptz | Data |

#### Serviços e Orçamentos

**`completed_services`**
Serviços concluídos registrados pelo profissional (histórico).

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| client_name | text | Nome do cliente |
| service_type | text | Tipo de serviço realizado |
| value | numeric(10,2) | Valor cobrado (opcional) |
| execution_date | date | Data de execução |
| status | service_status | IN_PROGRESS / COMPLETED |
| origin | service_origin | PRUMO / REFERRAL / OTHER |
| created_at | timestamptz | Data |

**`service_photos`**
Fotos dos serviços concluídos.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| service_id | uuid (FK → completed_services) | Serviço |
| cloudinary_url | text | URL da foto |
| cloudinary_id | text | ID no Cloudinary |
| created_at | timestamptz | Data |

**`budget_requests`**
Solicitações de orçamento de contratantes para profissionais.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| contractor_id | uuid (FK) | Contratante |
| description | text | Descrição do serviço desejado |
| status | budget_request_status | NEW / REPLIED / IN_NEGOTIATION / REFUSED |
| created_at | timestamptz | Data |

**`proposals`**
Propostas enviadas por profissionais em resposta a orçamentos.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| budget_request_id | uuid (FK) | Solicitação de orçamento |
| professional_id | uuid (FK) | Profissional |
| total_value | numeric(10,2) | Valor total proposto |
| deadline_days | integer | Prazo estimado em dias |
| approach_description | text | Descrição da abordagem |
| payment_stages | integer | Etapas de pagamento (1, 2 ou 3) |
| created_at | timestamptz | Data |

#### Avaliações

**`evaluations`**
Avaliações deixadas por contratantes após contratar um profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional avaliado |
| contractor_id | uuid (FK) | Contratante que avalia |
| rating | integer | Nota de 1 a 5 |
| comment | text | Comentário (máx. 500 caracteres, opcional) |
| dispute_status | text | Status de disputa (se contestada) |
| created_at | timestamptz | Data |

**`evaluation_photos`**
Fotos opcionais anexadas na avaliação.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| evaluation_id | uuid (FK → evaluations) | Avaliação |
| cloudinary_url | text | URL da foto |
| cloudinary_id | text | ID no Cloudinary |
| created_at | timestamptz | Data |

**`evaluation_responses`**
Resposta pública do profissional a uma avaliação.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| evaluation_id | uuid (FK → evaluations) | Avaliação |
| professional_id | uuid (FK) | Profissional |
| response_text | text | Texto da resposta (máx. 500 caracteres) |
| created_at | timestamptz | Data |

#### Assinatura e Pagamentos

**`professional_subscriptions`**
Estado da assinatura do profissional no Stripe.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| stripe_subscription_id | text | ID da subscription no Stripe |
| stripe_price_id | text | ID do price no Stripe (MVP_79) |
| status | subscription_status | TRIAL / ACTIVE / CANCELLED / SUSPENDED |
| trial_ends_at | timestamptz | Fim do período trial |
| current_period_end | timestamptz | Próxima cobrança |
| created_at | timestamptz | Data |

**`payment_transactions`**
Histórico de transações de pagamento.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| stripe_payment_id | text | ID do pagamento no Stripe |
| stripe_invoice_id | text | ID da fatura no Stripe |
| amount | numeric(10,2) | Valor cobrado |
| status | payment_status | PENDING / COMPLETED / FAILED / REFUNDED |
| created_at | timestamptz | Data |

#### Validação e Compliance

**`cpf_validations`**
Cache de validações CPF/CNPJ via SERPRO.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| document | text | CPF ou CNPJ (sanitizado) |
| document_type | text | `cpf` ou `cnpj` |
| status | text | APPROVED / REJECTED / UNAVAILABLE |
| serpro_response | jsonb | Resposta completa da API SERPRO |
| validated_at | timestamptz | Data da validação |

**`content_reports`**
Denúncias de conteúdo impróprio.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| reporter_id | uuid (FK) | Quem denunciou |
| content_type | text | IMAGE / VIDEO / PROFILE |
| content_id | uuid | ID do conteúdo denunciado |
| reason | text | Motivo da denúncia |
| created_at | timestamptz | Data |

**`professional_infractions`**
Infrações registradas contra profissionais.

| Coluna | Tipo | Descrição |
|---|---|---|
| id | uuid (PK) | ID |
| professional_id | uuid (FK) | Profissional |
| type | text | CONTENT_REJECTION / PLAGIARISM / FRAUD |
| consequence | infraction_consequence | Consequência aplicada |
| notes | text | Observações do admin |
| created_at | timestamptz | Data |

### Row Level Security (RLS)

| Tabela | Leitura | Escrita |
|---|---|---|
| `profiles` | Todos | Próprio usuário |
| `professional_profiles` | Público (apenas ACTIVE) | Próprio profissional |
| `professional_specialties` | Público | Próprio profissional |
| `professional_contact_channels` | Autenticados | Próprio profissional |
| `portfolio_projects` | Público (profissional ACTIVE) | Próprio profissional |
| `portfolio_images` | Público (apenas APPROVED) | Próprio profissional |
| `portfolio_videos` | Público (apenas APPROVED) | Próprio profissional |
| `contact_logs` | Profissional (seus logs) | Contratante autenticado |
| `evaluations` | Público | Contratante com contact_log |
| `evaluation_responses` | Público | Próprio profissional |
| `budget_requests` | Contratante (seus) / Profissional (seus) | Contratante autenticado |
| `professional_subscriptions` | Próprio profissional | Sistema (via service role) |
| `cpf_validations` | Próprio profissional | Sistema (via service role) |

### Índices Principais

```sql
idx_professional_profiles_slug          -- Busca por URL amigável
idx_professional_profiles_status        -- Filtrar ACTIVE
idx_professional_profiles_city          -- Busca por localização
idx_portfolio_projects_professional     -- Projetos de um profissional
idx_portfolio_projects_featured         -- Projetos em destaque
idx_contact_logs_professional           -- Logs por profissional
idx_contact_logs_contractor_professional -- Verificar se pode avaliar
idx_evaluations_professional            -- Avaliações de um profissional
idx_profile_activity_logs_professional_created -- Logs recentes
```

---

## 5. Integrações Externas

### Supabase (Auth + Database + Storage)

**Autenticação:**
- Login com email/senha
- Login com Google OAuth
- Callback em `/auth/callback` cria `professional_profiles` ou `contractor_profiles` automaticamente

**Clientes:**
- `src/lib/supabase/client.ts` — Browser (createBrowserClient)
- `src/lib/supabase/server.ts` — Server Components/Actions (createServerComponentClient)

**Storage Buckets:**
- `profiles` — Fotos de perfil (público)
- `portfolio` — Imagens e vídeos de portfólio (público)

---

### Stripe (Pagamentos)

**Plano disponível:**
- `MVP_79` — R$ 79/mês

**Fluxo:**
1. Profissional clica "Assinar" → Stripe Checkout Session criada
2. Pagamento confirmado → webhook `checkout.session.completed`
3. `professional_subscriptions.status` → `ACTIVE`
4. Cobrança recorrente mensal automática

**Webhooks configurados (TO DO — handlers pendentes):**

| Evento | Ação |
|---|---|
| `checkout.session.completed` | Ativar assinatura |
| `invoice.payment_succeeded` | Renovar período |
| `invoice.payment_failed` | Iniciar período de graça (5 dias) |
| `customer.subscription.deleted` | Cancelar e desativar perfil |

**Arquivo:** `src/lib/stripe/client.ts` (singleton com lazy init)

---

### SERPRO — Receita Federal (CPF/CNPJ)

Validação de documentos contra a base da Receita Federal brasileira.

**Endpoints consumidos:**
- `GET /consulta-cpf/v1/cpf/{cpf}` — Valida CPF
- `GET /consulta-cnpj/v1/cnpj/{cnpj}` — Valida CNPJ

**Configuração:**
- Auth: Bearer token (`SERPRO_API_KEY`)
- Base URL: `https://gateway.apiserpro.serpro.gov.br`
- Timeout: 8 segundos

**Respostas:**

```typescript
// CPF
SerproCpfResponse = {
  ni: string          // CPF
  nome: string        // Nome na Receita
  situacao: {
    codigo: string    // "0" = Regular
    descricao: string // "Regular"
  }
  nascimento: string  // "DDMMAAAA"
  ano_obito?: string  // Se falecido
}

// CNPJ
SerproCnpjResponse = {
  ni: string
  nome: string
  situacaoCadastral: {
    codigo: string
    descricao: string // "Ativa"
  }
  dataAbertura: string
}
```

**Cache:** Validações armazenadas por 24h em `cpf_validations`.

**Arquivos:**
- `src/lib/serpro/client.ts` — API client
- `src/lib/serpro/validators.ts` — Validação de checksum local (antes de chamar API)

---

### Cloudinary (Mídia)

Armazenamento e delivery de imagens e vídeos.

**Pastas organizadas:**

| Pasta | Conteúdo | Limite |
|---|---|---|
| `prumo/profiles` | Fotos de perfil | 20MB |
| `prumo/portfolio/images` | Fotos de projetos | 20MB por foto |
| `prumo/portfolio/videos` | Vídeos de projetos | 500MB por vídeo |
| `prumo/evaluations` | Fotos de avaliações | 20MB |

**Formatos aceitos:**
- Imagens: JPG, PNG
- Vídeos: MP4, MOV, AVI

**Arquivo:** `src/lib/cloudinary/config.ts`

---

### Resend (Email)

Envio de emails transacionais com templates React.

**Templates disponíveis:**

| Template | Arquivo | Trigger |
|---|---|---|
| Boas-vindas | `src/lib/resend/templates/welcome.tsx` | Cadastro concluído |
| Perfil ativado | `src/lib/resend/templates/profile-activated.tsx` | Assinatura confirmada |
| Convite de avaliação | `src/lib/resend/templates/evaluation-invite.tsx` | Serviço concluído |

**Sender:** `no-reply@prumo.com.br`

---

### PostHog (Analytics)

Tracking de eventos e sessões dos usuários.

**Configuração:**
- Client: `posthog-js` com localStorage persistence
- Server: `posthog-node` para eventos server-side
- `capture_pageview: false` (pageviews capturados manualmente)

---

### IBGE (Municípios do Brasil)

Busca de municípios para campos de cidade na aplicação.

**Endpoint:** `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`

**Implementação:** `src/lib/ibge.ts`
- Função `searchMunicipios(query)` — busca por prefixo com cache em memória

**Componente:** `src/components/city-input.tsx` — Autocomplete com debounce

---

## 6. Variáveis de Ambiente

### Públicas (expostas ao browser)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=https://prumo.com.br
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=nome-do-cloud
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
```

### Secretas (apenas server-side)

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
SERPRO_API_KEY=Bearer [token]
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@prumo.com.br
```

---

## 7. API Endpoints

### `POST /api/serpro/precheck`

Validação rápida de CPF/CNPJ durante o cadastro. Público (sem auth).

**Rate limit:** 10 requisições/minuto por IP.

**Body:**
```json
{
  "document": "12345678901",
  "type": "cpf"
}
```

**Response:**
```json
{
  "valid": true,
  "status": "APPROVED",
  "message": "Documento válido"
}
```

**Status possíveis:** `APPROVED | REJECTED | ERROR | UNAVAILABLE`

---

### `POST /api/serpro/validate`

Validação completa com cache e armazenamento. Requer autenticação.

**Body:**
```json
{
  "document": "12345678901",
  "type": "cpf"
}
```

**Response:**
```json
{
  "valid": true,
  "status": "APPROVED",
  "message": "CPF Regular",
  "name": "JOÃO DA SILVA"
}
```

---

### `POST /api/stripe/webhook`

Webhook recebido pelo Stripe após eventos de pagamento.

- Valida assinatura com `STRIPE_WEBHOOK_SECRET`
- Atualiza `professional_subscriptions` conforme o evento

---

### `POST /api/upload`

Upload de arquivo de mídia para o Cloudinary. Requer autenticação.

**Body (FormData):**
```
file: [arquivo]
folder: "profiles" | "portfolio"
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/..."
}
```

---

### `POST /api/emails`

Envio de email transacional via Resend.

**Body:**
```json
{
  "to": "usuario@email.com",
  "subject": "Assunto",
  "html": "<p>Conteúdo HTML</p>"
}
```

**Response:**
```json
{ "data": { "id": "..." } }
```

---

### `GET /auth/callback`

Callback do OAuth do Supabase após login com Google.

**Query params:**
- `code` — Código de autorização
- `next` — URL de redirecionamento pós-login
- `new_professional=true` — Indica que deve criar perfil profissional

**Comportamento:**
1. Troca o `code` por sessão
2. Cria `professional_profiles` ou `contractor_profiles` se não existir
3. Inicializa especialidade e canal WhatsApp para novos profissionais
4. Redireciona para `next` ou `/painel`

---

## 8. Fluxos de Usuário

### Fluxo 1: Visitante buscando profissional

```
1. Acessa prumo.com.br
2. Vê categorias de serviço na homepage
3. Clica em uma categoria (ex: "Elétrica")
4. Página /profissionais com filtros: categoria, cidade, nota mínima, badges
5. Navega pelos cards de profissionais
6. Clica em um profissional → /profissionais/[slug]
7. Vê perfil completo: foto, bio, especialidades, portfólio, avaliações, redes sociais
8. Tenta clicar em "Contatar" → redirecionado para /entrar
```

---

### Fluxo 2: Cadastro de Contratante

```
1. Acessa /cadastro
2. Preenche: nome, email, telefone, senha (ou Google OAuth)
3. Conta criada com role = "contractor"
4. Redirecionado para /minha-conta
```

---

### Fluxo 3: Cadastro de Profissional (3 etapas)

```
Etapa 1 — Conta:
  - Nome, email, telefone, senha
  - (ou Google OAuth → pula para etapa 2)

Etapa 2 — Perfil:
  - Cidade e estado (autocomplete IBGE)
  - WhatsApp (canal primário)
  - Especialidade principal

Etapa 3 — Documentos:
  - Tipo de pessoa: PF (CPF + data de nascimento) ou PJ (CNPJ)
  - Validação via /api/serpro/precheck:
    ✅ APPROVED → prossegue
    ❌ REJECTED → bloqueia com mensagem de erro
    ⚠️ UNAVAILABLE → avisa e prossegue (validação manual posterior)

Após cadastro:
  - Status = PENDING
  - Trial de 30 dias inicia
  - Redirecionado ao /painel com tour de onboarding
```

---

### Fluxo 4: Contato com Profissional

```
1. Contratante logado vê perfil do profissional
2. Clica em "WhatsApp", "Ligar" ou "Email"
3. Sistema registra em contact_logs:
   { contractor_id, professional_id, contact_type: "VIEWED_WHATSAPP" }
4. Redirecionado ao link externo (wa.me/..., tel:..., mailto:...)
5. Negociação acontece fora da plataforma
6. Após serviço: contratante recebe convite para avaliar
```

---

### Fluxo 5: Gestão de Portfólio

```
1. /painel/portfolio → lista de projetos existentes
2. "Criar Projeto" → /painel/portfolio/criar:
   - Título, categoria, cidade executada, descrição
3. Projeto criado → adicionar fotos e vídeos:
   - Fotos: upload via Cloudinary → moderation APPROVED imediatamente
   - Vídeos: upload → moderation PENDING → aprovado em até 24h
4. Reordenar projetos via drag & drop (dnd-kit)
5. Marcar até 3 como "destaque" (is_featured = true)
6. Projetos de profissionais ACTIVE aparecem publicamente
```

---

### Fluxo 6: Assinatura

```
Trial (30 dias):
  - Profissional usa a plataforma gratuitamente
  - Checklist de completude no painel (incentiva completar perfil)
  - CTA para assinar aparece conforme trial se aproxima do fim

Assinatura:
  1. Clica "Assinar Agora" no painel
  2. Stripe Checkout (cartão de crédito ou boleto)
  3. Pagamento confirmado → webhook → status = ACTIVE
  4. Perfil visível na busca

Cancelamento:
  - Profissional cancela no Stripe Customer Portal
  - status = CANCELLED
  - Perfil desativado imediatamente (invisível na busca)
  - Sem reembolso proporcional

Inadimplência:
  - Falha no pagamento → 5 dias de graça
  - Após 5 dias → status = SUSPENDED → perfil desativado
  - Profissional pode regularizar e reativar
```

---

### Fluxo 7: Avaliações

```
Pré-requisito: contratante deve ter contact_log com o profissional

1. Contratante acessa perfil do profissional que contratou
2. Botão "Avaliar" disponível (verificado via contact_logs)
3. Formulário: nota 1-5 + comentário (opcional) + fotos (opcional)
4. Avaliação salva em evaluations
5. Métricas do profissional atualizadas (average_rating, total_evaluations)
6. Profissional notificado
7. Profissional pode responder em até 48h (evaluation_responses)
8. Avaliação aparece publicamente no perfil

Disputa (futuro):
  - Contratante disputa em até 7 dias
  - Mediação em 5 dias úteis
  - Resultado: manter, remover ou ajustar avaliação
```

---

## 9. Regras de Negócio

### Validação de Documentos

- CPF deve ter checksum válido antes de chamar SERPRO
- Situação na Receita Federal deve ser "Regular" para ativar
- Falecidos (ano_obito preenchido) são bloqueados
- CNPJ deve estar "Ativa"
- Validação armazenada por 24h (cache)
- Profissional menor de 18 anos: bloqueado (via data de nascimento)

### Assinatura e Trial

- Trial de 30 dias sem cartão
- Após trial: cobrança automática via Stripe
- Cancelamento desativa perfil **imediatamente** (sem período proporcional)
- Suspensão por inadimplência: 5 dias de graça antes de desativar
- Reativação: regularizar pagamento no Stripe

### Visibilidade do Perfil

- Status `ACTIVE` → visível na busca e perfil público
- Status `PENDING` → invisível (apenas o dono vê)
- Status `SUSPENDED` / `CANCELLED` / `BANNED` → invisível

### Portfólio — Limites

| Recurso | Plano MVP |
|---|---|
| Projetos | 20 |
| Fotos por projeto | 50 |
| Vídeos por projeto | 3 |
| Projetos em destaque | 3 |

### Moderação de Conteúdo

**Fotos:** Aprovação automática por IA. Rejeitadas se detectar:
- Conteúdo adulto ou violento
- Rostos sem consentimento
- Imagens de IA apresentadas como reais

**Vídeos:** Revisão manual em até 24h. Rejeitados se conter:
- Publicidade de marcas terceiras
- Conteúdo adulto ou violento
- Plágio (detecção por hash)

**Consequências de infrações:**
- 1-2 reprovações → aviso
- 3 reprovações → revisão manual obrigatória futura
- Fraude comprovada → banimento permanente

### Sistema de Reputação

| Condição | Consequência |
|---|---|
| Nota média < 3.5 por 3 meses seguidos | Suspensão automática |
| 3 reclamações comprovadas | Banimento permanente |
| Fraude em avaliações | Banimento permanente |

### Avaliações — Regras

- Apenas contratantes com `contact_log` podem avaliar
- Nota de 1 a 5 (inteira)
- Comentário: máx. 500 caracteres (opcional)
- Profissional pode responder uma única vez (máx. 500 caracteres)
- Avaliação pode ser contestada em até 7 dias pelo contratante
- Sistema de disputas (mediação): em desenvolvimento

### Canais de Contato

- Mínimo 1 canal ativo obrigatório
- Exatamente 1 canal marcado como primário (`is_primary = true`)
- Canais disponíveis: WhatsApp, Telefone, Email, Instagram, Facebook, Site, Outro

---

## 10. Categorias de Serviço

| Slug | Nome exibido |
|---|---|
| `construcao` | Construção |
| `eletrica` | Elétrica |
| `hidraulica` | Hidráulica |
| `acabamento` | Acabamento |
| `pisos` | Pisos |
| `serralheria` | Serralheria |
| `marcenaria` | Marcenaria |
| `jardinagem` | Jardinagem |
| `limpeza` | Limpeza |
| `projeto` | Projeto |
| `engenharia` | Engenharia |
| `tecnologia` | Tecnologia |
| `climatizacao` | Climatização |

---

## 11. Roadmap

### Implementado

- Autenticação (email/senha + Google OAuth)
- Cadastro multi-step de profissional com validação SERPRO
- Perfil completo do profissional (bio, foto, especialidades, affinidades, contatos, redes sociais)
- Portfólio com projetos, fotos e vídeos (upload via Cloudinary)
- Drag & drop para reordenar projetos
- Busca pública de profissionais com filtros
- Perfil público do profissional
- Registro de contatos (`contact_logs`)
- Sistema de avaliações com resposta do profissional
- Registro de serviços concluídos
- Dashboard do profissional com métricas e checklist
- Log de atividades do perfil (`profile_activity_logs`)
- Integração SERPRO (CPF/CNPJ) com cache
- RLS em todas as tabelas do banco
- Analytics com PostHog
- Templates de email (Resend)

### Pendente / Em Desenvolvimento

- Webhooks Stripe (ativar, renovar, suspender assinatura automaticamente)
- Dashboard administrativo (moderação de vídeos, gestão de usuários)
- Sistema de disputas de avaliações
- Emails transacionais (rota pronta, disparo pendente)
- Solicitações de orçamento e propostas (schema pronto, UI pendente)
- Escrow de pagamentos (Fase 2)
- Revalidação de CPF a cada renovação de assinatura
- Testes automatizados
- App mobile (React Native)

---

*Documentação gerada em 07/04/2026.*
