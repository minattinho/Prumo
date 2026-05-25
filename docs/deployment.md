# Deploy e Configuração

## Pré-requisitos de Serviços

Antes de fazer deploy, é necessário ter contas e credenciais em:

| Serviço | Necessário para | Link |
|---------|----------------|------|
| Supabase | Banco de dados, autenticação, storage | supabase.com |
| Mercado Pago | Assinaturas recorrentes | mercadopago.com.br/developers |
| Cloudinary | Upload e CDN de imagens/vídeos | cloudinary.com |
| Resend | Emails transacionais | resend.com |
| SERPRO | Validação de CPF/CNPJ | servicos.serpro.gov.br |
| PostHog | Analytics de comportamento | posthog.com |
| BigDataCloud | Geocodificação reversa | bigdatacloud.com |

---

## Variáveis de Ambiente

Criar `.env.local` na raiz (nunca commitar):

```env
# ─── Supabase ────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# ─── URLs da aplicação ───────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_URL=https://meuprumo.com.br

# Cookie domain (opcional — calculado automaticamente de MAIN_URL)
# NEXT_PUBLIC_COOKIE_DOMAIN=.meuprumo.com.br

# ─── Mercado Pago ────────────────────────────────────────────
MP_ACCESS_TOKEN=<access-token>
MP_PLAN_ID=<plan-id>

# ─── Email (Resend) ──────────────────────────────────────────
RESEND_API_KEY=<api-key>
RESEND_FROM_EMAIL=no-reply@meuprumo.com.br

# ─── Validação de documentos (SERPRO) ───────────────────────
SERPRO_API_KEY=<api-key>
SERPRO_BASE_URL=https://gateway.apiserpro.serpro.gov.br

# ─── Analytics (PostHog) ────────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=<project-api-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ─── Geocodificação (BigDataCloud) ──────────────────────────
BIGDATACLOUD_API_KEY=<api-key>

# ─── Admin ───────────────────────────────────────────────────
SETUP_SECRET=<secret-para-endpoints-admin>
```

### Notas por variável

**`NEXT_PUBLIC_SUPABASE_URL`** — URL do projeto Supabase. Encontrada em Project Settings > API.

**`NEXT_PUBLIC_SUPABASE_ANON_KEY`** — Chave anônima (safe para expor no browser). Project Settings > API.

**`SUPABASE_SERVICE_ROLE_KEY`** — Chave com bypass de RLS. NUNCA expor no cliente. Usado apenas em Route Handlers e Server Actions.

**`NEXT_PUBLIC_MAIN_URL`** — URL de produção sem trailing slash. Define o cookie domain automaticamente (`.meuprumo.com.br`).

**`MP_PLAN_ID`** — ID do plano de assinatura criado via `/api/mercadopago/setup-plan`. Executar uma vez em produção para criar o plano.

**`SETUP_SECRET`** — Secret arbitrário para proteger endpoints de setup (`/api/mercadopago/setup-plan`, `/api/admin/criar-usuario`). Gerar string aleatória segura.

---

## Setup do Supabase

### 1. Criar Projeto

1. Criar projeto em [supabase.com](https://supabase.com)
2. Anotar URL, anon key e service role key

### 2. Aplicar Schema

No Supabase Dashboard > SQL Editor:
```sql
-- Executar conteúdo de supabase/schema.sql
```

Isso criará todas as 26 tabelas, enums, índices, triggers e políticas RLS.

### 3. Configurar Auth

Dashboard > Authentication > Settings:
- **Site URL:** `https://meuprumo.com.br`
- **Redirect URLs:** adicionar `https://meuprumo.com.br/auth/callback` e `https://app.meuprumo.com.br/auth/callback`

Para Google OAuth:
- Dashboard > Authentication > Providers > Google
- Adicionar Client ID e Secret do Google Cloud Console
- No Google Cloud: Authorized redirect URIs → `https://<project>.supabase.co/auth/v1/callback`

### 4. Criar Storage Buckets

Dashboard > Storage > New Bucket:
- `profiles` — público, 5MB max por arquivo
- `portfolio` — público, 50MB max por arquivo (vídeos)

### 5. Criar Plano MercadoPago

Uma vez em produção:
```bash
curl -X POST https://meuprumo.com.br/api/mercadopago/setup-plan \
  -H "x-setup-secret: ${SETUP_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Prumo Mensal", "amount": 79.00, "currency": "BRL"}'
```

Copiar o `plan_id` retornado para a variável `MP_PLAN_ID`.

---

## Deploy na Vercel

### 1. Conectar Repositório

1. [vercel.com](https://vercel.com) > Add New Project
2. Importar repositório do GitHub
3. Framework: Next.js (detectado automaticamente)

### 2. Configurar Variáveis de Ambiente

Vercel Dashboard > Project Settings > Environment Variables

Adicionar todas as variáveis do `.env.local`, separando por environment:
- **Production:** `NEXT_PUBLIC_MAIN_URL=https://meuprumo.com.br`
- **Preview:** `NEXT_PUBLIC_MAIN_URL=https://preview.meuprumo.com.br` (ou URL gerada)
- **Development:** não necessário (usa `.env.local` local)

### 3. Configurar Domínios

Vercel Dashboard > Project > Domains:
- Adicionar `meuprumo.com.br` (domínio principal)
- Adicionar `app.meuprumo.com.br` (painel do profissional)

No DNS do domínio:
```
meuprumo.com.br      CNAME  cname.vercel-dns.com
app.meuprumo.com.br  CNAME  cname.vercel-dns.com
```

### 4. Deploy

```bash
# Deploy automático a cada push para main
git push origin main

# Deploy manual via CLI (instalar: npm i -g vercel)
vercel --prod
```

---

## Configuração de Cookies Cross-Subdomínio

O cookie de sessão do Supabase precisa ser válido em ambos `meuprumo.com.br` e `app.meuprumo.com.br`.

**Mecanismo:** `getCookieDomain()` em `src/lib/supabase/cookie-domain.ts` retorna `.meuprumo.com.br` (com ponto inicial) em produção. Isso permite que o cookie seja lido nos dois subdomínios.

**Em desenvolvimento:** retorna `undefined` (cookie fica em `localhost`, sem subdomínio).

**Override manual:** definir `NEXT_PUBLIC_COOKIE_DOMAIN=.meuprumo.com.br` para forçar o domínio.

---

## Configuração de Produção do MercadoPago

### Webhooks

No Painel do Mercado Pago > Integrações > Webhooks:
- URL de notificação: `https://meuprumo.com.br/api/mercadopago/webhook`
- Eventos: `payment`, `preapproval`

### Modo Produção vs Sandbox

- Para testes: usar `MP_ACCESS_TOKEN` do ambiente de sandbox
- Para produção: usar `MP_ACCESS_TOKEN` de produção (obtido após aprovação da conta no MP)

---

## Verificação Pós-Deploy

```bash
# 1. Checar se a aplicação está no ar
curl https://meuprumo.com.br

# 2. Verificar API de mapa
curl https://meuprumo.com.br/api/map-professionals

# 3. Testar geocodificação
curl "https://meuprumo.com.br/api/geocode?lat=-23.55&lon=-46.63"

# 4. Verificar robots.txt e sitemap
curl https://meuprumo.com.br/robots.txt
curl https://meuprumo.com.br/sitemap.xml
```
