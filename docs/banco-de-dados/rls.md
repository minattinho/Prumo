# Políticas RLS

Row Level Security está habilitado em todas as 25 tabelas. As políticas seguem o princípio de menor privilégio.

## Princípios Gerais

| Regra | Aplicação |
|---|---|
| Profissionais ACTIVE → leitura pública | `professional_profiles`, `professional_specialties`, etc. |
| Mídia APPROVED → leitura pública | `portfolio_images`, `portfolio_videos` |
| Dados sensíveis → apenas o dono | Assinatura, métricas, logs |
| Admin → acesso total | Via `service_role` key em route handlers administrativos |

## Políticas por Tabela

### `professional_profiles`

```sql
-- Leitura pública: apenas perfis ACTIVE
CREATE POLICY "public_read_active"
ON professional_profiles FOR SELECT
USING (status = 'ACTIVE');

-- Escrita: apenas o próprio profissional
CREATE POLICY "owner_update"
ON professional_profiles FOR UPDATE
USING (user_id = auth.uid());
```

### `portfolio_images` / `portfolio_videos`

```sql
-- Leitura pública: apenas mídia APPROVED
CREATE POLICY "public_read_approved"
ON portfolio_images FOR SELECT
USING (status = 'APPROVED');

-- Escrita: dono do projeto
CREATE POLICY "owner_insert"
ON portfolio_images FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT id FROM portfolio_projects
    WHERE professional_id IN (
      SELECT id FROM professional_profiles
      WHERE user_id = auth.uid()
    )
  )
);
```

### `evaluations`

```sql
-- Leitura pública: todas as avaliações
CREATE POLICY "public_read"
ON evaluations FOR SELECT
USING (true);

-- Inserção: apenas contratante que contatou o profissional
CREATE POLICY "contractor_insert_if_contacted"
ON evaluations FOR INSERT
WITH CHECK (
  contractor_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM contact_logs
    WHERE contractor_id = auth.uid()
      AND professional_id = evaluations.professional_id
  )
);
```

### `contact_logs`

```sql
-- Leitura: apenas o contratante dono do log ou o profissional alvo
CREATE POLICY "owner_or_professional_read"
ON contact_logs FOR SELECT
USING (
  contractor_id = auth.uid()
  OR professional_id IN (
    SELECT id FROM professional_profiles WHERE user_id = auth.uid()
  )
);

-- Inserção: contratante autenticado
CREATE POLICY "contractor_insert"
ON contact_logs FOR INSERT
WITH CHECK (contractor_id = auth.uid());
```

### `professional_subscriptions` / `payment_transactions`

```sql
-- Leitura: apenas o próprio profissional
CREATE POLICY "owner_read"
ON professional_subscriptions FOR SELECT
USING (
  professional_id IN (
    SELECT id FROM professional_profiles WHERE user_id = auth.uid()
  )
);
```

### `budget_requests`

```sql
-- Leitura: contratante que enviou OU profissional que recebeu
CREATE POLICY "participant_read"
ON budget_requests FOR SELECT
USING (
  contractor_id = auth.uid()
  OR professional_id IN (
    SELECT id FROM professional_profiles WHERE user_id = auth.uid()
  )
);

-- Inserção: contratante autenticado
CREATE POLICY "contractor_insert"
ON budget_requests FOR INSERT
WITH CHECK (contractor_id = auth.uid());
```

## Service Role

Operações administrativas (ativação de perfil, moderação, criação manual de usuário) usam o `SUPABASE_SERVICE_ROLE_KEY` nas Route Handlers, que ignora todas as políticas RLS.

```typescript
// Nunca expor service_role no client-side
import { createClient } from '@supabase/supabase-js'

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
)
```

!!! danger "Segurança"
    O `SUPABASE_SERVICE_ROLE_KEY` não deve nunca ser exposto no client-side. Use apenas em Server Components, Route Handlers e Server Actions.
