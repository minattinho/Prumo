# Analytics

## Plataforma

**PostHog** — analytics de comportamento de usuário com suporte a eventos customizados, funnels e feature flags.

## Configuração

```typescript
// lib/posthog/client.ts
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})
```

O cliente PostHog é inicializado no `PostHogProvider` em `components/providers/posthog-provider.tsx`, que envolve o layout raiz.

## Eventos Rastreados

### Eventos de Profissional

| Evento | Quando |
|---|---|
| `professional_registered` | Conclusão do onboarding |
| `professional_profile_updated` | Salva perfil no painel |
| `portfolio_project_created` | Cria projeto no portfólio |
| `subscription_checkout_initiated` | Clica em "Assinar" |

### Eventos de Contratante

| Evento | Quando |
|---|---|
| `contact_revealed` | Visualiza canal de contato (WhatsApp/telefone/email) |
| `budget_request_sent` | Envia solicitação de orçamento |
| `evaluation_submitted` | Deixa avaliação |

### Eventos de Navegação

PostHog captura `$pageview` automaticamente para todas as páginas.

## Variáveis de Ambiente

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

!!! tip "Self-hosted"
    É possível usar PostHog self-hosted. Basta apontar `NEXT_PUBLIC_POSTHOG_HOST` para a instância própria.

## Métricas em Banco

Além do PostHog, a tabela `professional_metrics` armazena métricas agregadas diretamente no banco para exibição no dashboard do profissional:

| Métrica | Fonte |
|---|---|
| `profile_views` | `contact_logs` |
| `contacts_received` | `contact_logs` (por tipo) |
| `average_rating` | `evaluations.rating` |
| `total_evaluations` | COUNT em `evaluations` |
