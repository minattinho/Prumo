# Monetização

## Modelo de Negócio

O Prumo adota um modelo **SaaS B2B de assinatura recorrente**, cobrado exclusivamente dos profissionais. Contratantes usam a plataforma gratuitamente.

Não há comissão sobre o valor dos serviços contratados — o profissional e o contratante negociam e transacionam diretamente entre si.

## Plano Atual

| Item | Valor |
|---|---|
| Plano único (`MVP_79`) | R$79/mês |
| Trial gratuito | 30 dias |
| Cobrança | Recorrente mensal via Mercado Pago |
| Cancelamento | A qualquer momento |

## Ciclo de Vida da Assinatura

```
Cadastro
   ↓
TRIAL (30 dias gratuitos)
   ↓
[Trial expira]
   ↓
Profissional assina → ACTIVE
   ↓
Renovação mensal automática (Mercado Pago PreApproval)
   ↓
Pagamento falha → SUSPENDED (perfil sai da busca)
   ↓
Regulariza → ACTIVE
   ↓
Cancela → CANCELLED (perfil desativado ao fim do período pago)
```

## Fluxo de Checkout

1. Profissional acessa `/painel/assinatura` e clica em "Assinar"
2. POST para `/api/mercadopago/checkout` cria um PreApproval no Mercado Pago
3. API retorna `init_point` — URL do checkout do Mercado Pago
4. Profissional é redirecionado para a tela de pagamento
5. Após aprovação, webhook atualiza `subscription_status = ACTIVE`

## Impacto no Perfil

| Status da Assinatura | Visível na Busca | Visível no Mapa |
|---|---|---|
| `TRIAL` (30 dias) | ✅ Sim | ✅ Sim |
| `ACTIVE` | ✅ Sim | ✅ Sim |
| `SUSPENDED` | ❌ Não | ❌ Não |
| `CANCELLED` | ❌ Não | ❌ Não |

!!! note "Dependência de status duplo"
    O perfil só aparece na busca se `status = ACTIVE` **e** `subscription_status IN (TRIAL, ACTIVE)`. Ambas as condições precisam ser verdadeiras.

## Webhooks Pendentes

Os seguintes eventos do Mercado Pago precisam ser tratados para automatizar o ciclo:

| Evento | Ação esperada |
|---|---|
| `payment.approved` | `subscription_status = ACTIVE`, atualizar `subscription_paid_until` |
| `payment.rejected` | `subscription_status = SUSPENDED`, suspender perfil |
| `preapproval.cancelled` | `subscription_status = CANCELLED` |

## Projeção de Receita

| Profissionais Ativos | Receita Mensal (R$) | Receita Anual (R$) |
|---|---|---|
| 100 | 7.900 | 94.800 |
| 500 | 39.500 | 474.000 |
| 1.000 | 79.000 | 948.000 |
| 5.000 | 395.000 | 4.740.000 |
