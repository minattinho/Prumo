# Rotas e Telas

## Área Pública `(public)`

### `/` — Home

| Componente | Descrição |
|---|---|
| `HeroSearch` | Campo de busca com autocomplete de categorias (IBGE) |
| `HeroMap` | Mapa Leaflet com profissionais ativos; centraliza na geolocalização do visitante |
| Grid de categorias | 13 categorias clicáveis que passam para `/profissionais?categoria=X` |
| Como funciona | Fluxo visual: buscar → contatar → contratar → avaliar |
| Depoimentos | Avaliações reais de contratantes |

### `/profissionais` — Busca de Profissionais

Listagem paginada com filtros via query string:

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `q` | string | Busca full-text (nome, especialidade) |
| `categoria` | string | Categoria de serviço |
| `cidade` | string | Cidade de atuação |
| `ordem` | `avaliacao` \| `recencia` | Critério de ordenação |
| `avaliacao` | `1`–`5` | Nota mínima |
| `verificacao` | `true` | Apenas com CPF/CNPJ validado |
| `tipo` | `pf` \| `pj` | Pessoa Física ou Jurídica |
| `pagina` | number | Paginação (padrão: 1) |

Cada card exibe: foto, nome, especialidades, cidade, nota média, badge de verificação, preview do portfólio.

### `/profissionais/[slug]` — Perfil do Profissional

Página SSR indexável por mecanismos de busca. Seções:

- Foto, nome, bio, cidade, raio de atendimento
- Badges (VERIFIED, TRUSTWORTHY, CERTIFIED)
- Especialidades + affinities
- Portfólio: galeria de imagens/vídeos por projeto
- Canais de contato (revelados ao clicar — gera `contact_log`)
- Redes sociais
- Avaliações com opção de resposta

### `/seja-profissional` — Cadastro de Profissional

Onboarding multi-etapa:

| Etapa | Campos |
|---|---|
| 1 - Conta | Email, senha (ou Google OAuth), nome completo, telefone |
| 2 - Perfil | Especialidade principal, cidade, foto, bio |
| 3 - Documentos | CPF ou CNPJ (validado via SERPRO em tempo real) |

Resultado: `status = PENDING`, `subscription_status = TRIAL`, `trial_ends_at = NOW() + 30 days`

---

## Autenticação `(auth)`

| Rota | Descrição |
|---|---|
| `/contratante` | Login/signup de contratante (toggle via `?modo=cadastro`). Email/senha + Google OAuth |
| `/profissional` | Login de profissional e admin. Admin é redirecionado para `/admin` |
| `/entrar` | Login genérico |
| `/cadastro` | Cadastro de contratante |
| `/redefinir-senha` | Formulário de redefinição de senha |

---

## Painel do Profissional `(professional)/painel`

Requer `role = professional`. Sidebar de navegação em todas as páginas.

### `/painel` — Dashboard

- Status da assinatura (trial + dias restantes, ativo, suspenso)
- Barra de completude do perfil com checklist
- Métricas: visualizações, contatos, nota média, total de avaliações
- Atalhos para seções do painel

### `/painel/perfil` — Editor de Perfil

| Campo | Tipo |
|---|---|
| Foto de perfil | Upload → Cloudinary |
| Bio | Textarea |
| Especialidades | Multi-select (das categorias disponíveis) |
| Affinities | Tags livres |
| Canais de contato | WhatsApp, Telefone, Email, Instagram, Facebook, Site, Outro |
| Canal primário | Radio (um por vez) |
| Redes sociais | Instagram, Facebook, TikTok, LinkedIn, YouTube |
| Cidade + estado | Autocomplete IBGE |
| Raio de atendimento | Slider (km) |

### `/painel/portfolio` — Portfólio

