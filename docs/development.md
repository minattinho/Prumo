# Guia de Desenvolvimento

## Pré-requisitos

- Node.js 20+
- npm 10+
- Conta Supabase (projeto criado)
- Credenciais dos serviços externos (ver [deployment.md](deployment.md))

## Setup Local

```bash
# 1. Clonar e instalar
git clone <repo>
cd prumo
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher as variáveis (ver docs/deployment.md)

# 3. Aplicar schema no Supabase
# Abrir Supabase Dashboard > SQL Editor
# Executar conteúdo de supabase/schema.sql

# 4. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:3000`.

## Estrutura de Arquivos

```
src/
├── app/              Páginas e API routes (Next.js App Router)
│   ├── (public)/     Área pública
│   ├── (auth)/       Login e cadastro
│   ├── (professional)/painel/  Painel do profissional
│   ├── (contractor)/ Área do contratante
│   ├── (admin)/      Painel admin
│   └── api/          Route Handlers
│
├── components/
│   ├── ui/           Componentes shadcn/ui
│   ├── layout/       Header, Footer, Logo
│   ├── auth/         Modais de auth
│   └── providers/    Context providers
│
├── hooks/            Custom React hooks
├── lib/              Clientes de serviços externos
│   ├── supabase/     Client e Server clients
│   ├── cloudinary/   Config Cloudinary
│   ├── mercadopago/  Client e planos
│   ├── resend/       Client e templates de email
│   ├── serpro/       Client e validadores
│   └── posthog/      Client analytics
│
├── types/            Tipos TypeScript
│   ├── index.ts      Tipos de domínio
│   └── services.ts   Tipos de serviços externos
│
└── proxy.ts          Middleware (subdomain routing + auth guard)
```

## Convenções de Nomes

| Item | Convenção | Exemplo |
|------|-----------|---------|
| Componentes | PascalCase | `ProfessionalCard.tsx` |
| Hooks | camelCase com `use` | `useMobile.ts` |
| Utilitários | camelCase | `utils.ts` |
| Server Actions | camelCase, verbo | `updateProfile`, `deleteProject` |
| Tipos | PascalCase | `ProfessionalProfile` |
| Variáveis CSS | kebab-case | `--azul-principal` |
| Slugs de categoria | kebab-case | `eletricista`, `design-grafico` |

## Path Alias

`@/*` aponta para `src/*`. Sempre usar em imports:

```typescript
// Correto
import { Button } from '@/components/ui/button'
import { createServerClient } from '@/lib/supabase/server'

// Evitar
import { Button } from '../../components/ui/button'
```

## Server Actions

Padrão: arquivo `actions.ts` co-localizado com a página/route.

```typescript
// app/(professional)/painel/perfil/actions.ts
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  personal_description: z.string().max(500),
  city: z.string().min(2),
})

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { error: 'Não autenticado' }
  
  const parsed = profileSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  
  const { error } = await supabase
    .from('professional_profiles')
    .update(parsed.data)
    .eq('user_id', user.id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/painel/perfil')
  return { data: true }
}
```

**Regras:**
- Sempre validar com Zod antes de tocar no banco
- Sempre verificar autenticação antes de qualquer operação
- Retornar `{ error?: string, data?: T }` — nunca lançar exceção
- Chamar `revalidatePath()` após mutations para atualizar o cache

## Formulários

Padrão: `react-hook-form` + Zod + Server Actions.

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateProfile } from './actions'

const schema = z.object({
  personal_description: z.string().min(10, 'Mínimo 10 caracteres'),
})

type FormData = z.infer<typeof schema>

export function ProfileForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, v))
    const result = await updateProfile(formData)
    if (result.error) toast.error(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <textarea {...register('personal_description')} />
      {errors.personal_description && <p>{errors.personal_description.message}</p>}
      <button type="submit" disabled={isSubmitting}>Salvar</button>
    </form>
  )
}
```

## Banco de Dados (Supabase)

**Server Components e Actions:** usar `createServerClient` de `@/lib/supabase/server`

```typescript
import { createServerClient } from '@/lib/supabase/server'

const supabase = await createServerClient()
const { data, error } = await supabase
  .from('professional_profiles')
  .select('id, slug, city, status')
  .eq('status', 'ACTIVE')
```

**Client Components:** usar `createBrowserClient` de `@/lib/supabase/client`

```typescript
import { createBrowserClient } from '@/lib/supabase/client'

const supabase = createBrowserClient()
```

**Tipos:** o arquivo `src/lib/supabase/types.ts` é gerado automaticamente pelo Supabase CLI e contém tipos para todas as tabelas. Para usar:

```typescript
import type { Tables } from '@/lib/supabase/types'

type ProfessionalProfile = Tables<'professional_profiles'>
```

Para regenerar tipos após mudanças no schema:
```bash
npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
```

## Imagens

**Upload:** POST para `/api/upload` com `multipart/form-data`

```typescript
const formData = new FormData()
formData.append('file', file)
formData.append('folder', 'portfolio')

const res = await fetch('/api/upload', { method: 'POST', body: formData })
const { cloudinary_url, cloudinary_id } = await res.json()
```

**Exibição:** usar `CldImage` de `next-cloudinary`

```tsx
import { CldImage } from 'next-cloudinary'

<CldImage
  src={cloudinary_id}
  width={400}
  height={300}
  alt="Foto do projeto"
  crop="fill"
/>
```

## Emails

Chamar POST `/api/emails` com o tipo e dados:

```typescript
await fetch('/api/emails', {
  method: 'POST',
  body: JSON.stringify({
    type: 'welcome',
    to: 'prof@email.com',
    data: { name: 'João' },
  }),
})
```

Templates ficam em `src/lib/resend/templates/` como componentes React Email.

## Utilitários (`src/lib/utils.ts`)

```typescript
import { cn, formatCurrency, formatPhone, slugify, formatDate } from '@/lib/utils'

cn('flex gap-4', isActive && 'text-blue-600')  // clsx + tailwind-merge
formatCurrency(7900)                            // "R$ 79,00"
formatPhone('11999998888')                      // "(11) 99999-8888"
slugify('João Silva')                           // "joao-silva"
formatDate('2024-01-15')                        // "15/01/2024"
```

## Como Adicionar uma Nova Página

1. Criar pasta/arquivo na route group correta:
   ```
   src/app/(professional)/painel/nova-pagina/page.tsx
   ```

2. Se precisar de Server Action, criar `actions.ts` na mesma pasta

3. Se precisar de estado de loading, criar `loading.tsx`

4. Se precisar de tratamento de erro, criar `error.tsx`

5. Adicionar link na sidebar correspondente (`sidebar.tsx` do route group)

## Como Adicionar um Novo API Route

```typescript
// src/app/api/novo-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }
  
  const body = await request.json()
  // ...
  
  return NextResponse.json({ data: result })
}
```

## Lint e Formatação

```bash
npm run lint          # ESLint (Next.js + Prettier config)
```

ESLint config: `eslint.config.mjs` (ESLint 9 flat config)

Prettier config: `prettier.config.js` com `eslint-config-prettier` para não conflitar.

## Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| `dev` | `next dev` | Servidor de desenvolvimento (port 3000) |
| `build` | `next build` | Build de produção |
| `start` | `next start` | Servidor de produção local |
| `lint` | `eslint` | Verificação de código |
| `test` | `vitest` | Testes unitários em watch mode |
| `test:run` | `vitest run` | Testes unitários (uma vez) |
| `test:coverage` | `vitest run --coverage` | Relatório de cobertura |
| `test:e2e` | `playwright test` | Testes E2E |
