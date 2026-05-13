# Autenticação

## Provider

Supabase Auth (PostgreSQL-backed) com suporte a:

- Email + senha
- Google OAuth

## Roles

| Role | Acesso |
|---|---|
| `contractor` | `/minha-conta`, busca e contato com profissionais |
| `professional` | `/painel` e toda a área de gestão do profissional |
| `admin` | `/admin`, operações administrativas |

O role é armazenado em `profiles.role` e definido no momento do cadastro.

## Fluxo de Cadastro

### Contratante

```
/contratante?modo=cadastro
      ↓
Email + senha (ou Google OAuth)
      ↓
Supabase cria auth.users
      ↓
Trigger handle_new_user() → cria profiles com role='contractor'
      ↓
Redireciona para /minha-conta (ou rota anterior via ?next=)
```

### Profissional

```
/seja-profissional (3 etapas)
      ↓
Etapa 1: Email + senha (ou Google)
      ↓
Supabase cria auth.users
      ↓
Trigger → profiles com role='professional'
      ↓
Etapa 2: Perfil
      ↓
Etapa 3: Documento (SERPRO)
      ↓
professional_profiles criado com:
  status = 'PENDING'
  subscription_status = 'TRIAL'
  trial_ends_at = NOW() + 30 days
      ↓
Redireciona para /painel
```

## Google OAuth

Fluxo redirect:

1. Usuário clica em "Entrar com Google"
2. Supabase inicia fluxo OAuth
3. Google autentica e redireciona para `/api/auth/callback`
4. Handler troca code por sessão e redireciona para `/painel` (profissional) ou `/` (contratante)

## Sessão

- Cookies gerenciados pelo `@supabase/ssr`
- Server client (`lib/supabase/server.ts`) lê cookies via `next/headers`
- Sessão renovada automaticamente pelo Supabase

## Proteção de Rotas (Server-Side)

Cada grupo de rotas tem um `layout.tsx` server-side que verifica:

```typescript
const { data: { user } } = await supabase.auth.getUser()
// Não autenticado → redirect para login
// Role incorreto → redirect para login correto
```

Não há middleware Edge. A proteção acontece em Server Components, antes da renderização.

## Redefinição de Senha

```
/redefinir-senha
      ↓
Usuário informa email
      ↓
Supabase envia email com link de redefinição
      ↓
Link redireciona para /redefinir-senha?token=...
      ↓
Usuário define nova senha
```

Lógica em `lib/auth/password-reset.ts`.

## Admin

Admins fazem login em `/profissional`. Após autenticação:

```typescript
if (profile.role === 'admin') redirect('/admin')
if (profile.role === 'professional') redirect('/painel')
```
