# Pagamentos

## Plataforma

**Mercado Pago** — processador de pagamentos brasileiro, via API de **PreApproval** (assinaturas recorrentes).

## Plano

| Propriedade | Valor |
|---|---|
| ID | `MVP_79` |
| Preço | R$79/mês |
| Ciclo | Mensal |
| Trial | 30 dias (gerenciado no Prumo, não no MP) |

## Fluxo de Checkout

```
/painel/assinatura → "Assinar"
        ↓
POST /api/mercadopago/checkout
        ↓
Mercado Pago cria PreApproval
        ↓
Retorna init_point (URL de checkout MP)
        ↓
Profissional é redirecionado
        ↓
[Usuário completa pagamento no MP]
        ↓
Webhook → subscription_status = ACTIVE
```

## Estrutura da API

### `POST /api/mercadopago/checkout`

Requer autenticação com `role = professional`.

**Request body:**
```json
{
  "professionalId": "uuid"
}
```

**Response:**
```json
{
  "init_point": "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=..."
}
```

### `POST /api/mercadopago/setup-plan`

Cria o plano `MVP_79` no Mercado Pago se ainda não existir. Idempotente — verifica se já existe antes de criar.

## Webhooks (Pendente)

Os eventos do Mercado Pago que precisam ser tratados:

| Evento MP | Ação no Prumo |
|---|---|
| `payment.approved` | `subscription_status = 'ACTIVE'`, atualizar `subscription_paid_until` |
| `payment.rejected` | `subscription_status = 'SUSPENDED'`, `professional_profiles.status = 'SUSPENDED'` |
| `preapproval.cancelled` | `subscription_status = 'CANCELLED'` |
| `preapproval.paused` | `subscription_status = 'SUSPENDED'` |

!!! warning "Webhooks não implementados"
    O checkout está funcionando, mas sem webhooks o status de assinatura **não é atualizado automaticamente** após pagamento. Requer implementação de endpoint `/api/mercadopago/webhook`.

## Tabelas de Controle

### `professional_subscriptions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `professional_id` | uuid | FK para professional_profiles |
| `plan` | text | `MVP_79` |
| `mp_subscription_id` | text | ID do PreApproval no Mercado Pago |
| `mp_plan_id` | text | ID do plano no Mercado Pago |
| `status` | subscription_status | TRIAL \| ACTIVE \| CANCELLED \| SUSPENDED |
| `trial_ends_at` | timestamptz | Data de fim do trial |
| `current_period_end` | timestamptz | Data de renovação atual |

### `payment_transactions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `professional_id` | uuid | FK para professional_profiles |
| `amount` | numeric | Valor pago |
| `currency` | text | `BRL` |
| `status` | text | `approved` \| `rejected` \| `pending` |
| `mp_payment_id` | text | ID do pagamento no Mercado Pago |

### Campos em `professional_profiles`

| Coluna | Descrição |
|---|---|
| `mercadopago_customer_id` | ID do cliente no Mercado Pago |
| `subscription_status` | Status atual da assinatura |
| `trial_ends_at` | Data de fim do trial (set no cadastro) |
| `subscription_paid_until` | Data até quando a assinatura está paga |

## Inicialização do Cliente

```typescript
// lib/mercadopago/client.ts — lazy initialization
let _config: MercadoPagoConfig | null = null

export function getMercadoPagoClient() {
  if (!_config) {
    _config = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    })
  }
  return _config
}
```

## Variáveis de Ambiente

```env
MP_ACCESS_TOKEN=TEST-...   # Token de acesso (TEST- para sandbox, APP- para prod)
MP_PLAN_ID=408B...         # ID do plano criado via /api/mercadopago/setup-plan
```
