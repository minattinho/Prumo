# Endpoints da API

Todos os endpoints são Route Handlers do Next.js em `src/app/api/`.

## Autenticação

### `GET /api/auth/callback`

Callback do fluxo OAuth (Supabase + Google).

Troca o `code` da query string por uma sessão autenticada e redireciona:

- Profissional → `/painel`
- Contratante → `/` (ou `?next=` se presente)
- Admin → `/admin`

---

## Upload

### `POST /api/upload`

Requer autenticação.

Faz upload de arquivo para Supabase Storage ou Cloudinary conforme o tipo.

**Headers:**
```
Content-Type: multipart/form-data
```

**Body:**
| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `file` | File | Sim | Arquivo para upload |
| `type` | string | Sim | `profile` \| `portfolio` \| `service` |
| `projectId` | string | Não | ID do projeto (para `type=portfolio`) |

**Response 200:**
```json
{
  "url": "https://res.cloudinary.com/...",
  "cloudinary_id": "prumo/portfolio/abc123",
  "type": "image"
}
```

---

## Mapa

### `GET /api/map-professionals`

Sem autenticação. Cacheado por 5 minutos.

Retorna todos os profissionais ativos com cidade e estado para renderizar o mapa.

**Response 200:**
```json
[
  {
    "id": "uuid",
    "slug": "joao-silva-eletricista",
    "name": "João Silva",
    "city": "São Paulo",
    "state": "SP",
    "photo_url": "https://...",
    "specialties": ["Elétrica"]
  }
]
```

**Cache headers:**
```
Cache-Control: public, max-age=300, stale-while-revalidate=60
```

---

## Geocodificação

### `GET /api/geocode`

Sem autenticação.

Converte coordenadas em cidade e estado brasileiro.

**Query params:**
| Parâmetro | Tipo | Descrição |
|---|---|---|
| `lat` | number | Latitude |
| `lon` | number | Longitude |

**Response 200:**
```json
{
  "city": "São Paulo",
  "state": "SP"
}
```

---

## SERPRO

### `POST /api/serpro/precheck`

Sem autenticação. Validação local (sem chamada externa).

**Body:**
```json
{
  "document": "123.456.789-09",
  "type": "cpf"
}
```

**Response 200:**
```json
{
  "valid": true
}
```

### `POST /api/serpro/validate`

Requer autenticação.

**Body:**
```json
{
  "document": "123.456.789-09",
  "type": "cpf",
  "professionalId": "uuid"
}
```

**Response 200:**
```json
{
  "status": "APPROVED",
  "name": "João da Silva",
  "situacao": "Regular"
}
```

**Response 400:**
```json
{
  "status": "REJECTED",
  "reason": "CPF com situação irregular na Receita Federal"
}
```

---

## Email

### `POST /api/emails`

Uso interno. Sem autenticação obrigatória (chamado de Server Actions).

**Body:**
```json
{
  "to": "usuario@email.com",
  "template": "welcome-professional",
  "data": { "name": "João" }
}
```

**Response 200:**
```json
{ "success": true }
```

---

## Mercado Pago

### `POST /api/mercadopago/checkout`

Requer autenticação com `role = professional`.

**Body:**
```json
{
  "professionalId": "uuid"
}
```

**Response 200:**
```json
{
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?..."
}
```

### `POST /api/mercadopago/setup-plan`

Cria o plano `MVP_79` no Mercado Pago se não existir. Idempotente.

**Response 200:**
```json
{
  "plan_id": "408B...",
  "created": false
}
```

---

## Admin

### `POST /api/admin/criar-usuario`

Requer header `Authorization: Bearer ${SETUP_SECRET}` ou autenticação com `role = admin`.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Nome Completo",
  "role": "professional"
}
```

**Response 200:**
```json
{
  "userId": "uuid",
  "email": "usuario@email.com"
}
```
