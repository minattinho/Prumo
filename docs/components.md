# Componentes

## shadcn/ui (`src/components/ui/`)

Configuração em `components.json`: estilo `base-nova`, ícones `lucide-react`, variáveis CSS.

Para adicionar um novo componente: `npx shadcn add <nome>`

| Componente | Arquivo | Uso principal |
|-----------|---------|--------------|
| Accordion | `accordion.tsx` | FAQ, conteúdo colapsável |
| Alert | `alert.tsx` | Mensagens informativas inline |
| AlertDialog | `alert-dialog.tsx` | Confirmações destrutivas (ex: deletar conta) |
| AspectRatio | `aspect-ratio.tsx` | Container de proporção fixa para imagens |
| Avatar | `avatar.tsx` | Foto de perfil circular com fallback iniciais |
| Badge | `badge.tsx` | Tags, status, categorias |
| Breadcrumb | `breadcrumb.tsx` | Navegação hierárquica no painel |
| Button | `button.tsx` | Botão principal (variantes: default, outline, ghost, destructive) |
| ButtonGroup | `button-group.tsx` | Grupo de botões relacionados |
| Calendar | `calendar.tsx` | Seletor de data (usado em date pickers) |
| Card | `card.tsx` | Container com borda e padding |
| Carousel | `carousel.tsx` | Galeria de imagens via Embla |
| Chart | `chart.tsx` | Wrapper Recharts com tema |
| Checkbox | `checkbox.tsx` | Input booleano |
| Collapsible | `collapsible.tsx` | Seção expandível |
| Command | `command.tsx` | Paleta de comandos / combobox |
| ContextMenu | `context-menu.tsx` | Menu de contexto (right-click) |
| Dialog | `dialog.tsx` | Modal centrado na tela |
| Drawer | `drawer.tsx` | Modal deslizante (bottom sheet em mobile) |
| DropdownMenu | `dropdown-menu.tsx` | Menu suspenso (ex: user menu no header) |
| Empty | `empty.tsx` | Estado vazio de listas |
| Field | `field.tsx` | Wrapper de campo de formulário (label + input + error) |
| HoverCard | `hover-card.tsx` | Preview ao hover |
| Input | `input.tsx` | Campo de texto |
| InputGroup | `input-group.tsx` | Input com prefix/suffix (ex: campo de busca com ícone) |
| InputOTP | `input-otp.tsx` | Campo de código OTP |
| Item | `item.tsx` | Item de lista com ações |
| Kbd | `kbd.tsx` | Tecla de teclado renderizada |
| Label | `label.tsx` | Label acessível para inputs |
| Menubar | `menubar.tsx` | Barra de menus horizontal |
| NativeSelect | `native-select.tsx` | Select nativo do HTML |
| NavigationMenu | `navigation-menu.tsx` | Menu de navegação com submenus |
| Pagination | `pagination.tsx` | Paginação de listas |
| PasswordInput | `password-input.tsx` | Input de senha com toggle de visibilidade |
| Popover | `popover.tsx` | Popup posicionado |
| Progress | `progress.tsx` | Barra de progresso (ex: completude do perfil) |
| RadioGroup | `radio-group.tsx` | Seleção única entre opções |
| Resizable | `resizable.tsx` | Painéis redimensionáveis |
| ScrollArea | `scroll-area.tsx` | Área com scroll customizado |
| Select | `select.tsx` | Select estilizado (Radix) |
| Separator | `separator.tsx` | Divisor visual |
| Sheet | `sheet.tsx` | Painel lateral deslizante |
| Sidebar | `sidebar.tsx` | Sidebar de navegação (painel profissional) |
| Skeleton | `skeleton.tsx` | Placeholder de carregamento |
| Slider | `slider.tsx` | Slider numérico |
| Spinner | `spinner.tsx` | Indicador de carregamento circular |
| Sonner | `sonner.tsx` | Sistema de toast/notificações |
| Switch | `switch.tsx` | Toggle on/off |
| Table | `table.tsx` | Tabela de dados |
| Tabs | `tabs.tsx` | Abas de conteúdo |
| Textarea | `textarea.tsx` | Campo de texto multilinha |
| Toggle | `toggle.tsx` | Botão com estado on/off |
| ToggleGroup | `toggle-group.tsx` | Grupo de toggles exclusivos |
| Tooltip | `tooltip.tsx` | Tooltip ao hover |

---

## Componentes de Layout (`src/components/layout/`)

### `header.tsx`
Server Component. Busca sessão e perfil do usuário no Supabase na renderização.

- Sticky, z-[1000], altura 64px
- Nav: "Encontrar profissional" e "Sou profissional"
- Se autenticado: `HeaderUserMenu` com nome do usuário e opções
- Se não autenticado: botões Login e Cadastrar
- Responsivo: nav escondida em mobile, menu hamburger

### `header-user-menu.tsx`
Client Component. Dropdown com opções de navegação e logout.

- Mostra avatar e nome do usuário
- Links para dashboard conforme role
- Botão de logout (chama `supabase.auth.signOut()`)

### `footer.tsx`
Server Component. Rodapé escuro (azul-noite).

- 4 colunas em desktop, 1 em mobile
- Seções: Para contratantes | Para profissionais | Empresa | Contato
- Ícones sociais: Instagram, LinkedIn, WhatsApp
- Copyright e links legais

### `logo.tsx`
Componente de logo da marca. Suporta variante clara (para fundo escuro) e escura.

---

## Componentes Customizados (`src/components/`)

### `city-input.tsx`
Autocomplete de cidades brasileiras via API do IBGE.

```tsx
<CityInput
  value={city}
  onChange={(city, state) => {/* ... */}}
  placeholder="Digite sua cidade"
/>
```

- Busca cidades ao digitar (mínimo 3 caracteres)
- Retorna nome da cidade e sigla do estado
- Debounce de 300ms na busca

### `FAQ.tsx`
Seção de perguntas frequentes usando o componente `Accordion`.

### `ResponsiveImage.tsx`
Wrapper de imagem com lazy loading e fallback.

- Usa `next-cloudinary` para imagens do Cloudinary
- Fallback visual quando imagem falha
- Otimização automática de formato (WebP/AVIF)

### `SocialProof.tsx`
Seção de depoimentos ou estatísticas na homepage.

---

## Providers (`src/components/providers/`)

### `posthog-provider.tsx`
Client Component. Inicializa o PostHog e envolve a aplicação para analytics.

- Identifica usuário autenticado automaticamente
- Rastreia page views via `PostHogPageView` dentro de Suspense
- Configurado em `src/app/layout.tsx` como wrapper global

---

## Componentes de Auth (`src/components/auth/`)

### `contractor-auth-modal.tsx`
Modal de autenticação rápida para contratantes. Aparece quando um visitante não autenticado tenta acessar canais de contato ou avaliações de um profissional.

- Formulário de login/cadastro inline
- Após autenticar, continua a ação que estava tentando fazer

---

## Hooks Customizados (`src/hooks/`)

### `use-mobile.ts`
Detecta se o viewport é mobile (< 768px).

```tsx
const isMobile = useMobile()
```

Usa `matchMedia` com listener de resize.
