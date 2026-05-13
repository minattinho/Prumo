# Upload de Mídia

## Plataformas

| Uso | Plataforma |
|---|---|
| Fotos de perfil | Supabase Storage (`profiles/`) |
| Imagens de portfólio | Cloudinary (CDN) |
| Vídeos de portfólio | Cloudinary (CDN) |
| Fotos de serviços concluídos | Cloudinary (CDN) |

## Endpoint de Upload

**`POST /api/upload`**

Requer autenticação. Aceita `multipart/form-data`.

**Parâmetros:**

| Campo | Tipo | Descrição |
|---|---|---|
| `file` | File | Arquivo a ser enviado |
| `type` | `profile` \| `portfolio` \| `service` | Destino do upload |
| `projectId` | uuid (opcional) | ID do projeto no portfólio |

**Response:**
```json
{
  "url": "https://res.cloudinary.com/prumo/...",
  "cloudinary_id": "prumo/portfolio/abc123",
  "type": "image"
}
```

## Supabase Storage Buckets

| Bucket | Política de Leitura | Política de Escrita |
|---|---|---|
| `profiles/` | Pública | Apenas o dono (`auth.uid() = user_id`) |
| `portfolio/` | Pública | Apenas o dono |

## Moderação de Mídia

Toda mídia de portfólio enviada começa com `status = 'PENDING'`:

```sql
INSERT INTO portfolio_images (project_id, cloudinary_url, cloudinary_id, status)
VALUES ($1, $2, $3, 'PENDING')
```

Antes de aparecer publicamente, precisa ser aprovada (`status = 'APPROVED'`).

### Estados da Mídia

```
PENDING → APPROVED (visível no perfil público)
        → REJECTED (gera infração no profissional)
```

A aprovação/rejeição é feita manualmente pelo admin (UI de moderação pendente).

## Reordenação de Imagens

Imagens de portfólio têm campo `order` (integer). O componente de portfólio usa `@dnd-kit/sortable` para drag-and-drop, que atualiza o `order` via Server Action.

## Projetos em Destaque

Campo `is_featured` em `portfolio_projects`. Constraint no banco impede mais de 3 projetos marcados como destaque por profissional.

## Cloudinary

Configurado em `lib/cloudinary/config.ts`:

```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
```

!!! note "Cloudinary vs Supabase Storage"
    Cloudinary é usado para portfólio por oferecer transformações de imagem on-the-fly (resize, crop, qualidade) e CDN global mais robusto para mídia pesada. Supabase Storage é usado para fotos de perfil (mais simples, sem necessidade de CDN especializado).
