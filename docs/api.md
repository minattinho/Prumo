# API Reference

Todos os Route Handlers ficam em `src/app/api/`. Autenticação via cookie de sessão Supabase quando necessário.

---

## GET /api/map-professionals

Retorna profissionais ativos com localização para o mapa da homepage.

**Cache:** `public, max-age=300, stale-while-revalidate=60` (5 minutos)

**Auth:** Não requerida

**Response 200:**
```json
[
  {
    "id": "uuid",
    "slug": "joao-silva-eletricista",
    "name": "João Silva",
    "city": "São Paulo",
    "state": "SP",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "main_specialty": "eletricista",
    "photo_url": "https://res.cloudinary.com/..."
  }
]
```

---

## GET /api/geocode

Geocodificação reversa: coordenadas → cidade e estado.

**Auth:** Não requerida

**Query params:**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `lat` | number | Latitude |
| `lon` | number | Longitude |

**Serviço:** BigDataCloud Reverse Geocoding API

**Response 200:**
```json
{
  "city": "São Paulo",
  "state": "SP",
  "stateCode": "SP"
}
```

**Response 400:** `{ "error": "lat e lon são obrigatórios" }`

---

## POST /api/upload

Upload de arquivo para Cloudinary.

**Auth:** Requerida (sessão Supabase)

**Body:** `multipart/form-data`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `file` | File | Arquivo a fazer upload |
| `folder` | string | Pasta no Cloudinary (ex: `'profiles'`, `'portfolio'`) |

**Response 200:**
```json
{
  "cloudinary_id": "portfolio/abc123",
  "cloudinary_url": "https://res.cloudinary.com/prumo/image/upload/...",
  "width": 1920,
  "height": 1080
}
```

**Response 400:** `{ "error": "Arquivo não encontrado" }`

**Response 401:** `{ "error": "Não autenticado" }`

---

## POST /api/serpro/precheck

Validação local de CPF ou CNPJ (checksum algorítmico, sem consulta externa).

**Auth:** Não requerida

**Body:**
```json
{ "document": "12345678901", "type": "cpf" }
```

| Campo | Valores |
|-------|---------|
| `type` | `"cpf"` \| `"cnpj"` |

**Response 200:**
```json
{ "valid": true }
```

**Response 200 (inválido):**
```json
{ "valid": false, "error": "CPF inválido" }
```

---

## POST /api/serpro/validate

Validação oficial via API SERPRO (Receita Federal). Resultado cacheado 24h em `cpf_validations`.

**Auth:** Requerida (profissional autenticado)

**Body:**
```json
{ "document": "12345678901", "type": "cpf" }
```

**Response 200:**
```json
{
  "valid": true,
  "status": "APPROVED",
  "name": "JOÃO DA SILVA"
}
```

**Response 200 (rejeitado):**
```json
{
  "valid": false,
  "status": "REJECTED",
  "reason": "CPF irregular na Receita Federal"
}
```

**Response 429:** Cache hit válido retornado (não faz nova consulta)

---

## POST /api/emails

Envio de email transacional via Resend.

**Auth:** Requerida (ou secret interno)

**Body:**
```json
{
  "type": "welcome",
  "to": "usuario@email.com",
  "data": { "name": "João" }
}
```

| `type` | Template | Destinatário |
|--------|----------|-------------|
| `welcome` | Boas-vindas ao profissional | Profissional recém-cadastrado |
| `profile_activated` | Perfil ativado | Profissional após ativação |
| `evaluation_invite` | Convite para avaliação | Contratante após contato |

**Templates:** `src/lib/resend/templates/` (componentes React Email)

**Response 200:** `{ "id": "resend-message-id" }`

**Response 400:** `{ "error": "Tipo de email inválido" }`

---

## POST /api/mercadopago/checkout

Cria uma PreApproval (assinatura recorrente) no Mercado Pago e retorna o link de checkout.

**Auth:** Requerida (profissional)

**Body:** Sem body (usa dados do profissional da sessão)

**Response 200:**
```json
{
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=...",
  "subscription_id": "uuid"
}
```

**Response 400:** `{ "error": "Profissional já possui assinatura ativa" }`

**Fluxo:**
1. Cria PreApproval no MP via `MP_PLAN_ID`
2. INSERT em `professional_subscriptions` com status `TRIAL`
3. Retorna `init_point` para redirect do browser

---

## POST /api/mercadopago/setup-plan

Cria o plano de assinatura no Mercado Pago (operação de setup única, executada por admin).

**Auth:** Header `x-setup-secret: ${SETUP_SECRET}`

**Body:**
```json
{
  "name": "Prumo Mensal",
  "amount": 79.00,
  "currency": "BRL"
}
```

**Response 200:** `{ "plan_id": "mp-plan-id" }`

---

## POST /api/mercadopago/webhook

Recebe notificações de eventos do Mercado Pago.

**Auth:** Validação de assinatura HMAC do MP

**Body:** Payload IPN do Mercado Pago

**Eventos tratados:**

| Evento MP | Ação |
|-----------|------|
| `payment.approved` | `subscription_status → ACTIVE`, `subscription_paid_until` atualizado |
| `payment.rejected` | `subscription_status → SUSPENDED`, `professional_status → SUSPENDED` |
| `preapproval.cancelled` | `subscription_status → CANCELLED` |

**Response 200:** `{ "received": true }`

---

## POST /api/admin/criar-usuario

Criação manual de usuário (admin bypass do signup normal).

**Auth:** Header `x-setup-secret: ${SETUP_SECRET}` ou sessão admin

**Body:**
```json
{
  "email": "prof@email.com",
  "name": "Maria Santos",
  "role": "professional",
  "password": "senha123"
}
```

**Response 200:** `{ "user_id": "uuid" }`

**Response 403:** `{ "error": "Não autorizado" }`

---

## GET /api/auth/callback

Callback OAuth do Supabase (Google OAuth flow).

**Auth:** Não requerida (é o destino do redirect do Google)

**Query params:**

| Param | Descrição |
|-------|-----------|
| `code` | Authorization code do provider OAuth |
| `next` | URL para redirect após login (ex: `/painel`) |

**Fluxo:**
1. Recebe `code` do Google
2. `supabase.auth.exchangeCodeForSession(code)`
3. Cookie de sessão setado com `getCookieDomain()`
4. Redirect para `next` ou `/painel`
