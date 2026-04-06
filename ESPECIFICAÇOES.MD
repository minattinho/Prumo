# App Web — Especificações MVP

> **Decisão:** Fase 1 é exclusivamente web desktop. Sem app mobile no MVP.
> 

> **Decisão de produto:** Existem **2 tipos de usuário** na plataforma: o **Contratante** e o **Contratado (Profissional)**. Ambos precisam de conta. O contratante precisa estar logado para acessar as informações de contato do profissional (WhatsApp/telefone) e para avaliar um serviço concluído — o que garante a integridade do sistema de avaliações.
> 

> **Decisão de monetização:** O Prumo é apenas o meio de contato. Sem escrow, sem contrato digital e sem intermediação de pagamento no MVP. O profissional paga R$ 79/mês para estar na plataforma.
> 

---

## 1. Princípios do Produto

- **Profissional no centro:** o perfil dele é o produto. Quanto mais rico, mais clientes ele atrai
- **Portfólio como vitrine:** fotos e vídeos reais de serviços anteriores são o principal argumento de venda
- **Contratante com conta leve:** cadastro rápido (nome, e-mail, telefone). Necessidade de login é justificada: acessa contato do profissional e avalia o serviço após a execução
- **Plataforma como meio, não como garantia:** contratante e profissional negociam diretamente. O Prumo não intermedia pagamentos nem contratos no MVP
- **Profissional enxerga valor:** ele registra os serviços realizados e vê métricas de quantos clientes vieram pela plataforma — isso justifica a assinatura mensalmente
- **Confiança visual:** fotos reais, avaliações visíveis, badges de verificação em destaque

---

## 2. Fluxo Central do MVP

### Lado do Contratante (com login)

```
Contratante acessa a plataforma
→ Busca por categoria e cidade (páginas públicas, sem login)
→ Vê lista de profissionais com foto, nota e mini-portfólio (público)
→ Entra no perfil completo e portfólio (público)
→ Tenta ver WhatsApp/telefone ou solicitar orçamento → sistema pede login
→ Cria conta ou faz login (rápido: nome + e-mail + telefone)
→ Acessa dados de contato do profissional
→ Negocia diretamente fora da plataforma (WhatsApp, ligação)
→ Executa o serviço
→ Recebe convite para avaliar o profissional (e-mail ou notificação)
→ Avalia (nota + comentário) — avaliação vinculada ao contato registrado
```

### Lado do Profissional (com login)

```
Profissional recebe contato do cliente
→ Fecha o serviço fora da plataforma (WhatsApp, ligação, presencial)
→ Acessa o painel e registra o serviço como "Realizado via Prumo"
→ Adiciona fotos do serviço concluído ao portfólio
→ Vê no dashboard: quantos contatos recebeu, quantos serviços fechou, receita estimada gerada
→ Isso comprova o ROI da assinatura de R$ 79/mês
```

---

## 3. Páginas Públicas (sem login)

### Home (`/`)

- Hero com tagline + CTA duplo: "Encontrar profissional" | "Sou profissional"
- Categorias em grid (alvenaria, elétrica, hidráulica, pintura, gesso...)
- Seção "Portfólios em destaque" — obras reais com foto antes/depois
- Como funciona (3 passos simples)
- Depoimentos de contratantes reais
- Banner de confiança: contratos, escrow, verificação

### Busca de Profissionais (`/profissionais`)

- Filtros: categoria, cidade/CEP, nota mínima, badge de verificação
- Cards com: foto de perfil, nome, especialidade, nota, cidade, **miniatura do portfólio (3 fotos)**
- Ordenação: mais bem avaliado, mais obras, mais recente

### Perfil do Profissional (`/profissionais/:slug`) ⭐ Página mais importante

**Identidade visual**

- Foto de perfil (obrigatória)
- Fotos do profissional em ação (opcional — ex: trabalhando, com ferramentas)
- Nome, cidade e região de atuação
- Descrição pessoal (quem é, como trabalha, diferenciais)

**Competências e Afinidades**

