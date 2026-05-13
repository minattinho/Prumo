# Como Funciona

## Fluxo do Contratante

```
Busca por serviço
      ↓
Filtra por cidade, categoria, nota, verificação
      ↓
Visualiza perfil + portfólio do profissional
      ↓
Revela canal de contato (gera contact_log)
      ↓
Solicita orçamento (formulário na plataforma)
         ou
Contata diretamente (WhatsApp / telefone / email)
      ↓
Após contratar, deixa avaliação verificada
```

### Pré-requisito para Avaliar

O contratante **só pode avaliar** um profissional se houver um `contact_log` registrado — ou seja, ele precisa ter efetivamente visualizado um canal de contato. Isso impede avaliações falsas.

---

## Fluxo do Profissional

### 1. Cadastro (3 etapas)

```
/seja-profissional
├── Etapa 1: Conta (email/senha ou Google)
├── Etapa 2: Perfil (especialidade, cidade, foto, bio)
└── Etapa 3: Documento (CPF ou CNPJ via SERPRO)
     ↓
     status = PENDING
     trial = 30 dias
```

### 2. Configuração do Perfil

Após o cadastro, o profissional acessa `/painel/perfil` para completar:

- Foto de perfil
- Bio detalhada
- Múltiplas especialidades
- Tags livres (affinities)
- Canais de contato (WhatsApp, telefone, email, site, Instagram, Facebook)
- Redes sociais
- Cidade e raio de atendimento em km

### 3. Portfólio

Em `/painel/portfolio`, o profissional:

- Cria projetos com título, categoria e cidade onde foi executado
- Sobe imagens e vídeos (via Cloudinary)
- Reordena imagens por drag-and-drop
- Marca até 3 projetos como destaque

Toda mídia enviada passa por **moderação** antes de aparecer publicamente.

### 4. Recebendo Orçamentos

Contratantes enviam solicitações pelo perfil público. O profissional responde em `/painel/solicitacoes/[id]/proposta` com:

- Valor total
- Prazo estimado
- Descrição da abordagem
- Até 3 etapas de pagamento (% + condição)

### 5. Assinatura

O trial de 30 dias permite usar a plataforma completa. Após o trial:

- Profissional acessa `/painel/assinatura` e clica em "Assinar"
- Redireciona para checkout do Mercado Pago (PreApproval)
- Ao confirmar: `subscription_status = ACTIVE`
- Perfil permanece visível enquanto assinatura estiver ativa

---

## Fluxo de Ativação do Profissional

```
Cadastro → PENDING (aguarda validação)
         → ACTIVE (habilitado manualmente pelo admin)
         → SUSPENDED (inadimplência ou infração)
         → BANNED (infração grave)
```

Somente profissionais com `status = ACTIVE` aparecem na busca e no mapa.

---

## Sistema de Avaliação

```
Contratante visualiza canal de contato
         ↓
contact_log registrado (tipo: WHATSAPP/PHONE/EMAIL)
         ↓
Contratante pode deixar avaliação (1–5 estrelas + comentário)
         ↓
Profissional pode responder publicamente
         ↓
Se discordar: abre disputa (com fotos de evidência)
         ↓
Admin resolve a disputa
```

Constraint UNIQUE garante **uma avaliação por par** contratante-profissional.
