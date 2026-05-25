# Arquitetura do Sistema

## Visão Geral

```
                    Internet
                       │
          ┌────────────┴────────────┐
          │                         │
   meuprumo.com.br          app.meuprumo.com.br
  (área pública + auth)     (painel do profissional)
          │                         │
          └────────────┬────────────┘
                       │
                  Next.js 16
                 (App Router)
                       │
          ┌────────────┼────────────┐
          │            │            │
       Supabase    Cloudinary   MercadoPago
    (DB + Auth +   (imagens/    (assinaturas)
      Storage)      vídeos)
          │
    ┌─────┼─────┐
    │     │     │
  Auth   DB   Storage
  JWT   RLS   Buckets
```

## Subdomain Routing

Dois domínios servidos pela mesma aplicação Next.js:

| Domínio | Propósito | Rotas permitidas |
|---------|-----------|-----------------|
| `meuprumo.com.br` | Área pública, cadastro, login | `/`, `/profissionais`, `/seja-profissional`, `/planos`, `/contratante`, `/auth` |
| `app.meuprumo.com.br` | Painel do profissional e admin | `/painel`, `/profissional`, `/auth/callback`, `/redefinir-senha`, `/api` |

Acesso ao `/painel` pelo domínio principal redireciona para `app.*`. Acesso a rotas públicas pelo `app.*` redireciona para o domínio principal.

Em desenvolvimento (`localhost`), o roteamento por subdomínio é ignorado — tudo funciona em `localhost:3000`. Para testar subdomínio localmente, usar `app.localhost:3000`.

## Middleware (proxy.ts)

O arquivo `src/proxy.ts` exporta a função `proxy` usada em `middleware.ts`. Executa em toda requisição (exceto assets estáticos).

**Responsabilidades (em ordem):**

1. **Subdomain routing** — detecta se o host é `app.*` e aplica redirects
2. **Session refresh** — cria Supabase server client e chama `getUser()` para renovar tokens JWT automaticamente
3. **Auth guard** — redireciona para login se rota protegida sem sessão

```typescript
const PROFESSIONAL_ROUTES = ["/painel", "/admin"];
const CONTRACTOR_ROUTES = ["/minha-conta"];

// Não autenticado acessando rota protegida:
// /painel/* → redirect /profissional?next=/painel/...
// /minha-conta → redirect /contratante?next=/minha-conta
```

**Cookie domain cross-subdomain** (`src/lib/supabase/cookie-domain.ts`):

```typescript
// Retorna ".meuprumo.com.br" (com ponto) em produção
// Undefined em localhost
// Override via NEXT_PUBLIC_COOKIE_DOMAIN
getCookieDomain()
```

O domínio com ponto prefixado permite que o cookie de sessão seja compartilhado entre `meuprumo.com.br` e `app.meuprumo.com.br` — login no domínio principal mantém a sessão no `app.*`.

## Clientes Supabase

Dois clientes com contextos diferentes:

| Arquivo | Ambiente | Uso |
|---------|----------|-----|
| `src/lib/supabase/server.ts` | Server (Node.js) | Server Components, Route Handlers, Server Actions |
| `src/lib/supabase/client.ts` | Client (Browser) | Client Components (`'use client'`) |

**Regra:** nunca importar o client de servidor em Client Components (não tem acesso a cookies) e vice-versa (o client browser não pode ser instanciado no servidor).

## Estrutura de Rotas (Route Groups)

```
src/app/
├── (public)/       Sem autenticação requerida
├── (auth)/         Páginas de login/cadastro (redireciona se já logado)
├── (professional)/ Requer sessão + role=professional
├── (contractor)/   Requer sessão + role=contractor
├── (admin)/        Requer sessão + role=admin
└── api/            Route Handlers (REST)
```

Os parênteses tornam o grupo invisível na URL. `(professional)/painel/page.tsx` → `/painel`.

## Proteção de Rotas

**Camada 1 — Middleware (`proxy.ts`):** verifica apenas se há sessão. Se não há sessão e a rota é protegida, redireciona para login.

**Camada 2 — Layout server-side:** cada route group tem um `layout.tsx` que consulta o banco, verifica a `role` do usuário e redireciona se a role não corresponde. Exemplo: `/painel/layout.tsx` confirma `role === 'professional'`; caso contrário, redireciona para `/`.

Esse design de duas camadas garante:
- Performance: middleware não consulta banco (só verifica JWT)
- Segurança: layout verifica role real no banco antes de renderizar qualquer dado sensível

## Auth Flow

### Cadastro de Profissional

```
1. /seja-profissional (form 3 etapas)
2. Supabase Auth: signUp() → email/senha ou OAuth Google
3. INSERT profiles (role='professional')
4. INSERT professional_profiles (status='PENDING', trial_ends_at=now+30d)
5. POST /api/serpro/validate → cpf_validations INSERT
6. Email boas-vindas via Resend
7. Perfil criado: status=PENDING, trial ativo
```

### Login

```
1. /profissional ou /contratante (form)
2. Supabase Auth: signInWithPassword() ou OAuth
3. JWT retornado, cookie setado com getCookieDomain()
4. Cookie válido nos dois subdomínios
5. Redirect para /painel (professional) ou /minha-conta (contractor)
```

### Ativação do Perfil (PENDING → ACTIVE)

Feita pelo admin via painel `/admin` ou automaticamente quando:
- Documento validado pelo SERPRO
- Perfil suficientemente preenchido

## Server/Client Boundary

**Server Components (padrão):** buscam dados diretamente do Supabase no servidor. Sem useEffect, sem fetch no cliente. Dados chegam prontos no HTML.

**Client Components (`'use client'`):** usados apenas quando:
- Interatividade (state, eventos)
- APIs browser (geolocalização, localStorage)
- Hooks React (useEffect, useState)

**Server Actions:** funções `async` marcadas com `'use server'`, usadas como handlers de formulários. Padrão por rota: arquivo `actions.ts` com exports nomeados. Retornam `{ error?: string, data?: T }`.

```typescript
// app/(professional)/painel/perfil/actions.ts
'use server'
export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient()
  // ...
  return { data: updated }
}
```

## Fluxo de Dados

```
Browser → Server Component
         ↓ createServerClient()
         ↓ supabase.from('table').select()
         ↓ dados retornados no HTML (SSR)
         ↓ hidratação React

Browser → Form Submit → Server Action
         ↓ 'use server'
         ↓ createServerClient()
         ↓ validação Zod
         ↓ supabase.from('table').insert/update()
         ↓ revalidatePath() ou redirect()
```
