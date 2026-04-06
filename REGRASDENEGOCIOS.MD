## 1. Cadastro e Perfis

### Contratante

- Cadastro com nome, e-mail, telefone e CPF
- Gratuito para criar conta e solicitar orçamentos
- Verificação de e-mail obrigatória antes de qualquer ação
- Um contratante pode ter múltiplas obras em andamento simultaneamente

### Profissional

- Cadastro gratuito com nome, CPF, foto, especialidades e contato principal
- Perfil criado com status **PENDENTE** (invisível na plataforma)
- Perfil só é ativado após confirmação do pagamento da assinatura (R$ 79/mês)
- Validação de CPF via Serpro + Jusbrasil é disparada automaticamente após o pagamento
- Foto de perfil obrigatória
- Mínimo 1 especialidade selecionada
- Contato principal marcado obrigatoriamente (WhatsApp, telefone ou e-mail)
- Portfólio inicial recomendado mas não obrigatório para ativação

---

## 2. Fluxo Central do MVP

> ⚠️ **Decisão MVP:** O Prumo é o meio de contato. Não há escrow, contrato digital nem intermediação de pagamento entre contratante e contratado. A negociação ocorre diretamente entre as partes.
> 

### Fluxo do Contratante

```
1. Busca profissional por categoria e cidade (público, sem login)
2. Visualiza perfil completo e portfólio (público, sem login)
3. Tenta acessar contato do profissional → sistema solicita login
4. Cria conta ou faz login (nome + e-mail + telefone)
5. Acessa o contato principal do profissional (WhatsApp, telefone ou e-mail)
6. Negocia e contrata diretamente fora da plataforma
7. Após o serviço, recebe convite para avaliar o profissional
8. Avaliação fica vinculada ao contato registrado (garantia de autenticidade)
```

### Fluxo do Profissional

```
1. Cadastra perfil completo na plataforma
2. Paga assinatura de R$ 79/mês → CPF validado automaticamente
3. Perfil ativado e visível na busca
4. Recebe contatos de clientes via canal principal
5. Negocia e executa o serviço diretamente
6. Registra o serviço no painel (origem: Prumo / Indicação / Outro)
7. Visualiza métricas: contatos recebidos, serviços fechados, receita estimada gerada
```

> 💡 **Futuro (Fase 2):** Escrow de pagamento, contrato digital, acompanhamento de etapas.
> 

---

## 3. Regras do Portfólio do Profissional

O portfólio é a vitrine do profissional — a principal ferramenta de venda dentro do Prumo.

### Estrutura

- Portfólio organizado em **projetos** (agrupamento de fotos/vídeos de uma mesma obra)
- Cada projeto contém: título, categoria, cidade onde foi executado, descrição (opcional) e mídias

### Mídias permitidas

- **Fotos:** JPG ou PNG, máx. 20MB por arquivo, até 50 fotos por projeto
- **Vídeos:** MP4, máx. 500MB por arquivo, até 3 vídeos por projeto
- Formatos de vídeo aceitos: MP4, MOV, AVI (convertidos automaticamente para MP4)

### Limites por plano

| Plano | Projetos no portfólio | Fotos totais | Vídeos totais |
| --- | --- | --- | --- |
| Gratuito | 20 projetos | 200 fotos | 30 vídeos |
| Pro | Ilimitado | Ilimitado | Ilimitado |
| Premium | Ilimitado | Ilimitado | Ilimitado |

### Moderação de conteúdo

- Fotos: análise automática (IA) — aparecem imediatamente se aprovadas
- Vídeos: revisão manual em até **24h** antes de publicar
- **Proibido:**
    - Rostos de pessoas sem consentimento expresso
    - Fotos de obras de outros profissionais (plágio detectado por hash de imagem)
    - Material publicitário de marcas ou concorrentes
    - Conteúdo de adulto, violento ou ofensivo
    - Imagens geradas por IA apresentadas como obras reais
- 3 reprovações de conteúdo = revisão manual obrigatória de todo portfólio futuro
- Profissional pode marcar até **3 projetos como destaque** — aparecem primeiro no perfil

---

## 4. Regras de Contato

- Contratante acessa o canal de contato principal do profissional após fazer login
- O contato (WhatsApp, telefone ou e-mail) é exibido diretamente na página do profissional
- O sistema registra que o contratante acessou os dados do profissional (necessário para liberar avaliação posterior)
- Um contratante pode contatar quantos profissionais quiser
- A negociação, o preço e a forma de pagamento são definidos diretamente entre as partes