- Criar/editar projetos (título, categoria, cidade executada, descrição)
- Upload múltiplo de imagens e vídeos (Cloudinary)
- Reordenar imagens via drag-and-drop (@dnd-kit)
- Marcar até 3 projetos como destaque (constraint no banco)
- Status de moderação por mídia: PENDING → APPROVED / REJECTED

### `/painel/servicos` — Serviços Realizados

Histórico separado do portfólio:

| Campo | Tipo |
|---|---|
| Nome do cliente | string |
| Tipo de serviço | string |
| Valor cobrado | number |
| Data de execução | date |
| Origem | `PRUMO` \| `REFERRAL` \| `OTHER` |
| Status | `IN_PROGRESS` \| `COMPLETED` |
| Fotos | Upload com opção de mover para o portfólio |

### `/painel/solicitacoes` — Solicitações de Orçamento

Inbox de pedidos enviados por contratantes:

| Status | Descrição |
|---|---|
| `NEW` | Recém-chegada, não respondida |
| `REPLIED` | Proposta enviada |
| `IN_NEGOTIATION` | Em negociação |
| `REFUSED` | Recusada pelo profissional |

### `/painel/solicitacoes/[id]/proposta` — Criar Proposta

| Campo | Tipo |
|---|---|
| Valor total | currency |
| Prazo estimado | number (dias) |
| Abordagem/metodologia | textarea |
| Etapas de pagamento | Até 3 parcelas com % e condição de pagamento |

### `/painel/avaliacoes` — Avaliações Recebidas

- Nota (1–5), comentário, data de cada avaliação
- Botão para responder publicamente
- Status de disputa: aberta / resolvida

### `/painel/assinatura` — Assinatura

- Status atual: TRIAL / ATIVO / CANCELADO / SUSPENSO
- Dias restantes do trial ou data de renovação
- Preço: R$79/mês
- Botão "Assinar" → checkout Mercado Pago
- Histórico de pagamentos

### `/painel/acessos` — Logs de Acesso

Lista de eventos de acesso ao perfil:

| Tipo | Descrição |
|---|---|
| `VIEWED_WHATSAPP` | Contratante revelou WhatsApp |
| `VIEWED_PHONE` | Contratante revelou telefone |
| `VIEWED_EMAIL` | Contratante revelou email |

### `/painel/configuracoes` — Configurações

- Notificações por email
- Preferências de privacidade
- Exclusão de conta

---

## Área do Contratante `(contractor)`

### `/minha-conta` — Minha Conta

- Histórico de contatos com profissionais (baseado em `contact_logs`)
- Avaliações já enviadas
- Dados da conta (nome, email, telefone)

---

## Área Admin `(admin)`

### `/admin` — Dashboard Admin

Painel de gestão da plataforma.

### `/admin/usuarios` — Usuários

Listagem e gerenciamento de usuários da plataforma.

### `/admin/criar-usuario` — Criar Usuário

Formulário para criação manual de usuário com role específico.

---

## API Routes

| Endpoint | Método | Auth | Descrição |
|---|---|---|---|
| `/api/auth/callback` | GET | — | Callback OAuth (redireciona para `/painel` ou `/`) |
| `/api/upload` | POST | User | Upload de arquivo para Supabase Storage |
| `/api/map-professionals` | GET | — | Profissionais ativos para o mapa (cache 5min) |
| `/api/geocode` | GET | — | Geocodificação reversa lat/lon → cidade, estado |
| `/api/serpro/validate` | POST | User | Valida CPF/CNPJ via SERPRO, armazena resultado |
| `/api/serpro/precheck` | POST | — | Validação local de CPF/CNPJ (checksum) |
| `/api/emails` | POST | — | Envio de email via Resend |
| `/api/mercadopago/checkout` | POST | Professional | Cria PreApproval e retorna `init_point` |
| `/api/mercadopago/setup-plan` | POST | — | Cria plano no Mercado Pago (idempotente) |
| `/api/admin/criar-usuario` | POST | Admin | Cria usuário com role específico |
