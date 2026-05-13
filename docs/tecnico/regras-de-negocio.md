# Regras de Negócio

## Status do Profissional

```
PENDING → ACTIVE → SUSPENDED → BANNED
```

| Status | Visível na Busca | Visível no Mapa | Pode Receber Orçamentos |
|---|---|---|---|
| `PENDING` | ❌ | ❌ | ❌ |
| `ACTIVE` | ✅ | ✅ | ✅ |
| `SUSPENDED` | ❌ | ❌ | ❌ |
| `BANNED` | ❌ | ❌ | ❌ |

**Transições:**
- `PENDING → ACTIVE`: ativação manual pelo admin (após validação)
- `ACTIVE → SUSPENDED`: pagamento inadimplente ou infração
- `SUSPENDED → ACTIVE`: regularização de pagamento ou resolução de infração
- `ACTIVE/SUSPENDED → BANNED`: infração grave (fraude, conteúdo ilegal)

## Status da Assinatura

```
TRIAL → ACTIVE → CANCELLED
               → SUSPENDED
```

| Status | Descrição | Efeito no Perfil |
|---|---|---|
| `TRIAL` | 30 dias gratuitos | Perfil visível |
| `ACTIVE` | Assinatura paga e vigente | Perfil visível |
| `CANCELLED` | Cancelado pelo profissional | Perfil desativado |
| `SUSPENDED` | Pagamento falhou | Perfil suspenso |

!!! warning "Condição dupla para visibilidade"
    O perfil só aparece se `status = ACTIVE` **E** `subscription_status IN ('TRIAL', 'ACTIVE')`.

## Avaliações

### Pré-requisito para Avaliar

1. Contratante deve estar autenticado com `role = contractor`
2. Deve existir ao menos um `contact_log` para o par `(contractor_id, professional_id)`
3. Cada par pode gerar **no máximo uma avaliação** (constraint UNIQUE no banco)

### Fluxo de Disputa

```
Avaliação publicada
      ↓
Profissional abre disputa
      ↓
Upload de fotos de evidência (evaluation_photos)
      ↓
Admin analisa
      ↓
Disputa RESOLVIDA → avaliação mantida ou removida
```

### Resposta Pública

Profissional pode responder uma vez por avaliação. A resposta aparece publicamente abaixo do comentário do contratante.

## Portfólio

### Destaque

- Máximo **3 projetos em destaque** por profissional
- Projetos em destaque aparecem no topo do portfólio no perfil público
- Constraint no banco impede marcar o 4º como destaque

### Moderação de Mídia

```
Upload → PENDING → APPROVED (visível publicamente)
                 → REJECTED (gera infração)
```

Mídia rejeitada gera um registro em `professional_infractions` com o tipo `CONTENT_REJECTION`.

### Infrações

| Tipo | Consequência Automática |
|---|---|
| `CONTENT_REJECTION` | Revisão manual obrigatória |
| `PLAGIARISM` | `status = SUSPENDED` |
| `FRAUD` | `status = BANNED` |

## Solicitações de Orçamento

| Transição | Ação |
|---|---|
| `NEW → REPLIED` | Profissional envia proposta |
| `REPLIED → IN_NEGOTIATION` | Contratante responde |
| `ANY → REFUSED` | Profissional recusa |

## Contatos e contact_log

Cada vez que um contratante clica para revelar um canal de contato (WhatsApp, telefone, email), um registro é criado em `contact_logs`:

```sql
INSERT INTO contact_logs (contractor_id, professional_id, contact_type)
VALUES ($1, $2, 'VIEWED_WHATSAPP')
```

Este registro é o **gatilho** que habilita a avaliação. Sem ele, o botão de avaliar não aparece.

## Geolocalização e Mapa

- API `/api/map-professionals` retorna apenas profissionais com `status = ACTIVE` e `subscription_status IN ('TRIAL', 'ACTIVE')`
- Resposta cacheada por 5 minutos com `Cache-Control: public, max-age=300, stale-while-revalidate=60`
- Profissionais sem cidade cadastrada não aparecem no mapa

## Validação de Documentos

Duas etapas obrigatórias:

1. **Checksum local** (`/api/serpro/precheck`) — valida algoritmo de dígitos verificadores do CPF/CNPJ sem chamada externa. Rápido e sem custo.

2. **Consulta SERPRO** (`/api/serpro/validate`) — consulta à API da Receita Federal. Resultado armazenado em `cpf_validations` com cache de 24h:
   ```sql
   INSERT INTO cpf_validations (professional_id, validation_date, status, serpro_response)
   VALUES ($1, NOW(), 'APPROVED', $2)
   ```

!!! note "Cache de 24h"
    Se já existe uma validação SERPRO com menos de 24h, a consulta usa o cache sem nova chamada à API.

## Métricas em Cache

A tabela `professional_metrics` armazena métricas agregadas:

| Coluna | Fonte |
|---|---|
| `average_rating` | Média de `evaluations.rating` |
| `total_evaluations` | COUNT em `evaluations` |
| `profile_views` | COUNT em `contact_logs` (tipo: perfil visto) |
| `contacts_received` | COUNT em `contact_logs` (canal revelado) |

Métricas são atualizadas via trigger no banco ou periodicamente por job (a definir).
