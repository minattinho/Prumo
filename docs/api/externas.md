# APIs Externas

## SERPRO — Receita Federal

**Uso:** Validação de CPF e CNPJ em tempo real durante o onboarding do profissional.

**Documentação:** https://developers.serpro.gov.br

**Variáveis:**
```env
SERPRO_API_KEY=
SERPRO_BASE_URL=
```

**Fluxo de uso:**
1. Usuário digita CPF/CNPJ → pré-validação local (checksum)
2. Avança para etapa → chamada SERPRO com cache de 24h
3. Resultado armazenado em `cpf_validations`

**Resposta esperada:**
- Nome completo da pessoa ou razão social
- Situação cadastral (regular, suspensa, cancelada, etc.)

---

## IBGE — Municípios Brasileiros

**Uso:** Autocomplete de cidades no componente `CityInput` e no editor de perfil.

**Endpoint público:** `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`

Sem autenticação. Carrega todos os municípios em memória no primeiro uso e filtra localmente.

```typescript
// lib/ibge.ts
export async function getCities(): Promise<City[]> { ... }
```

---

## BigDataCloud — Geocodificação Reversa

**Uso:** Converter as coordenadas de geolocalização do navegador em cidade e estado para exibir no mapa.

**Endpoint:** `https://api.bigdatacloud.net/data/reverse-geocode-client`

**Variável:**
```env
BIGDATACLOUD_API_KEY=
```

**Parâmetros:** `latitude`, `longitude`, `localityLanguage=pt`

**Resposta usada:**
```json
{
  "city": "São Paulo",
  "principalSubdivisionCode": "BR-SP"
}
```

---

## Mercado Pago — Pagamentos

**Uso:** Assinaturas recorrentes via PreApproval (checkout hospedado pelo MP).

**SDK:** `mercadopago` (oficial, npm)

**Documentação:** https://www.mercadopago.com.br/developers/pt/reference

**Variáveis:**
```env
MP_ACCESS_TOKEN=TEST-...    # TEST- para sandbox
MP_PLAN_ID=408B...          # ID do plano criado via /api/mercadopago/setup-plan
```

**Objetos usados:**
- `PreApprovalPlan` — criar plano de assinatura
- `PreApproval` — criar instância de assinatura para um usuário

---

## Cloudinary — CDN de Mídia

**Uso:** Upload, transformação e CDN de imagens e vídeos do portfólio e fotos de perfil.

**SDK:** `cloudinary` (npm)

**Variáveis:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Funcionalidades usadas:**
- `uploader.upload()` — upload de arquivo com folder e resource_type
- URLs com transformações on-the-fly (resize, crop, qualidade)

---

## Resend — Email Transacional

**Uso:** Envio de emails transacionais com templates React.

**SDK:** `resend` (npm)

**Documentação:** https://resend.com/docs

**Variáveis:**
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@meuprumo.com.br
```

---

## PostHog — Analytics

**Uso:** Rastreamento de comportamento de usuário, eventos customizados e funnels de conversão.

**SDKs:** `posthog-js` (browser) + `posthog-node` (server)

**Variáveis:**
```env
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```
