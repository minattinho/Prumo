# Modelo de Negócio: Business Model Canvas

O modelo de negócios do **LeadMap** foi estruturado para garantir escalabilidade, recorrência de receita e um custo de aquisição de cliente (CAC) saudável, preenchendo a lacuna de mercado deixada pelas grandes ferramentas de Big Data B2B [1] [2].

---

## 📊 Matriz do Business Model Canvas

| Parcerias-Chave | Atividades-Chave | Propostas de Valor | Relacionamento | Segmentos de Clientes |
|:---|:---|:---|:---|:---|
| - **Google Cloud Platform** (API Places)<br>- **Gateways de Pagamento** (Asaas, Stripe)<br>- **CRMs de Vendas** (RD Station, Pipedrive)<br>- **Consultores B2B** e influenciadores de vendas | - **Desenvolvimento de Software** (UI/UX)<br>- **Otimização de Custos de API** (cache)<br>- **Marketing de Aquisição** (tráfego pago)<br>- **Enriquecimento e Higienização de Dados** | - **Leads frescos em tempo real** (não estáticos)<br>- **Mapeamento geográfico por raio** (KM)<br>- **Relação segmento-alvo automática**<br>- **Preço acessível para PMEs** (R$ 39,90 a R$ 224,90) | - **Plataforma Self-Service** (PLG)<br>- **Suporte ágil via WhatsApp**<br>- **Onboarding automatizado** (tutoriais curtos)<br>- **Newsletter de dicas de vendas** | - **Distribuidoras de Autopeças** e motopeças<br>- **Fornecedores de Alimentos** e bebidas<br>- **Distribuidoras de Limpeza** e descartáveis<br>- **Prestadores de Serviços B2B locais** |
| **Recursos-Chave** | | | **Canais** | |
| - **Infraestrutura Cloud** escalável<br>- **APIs de Dados** (Google + Receita Federal)<br>- **Algoritmo de correspondência** de segmentos<br>- **Equipe técnica** de dev e suporte | | | - **Tráfego Pago** (Google Ads, Meta Ads)<br>- **Inbound Marketing** e SEO<br>- **Prospecção Outbound própria**<br>- **Parcerias com associações** comerciais | |

---

## 1. Detalhamento dos 9 Blocos

### 1.1. Segmentos de Clientes
O foco são pequenas e médias empresas (PMEs) comerciais que vendem para outras empresas fisicamente localizadas. Elas operam regionalmente e dependem de logística eficiente de entrega ou visitas de representantes comerciais.

### 1.2. Proposta de Valor
Diferente das bases de dados estáticas de CNPJ, o LeadMap entrega dados em tempo real (empresas que estão abertas e operando hoje no Google Maps) com visualização geográfica por raio em KM, facilitando o planejamento logístico e de vendas externas [1] [2].

### 1.3. Canais
A aquisição de clientes será majoritariamente digital através de anúncios de alta intenção no Google (ex: "lista de oficinas mecânicas para prospecção") e anúncios de oportunidade no Meta Ads focados em donos de distribuidoras.

### 1.4. Relacionamento com Clientes
Adota-se a estratégia de **Product-Led Growth (PLG)**, onde o produto possui baixo atrito de entrada (cadastro gratuito com 10 leads de teste) e o próprio usuário realiza o upgrade de forma self-service na plataforma.

### 1.5. Fontes de Receita
Combinação de **recorrência mensal (MRR)** através de pacotes de assinatura com **receita transacional** através de venda de créditos avulsos que não expiram.

### 1.6. Recursos-Chave
Os ativos mais importantes são o cache inteligente no Redis (para economizar custos de API do Google), o banco de dados MongoDB (flexível para leads enriquecidos) e a marca focada em simplicidade e vendas locais [1].

### 1.7. Atividades-Chave
Manutenção e melhoria contínua da plataforma, desenvolvimento de novos enrichment workers (scripts de raspagem de dados) e otimização constante do consumo de APIs de terceiros.

### 1.8. Parcerias-Chave
Integrações nativas com CRMs nacionais (como RD Station CRM) para facilitar a exportação de leads, gateways de pagamento robustos para gerenciar assinaturas e parcerias com consultores de vendas B2B locais.

### 1.9. Estrutura de Custos
Os custos principais são o consumo da API do Google Places (variável conforme o uso), servidores em nuvem, orçamento de tráfego pago para aquisição e custos de desenvolvimento e suporte.

---

## Referências

[1]: https://www.apollo.io/tech-blog/building-apollos-data-machine-learning-platform "Building Apollo's Data & Machine Learning Platform"
[2]: https://leadjet.com.br/alternativa-econodata/ "Alternativa a Econodata: 5 Opções para B2B"
