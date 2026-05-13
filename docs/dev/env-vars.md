# Variáveis de Ambiente

Crie `.env.local` na raiz do projeto com as variáveis abaixo.

## Supabase

```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co

# Chave anônima (segura para o client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Chave de serviço (NUNCA expor no client-side)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Mercado Pago

```env
# Token de acesso (TEST-... para sandbox, APP-... para produção)
MP_ACCESS_TOKEN=TEST-xxxx

# ID do plano criado via /api/mercadopago/setup-plan
MP_PLAN_ID=408Bxxxx
```

## URLs da Aplicação

```env
# URL base local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# URL de produção
NEXT_PUBLIC_MAIN_URL=https://meuprumo.com.br
```

## Resend (Email)

```env
RESEND_API_KEY=re_xxxx

# Remetente configurado no Resend
RESEND_FROM_EMAIL=no-reply@meuprumo.com.br
```

## SERPRO

```env
# Chave de acesso à API do SERPRO/Receita Federal
SERPRO_API_KEY=xxxx

# URL base (sandbox ou produção)
SERPRO_BASE_URL=https://gateway.apiserpro.serpro.gov.br
```

## PostHog (Analytics)

```env
# Chave pública do projeto PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxx

# Host do PostHog (cloud ou self-hosted)
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## BigDataCloud (Geocodificação)

```env
# Chave da API BigDataCloud
BIGDATACLOUD_API_KEY=xxxx
```

## Admin

```env
# Secret para criar usuários via API antes de ter admin autenticado
SETUP_SECRET=qualquer-segredo-forte
```

## Cloudinary (se usar upload direto)

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=prumo
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

!!! note "Cloudinary vs Supabase Storage"
    O projeto usa Supabase Storage para fotos de perfil e Cloudinary para mídia de portfólio (imagens e vídeos). Apenas as variáveis Cloudinary são necessárias se o upload de portfólio estiver ativo.

## Ambiente de Produção

No Vercel, configure as variáveis em **Project Settings → Environment Variables**.

Variáveis prefixadas com `NEXT_PUBLIC_` são expostas no bundle client-side. As demais são server-only.

!!! danger "Segurança"
    - `SUPABASE_SERVICE_ROLE_KEY` → nunca expor no client-side
    - `MP_ACCESS_TOKEN` → nunca expor no client-side
    - `SERPRO_API_KEY` → nunca expor no client-side
    - `CLOUDINARY_API_SECRET` → nunca expor no client-side
    - `SETUP_SECRET` → trocar para algo forte em produção
