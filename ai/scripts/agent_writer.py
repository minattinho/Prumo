"""
Agent: Content Writer
Funcao: Gera novos posts para o Instagram do Prumo via LLM (Groq gratis).
Salva direto na pasta instagram/queue/ para revisao e publicacao.
"""
import os, sys
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

import config
from llm import chat, notify_discord
from datetime import datetime

config.log("=== AGENT: Content Writer ===")

# Carrega identidade da marca
identity_path = config.ROOT / "IDENTITY.MD"
identity = identity_path.read_text(encoding="utf-8") if identity_path.exists() else ""

# Carrega posts ja publicados para nao repetir
published_posts = list(config.PUBLISHED_DIR.glob("*.md"))
existing_content = ""
for p in published_posts[-3:]:  # le os 3 ultimos pra contexto
    existing_content += f"\n\n--- POST ANTERIOR: {p.name} ---\n{p.read_text(encoding='utf-8')[:500]}"

# Le posts ja na fila
queue_files = list(config.POST_QUEUE.glob("*.md"))
next_num = len(queue_files) + len(published_posts) + 1

prompt = f"""Voce e o Content Writer do Instagram do Prumo.

PRUMO - Contexto da marca:
{identity}

REGRAS:
- Gerar UM post por vez
- Formatar exatamente como os outros posts (Direcao Visual, Legenda, Hashtags, Notas)
- Manter o tom de voz definido no IDENTITY.MD
- Usar a paleta de cores da marca
- Fonte: Inter
- O foco do Prumo e: "Encontre os melhores prestadores de servicos da sua regiao"
- Marketplace de profissionais de construcao e servicos residenciais
- NAO repetir temas de posts anteriores: {existing_content}
- O post deve ser em portugues brasileiro
- Incluir emojis moderadamente
- Hashtags devem ser relevantes e incluir #prumo

O output deve ser SO o conteudo do post em markdown, sem comentarios extras.
"""

config.log(f"Gerando post #{next_num} via {config.LLM_PROVIDER}...")

import time
import urllib.error
for attempt in range(3):
    try:
        post_content = chat(
            system_prompt="Voce e um social media manager especializado em criar conteúdo para Instagram de marcas brasileiras de tecnologia e servicos.",
            user_message=prompt,
        )
        break
    except urllib.error.HTTPError as e:
        if e.code == 429:
            wait = 5 * (attempt + 1)
            config.log(f"Rate limit (429). Esperando {wait}s antes de tentar novamente...", "WARN")
            time.sleep(wait)
        else:
            raise
else:
    config.log("Falha apos 3 tentativas devido a rate limit.", "ERROR")
    sys.exit(1)

# Salva na fila
filename = f"post-{next_num:02d}-generated.md"
filepath = config.POST_QUEUE / filename
filepath.write_text(post_content, encoding="utf-8")

config.log(f"Post gerado e salvo: {filename}")

message = (
    f"\u270d\ufe0f **Novo Conteudo Gerado: Post #{next_num}**\n"
    f"\U0001f4c5 `{datetime.now().strftime('%Y-%m-%d %H:%M')}`\n"
    f"\U0001f4d4 Arquivo: `{filename}`\n"
    f"Primeiras linhas:\n```\n{post_content[:200]}...\n```\n"
    f"Gerado pelo Agent Content Writer ({config.LLM_PROVIDER})"
)
notify_discord(message)