- Especialidades (múltipla escolha por categoria — ex: Elétrica, Hidráulica, Gesso, Pintura...)
- Afinidades livres (tags que o profissional define — ex: "atendo finais de semana", "pequenas reformas", "orçamento sem compromisso")

**📞 Contato Principal — destaque obrigatório**

- O profissional marca **um canal como contato principal** (WhatsApp, Telefone ou E-mail)
- Esse canal aparece em destaque no topo do perfil, com botão de ação direto
- É o que o contratante vê imediatamente ao fazer login
- Canais secundários ficam abaixo, visíveis mas sem destaque

**Canais de contato disponíveis**

- WhatsApp (com link direto `wa.me/`)
- Telefone (com link `tel:`)
- E-mail
- Instagram
- Facebook
- Site próprio
- Outros (campo livre)

**Redes Sociais**

- Instagram, Facebook, TikTok, LinkedIn, YouTube — o profissional adiciona os que quiser
- Exibidos como ícones clicáveis no perfil

**Portfólio**

- Galeria de fotos organizadas por projeto
- Vídeos por projeto (até 3 por projeto)
- Cada projeto tem: título, categoria, cidade e descrição

**Reputação**

- Badges de verificação (Verificado / Confiável / Certificado)
- Nota média + nº de avaliações
- Avaliações detalhadas de clientes anteriores (com resposta do profissional)

---

## 4. Portfólio do Profissional (feature central)

### O que o profissional pode postar

- **Fotos:** JPG/PNG, máx. 20MB por arquivo, até 50 fotos por projeto
- **Vídeos:** MP4, máx. 500MB por arquivo, até 3 vídeos por projeto
- **Projetos:** agrupamento de fotos/vídeos com título, descrição e categoria
- Máximo de projetos no portfólio: 20 (Gratuito) / ilimitado (Pro/Premium)

### Estrutura de um projeto no portfólio

- Título do projeto (ex: "Reforma completa de banheiro")
- Categoria do serviço
- Cidade onde foi executado
- Descrição livre (opcional)
- Fotos organizadas em galeria (antes/depois quando possível)
- Vídeo de apresentação (opcional)

### Regras de moderação do portfólio

- Fotos não podem conter: rostos de pessoas sem consentimento, conteúdo ofensivo, material publicitário externo
- Vídeos passam por revisão em até 24h antes de aparecerem publicamente
- Fotos aparecem imediatamente (com análise automática de conteúdo impróprio)
- 3 reprovações de conteúdo = revisão manual obrigatória de todo portfólio futuro
- Proibido usar fotos de obras de outros profissionais (plágio detectado por hash de imagem)

---

## 5. Área do Contratante

> ✅ **Decisão MVP:** O contratante **precisa ter conta**. Motivo principal: (1) dados de contato do profissional só ficam visíveis para usuários autenticados, evitando spam e garantindo rastreabilidade; (2) avaliações só podem ser feitas por quem tem conta e registrou um contato com o profissional, garantindo a credibilidade do sistema de reputação.
> 

### O que é público (sem login)

- Busca de profissionais por categoria e cidade
- Perfil completo do profissional (foto, especialidades, região, portfólio, avaliações)
- **Não visível sem login:** WhatsApp, telefone e e-mail do profissional

### Cadastro / Login (`/entrar`, `/cadastro`)

- Campos: nome, e-mail, telefone
- Login com e-mail + senha ou Google OAuth
- Cadastro leve — sem CPF obrigatório no MVP
- Verificação de e-mail obrigatória

### Dashboard do Contratante (`/minha-conta`) — MVP simplificado

- Profissionais contatados (histórico de acessos a dados de contato)
- Avaliações já feitas
- Pendentes de avaliação (profissionais contatados que ainda não foram avaliados)

### Sistema de Avaliação

- Contratante só pode avaliar um profissional após ter acessado os dados de contato dele
- Avaliação: nota de 1 a 5 + comentário livre
- Uma avaliação por contratante por profissional
- Avaliações são públicas e visíveis no perfil do profissional
- Profissional pode responder à avaliação

