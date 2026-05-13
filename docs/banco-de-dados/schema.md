# Schema Completo

25 tabelas PostgreSQL no Supabase, todas com Row Level Security (RLS) habilitada.

## Tabelas de Usuário

### `profiles`

Espelho dos usuários do Supabase Auth. Criado por trigger `handle_new_user()` no cadastro.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | Mesmo ID do `auth.users` |
| `email` | text | Email do usuário |
| `name` | text | Nome completo |
| `phone` | text | Telefone |
| `role` | text | `contractor` \| `professional` \| `admin` |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | — |

### `contractor_profiles`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `user_id` | uuid (FK → profiles.id) | — |
| `last_service_date` | date | Data do último serviço contratado |
| `created_at` | timestamptz | — |

### `professional_profiles`

Tabela central do profissional.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `user_id` | uuid (FK → profiles.id) | — |
| `slug` | text (UNIQUE) | URL amigável (ex: `joao-silva-eletricista`) |
| `cpf` | text | CPF (mascarado) |
| `cnpj` | text | CNPJ (mascarado) |
| `photo_url` | text | URL da foto de perfil |
| `bio` | text | Descrição pessoal |
| `city` | text | Cidade de atuação |
| `state` | text | UF (ex: `SP`) |
| `service_radius_km` | integer | Raio de atendimento em km |
| `status` | professional_status | PENDING \| ACTIVE \| SUSPENDED \| BANNED |
| `subscription_status` | subscription_status | TRIAL \| ACTIVE \| CANCELLED \| SUSPENDED |
| `trial_ends_at` | timestamptz | Data de fim do trial |
| `subscription_paid_until` | timestamptz | Data até quando a assinatura está paga |
| `mercadopago_customer_id` | text | ID do cliente no Mercado Pago |
| `payment_date` | integer | Dia do mês da cobrança |
| `created_at` | timestamptz | — |
| `updated_at` | timestamptz | — |

---

## Tabelas de Perfil do Profissional

### `professional_specialties`

| Coluna | Tipo |
|---|---|
| `id` | uuid (PK) |
| `professional_id` | uuid (FK) |
| `category` | text |

### `professional_affinities`

Tags livres para descrever serviços específicos.

| Coluna | Tipo |
|---|---|
| `id` | uuid (PK) |
| `professional_id` | uuid (FK) |
| `tag` | text |

### `professional_contact_channels`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `type` | contact_channel_type | WHATSAPP \| PHONE \| EMAIL \| INSTAGRAM \| FACEBOOK \| SITE \| OTHER |
| `value` | text | Valor (número, email, URL) |
| `is_primary` | boolean | Canal principal de contato |
| `link_formatted` | text | URL formatada (ex: `https://wa.me/5511...`) |

### `professional_social_networks`

| Coluna | Tipo |
|---|---|
| `id` | uuid (PK) |
| `professional_id` | uuid (FK) |
| `platform` | social_network_type |
| `handle_or_url` | text |

---

## Tabelas de Portfólio

### `portfolio_projects`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `title` | text | Título do projeto |
| `category` | text | Categoria do serviço |
| `city_executed` | text | Cidade onde foi executado |
| `description` | text | Descrição do projeto |
| `is_featured` | boolean | Projeto em destaque (máx 3) |
| `display_order` | integer | Ordem de exibição |
| `view_count` | integer | Visualizações do projeto |
| `created_at` | timestamptz | — |

### `portfolio_images`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `project_id` | uuid (FK → portfolio_projects.id) | — |
| `cloudinary_url` | text | URL da imagem no Cloudinary |
| `cloudinary_id` | text | ID no Cloudinary |
| `order` | integer | Ordem de exibição |
| `status` | media_moderation_status | PENDING \| APPROVED \| REJECTED |
| `moderation_notes` | text | Notas do moderador |

### `portfolio_videos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `project_id` | uuid (FK) | — |
| `cloudinary_url` | text | — |
| `cloudinary_id` | text | — |
| `duration` | integer | Duração em segundos |
| `order` | integer | — |
| `status` | media_moderation_status | — |

---

## Tabelas de Interação

### `contact_logs`

Registro de quando um contratante visualiza um canal de contato. É o **gatekeeper** das avaliações.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `contractor_id` | uuid (FK → profiles.id) | — |
| `professional_id` | uuid (FK) | — |
| `contact_type` | contact_log_type | VIEWED_WHATSAPP \| VIEWED_PHONE \| VIEWED_EMAIL |
| `created_at` | timestamptz | — |