---

## 5. Regras da Assinatura do Profissional

- Valor: **R$ 79/mês** — único plano disponível no MVP
- Perfil só é ativado e visível após confirmação do primeiro pagamento
- Cobrança recorrente mensal via cartão de crédito ou boleto
- Assinatura cancelada = perfil desativado imediatamente (não aparece mais nas buscas)
- Sem período de carencia ou acesso parcial após cancelamento
- Período gratuito de teste: 30 dias antes do primeiro pagamento (perfil visível durante o trial)

---

## 6. Sistema de Escrow — PÓS-MVP

> ⚠️ **Esta funcionalidade NÃO faz parte do MVP.** O Prumo não intermedia pagamentos entre contratante e contratado na Fase 1. Escrow, etapas de pagamento e mediação de disputas financeiras serão avaliados na Fase 2, após validação do modelo de assinatura.
> 

**Previsto para Fase 2:**

- Pagamento retido em escrow até aprovação do contratante
- Liberação por etapas
- Mediação de disputas pelo Prumo

---

## 7. Sistema de Reputação

### Avaliação do Profissional

- Avaliação liberada somente após ambos confirmarem conclusão
- Nota de 1 a 5 estrelas
- Critérios: qualidade do trabalho, prazo, comunicação, limpeza do local
- Comentário opcional (máx. 500 caracteres)
- Contratante pode anexar fotos do resultado na avaliação

### Regras de Reputação

- Nota mínima para permanecer ativo: **4.0**
- Abaixo de 3.5 por 3 meses consecutivos = **suspensão automática**
- Profissional pode contestar avaliação injusta em até **48h**
- 3 reclamações comprovadas = **banimento permanente**

### Métricas exibidas no perfil

- Nota média geral
- Taxa de resposta a solicitações
- Taxa de conclusão de obras
- Pontualidade (% de obras no prazo)
- Total de obras realizadas pelo Prumo

---

## 8. Regras de Segurança e Moderação

- O contato direto entre contratante e profissional é **o modelo da plataforma** — não é proibido
- Conteúdo ofensivo, discriminatório ou fraudulento no perfil ou portfólio = ban imediato
- Tentativa de fraude em avaliação = ban permanente
- Perfis com CPF não validado ou reprovado na verificação não são ativados
- Avaliações só podem ser feitas por contratantes que acessaram o contato do profissional (previne avaliações falsas)

---

## 9. Gestão de Conflitos

- Contratante pode abrir disputa em até **7 dias** após conclusão
- Disputa requer evidências (fotos, mensagens)
- Time de mediação decide em até 5 dias úteis
- Reembolso parcial possível se etapa não cumpriu o acordado
- Decisão do Prumo é final e definitiva

---

## 10. Categorias de Serviço

| Categoria | Exemplos |
| --- | --- |
| Alvenaria | Construção, demolição, reboco, assentamento |
| Elétrica | Instalação, manutenção, quadro elétrico |
| Hidráulica | Encanamento, box, aquecedor |
| Pintura | Interna, externa, textura |
| Gesso | Forro, sancas, molduras |
| Pisos e revestimentos | Porcelanato, madeira, vinílico |
| Marcenaria | Móveis planejados, portas, janelas |
| Arquitetura | Projeto residencial, comercial, reforma |
| Engenharia | Projeto estrutural, laudo, vistoria |
| Limpeza pós-obra | Limpeza final de construção |

---

## 11. Política de Cancelamento da Assinatura

| Situação | Consequência |
| --- | --- |
| Cancelamento durante o período de trial (30 dias) | Sem cobrança |
| Cancelamento após primeiro pagamento | Perfil desativado imediatamente, sem reembolso proporcional |
| Inadimplência (pagamento não processado) | Perfil suspenso automaticamente, 5 dias para regularizar |
| Reativação após cancelamento | Novo pagamento exigido, CPF não é revalidado (já foi validado) |

> 💡 **Política de conflitos entre contratante e profissional:** Como o Prumo é apenas o meio de contato no MVP, disputas sobre a qualidade ou execução do serviço devem ser resolvidas diretamente entre as partes. O Prumo não media conflitos financeiros no MVP.
>