> 💡 **Futuro (Fase 2):** Acompanhamento de obra, histórico de contratos, favoritos, chat interno, avaliação mútua.
> 

---

## 6. Área do Profissional

### Cadastro (`/seja-profissional`)

Fluxo em etapas — não sobrecarregar o profissional de uma vez:

**Etapa 1 — Dados básicos**

- Nome completo + CPF/CNPJ
- E-mail + senha
- Telefone
- Cidade e região de atuação (raio em km)

> 🔐 **Validação de CPF — disparada SOMENTE após confirmação do primeiro pagamento (R$ 79/mês)**
> 

> O profissional se cadastra livremente, mas o perfil permanece invisível até o pagamento ser confirmado. Isso evita custo de validação com quem nunca converte.
> 

**Fluxo completo de ativação:**

```
1. Profissional preenche o cadastro (perfil criado, status: PENDENTE)
2. Direcionado para pagamento da mensalidade de R$ 79/mês
3. Pagamento confirmado → validação de CPF disparada automaticamente
4. Serpro: CPF ativo + nome confere com Receita Federal
5. Jusbrasil: processos criminais em aberto
6a. Aprovado → perfil ATIVADO e visível na plataforma
6b. Reprovado → pagamento estornado + conta bloqueada (mensagem genérica)
```

**APIs de validação:**

| Verificação | API | Custo estimado (Faixa 1 Serpro) |
| --- | --- | --- |
| CPF ativo e válido | Serpro — Consulta CPF | ~R$ 0,80–1,50/consulta |
| Processos criminais | Jusbrasil API | A confirmar |