### `budget_requests`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `contractor_id` | uuid (FK) | — |
| `professional_id` | uuid (FK) | — |
| `message` | text | Mensagem do contratante |
| `status` | budget_request_status | NEW \| REPLIED \| IN_NEGOTIATION \| REFUSED |
| `created_at` | timestamptz | — |

### `proposals`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `budget_request_id` | uuid (FK) | — |
| `total_value` | numeric | Valor total proposto |
| `deadline_days` | integer | Prazo estimado em dias |
| `approach` | text | Descrição da abordagem |
| `payment_stages` | jsonb | Até 3 etapas de pagamento |
| `created_at` | timestamptz | — |

---

## Tabelas de Serviços e Avaliações

### `completed_services`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `client_name` | text | Nome do cliente |
| `service_type` | text | Tipo de serviço |
| `value` | numeric | Valor cobrado |
| `execution_date` | date | Data de execução |
| `status` | service_status | IN_PROGRESS \| COMPLETED |
| `origin` | service_origin | PRUMO \| REFERRAL \| OTHER |

### `service_photos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `service_id` | uuid (FK) | — |
| `cloudinary_url` | text | — |
| `cloudinary_id` | text | — |
| `added_to_portfolio` | boolean | Se a foto foi movida para o portfólio |

### `evaluations`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `contractor_id` | uuid (FK) | — |
| `professional_id` | uuid (FK) | — |
| `rating` | integer | 1–5 estrelas |
| `comment` | text | Comentário |
| `is_disputed` | boolean | Se o profissional abriu disputa |
| `dispute_status` | text | `open` \| `resolved` |
| `created_at` | timestamptz | — |
| UNIQUE | — | `(contractor_id, professional_id)` |

### `evaluation_photos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `evaluation_id` | uuid (FK) | — |
| `cloudinary_url` | text | Foto de evidência na disputa |
| `cloudinary_id` | text | — |

### `evaluation_responses`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `evaluation_id` | uuid (FK, UNIQUE) | — |
| `professional_id` | uuid (FK) | — |
| `response_text` | text | Resposta pública do profissional |
| `created_at` | timestamptz | — |

---

## Tabelas de Métricas e Badges

### `professional_metrics`

Cache de métricas agregadas para exibição no dashboard.

| Coluna | Tipo |
|---|---|
| `professional_id` | uuid (PK, FK) |
| `average_rating` | numeric |
| `total_evaluations` | integer |
| `profile_views` | integer |
| `contacts_received` | integer |
| `updated_at` | timestamptz |

### `verification_badges`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `type` | badge_type | VERIFIED \| TRUSTWORTHY \| CERTIFIED |
| `awarded_date` | date | Data de concessão |

---

## Tabelas Financeiras

### `professional_subscriptions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `plan` | text | `MVP_79` |
| `mp_subscription_id` | text | ID PreApproval no Mercado Pago |
| `mp_plan_id` | text | ID do plano no Mercado Pago |
| `status` | subscription_status | — |
| `trial_ends_at` | timestamptz | — |
| `current_period_end` | timestamptz | — |
| `created_at` | timestamptz | — |

### `payment_transactions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `amount` | numeric | Valor |
| `currency` | text | `BRL` |
| `status` | text | `approved` \| `rejected` \| `pending` |
| `mp_payment_id` | text | ID do pagamento no Mercado Pago |
| `created_at` | timestamptz | — |

---

## Tabelas de Moderação e Compliance

### `cpf_validations`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `validation_date` | timestamptz | Data da validação |
| `status` | verification_status | APPROVED \| REJECTED |
| `serpro_response` | jsonb | Payload completo do SERPRO |
| `jusbrasil_response` | jsonb | Consulta adicional (opcional) |

### `content_reports`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `reported_item_type` | text | Tipo do item denunciado |
| `reported_item_id` | uuid | ID do item denunciado |
| `reported_by_user_id` | uuid (FK) | Quem denunciou |
| `reason` | text | Motivo da denúncia |
| `status` | text | Status da análise |
| `created_at` | timestamptz | — |

### `professional_infractions`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | uuid (PK) | — |
| `professional_id` | uuid (FK) | — |
| `infraction_type` | text | CONTENT_REJECTION \| PLAGIARISM \| FRAUD |
| `count` | integer | Quantidade acumulada |
| `consequence` | infraction_consequence | MANUAL_REVIEW_REQUIRED \| SUSPENDED \| BANNED |
| `notes` | text | Notas do moderador |
| `created_at` | timestamptz | — |
