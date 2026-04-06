# Painel Profissional — Novas Seções

**Data:** 2026-04-06  
**Scope:** Adicionar 3 novas seções ao painel profissional existente

---

## Contexto

O painel profissional do Prumo já possui as seções: Dashboard, Perfil, Portfólio, Serviços e Solicitações.  
Faltam seções para o profissional gerenciar avaliações recebidas, configurações de conta e assinatura.  
O Stripe ainda não está integrado — a seção de assinatura será informativa por ora.

---

## Estrutura: 3 Rotas Independentes

Cada seção segue o padrão existente do projeto:
- `page.tsx` — Server Component (fetch de dados + auth guard implícito via layout)
- `*-client.tsx` — Client Component (interatividade)
- `actions.ts` — Server Actions (mutações)

---

## Seção 1 — Avaliações Recebidas (`/painel/avaliacoes`)

### Dados
- `evaluations`: `id`, `rating` (1-5), `comment`, `created_at`, `contractor_id`
- `profiles` (join via contractor_id): `full_name`
- `evaluation_responses`: `id`, `evaluation_id`, `response_text`

### Fetch (server, `page.tsx`)
```ts
// evaluations tem 2 FKs para profiles (contractor_id e professional_id)
// Supabase requer nome da FK explícita para disambiguar
supabase
  .from("evaluations")
  .select("id, rating, comment, created_at, profiles!contractor_id(full_name), evaluation_responses(response_text)")
  .eq("professional_id", pro.id)
  .order("created_at", { ascending: false })
```

### UI (`evaluations-client.tsx`)
- **Header:** título + 2 stats inline (média de avaliação com estrela, total de avaliações)
- **Lista de cards:** para cada avaliação:
  - Avatar de iniciais do contratante (estilo existente)
  - Nome do contratante, estrelas (1-5), comentário, data formatada
  - Se `evaluation_responses` existe: bloco "Sua resposta" com o texto
  - Se não existe: botão "Responder" que expande textarea inline com botão Salvar
- **Empty state:** ícone + "Você ainda não recebeu avaliações"

### Actions (`actions.ts`)
```ts
respondToEvaluation(evaluationId: string, responseText: string): Promise<{success?:true, error?:string}>
```
- Verifica auth + ownership (evaluation pertence a este professional_id)
- Insere em `evaluation_responses` (upsert por evaluation_id)
- Revalida `/painel/avaliacoes`

---

## Seção 2 — Configurações de Conta (`/painel/configuracoes`)

### Dados
- `profiles`: `full_name`, `phone`, `email`
- Email via `supabase.auth.getUser()` (read-only)

### Fetch (server, `page.tsx`)
```ts
supabase.from("profiles").select("full_name, phone, email").eq("id", user.id).single()
```

### UI (`settings-client.tsx`)
Dois blocos separados:

**Bloco 1 — Dados pessoais**
- Campo: Nome completo (input text, required)
- Campo: Telefone (input tel)
- Campo: E-mail (input text, disabled, estilizado como somente leitura)
- Botão "Salvar alterações"
- Feedback inline de sucesso/erro

**Bloco 2 — Segurança**
- Label: "Alterar senha"
- Texto explicativo: "Enviaremos um link de redefinição para seu e-mail."
- Botão "Enviar link de redefinição"
- Feedback de envio (loading state + confirmação)

### Actions (`actions.ts`)
```ts
updateAccountSettings(data: { full_name: string; phone: string }): Promise<{success?:true, error?:string}>
// Atualiza profiles SET full_name, phone WHERE id = user.id
// revalidatePath("/painel/configuracoes")

sendPasswordReset(): Promise<{success?:true, error?:string}>
// supabase.auth.resetPasswordForEmail(user.email, { redirectTo: "/auth/callback?next=/painel" })
```

---

## Seção 3 — Gestão de Assinatura (`/painel/assinatura`)

### Dados
- `professional_subscriptions`: `plan`, `status`, `trial_ends_at`, `current_period_end`, `stripe_subscription_id`
- `payment_transactions`: `id`, `amount`, `currency`, `status`, `created_at` (ordenados desc, limit 20)

### Fetch (server, `page.tsx`)
```ts
const [{ data: sub }, { data: transactions }] = await Promise.all([
  supabase.from("professional_subscriptions").select(...).eq("professional_id", pro.id).single(),
  supabase.from("payment_transactions").select(...).eq("professional_id", pro.id).order("created_at", { ascending: false }).limit(20),
])
```

### UI (`subscription-client.tsx`)
**Card do plano atual:**
- Nome: "Plano Prumo Pro"
- Preço: R$79/mês
- Badge de status: Trial (âmbar) / Ativo (verde) / Cancelado (vermelho) / Suspenso (cinza)
- Linha informativa contextual:
  - TRIAL → "X dias restantes no período gratuito"
  - ACTIVE → "Próxima cobrança em DD/MM/YYYY"
  - CANCELLED/SUSPENDED → "Seu perfil ficará oculto até a reativação"

**CTA contextual:**
- TRIAL → botão primário "Assinar agora — R$79/mês" (link para `/planos`)
- ACTIVE → botão outline "Gerenciar assinatura" (desabilitado, tooltip "Disponível em breve")
- CANCELLED/SUSPENDED → botão primário "Reativar assinatura" (link para `/planos`)

**Tabela de histórico:**
- Colunas: Data | Descrição | Valor | Status
- Descrição fixa: "Plano Prumo Pro — mensal"
- Status badges: COMPLETED (verde), PENDING (âmbar), FAILED (vermelho), REFUNDED (cinza)
- Empty state: "Nenhuma transação encontrada"

**Sem `actions.ts`** — página somente leitura por ora.

---

## Sidebar (`sidebar.tsx`)

Adicionar 3 novos itens ao `navItems`:

```ts
{ label: "Avaliações",     href: "/painel/avaliacoes",    icon: Star,       exact: false },
{ label: "Assinatura",     href: "/painel/assinatura",    icon: CreditCard, exact: false },
{ label: "Configurações",  href: "/painel/configuracoes", icon: Settings,   exact: false },
```

Importar: `Star`, `CreditCard`, `Settings` do `lucide-react`.

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `src/app/(professional)/painel/avaliacoes/page.tsx` | Criar |
| `src/app/(professional)/painel/avaliacoes/evaluations-client.tsx` | Criar |
| `src/app/(professional)/painel/avaliacoes/actions.ts` | Criar |
| `src/app/(professional)/painel/configuracoes/page.tsx` | Criar |
| `src/app/(professional)/painel/configuracoes/settings-client.tsx` | Criar |
| `src/app/(professional)/painel/configuracoes/actions.ts` | Criar |
| `src/app/(professional)/painel/assinatura/page.tsx` | Criar |
| `src/app/(professional)/painel/assinatura/subscription-client.tsx` | Criar |
| `src/app/(professional)/painel/sidebar.tsx` | Modificar (adicionar 3 itens) |

---

## Verificação

1. Navegar para `/painel/avaliacoes` — deve carregar mesmo sem avaliações (empty state)
2. Responder uma avaliação (se houver) — response deve aparecer no card sem reload
3. Navegar para `/painel/configuracoes` — campos devem estar pré-preenchidos
4. Salvar nome/telefone — mudança deve persistir ao recarregar
5. Clicar "Enviar link de redefinição" — deve mostrar confirmação
6. Navegar para `/painel/assinatura` — card de plano deve refletir o status atual
7. Sidebar deve exibir os 3 novos itens com ícones corretos, highlight ativo funcionando
