# AI — Squad de Agents do Prumo

Tudo que é inteligência artificial neste projeto vive aqui.
O projeto Prumo (`src/`, `supabase/`, `public/`) fica limpo — sem AI tools misturados.

## Estrutura

```
ai/
├── README.md              ← voce esta aqui
├── agents/                ← .claude/ configs (agents, skills)
├── claude/                ← .claude/ local settings
├── content/               ← conteudo gerado por AI
│   └── instagram/         ← posts, fila, publicados, analytics
├── scripts/               ← Python scripts dos agents
│   ├── config.py          ← paths, env, helpers
│   ├── llm.py             ← wrapper OpenRouter/Groq/Ollama
│   ├── agent_scheduler.py
│   ├── agent_writer.py
│   ├── agent_post.py
│   ├── agent_analytics.py
│   └── requirements.txt
└── workflows/             ← GitHub Actions (referencia)
```

## Agents

| Agent | Funcao | Frequencia |
|---|---|---|
| Scheduler | Garante fila com minimo 3 posts | Diario (5h BRT) |
| Content Writer | Gera posts novos via LLM | Segundas (6h BRT) |
| Instagram Poster | Publica proximo post da fila | 2x/dia (9h e 18h BRT) |
| Analytics | Relatorio semanal de conteudo | Domingos (12h BRT) |

## LLM Provider

- **Padrao:** OpenRouter com `qwen/qwen3.6-plus:free` (gratuito)
- **Fallbacks:** Groq (llama), Ollama (local)
- **Requer:** `OPENROUTER_API_KEY` no GitHub Secrets

## Configuracao

Secrets do GitHub (Settings → Secrets → Actions):
- `OPENROUTER_API_KEY` — chave da API
- `DISCORD_WEBHOOK` — URL do webhook do Discord

## Como rodar local

```bash
cd ai/scripts
pip install -r requirements.txt
export OPENROUTER_API_KEY="sua-chave"
python agent_writer.py      # gera post
python agent_post.py        # publica
python agent_analytics.py   # gera relatorio
python agent_scheduler.py   # checa fila
```