> ⚠️ **Custo Serpro Faixa 1 a confirmar em:** [loja.serpro.gov.br/consultacpf](http://loja.serpro.gov.br/consultacpf) (requer e-CNPJ). Valores confirmados: Faixa 2 = R$0,5649 e Faixa 3 = R$0,3557 por consulta. MVP estará na Faixa 1 (menor volume).
> 

**Projeção de custo mensal de validação:**

| Pagantes novos/mês | Custo estimado Serpro |
| --- | --- |
| 50 | ~R$ 40–75 |
| 100 | ~R$ 80–150 |
| 200 | ~R$ 160–300 |

**Por que só após pagamento?** Evita gastar com quem cadastra mas não converte. Custo único por profissional, absorvido pela plataforma.

**Etapa 2 — Identidade visual**

- Foto de perfil (obrigatória)
- Fotos do profissional em ação (opcional)
- Descrição pessoal

**Etapa 3 — Competências**

- Especialidades (múltipla escolha por categoria)
- Afinidades livres (tags personalizadas)
- Informações de registro (CREA, CAU, CRM, etc. — opcional)

**Etapa 4 — Contato e Redes Sociais**

- Adicionar canais de contato (WhatsApp, telefone, e-mail, etc.)
- ★ **Marcar o contato principal** — obrigatório. É o canal que aparecerá em destaque no perfil público
- Redes sociais (Instagram, Facebook, TikTok, LinkedIn, YouTube — opcional)
- Site próprio (opcional)

**Etapa 5 — Portfólio inicial**

- Incentivar o upload de ao menos 1 projeto com fotos
- Pode pular e adicionar depois

### Dashboard (`/painel`)

- Solicitações de orçamento recebidas (inbox)
- Obras em andamento
- Receita do mês
- Visualizações do perfil (quantas pessoas viram hoje/semana)
- Alertas: nova solicitação, etapa pendente de aprovação

### Gerenciar Portfólio (`/painel/portfolio`) ⭐

- Lista de projetos postados
- Adicionar novo projeto (upload de fotos/vídeos + título + categoria)
- Reordenar projetos (drag and drop)
- Editar ou excluir projeto
- Ver quantas visualizações cada projeto teve
- Destaque: marcar até 3 projetos como "em destaque" (aparecem primeiro)

### Inbox de Solicitações (`/painel/solicitacoes`)

- Lista de pedidos de orçamento recebidos
- Filtros: novo, respondido, em negociação, recusado
- Visualizar mensagem completa do contratante
- Botão: "Enviar proposta" ou "Recusar"

### Enviar Proposta (`/painel/solicitacoes/:id/proposta`)

- Campo: valor total
- Campo: prazo em dias
- Campo: descrição da abordagem
- Definição das etapas de pagamento (1, 2 ou 3)

### ⭐ Registro de Serviços Realizados (`/painel/servicos`)

Funcionalidade central para o profissional **enxergar o valor da plataforma**. Ele registra manualmente os serviços que fechou a partir de contatos recebidos pelo Prumo.

**O profissional informa:**

- Nome do cliente (opcional)
- Tipo de serviço executado
- Valor cobrado (opcional)
- Data de execução
- Status: Em andamento / Concluído
- Fotos do serviço (opcional — vão direto para o portfólio)
- Origem: Veio pelo Prumo / Indicação / Outro

**O que o profissional vê no dashboard:**

- Total de contatos recebidos via plataforma no mês
- Total de serviços fechados via plataforma
- Taxa de conversão (contatos → serviços fechados)
- Receita estimada gerada pela plataforma no mês
- Comparativo: "Você gerou R$ X via Prumo esse mês. Sua assinatura custa R$ 79."

> 💡 **Por que isso é crítico:** Se o profissional não registrar o que fechou, ele não enxerga ROI e cancela a assinatura. Esse registro cria o laço entre o valor gerado e a mensalidade paga.
> 

### Meu Perfil (`/painel/perfil`)

- Editar foto de perfil e fotos em ação
- Editar descrição pessoal
- Editar especialidades e afinidades
- Gerenciar canais de contato
- ★ **Definir / alterar contato principal** — o canal destacado no perfil público
- Editar redes sociais e site
- Ver como o perfil aparece para os contratantes (pré-visualização pública)
- Assinatura ativa e data de renovação
- Métricas de desempenho do mês

---

## 7. Stack Tecnológico

| Camada | Tecnologia |
| --- | --- |
| Frontend + Backend | Next.js + Tailwind CSS |
| Banco de dados | PostgreSQL (via Supabase) |
| Autenticação | Supabase Auth (e-mail + Google) |
| Armazenamento de mídia | Cloudinary (fotos + vídeos com CDN) |
| Processamento de vídeo | Cloudinary Video API (transcodificação automática) |
| Pagamentos | Stripe ou PagSeguro |
| Contratos digitais | ClickSign API |
| E-mails transacionais | Resend |
| Hospedagem | Hostinger (frontend) + Railway (backend) |
| Analytics | Posthog |

---

## 8. MVP vs. Futuro

| Funcionalidade | MVP | Futuro |
| --- | --- | --- |
| Perfil do profissional | ✅ | - |
| Portfólio fotos | ✅ | - |
| Portfólio vídeos | ✅ | Vídeo ao vivo (stories) |
| Busca e filtros | ✅ | Busca por IA |
| Solicitar orçamento | ✅ | - |
| Chat interno | ✅ básico | Voz e vídeo |
| Contrato digital | ✅ | Personalizável |
| Escrow de pagamento | ✅ | Financiamento integrado |
| Avaliações | ✅ | Fotos na avaliação |
| Antes/Depois no portfólio | ❌ | ✅ V2 |
| App mobile | ❌ | ✅ V2 |
| Verificação CREA/CAU | ❌ | ✅ V2 |
| Reels de obra (vídeo curto) | ❌ | ✅ V2 |

---

## 9. Requisitos Não Funcionais

- Tempo de carregamento < 2s (LCP)
- Imagens com lazy loading e compressão automática
- Vídeos com player próprio (não depender de YouTube)
- Disponibilidade 99.5%
- HTTPS obrigatório em todas as rotas
- LGPD: consentimento de cookies, política de privacidade, exclusão de dados
- SEO: páginas indexadas por categoria e cidade (ex: `/pedreiros/cricuma`)
- Acessibilidade: contraste mínimo AA (WCAG 2.1)