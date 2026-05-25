# Banco de Dados

PostgreSQL no Supabase. 26 tabelas, todas com Row Level Security (RLS) habilitada.

## Enums

| Enum | Valores |
|------|---------|
| `professional_status` | `PENDING` `ACTIVE` `SUSPENDED` `BANNED` |
| `subscription_status` | `TRIAL` `ACTIVE` `CANCELLED` `SUSPENDED` |
| `media_moderation_status` | `PENDING` `APPROVED` `REJECTED` |
| `budget_request_status` | `NEW` `REPLIED` `IN_NEGOTIATION` `REFUSED` |
| `contact_channel_type` | `WHATSAPP` `PHONE` `EMAIL` `INSTAGRAM` `FACEBOOK` `SITE` `OTHER` |
| `contact_log_type` | `VIEWED_WHATSAPP` `VIEWED_PHONE` `VIEWED_EMAIL` |
| `badge_type` | `VERIFIED` `TRUSTWORTHY` `CERTIFIED` |
| `infraction_consequence` | `MANUAL_REVIEW_REQUIRED` `SUSPENDED` `BANNED` |
| `verification_status` | `APPROVED` `REJECTED` |
| `service_origin` | `PRUMO` `REFERRAL` `OTHER` |
| `service_status` | `IN_PROGRESS` `COMPLETED` |
| `social_network_type` | `INSTAGRAM` `FACEBOOK` `TIKTOK` `LINKEDIN` `YOUTUBE` |

## Tabelas

### `profiles`
Espelho dos usuários do Supabase Auth. Criado via trigger no signup.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | Mesmo ID do `auth.users` |
| `email` | text | Email do usuário |
| `name` | text | Nome completo |
| `phone` | text? | Telefone |
| `role` | text | `'professional'` \| `'contractor'` \| `'admin'` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### `professional_profiles`
Dados do perfil do prestador de serviços.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK→profiles | 1:1 |
| `slug` | text UNIQUE | URL pública do perfil |
| `status` | professional_status | Default: `PENDING` |
| `subscription_status` | subscription_status | Default: `TRIAL` |
| `trial_ends_at` | timestamptz | Criado em now()+30 dias |
| `subscription_paid_until` | timestamptz? | Data de vencimento da assinatura |
| `cpf` | text? | CPF validado |
| `cnpj` | text? | CNPJ (pessoa jurídica) |
| `personal_description` | text? | Bio pública |
| `photo_url` | text? | URL Cloudinary |
| `city` | text? | Cidade de atuação |
| `state` | text? | Estado (sigla) |
| `service_radius_km` | int? | Raio de atendimento em km |
| `price_per_hour` | numeric? | Preço hora (R$) |
| `price_per_day` | numeric? | Preço dia (R$) |
| `price_per_service` | numeric? | Preço por serviço (R$) |
| `price_per_month` | numeric? | Preço mensal (R$) |
| `price_currency` | text? | Default: `'BRL'` |
| `mercadopago_customer_id` | text? | ID do cliente no MP |
| `onboarding_completed_at` | timestamptz? | Quando concluiu onboarding |
| `created_at` / `updated_at` | timestamptz | |

---

### `contractor_profiles`
Dados do contratante. Minimalista — contratantes não têm perfil público.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK→profiles | 1:1 |
| `last_service_date` | timestamptz? | Última contratação |
| `created_at` | timestamptz | |

---

### `professional_specialties`
Categorias de serviço do profissional.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `category` | text | Slug da categoria (ex: `'pedreiro'`) |
| `created_at` | timestamptz | |

---

### `professional_affinities`
Tags livres definidas pelo profissional (ex: "reformas residenciais", "trabalho em altura").

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `tag` | text | Tag livre |

---

### `professional_contact_channels`
Canais de contato visíveis no perfil.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `type` | contact_channel_type | |
| `value` | text | Número/email/URL |
| `link_formatted` | text? | Link formatado (ex: `https://wa.me/55...`) |
| `is_primary` | bool | Canal principal |
| `created_at` | timestamptz | |

---

### `professional_social_networks`
Redes sociais do profissional.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `platform` | social_network_type | |
| `handle_or_url` | text | Handle ou URL completa |

---

### `portfolio_projects`
Projetos no portfólio público.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `title` | text | Nome do projeto |
| `description` | text? | Descrição |
| `category` | text | Categoria do projeto |
| `city_executed` | text? | Cidade onde foi executado |
| `is_featured` | bool | Destaque (máx 3 por profissional) |
| `display_order` | int | Ordenação drag-and-drop |
| `view_count` | int | Visualizações |
| `created_at` / `updated_at` | timestamptz | |

---

