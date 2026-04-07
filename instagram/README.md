# Prumo Instagram — AI Squad

## Squad de Agents

| Agent | Funcao | Frequencia | Workflow |
|---|---|---|---|
| **Scheduler** | Garante fila com minimo 3 posts | Diario (5h BRT) | `agent-scheduler.yml` |
| **Content Writer** | Gera posts novos via Groq/LLM | Segundas (6h BRT) | `agent-writer.yml` |
| **Instagram Poster** | Publica proximo post da fila | 2x/dia (9h e 18h BRT) | `agent-post.yml` |
| **Analytics** | Relatorio semanal de conteudo | Domingos (12h BRT) | `agent-analytics.yml` |

## Diretorio

```
instagram/
├── README.md              ← voce esta aqui
├── post-01-debut.md       ← posts manuais (feitos por voce)
├── post-02-*.md
├── post-03-*.md
├── post-04-*.md
├── queue/                 ← fila de posts prontos (agents leem daqui)
├── published/             ← posts ja publicados (arquivo)
└── analytics/             ← relatorios semanais JSON
```

## Configuracao (secrets do GitHub)

Vai em **Settings → Secrets and variables → Actions** e adiciona:

| Secret | Onde pegar |
|---|---|
| `GROQ_API_KEY` | https://console.groq.com/keys (gratis) |
| `DISCORD_WEBHOOK` | Discord server → channel settings → Integrations → Webhooks |
| `INSTAGRAM_ACCESS_TOKEN` | (Opcional) Meta Developer Portal |
| `INSTAGRAM_ACCOUNT_ID` | (Opcional) Meta Developer Portal |

## Como funciona

1. **Content Writer** gera um post por semana e salva em `queue/`
2. **Scheduler** checa se a fila ta com pelo menos 3 posts — se nao, dispara o Writer extra
3. **Instagram Poster** pega o primeiro arquivo de `queue/`, move para `published/`
4. **Analytics** analisa conteudo publicado e da sugestoes de melhoria

### Publicar manualmente

Mova um arquivo de `instagram/post-*.md` para `instagram/queue/`:
```bash
mv instagram/post-02-cadastro-profissional.md instagram/queue/
```

### Rodar um agent localmente

```bash
cd prumo
pip install -r scripts/requirements.txt
export GROQ_API_KEY="sua-key"
python scripts/agent_writer.py     # gera post
python scripts/agent_post.py       # publica
python scripts/agent_analytics.py  # gera relatorio
python scripts/agent_scheduler.py  # checa fila
```
