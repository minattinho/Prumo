# Email

## Plataforma

**Resend** — plataforma de email transacional com suporte a templates React.

## Endpoint

**`POST /api/emails`**

Uso interno pela aplicação. Aceita JSON:

```json
{
  "to": "usuario@email.com",
  "template": "welcome-professional",
  "data": { ... }
}
```

## Templates Disponíveis

Templates em `lib/resend/templates/` (componentes React):

| Template | Trigger | Destinatário |
|---|---|---|
| `welcome-professional` | Cadastro concluído | Profissional |
| `profile-activated` | Admin ativa o perfil | Profissional |
| `evaluation-invite` | Contratante contata profissional | Contratante |

!!! warning "Templates parcialmente conectados"
    Os templates estão criados, mas nem todos os eventos que deveriam disparar um email estão conectados ao endpoint `/api/emails`. Veja a seção de status do produto.

## Configuração

```typescript
// lib/resend/client.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'no-reply@meuprumo.com.br'
```

## Variáveis de Ambiente

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@meuprumo.com.br
```

## Eventos Planejados (a implementar)

| Evento | Email a enviar |
|---|---|
| Profissional cadastrado | Boas-vindas com próximos passos |
| Perfil ativado pelo admin | Notificação de ativação |
| Nova solicitação de orçamento | Email para o profissional |
| Proposta enviada | Email para o contratante |
| Trial expirando (7 dias antes) | Lembrete de assinatura |
| Pagamento falhou | Aviso de suspensão iminente |
| Nova avaliação recebida | Notificação para o profissional |