### `portfolio_images`
Imagens de um projeto. Passam por moderação antes de aparecer publicamente.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `project_id` | uuid FK→portfolio_projects | |
| `cloudinary_id` | text | ID no Cloudinary |
| `cloudinary_url` | text | URL pública CDN |
| `status` | media_moderation_status | Default: `PENDING` |
| `moderation_notes` | text? | Motivo da rejeição |
| `order_in_project` | int | Ordem dentro do projeto |
| `uploaded_at` | timestamptz | |

---

### `portfolio_videos`
Vídeos de um projeto.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `project_id` | uuid FK→portfolio_projects | |
| `cloudinary_id` / `cloudinary_url` | text | |
| `duration_seconds` | int? | Duração |
| `status` | media_moderation_status | Default: `PENDING` |
| `moderation_notes` | text? | |
| `manual_review_date` | timestamptz? | Data de revisão manual |
| `order_in_project` | int | |
| `uploaded_at` | timestamptz | |

---

### `contact_logs`
Registro de quando um contratante visualiza um canal de contato. **Gatekeeper de avaliações** — só pode avaliar se houver log.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `contractor_id` | uuid FK→profiles | |
| `professional_id` | uuid FK→professional_profiles | |
| `contact_type` | contact_log_type | Qual canal foi revelado |
| `created_at` | timestamptz | |

---

### `evaluations`
Avaliações de profissionais por contratantes. UNIQUE por par (contractor, professional).

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `contractor_id` | uuid FK→profiles | |
| `professional_id` | uuid FK→professional_profiles | |
| `rating` | int | 1–5 |
| `comment` | text? | Texto da avaliação |
| `is_disputed` | bool | Default: false |
| `dispute_status` | text? | Status da disputa |
| `created_at` | timestamptz | |

---

### `evaluation_photos`
Fotos de evidência em disputas de avaliação.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `evaluation_id` | uuid FK→evaluations | |
| `cloudinary_id` / `cloudinary_url` | text | |
| `uploaded_at` | timestamptz | |

---

### `evaluation_responses`
Resposta pública do profissional a uma avaliação. 1:1 com evaluations.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `evaluation_id` | uuid FK→evaluations | 1:1 |
| `professional_id` | uuid FK→professional_profiles | |
| `response_text` | text | |
| `created_at` | timestamptz | |

---

### `professional_metrics`
Cache de métricas agregadas. 1:1 com professional_profiles.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | 1:1 |
| `profile_views` | int | Total de visualizações |
| `contacts_received` | int | Canais revelados |
| `average_rating` | numeric | Média das avaliações |
| `total_evaluations` | int | Total de avaliações |
| `total_completed_services_via_prumo` | int | Serviços via plataforma |
| `updated_at` | timestamptz | |

---

### `verification_badges`
Badges de verificação concedidas ao profissional.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `type` | badge_type | `VERIFIED` `TRUSTWORTHY` `CERTIFIED` |
| `awarded_date` | timestamptz | |

---

### `professional_subscriptions`
Histórico de assinaturas (Mercado Pago PreApproval).

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `plan` | text | Nome do plano (default: `'mensal'`) |
| `status` | subscription_status | |
| `mercadopago_subscription_id` | text? | ID PreApproval no MP |
| `mercadopago_plan_id` | text? | ID do plano no MP |
| `trial_ends_at` | timestamptz | |
| `current_period_end` | timestamptz? | Fim do período atual |
| `cancelled_at` | timestamptz? | |
| `created_at` / `updated_at` | timestamptz | |

---

### `payment_transactions`
Transações individuais de pagamento.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `amount` | numeric | Valor em R$ |
| `currency` | text | Default: `'BRL'` |
| `status` | text | Status da transação |
| `mercadopago_payment_id` | text? | ID do pagamento no MP |
| `created_at` | timestamptz | |

---

### `cpf_validations`
Cache de validações SERPRO (24h). Evita chamadas repetidas à API da Receita Federal.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `status` | verification_status | |
| `serpro_response` | jsonb? | Resposta bruta da API SERPRO |
| `jusbrasil_response` | jsonb? | Resposta de antecedentes |
| `reason_if_rejected` | text? | Motivo da rejeição |
| `validation_date` | timestamptz | |

---

### `budget_requests`
Pedidos de orçamento enviados por contratantes a profissionais.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `contractor_id` | uuid FK→profiles | |
| `professional_id` | uuid FK→professional_profiles | |
| `message` | text | Descrição do serviço desejado |
| `status` | budget_request_status | Default: `NEW` |
| `created_at` / `updated_at` | timestamptz | |

---

### `proposals`
Propostas do profissional em resposta a orçamentos.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `budget_request_id` | uuid FK→budget_requests | |
| `professional_id` | uuid FK→professional_profiles | |
| `total_value` | numeric | Valor total da proposta |
| `deadline_days` | int | Prazo em dias |
| `approach_description` | text | Como o profissional abordará o trabalho |
| `payment_stages` | int | Número de etapas de pagamento (máx 3) |
| `status` | text | Status da proposta |
| `created_at` | timestamptz | |

---

