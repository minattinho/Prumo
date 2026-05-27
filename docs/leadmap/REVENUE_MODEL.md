# Modelo de Receita e Precificação: LeadMap

O **LeadMap** adota um modelo híbrido de monetização focado em **pay-per-use** (pague pelo que usar) com incentivo à **recorrência mensal (SaaS)** [1]. Esse modelo reduz drasticamente a barreira de entrada para novos usuários, permitindo que eles testem o valor da ferramenta antes de realizar investimentos significativos.

---

## 1. O Conceito de Crédito

A moeda interna do sistema é o **Crédito**. 
- **1 Crédito = 1 Lead Desbloqueado.**
- A busca inicial e a visualização básica dos leads na tabela e no mapa são **gratuitas** e ilimitadas.
- O crédito só é consumido quando o usuário clica no botão **"Desbloquear Lead"**, revelando os dados de contato completos (Telefone, WhatsApp verificado, e-mail e redes sociais) e permitindo a exportação do lead para planilhas ou CRM.
- **Os créditos adquiridos nunca expiram**, garantindo que o usuário sinta que seu dinheiro está seguro e acumulado para quando ele de fato precisar prospectar.

---

## 2. Estrutura de Planos e Precificação

A precificação é dividida entre planos de assinatura recorrente (com desconto por lead) e compra de créditos avulsos (para uso esporádico).

### 2.1. Plano Freemium (Contas Novas)
Ao criar uma conta, o usuário recebe automaticamente **10 créditos gratuitos** para testar a ferramenta. Esses créditos não expiram e servem para o usuário validar a qualidade dos dados na sua própria região de atuação.

### 2.2. Planos de Assinatura Recorrente (Mensal)
Os planos mensais oferecem a melhor relação custo-benefício por lead e geram receita recorrente previsível (MRR) para o SaaS. Os créditos não utilizados no mês acumulam para o mês seguinte, desde que a assinatura continue ativa.

| Plano | Preço Mensal | Créditos Inclusos | Custo Efetivo por Lead | Funcionalidades Adicionais |
|:---|:---|:---|:---|:---|
| **Básico** | R$ 39,90 | 50 créditos | R$ 0,80 | Filtros básicos, busca por raio (KM), suporte via e-mail. |
| **Profissional** | R$ 119,90 | 200 créditos | R$ 0,60 | Filtro por raio, detecção de WhatsApp ativo, suporte via WhatsApp. |
| **Empresarial** | R$ 224,90 | 500 créditos | R$ 0,45 | Alertas de novas empresas na região, integração com CRM, múltiplos usuários. |

### 2.3. Créditos Avulsos (Sem Assinatura)
Para usuários que não desejam se comprometer com uma mensalidade, é possível comprar pacotes de créditos avulsos através de Pix ou Cartão de Crédito.

- **Pacote 50 Leads:** R$ 49,90 (R$ 1,00 por lead)
- **Pacote 100 Leads:** R$ 89,90 (R$ 0,90 por lead)
- **Pacote 300 Leads:** R$ 239,90 (R$ 0,80 por lead)

---

## 3. Economia Unitária (Unit Economics) e Viabilidade

O custo de processamento de um lead no LeadMap é extremamente baixo, garantindo altas margens de lucro bruto.

### Custo da API do Google Places (Maps Platform)
A API do Google Places cobra por requisição [2]. O LeadMap utiliza uma estratégia de busca em dois níveis para otimizar custos:
- **Busca Inicial (SKU: Text Search / Nearby Search):** Custa aproximadamente US$ 0,032 por chamada (retorna uma lista de até 20 estabelecimentos com dados básicos como nome, ID e localização) [2].
- **Desbloqueio de Detalhes (SKU: Place Details):** Custa aproximadamente US$ 0,017 por chamada (retorna telefone, site, horário de funcionamento) [2].

Considerando o crédito mensal gratuito de **US$ 200,00** que o Google oferece para todas as contas do Maps Platform [2], o custo de API para os primeiros milhares de leads gerados no SaaS é **zero**.

### Margem de Lucro Bruto Estimada (Após estourar o limite gratuito do Google)
- Preço médio de venda de 1 lead: **R$ 0,60**
- Custo médio de API do Google para buscar e detalhar 1 lead: ~US$ 0,02 (**R$ 0,10**)
- Margem de Contribuição por Lead Desbloqueado: **~83%**

Essa margem extremamente saudável permite cobrir com folga os custos fixos de servidores, marketing de aquisição (tráfego pago) e suporte ao cliente.

---

## Referências

[1]: https://baita.ac/insights/saas-b2b-para-pmes-modelo-go-to-market-mm3v4ou0 "SaaS B2B para PMEs: Modelo e Go-to-Market"
[2]: https://mapsplatform.google.com/pricing/ "Google Maps Platform Pricing"
