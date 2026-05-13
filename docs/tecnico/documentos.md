# Validação de Documentos

## Overview

CPF e CNPJ são validados em duas etapas durante o onboarding do profissional (etapa 3 de `/seja-profissional`).

## Etapa 1: Pré-validação Local

**Endpoint:** `POST /api/serpro/precheck`

Valida o **checksum algorítmico** do CPF ou CNPJ sem nenhuma chamada externa.

- Para CPF: algoritmo de módulo 11 com dois dígitos verificadores
- Para CNPJ: algoritmo da Receita Federal com dois dígitos verificadores

Rápido, sem custo, sem latência de rede. Rejeita documentos com dígitos inválidos antes mesmo de chamar o SERPRO.

```typescript
// lib/serpro/validators.ts
export function validateCPF(cpf: string): boolean { ... }
export function validateCNPJ(cnpj: string): boolean { ... }
```

## Etapa 2: Validação SERPRO

**Endpoint:** `POST /api/serpro/validate`

Consulta a **API da Receita Federal** (via SERPRO) para verificar a situação cadastral do documento.

### Fluxo

```
POST /api/serpro/validate
      ↓
Verifica cache em cpf_validations (< 24h)
      ↓
[Cache hit] → retorna resultado cacheado
[Cache miss] → consulta SERPRO
               → armazena resultado em cpf_validations
               → retorna resultado
```

### Cache de 24h

```sql
-- Verificação de cache
SELECT * FROM cpf_validations
WHERE professional_id = $1
  AND validation_date > NOW() - INTERVAL '24 hours'
ORDER BY validation_date DESC
LIMIT 1
```

### Dados Retornados

| Campo | Descrição |
|---|---|
| `nome` | Nome completo da pessoa/empresa |
| `situacao_cadastral` | Status na Receita Federal (regular, suspensa, etc.) |
| `status` | `APPROVED` ou `REJECTED` |

### Armazenamento

```sql
INSERT INTO cpf_validations (
  professional_id,
  validation_date,
  status,
  serpro_response,      -- JSON completo da resposta SERPRO
  jusbrasil_response    -- JSON de consulta adicional (opcional)
)
```

## Variáveis de Ambiente

```env
SERPRO_API_KEY=          # Chave de acesso à API do SERPRO
SERPRO_BASE_URL=         # URL base da API (sandbox ou produção)
```

## Considerações

!!! note "SERPRO é pago"
    Cada consulta à API do SERPRO tem custo. O cache de 24h reduz chamadas repetidas durante o onboarding.

!!! tip "Validação em tempo real"
    A pré-validação local (`/precheck`) ocorre enquanto o usuário digita (onBlur). A validação SERPRO é disparada apenas ao avançar para a próxima etapa.
