# Testes

Dois frameworks de teste: **Vitest** para testes unitários e de integração, **Playwright** para E2E.

## Vitest (Unitários / Integração)

**Config:** `vitest.config.ts`

```typescript
// vitest.config.ts
defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',       // Browser DOM simulado
    setupFiles: ['./vitest.setup.ts'],
    globals: true,              // describe, it, expect sem import
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: ['src/types/**/*', 'src/**/*.d.ts'],
    },
  },
})
```

**Setup:** `vitest.setup.ts` — importa `@testing-library/jest-dom` para matchers DOM customizados.

### Comandos

```bash
npm test              # Watch mode (re-executa ao salvar)
npm run test:run      # Executa uma vez e sai
npm run test:coverage # Gera relatório de cobertura em coverage/
```

### Arquivos de Teste Existentes

| Arquivo | O que testa |
|---------|-------------|
| `src/hooks/use-mobile.test.ts` | Hook `useMobile` — detecta viewport mobile |
| `src/lib/ibge.test.ts` | Utilitários IBGE — parsing de cidades |
| `src/lib/utils.test.ts` | `formatCurrency`, `formatPhone`, `slugify`, `formatDate` |
| `src/app/(contractor)/minha-conta/actions.test.ts` | Server Actions do painel do contratante |

### Padrão de Arquivo de Teste

Testes unitários ficam **co-localizados** com o arquivo que testam (`foo.ts` → `foo.test.ts`).

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatCurrency, slugify } from './utils'

describe('formatCurrency', () => {
  it('formata valor em reais', () => {
    expect(formatCurrency(7900)).toBe('R$ 79,00')
  })

  it('trata zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })
})

describe('slugify', () => {
  it('remove acentos e espaços', () => {
    expect(slugify('João Silva')).toBe('joao-silva')
  })
})
```

### Testando Server Actions

Server Actions retornam `{ error?, data? }` — testar os dois caminhos:

```typescript
// actions.test.ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: vi.fn(() => ({ data: { user: { id: 'user-1' } } })) },
    from: vi.fn(() => ({ update: vi.fn().mockResolvedValue({ error: null }) })),
  })),
}))

describe('updateProfile', () => {
  it('retorna erro sem autenticação', async () => {
    // ...
  })
})
```

### Testando Componentes React

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CityInput } from './city-input'

it('chama onChange com cidade selecionada', async () => {
  const onChange = vi.fn()
  render(<CityInput onChange={onChange} value="" />)
  
  await userEvent.type(screen.getByRole('combobox'), 'São Paulo')
  // ...
  
  expect(onChange).toHaveBeenCalledWith('São Paulo', 'SP')
})
```

---

## Playwright (E2E)

**Config:** `playwright.config.ts`

```typescript
defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Comandos

```bash
npm run test:e2e                    # Executa todos os testes E2E
npm run test:e2e -- --headed        # Com browser visível
npm run test:e2e -- --project=chromium  # Só Chromium
npx playwright show-report          # Abre relatório HTML
```

Relatório salvo em `playwright-report/`. Resultados em `test-results/`.

### Localização dos Testes

Testes E2E ficam em `tests/e2e/` (separado do source).

```
tests/
└── e2e/
    ├── auth.spec.ts      Fluxos de login e cadastro
    ├── search.spec.ts    Busca de profissionais
    └── profile.spec.ts   Perfil público
```

### Padrão de Teste E2E

```typescript
// tests/e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test('busca retorna profissionais por categoria', async ({ page }) => {
  await page.goto('/profissionais?categoria=eletricista')
  
  await expect(page.getByRole('heading', { name: /profissionais/i })).toBeVisible()
  await expect(page.getByTestId('professional-card')).toHaveCount.greaterThan(0)
})

test('filtro por cidade funciona', async ({ page }) => {
  await page.goto('/profissionais')
  await page.getByPlaceholder('Cidade').fill('São Paulo')
  await page.keyboard.press('Enter')
  
  await expect(page).toHaveURL(/cidade=s%C3%A3o-paulo/)
})
```

### CI

Em CI (`process.env.CI === 'true'`):
- Workers: 1 (execução serial)
- Retries: 2 (re-executa em falha)
- `reuseExistingServer: false` (sempre inicia novo servidor)

---

## Cobertura

Relatório HTML gerado em `coverage/index.html`.

Configuração:
- **Provider:** V8 (mais rápido que Istanbul)
- **Inclui:** `src/**/*`
- **Exclui:** `src/types/**/*`, `src/**/*.d.ts`

Para ver a cobertura atual:
```bash
npm run test:coverage
# Abre coverage/index.html no browser
```
