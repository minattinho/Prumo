# Enums

Todos os tipos enumerados do PostgreSQL usados no Prumo.

## `professional_status`

Status do profissional na plataforma.

| Valor | Descrição |
|---|---|
| `PENDING` | Recém-cadastrado, aguardando ativação pelo admin |
| `ACTIVE` | Ativo e visível na busca e no mapa |
| `SUSPENDED` | Temporariamente suspenso (inadimplência ou infração) |
| `BANNED` | Banido permanentemente |

## `subscription_status`

Status da assinatura do profissional.

| Valor | Descrição |
|---|---|
| `TRIAL` | Período de 30 dias gratuitos |
| `ACTIVE` | Assinatura paga e em vigor |
| `CANCELLED` | Cancelado pelo profissional |
| `SUSPENDED` | Suspenso por falha no pagamento |

## `contact_channel_type`

Tipos de canal de contato do profissional.

| Valor |
|---|
| `WHATSAPP` |
| `PHONE` |
| `EMAIL` |
| `INSTAGRAM` |
| `FACEBOOK` |
| `SITE` |
| `OTHER` |

## `social_network_type`

Redes sociais suportadas no perfil.

| Valor |
|---|
| `INSTAGRAM` |
| `FACEBOOK` |
| `TIKTOK` |
| `LINKEDIN` |
| `YOUTUBE` |

## `budget_request_status`

Status das solicitações de orçamento.

| Valor | Descrição |
|---|---|
| `NEW` | Recém-recebida, não respondida |
| `REPLIED` | Profissional enviou proposta |
| `IN_NEGOTIATION` | Em negociação |
| `REFUSED` | Recusada pelo profissional |

## `media_moderation_status`

Status de moderação de imagens e vídeos do portfólio.

| Valor | Descrição |
|---|---|
| `PENDING` | Aguardando análise do moderador |
| `APPROVED` | Aprovada e visível publicamente |
| `REJECTED` | Rejeitada (gera infração) |

## `service_origin`

Origem do serviço registrado no histórico.

| Valor | Descrição |
|---|---|
| `PRUMO` | Captado via plataforma Prumo |
| `REFERRAL` | Indicação de terceiros |
| `OTHER` | Outro canal |

## `service_status`

Status do serviço no histórico.

| Valor | Descrição |
|---|---|
| `IN_PROGRESS` | Em andamento |
| `COMPLETED` | Concluído |

## `badge_type`

Tipos de badge de verificação do profissional.

| Valor | Descrição |
|---|---|
| `VERIFIED` | Documento (CPF/CNPJ) validado via SERPRO |
| `TRUSTWORTHY` | Alto índice de avaliações positivas |
| `CERTIFIED` | Certificação adicional (a definir) |

## `contact_log_type`

Tipos de evento registrados nos logs de contato.

| Valor | Descrição |
|---|---|
| `VIEWED_WHATSAPP` | Contratante revelou número de WhatsApp |
| `VIEWED_PHONE` | Contratante revelou telefone |
| `VIEWED_EMAIL` | Contratante revelou email |

## `verification_status`

Status de validações de documentos.

| Valor |
|---|
| `APPROVED` |
| `REJECTED` |

## `infraction_consequence`

Consequências automáticas de infrações acumuladas.

| Valor | Descrição |
|---|---|
| `MANUAL_REVIEW_REQUIRED` | Admin precisa revisar manualmente |
| `SUSPENDED` | Perfil suspenso automaticamente |
| `BANNED` | Perfil banido automaticamente |