### `completed_services`
Histórico de serviços concluídos registrados pelo profissional.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `service_type` | text | Tipo de serviço |
| `execution_date` | date | Data de execução |
| `client_name` | text? | Nome do cliente |
| `value` | numeric? | Valor cobrado |
| `origin` | service_origin | `PRUMO` `REFERRAL` `OTHER` |
| `status` | service_status | `IN_PROGRESS` `COMPLETED` |
| `photos_added` | bool | Se adicionou fotos |
| `created_at` | timestamptz | |

---

### `service_photos`
Fotos de serviços concluídos (movíveis para o portfólio).

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `service_id` | uuid FK→completed_services | |
| `cloudinary_id` / `cloudinary_url` | text | |
| `added_to_portfolio` | bool | Se já foi movida para portfólio |
| `uploaded_at` | timestamptz | |

---

### `content_reports`
Denúncias de conteúdo inadequado.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `reported_by_user_id` | uuid FK→profiles | Quem denunciou |
| `reported_item_id` | uuid | ID do item denunciado |
| `reported_item_type` | text | Tipo (ex: `'portfolio_image'`) |
| `reason` | text | Motivo |
| `status` | text | Status da análise |
| `created_at` | timestamptz | |

---

### `professional_infractions`
Infrações acumuladas. Três tipos podem levar a suspensão ou banimento.

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `infraction_type` | text | Tipo da infração |
| `count_total` | int | Ocorrências acumuladas |
| `consequence` | infraction_consequence? | Consequência aplicada |
| `notes` | text? | Detalhes |
| `created_at` | timestamptz | |

---

### `profile_activity_logs`
Log de atividades no perfil (visualizações, cliques).

| Coluna | Tipo | Notas |
|--------|------|-------|
| `id` | uuid PK | |
| `professional_id` | uuid FK→professional_profiles | |
| `contractor_id` | uuid | ID do visitante |
| `event_type` | text | Tipo de evento |
| `created_at` | timestamptz | |

---

## Row Level Security (RLS)

| Tabela | Leitura pública | Leitura autenticada | Escrita |
|--------|----------------|---------------------|---------|
| `professional_profiles` (status=ACTIVE) | Sim | Sim | Próprio usuário |
| `portfolio_images` (status=APPROVED) | Sim | Sim | Dono do projeto |
| `portfolio_videos` (status=APPROVED) | Sim | Sim | Dono do projeto |
| `professional_contact_channels` | Não | Sim | Dono |
| `evaluations` | Sim | Sim | Contratante com contact_log |
| `evaluation_responses` | Sim | Sim | Profissional avaliado |
| `professional_metrics` | Sim | Sim | Sistema |
| `professional_subscriptions` | Não | Próprio usuário | Sistema |
| `payment_transactions` | Não | Próprio usuário | Sistema |
| `contact_logs` | Não | Próprio usuário | Contratante autenticado |
| `budget_requests` | Não | Partes envolvidas | Contratante autenticado |

## Storage Buckets

| Bucket | Uso | Acesso de leitura | Acesso de escrita |
|--------|-----|-------------------|-------------------|
| `profiles/` | Fotos de perfil | Público | Usuário autenticado (próprio) |
| `portfolio/` | Imagens e vídeos de portfólio | Público | Profissional autenticado (próprio) |

## Funções PostgreSQL

| Função | Retorno | Uso |
|--------|---------|-----|
| `show_limit()` | number | Limite de resultados da busca por similaridade |
| `show_trgm(text)` | text[] | Debug de trigrams para busca full-text |

A extensão `pg_trgm` está ativa para busca full-text eficiente por nome e especialidade.

## Diagrama de Relacionamentos (simplificado)

```
auth.users
    │ 1:1
profiles
    ├── 1:1 → professional_profiles
    │              ├── 1:N → professional_specialties
    │              ├── 1:N → professional_affinities
    │              ├── 1:N → professional_contact_channels
    │              ├── 1:N → professional_social_networks
    │              ├── 1:1 → professional_metrics
    │              ├── 1:N → portfolio_projects
    │              │              ├── 1:N → portfolio_images
    │              │              └── 1:N → portfolio_videos
    │              ├── 1:N → completed_services → 1:N → service_photos
    │              ├── 1:N → professional_subscriptions
    │              ├── 1:N → payment_transactions
    │              ├── 1:N → cpf_validations
    │              ├── 1:N → verification_badges
    │              └── 1:N → professional_infractions
    │
    └── 1:1 → contractor_profiles
                   └── 1:N → budget_requests → 1:N → proposals

evaluations (contractor_id FK→profiles, professional_id FK→professional_profiles)
    ├── 1:N → evaluation_photos
    └── 1:1 → evaluation_responses

contact_logs (contractor_id FK→profiles, professional_id FK→professional_profiles)
profile_activity_logs (professional_id FK→professional_profiles)
content_reports (reported_by_user_id FK→profiles)
```
