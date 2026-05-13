# Prumo

**Marketplace SaaS brasileiro que conecta contratantes a profissionais verificados de construção, reforma e serviços especializados.**

---

## O que é o Prumo

O Prumo resolve um problema duplo no mercado brasileiro de serviços:

- **Contratante** — dificuldade de encontrar profissionais confiáveis e verificados na sua região
- **Profissional** — falta de vitrine digital acessível para divulgar trabalho, portfólio e receber clientes

A plataforma funciona com dois perfis de usuário:

| Perfil | Acesso | Custo |
|---|---|---|
| **Contratante** | Busca, contato e avaliação de profissionais | Gratuito |
| **Profissional** | Perfil ativo, portfólio, inbox de orçamentos | R$79/mês |

---

## Navegue pela documentação

<div class="grid cards" markdown>

- **[Produto](produto/visao-geral.md)** — Visão geral, como funciona e monetização
- **[Técnico](tecnico/arquitetura.md)** — Stack, arquitetura, rotas e regras de negócio
- **[Banco de Dados](banco-de-dados/schema.md)** — Schema completo, RLS e enums
- **[API](api/endpoints.md)** — Endpoints internos e APIs externas integradas
- **[Desenvolvimento](dev/setup.md)** — Configuração local e deploy

</div>

---

## Status do Produto

| Funcionalidade | Status |
|---|---|
| Auth (Supabase + Google OAuth) | ✅ Completo |
| Cadastro e onboarding de profissional | ✅ Completo |
| Perfil público + portfólio | ✅ Completo |
| Busca com filtros + mapa | ✅ Completo |
| Sistema de orçamentos e propostas | ✅ Completo |
| Avaliações e disputas | ✅ Completo |
| Validação de documentos (SERPRO) | ✅ Completo |
| Assinatura Mercado Pago (checkout) | ✅ Completo |
| Webhooks de pagamento | ⚠️ Pendente |
| Moderação de conteúdo (UI admin) | ⚠️ Pendente |
| Email transacional (todos os eventos) | ⚠️ Parcial |
| Analytics (PostHog) | ✅ Completo |
