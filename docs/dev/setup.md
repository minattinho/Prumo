# Configuração Local

## Pré-requisitos

- Node.js 20+
- npm 10+
- Conta no Supabase (gratuita)
- Conta no Mercado Pago (sandbox para desenvolvimento)

## Passo a Passo

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/prumo.git
cd prumo
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencher `.env.local` com as variáveis necessárias. Ver [Variáveis de Ambiente](env-vars.md).

### 4. Configurar o Supabase

1. Criar um projeto no [Supabase Dashboard](https://app.supabase.com)
2. Ir em **SQL Editor** e executar o conteúdo de `supabase/schema.sql`
3. Copiar as credenciais do projeto para o `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 5. Configurar Storage Buckets no Supabase

No Supabase Dashboard → Storage, criar dois buckets:

| Bucket | Público |
|---|---|
| `profiles` | Sim |
| `portfolio` | Sim |

### 6. Criar o plano no Mercado Pago

Com o `MP_ACCESS_TOKEN` configurado, chamar:

```bash
curl -X POST http://localhost:3000/api/mercadopago/setup-plan
```

Copiar o `plan_id` retornado para `MP_PLAN_ID` no `.env.local`.

### 7. Iniciar o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura de URLs

| URL | Contexto |
|---|---|
| `localhost:3000` | Área pública |
| `localhost:3000/painel` | Painel do profissional |
| `localhost:3000/admin` | Painel administrativo |
| `localhost:3000/minha-conta` | Área do contratante |

## Criar Usuário Admin

```bash
curl -X POST http://localhost:3000/api/admin/criar-usuario \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SETUP_SECRET}" \
  -d '{"email":"admin@prumo.com","password":"senha123","name":"Admin","role":"admin"}'
```

## Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |

## Desenvolvimento com Pagamentos (Sandbox)

Para testar o fluxo de pagamento:

1. Use `MP_ACCESS_TOKEN` começando com `TEST-` (sandbox)
2. No checkout do Mercado Pago, use os [cartões de teste](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/test-cards)
3. Para simular webhooks localmente, use [ngrok](https://ngrok.com) ou [Mercado Pago's webhook testing](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/test-cards)
