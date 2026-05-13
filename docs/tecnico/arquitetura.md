# Stack e Arquitetura

## Stack Técnica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| Linguagem | TypeScript | 5 |
| Estilo | Tailwind CSS | v4 |
| UI Primitives | Radix UI + shadcn/ui | latest |
| Formulários | React Hook Form + Zod | latest |
| Banco de Dados | Supabase (PostgreSQL) | — |
| Auth | Supabase Auth | — |
| Storage | Supabase Storage + Cloudinary | — |
| Pagamentos | Mercado Pago (PreApproval) | — |
| Email | Resend | — |
| Analytics | PostHog | — |
| Validação de documentos | SERPRO API | — |
| Geocodificação | BigDataCloud | — |
| Cidades | IBGE API | — |
| Mapas | Leaflet + React-Leaflet | — |
| Drag-and-drop | @dnd-kit | — |
| Gráficos | Recharts | — |
| Runtime | Node.js | 20+ |

## Estrutura de Diretórios

```
src/
├── app/                        # Next.js App Router
│   ├── (public)/               # Acesso irrestrito
│   │   ├── page.tsx            # Home
│   │   ├── profissionais/      # Busca + perfil público
│   │   ├── seja-profissional/  # Onboarding (3 etapas)
│   │   ├── planos/             # Preços
│   │   └── sobre|termos|privacidade/
│   ├── (auth)/                 # Páginas de auth
│   │   ├── contratante/        # Login + signup contratante
│   │   ├── profissional/       # Login profissional + admin
│   │   └── redefinir-senha/
│   ├── (professional)/painel/  # Dashboard do profissional
│   ├── (contractor)/           # Área do contratante
│   ├── (admin)/admin/          # Painel admin
│   └── api/                    # Route Handlers
│
├── components/
│   ├── ui/                     # shadcn/ui (50+ componentes)
│   └── layout/                 # Header, Footer, Logo, UserMenu
│
├── lib/
│   ├── supabase/               # server.ts, client.ts, types.ts
│   ├── mercadopago/            # client.ts, plan.ts
│   ├── serpro/                 # client.ts, validators.ts
│   ├── resend/                 # client.ts, templates/
│   ├── posthog/                # client.ts
│   ├── cloudinary/             # config.ts
│   └── ibge.ts                 # Autocomplete de cidades
│
└── types/                      # Tipos TypeScript de domínio
```

## Grupos de Rotas (Route Groups)

O App Router usa grupos de rotas para separar contextos de autorização:

| Grupo | Proteção | Redireciona para |
|---|---|---|
| `(public)` | Nenhuma | — |
| `(auth)` | Redireciona se autenticado | `/painel` ou `/minha-conta` |
| `(professional)` | Requer `role = professional` | `/profissional` |
| `(contractor)` | Requer `role = contractor` | `/contratante` |
| `(admin)` | Requer `role = admin` | `/profissional` |

### Como funciona a proteção

Cada grupo tem um `layout.tsx` que executa no servidor:

```typescript
// Exemplo simplificado de (professional)/layout.tsx
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) redirect('/profissional')

const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'professional') redirect('/profissional')
```

Não há middleware Edge — toda proteção acontece em Server Components.

## Clientes Supabase

### Padrão de Uso

```typescript
// Server Component / Route Handler / Server Action
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// Client Component
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
```

O cliente server usa `cookies()` do `next/headers` para manter a sessão via SSR. O cliente browser usa localStorage/cookies do navegador.

## Lazy Initialization de SDKs

SDKs externos (Mercado Pago, Cloudinary) usam lazy initialization para não instanciar na build:

```typescript
// lib/mercadopago/client.ts
let _mp: MercadoPagoConfig | null = null

export function getMercadoPagoClient() {
  if (!_mp) {
    _mp = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
  }
  return _mp
}
```

## Alias de Importação

Configurado em `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Use `@/lib/...`, `@/components/...`, `@/types/...` em todo o projeto.
