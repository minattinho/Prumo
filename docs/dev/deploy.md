# Deploy

## Plataforma Recomendada: Vercel

O Prumo é um projeto Next.js e funciona nativamente no Vercel sem configuração adicional.

## Deploy no Vercel

### Via CLI

```bash
npm install -g vercel
vercel --prod
```

### Via Dashboard

1. Importar repositório no [vercel.com](https://vercel.com)
2. Configurar variáveis de ambiente (ver [Variáveis de Ambiente](env-vars.md))
3. Deploy automático a cada push na branch `main`

## Checklist de Produção

Antes de ir ao ar:

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `MP_ACCESS_TOKEN` usando token de produção (`APP-...`, não `TEST-...`)
- [ ] Domínio configurado (`meuprumo.com.br`)
- [ ] Schema do banco de dados aplicado no Supabase de produção
- [ ] Storage buckets criados (`profiles`, `portfolio`) com políticas corretas
- [ ] Plano criado no Mercado Pago (`/api/mercadopago/setup-plan`)
- [ ] Webhooks do Mercado Pago configurados (pendente de implementação)
- [ ] Email verificado no Resend (`meuprumo.com.br`)
- [ ] PostHog configurado com projeto de produção

## Banco de Dados (Supabase)

O Supabase Cloud é o banco de produção. Aplique o schema:

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. SQL Editor → New Query
3. Cole e execute `supabase/schema.sql`

Para migrações futuras, use o Supabase CLI:

```bash
npx supabase db push
```

## Domínios

| Domínio | Propósito |
|---|---|
| `meuprumo.com.br` | Site principal (área pública + painel) |
| `app.meuprumo.com.br` | Alternativa para o painel (opcional) |
| `docs.meuprumo.com.br` | Esta documentação MkDocs |

## Build

O Next.js usa `output: 'standalone'` por padrão no Vercel. Não há `vercel.json` customizado.

```bash
npm run build  # Verifica erros de tipo e build
npm run start  # Servidor de produção local
```

## Monitoramento

- **Erros de runtime**: Vercel Logs ou integração com Sentry (a configurar)
- **Analytics de produto**: PostHog Dashboard
- **Performance do banco**: Supabase Dashboard → Reports

## Rollback

No Vercel, cada deploy é imutável. Para reverter:

1. Vercel Dashboard → Deployments
2. Selecionar deploy anterior
3. "Promote to Production"
