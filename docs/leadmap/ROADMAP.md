# Roadmap de Desenvolvimento: LeadMap

O planejamento de desenvolvimento do **LeadMap** foi estruturado em quatro fases principais, garantindo que o produto seja validado rapidamente no mercado brasileiro (através de um MVP focado) antes de escalar a infraestrutura técnica e de marketing [1] [2].

---

## 📅 Linha do Tempo e Marcos de Desenvolvimento

```
+-------------------------------------------------------------------------------+
| Q1 2026: Fase 1 (MVP)   | Q2 2026: Fase 2 (V1)    | Q3-Q4 2026: Fase 3-4      |
| Validação, busca básica | Recorrência, WhatsApp   | Extensão Chrome, IA,      |
| e 10-20 clientes teste  | verificado, automação   | integrações CRM e escala  |
+-------------------------------------------------------------------------------+
```

---

## 1. Detalhamento das Fases

### 1.1. Fase 1: MVP (Mínimo Produto Viável) — Foco em Validação
O objetivo desta fase é colocar a ferramenta no ar o mais rápido possível para validar se os donos de distribuidoras e representantes comerciais estão dispostos a pagar pelo lead gerado.

- **Funcionalidades Core:**
    - Cadastro e Login simples (OAuth Google).
    - Tela de busca básica: entrada de segmento, cidade e raio de busca (KM).
    - Tabela de resultados simples exibindo dados básicos do Google Maps (nome, segmento, nota).
    - Integração de pagamento via Pix (Asaas) para compra de créditos avulsos.
    - Botão "Desbloquear Lead" que consome créditos e revela telefone e endereço completo.
    - Exportação simples para planilha Excel.
- **Marcos de Sucesso:**
    - 10 a 20 clientes de teste reais utilizando a plataforma.
    - Primeiras vendas de créditos avulsos realizadas.

### 1.2. Fase 2: Versão 1.0 (Lançamento Oficial) — Foco em Recorrência
Após a validação da demanda, o foco passa a ser a construção de uma base de receita previsível (MRR) através de planos de assinatura recorrente e o enriquecimento de dados básico.

- **Funcionalidades Core:**
    - Lançamento dos planos de assinatura recorrente (Básico, Profissional, Empresarial) integrados ao cartão de crédito.
    - Módulo de **Enriquecimento Assíncrono:** Scraping de sites institucionais para buscar e-mails e redes sociais (Instagram).
    - **Validador de WhatsApp:** Script automático para testar se o telefone do lead possui WhatsApp ativo antes de exibi-lo na tela.
    - Mapa interativo (Google Maps) integrado à tela de busca.
- **Marcos de Sucesso:**
    - Atingir 50 assinantes pagantes (Break-even do projeto).
    - Redução de custos de API do Google através de cache Redis robusto.

### 1.3. Fase 3: Versão 2.0 (Engajamento e Expansão) — Foco em Retenção
Com a recorrência estabelecida, o produto expande suas funcionalidades para aumentar a retenção de clientes e o valor gerado por usuário.

- **Funcionalidades Core:**
    - **Extensão para Google Chrome:** Permite ao usuário capturar leads enquanto navega diretamente na interface padrão do Google Maps ou em sites institucionais (similar à extensão do Apollo.io) [1].
    - Módulo de CRM simplificado (Minhas Listas) com funil de status de abordagem e campo de notas.
    - Integrações nativas com CRMs nacionais (RD Station CRM, Pipedrive).
    - Alertas automáticos por e-mail ou WhatsApp sobre novas empresas que abriram na região do cliente.
- **Marcos de Sucesso:**
    - Atingir 300 assinantes pagantes.
    - Redução do Churn (cancelamento de assinaturas) para menos de 5% ao mês.

### 1.4. Fase 4: Escala e Inteligência Artificial (V3.0)
Fase focada em Big Data, inteligência de dados e expansão para novos segmentos de mercado.

- **Funcionalidades Core:**
    - **IA Lead Scoring:** Algoritmo que analisa o perfil dos clientes atuais do usuário e sugere automaticamente novos leads com maior probabilidade de conversão.
    - Enriquecimento avançado com dados de faturamento estimado, quantidade de funcionários e dados societários via API da Receita Federal.
    - Campanhas de e-mail e sequências de mensagens embutidas na plataforma (estilo Apollo.io Sequences) [1].
- **Marcos de Sucesso:**
    - Atingir 1.000+ assinantes pagantes.
    - Consolidação como a ferramenta líder de prospecção B2B local para PMEs no Brasil.

---

## Referências

[1]: https://www.apollo.io/product/chrome-extension "Apollo.io Chrome Extension"
[2]: https://speedio.com.br/blog/como-montar-um-processo-de-vendas-b2b/ "Speedio — Como montar um processo de vendas B2B"
