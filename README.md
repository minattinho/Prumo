# Prumo

> Marketplace SaaS brasileiro que conecta contratantes a profissionais verificados de construção, reforma e serviços especializados.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · Supabase · Mercado Pago · Resend · PostHog

---

## O que é o Prumo

O Prumo resolve um problema duplo no mercado brasileiro de serviços:

- **Contratante** — dificuldade de encontrar profissionais confiáveis e verificados na sua região
- **Profissional** — falta de vitrine digital acessível para divulgar trabalho, portfólio e receber clientes

**Modelo de negócio:** profissionais pagam R$79/mês para manter perfil ativo. Contratantes acessam gratuitamente.

---

## Sumário

1. [Stack Técnica](#stack-técnica)
2. [Arquitetura](#arquitetura)
3. [Rotas e Funcionalidades](#rotas-e-funcionalidades)
4. [Regras de Negócio](#regras-de-negócio)
5. [Banco de Dados](#banco-de-dados)
6. [APIs Externas](#apis-externas)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)
8. [Como Rodar Localmente](#como-rodar-localmente)
9. [Categorias de Serviço](#categorias-de-serviço)

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, SSR, Server Actions) |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS v4 + PostCSS |
| UI | Radix UI + shadcn/ui |
| Formulários | React Hook Form + Zod |
| Banco de dados | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/senha + Google OAuth) |
| Storage | Supabase Storage + Cloudinary (CDN de mídia) |
| Pagamentos | Mercado Pago (PreApproval — assinaturas recorrentes) |
| Email | Resend (templates React) |
| Analytics | PostHog |
| Validação de documentos | SERPRO API (CPF/CNPJ via Receita Federal) |
| Geocodificação | BigDataCloud |
| Cidades brasileiras | IBGE API |
| Mapas | Leaflet + React-Leaflet |
| Drag-and-drop | @dnd-kit |
| Gráficos | Recharts |

---

## Arquitetura

### Estrutura de Rotas (Next.js App Router)

```
src/app/
├── (public)/              # Acesso irrestrito
│   ├── page.tsx           # Home
│   ├── profissionais/     # Busca e perfil público
│   ├── seja-profissional/ # Cadastro de profissional (3 etapas)
│   ├── planos/            # Preços e checkout
│   └── sobre|termos|privacidade/
│
├── (auth)/                # Login e cadastro
│   ├── contratante/       # Login + signup de contratante
│   ├── profissional/      # Login de profissional e admin
│   └── redefinir-senha/
│
├── (professional)/painel/ # Requer role=professional
│   ├── page.tsx           # Dashboard com métricas
│   ├── perfil/            # Editor de perfil público
│   ├── portfolio/         # Gerenciador de projetos
│   ├── servicos/          # Histórico de serviços
│   ├── solicitacoes/      # Inbox de orçamentos
│   ├── avaliacoes/        # Avaliações recebidas
│   ├── assinatura/        # Gestão de assinatura
│   ├── acessos/           # Logs de visitas ao perfil
│   └── configuracoes/     # Preferências da conta
│
├── (contractor)/          # Requer role=contractor
│   └── minha-conta/       # Dashboard do contratante
│
├── (admin)/admin/         # Requer role=admin
│   ├── page.tsx           # Dashboard admin
│   ├── usuarios/          # Listagem de usuários
│   └── criar-usuario/     # Criação manual de usuário
│
└── api/                   # Route Handlers (REST)
    ├── auth/callback/     # OAuth callback
    ├── upload/            # Upload para Supabase/Cloudinary
    ├── map-professionals/ # Dados do mapa (cache 5min)
    ├── geocode/           # Geocodificação reversa
    ├── serpro/            # Validação CPF/CNPJ
    ├── emails/            # Envio de emails transacionais
    ├── mercadopago/       # Checkout e planos
    └── admin/             # Endpoints administrativos
```

### Proteção de Rotas

Autorização via **layouts server-side**: cada grupo de rotas tem `layout.tsx` que consulta o Supabase Server Client, verifica sessão e `role`, e redireciona conforme necessário. Não há middleware Edge.

### Clientes Supabase

| Arquivo | Uso |
|---|---|
| `src/lib/supabase/server.ts` | Server Components, Route Handlers, Server Actions (lê cookies) |
| `src/lib/supabase/client.ts` | Client Components (browser) |

---

## Rotas e Funcionalidades

### Área Pública

#### `/` — Home

- **HeroSearch**: busca com autocomplete de categorias e cidades (IBGE)
- **HeroMap**: mapa interativo (Leaflet) com profissionais ativos, centralizando na localização do visitante
- Grid de categorias clicáveis
- Seção "Como funciona" + depoimentos

#### `/profissionais` — Busca de Profissionais

Listagem paginada com busca full-text e filtros via query string:

| Parâmetro | Descrição |
|---|---|
| `q` | Texto livre (nome, especialidade) |
| `categoria` | Categoria de serviço |
| `cidade` | Cidade de atuação |
| `ordem` | Critério de ordenação |
| `avaliacao` | Nota mínima (1–5) |
| `verificacao` | Apenas profissionais com documento validado |
| `tipo` | Pessoa Física ou Jurídica |
| `pagina` | Paginação |

#### `/profissionais/[slug]` — Perfil do Profissional

Página pública e indexável (SSR para SEO). Exibe:

- Foto, nome, bio, cidade, raio de atendimento
- Badges de verificação (VERIFIED, TRUSTWORTHY, CERTIFIED)
- Especialidades e tags livres (affinities)
- Portfólio com galeria de imagens/vídeos por projeto
- Canais de contato revelados sob demanda (cada visualização gera `contact_log`)
- Redes sociais
- Avaliações de contratantes com possibilidade de resposta do profissional

#### `/seja-profissional` — Cadastro de Profissional

Onboarding em 3 etapas:
1. **Conta** — email, senha ou Google OAuth, nome, telefone
2. **Perfil** — especialidade principal, cidade, foto, bio
3. **Documentos** — CPF ou CNPJ validado via SERPRO

Ao concluir: status `PENDING`, trial de 30 dias iniciado.

### Painel do Profissional (`/painel`)

| Rota | O que faz |
|---|---|
| `/painel` | Dashboard: status de assinatura, completude do perfil, métricas (views, contatos, nota) |
| `/painel/perfil` | Editor: foto, bio, especialidades, affinities, canais de contato, redes sociais, cidade/raio |
| `/painel/portfolio` | Criar/editar projetos com imagens e vídeos; drag-and-drop para reordenar; até 3 projetos em destaque |
| `/painel/servicos` | Histórico de serviços concluídos com fotos (movíveis para o portfólio) |
| `/painel/solicitacoes` | Inbox de pedidos de orçamento com status (NOVA/RESPONDIDA/EM NEGOCIAÇÃO/RECUSADA) |
| `/painel/solicitacoes/[id]/proposta` | Formulário de proposta: valor, prazo, abordagem, até 3 etapas de pagamento |
| `/painel/avaliacoes` | Lista de avaliações com opção de resposta pública e gestão de disputas |
| `/painel/assinatura` | Status, histórico de pagamentos, botão de assinar (Mercado Pago) |
| `/painel/acessos` | Log de visitas: quem visualizou o perfil e quais canais de contato |
| `/painel/configuracoes` | Notificações, privacidade, exclusão de conta |

### Área do Contratante

#### `/minha-conta`

- Histórico de contatos com profissionais
- Avaliações já enviadas
- Dados da conta

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
| `SUSPENDED` | Fora do ar (pagamento inadimplente ou infração) |
| `BANNED` | Banido permanentemente |

Somente `status=ACTIVE` aparece nos resultados de busca e no mapa.

### Status da Assinatura

```
TRIAL → ACTIVE → CANCELLED
               → SUSPENDED
```

| Status | Descrição |
|---|---|
| `TRIAL` | 30 dias gratuitos a partir do cadastro |
| `ACTIVE` | Assinatura paga e vigente |
| `CANCELLED` | Cancelado pelo profissional |
| `SUSPENDED` | Pagamento falhou; perfil suspenso |

### Avaliações

- Cada par contratante-profissional tem **no máximo uma avaliação** (constraint UNIQUE no banco)
- Só pode avaliar se houver `contact_log` registrado — contratante precisa ter visualizado um canal de contato

### Portfólio

- Cada projeto suporta múltiplas imagens e vídeos (Cloudinary)
- **Máximo 3 projetos em destaque** por profissional (aplicado por constraint no banco)
- Toda mídia inicia `PENDING` e precisa ser aprovada por moderação antes de aparecer publicamente

### Moderação de Conteúdo

```
PENDING → APPROVED
         → REJECTED
```

Mídia rejeitada gera infração. Infrações acumuladas:

| Tipo | Consequência |
|---|---|
| `CONTENT_REJECTION` | Revisão manual obrigatória |
| `PLAGIARISM` | Suspensão |
| `FRAUD` | Banimento |

### Validação de Documentos (CPF/CNPJ)

1. **Pré-validação local** — checksum algorítmico (regras da Receita Federal)
2. **Validação SERPRO** — consulta à API da Receita Federal; resultado cacheado 24h em `cpf_validations`

### Geolocalização

O mapa exibe profissionais com `status=ACTIVE` que têm cidade/estado cadastrados. Resposta cacheada 5 minutos (`public, max-age=300, stale-while-revalidate=60`).

---

## Banco de Dados

25 tabelas PostgreSQL no Supabase, todas com Row Level Security (RLS) habilitada.

### Tabelas Principais

| Tabela | Descrição |
|---|---|
| `profiles` | Espelho dos usuários do Supabase Auth |
| `contractor_profiles` | Dados específicos do contratante |
| `professional_profiles` | Dados do profissional (slug, CPF/CNPJ, foto, bio, cidade, status, assinatura) |
| `professional_specialties` | Categorias de serviço |
| `professional_affinities` | Tags livres |
| `professional_contact_channels` | WhatsApp, Telefone, Email, Instagram, Facebook, Site |
| `professional_social_networks` | Handles de redes sociais |
| `portfolio_projects` | Projetos do portfólio |
| `portfolio_images` | Imagens com moderação (Cloudinary) |
| `portfolio_videos` | Vídeos com moderação (Cloudinary) |
| `contact_logs` | Registro de visualizações de canais de contato (gatekeeper de avaliações) |
| `budget_requests` | Solicitações de orçamento |
| `proposals` | Propostas em resposta a orçamentos |
| `completed_services` | Histórico de serviços realizados |
| `service_photos` | Fotos de serviços concluídos |
| `evaluations` | Avaliações (nota 1–5, comentário, disputa) |
| `evaluation_photos` | Fotos de evidência em disputas |
| `evaluation_responses` | Respostas públicas do profissional a avaliações |
| `professional_metrics` | Cache de métricas (views, contatos, nota média) |
| `verification_badges` | Badges VERIFIED, TRUSTWORTHY, CERTIFIED |
| `professional_subscriptions` | Histórico de assinaturas (Mercado Pago) |
| `payment_transactions` | Transações financeiras individuais |
| `cpf_validations` | Cache de validações SERPRO |
| `content_reports` | Denúncias de conteúdo |
| `professional_infractions` | Registro de infrações acumuladas |

### Políticas RLS Principais

- Perfis `ACTIVE`: leitura pública
- Portfólio `APPROVED`: leitura pública
- Canais de contato: visíveis para usuários autenticados
- Dados sensíveis (assinatura, métricas, logs): apenas o próprio usuário
- Avaliações: somente contratantes com `contact_log` registrado podem inserir

### Storage Buckets

| Bucket | Uso | Acesso |
|---|---|---|
| `profiles/` | Fotos de perfil | Leitura pública, escrita pelo dono |
| `portfolio/` | Imagens e vídeos de portfólio | Leitura pública, escrita pelo dono |

---

## APIs Externas

| Serviço | Uso | Rota interna |
|---|---|---|
| **SERPRO** | Validação de CPF/CNPJ via Receita Federal | `/api/serpro/validate`, `/api/serpro/precheck` |
| **IBGE** | Autocomplete de cidades brasileiras | Consumido direto no componente `CityInput` |
| **BigDataCloud** | Geocodificação reversa (lat/lon → cidade, estado) | `/api/geocode` |
| **Mercado Pago** | Assinaturas recorrentes via PreApproval | `/api/mercadopago/checkout`, `/api/mercadopago/setup-plan` |
| **Cloudinary** | Upload, armazenamento e CDN de imagens/vídeos | `/api/upload` |
| **Resend** | Emails transacionais (boas-vindas, notificações) | `/api/emails` |
| **PostHog** | Analytics de comportamento (page views, eventos, conversão) | Client + server SDKs |

### Fluxo de Pagamento (Mercado Pago)

1. Profissional clica em "Assinar" no `/painel/assinatura`
2. POST para `/api/mercadopago/checkout` cria PreApproval e retorna `init_point`
3. Usuário é redirecionado ao checkout do Mercado Pago
4. **Webhooks** (a implementar): `payment.approved` → `ACTIVE`, `payment.rejected` → `SUSPENDED`, `preapproval.cancelled` → `CANCELLED`

---

## Variáveis de Ambiente

Crie `.env.local` na raiz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mercado Pago
MP_ACCESS_TOKEN=
MP_PLAN_ID=

# URLs da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_URL=https://meuprumo.com.br

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=no-reply@prumo.com.br

# Validação de documentos (SERPRO)
SERPRO_API_KEY=
SERPRO_BASE_URL=

# Analytics (PostHog)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Geocodificação (BigDataCloud)
BIGDATACLOUD_API_KEY=

# Admin
SETUP_SECRET=
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
# Execute supabase/schema.sql no Supabase SQL Editor

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

| URL | Contexto |
|---|---|
| `localhost:3000` | Área pública + cadastro de contratantes |
| `localhost:3000/painel` | Painel do profissional |
| `localhost:3000/admin` | Painel administrativo |

---

## Categorias de Serviço

A plataforma suporta 5 grandes categorias com mais de 50 serviços específicos:

### Casa e Construção

**Obras e Reformas:** pedreiro, pintor, eletricista, encanador, gesseiro, azulejista, marceneiro, serralheiro, vidraceiro, telhadista, impermeabilização, drywall, pisos

**Projetos:** arquitetura, design de interiores, engenharia civil

### Reparos e Manutenção

**Instalações:** montagem de móveis, TV, antena, automação residencial

**Assistência Técnica:** eletrodomésticos, ar-condicionado, computadores, celulares

### Tecnologia e Desenvolvimento

**Desenvolvimento:** sites, sistemas web, apps mobile, e-commerce, SaaS

**Automação e IA:** chatbots, n8n, integrações, agentes de IA

**Infraestrutura:** bancos de dados, cloud, DevOps

### Design e Criatividade

**Design Gráfico:** logos, identidade visual, publicidade

**UX/UI:** design de interfaces, prototipação

**Audiovisual:** edição de vídeos, motion design, modelagem 3D

### Marketing e Vendas

**Marketing Digital:** redes sociais, tráfego pago, SEO, copywriting, email marketing

**Vendas:** SDR, consultoria comercial
