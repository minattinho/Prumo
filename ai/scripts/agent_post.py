"""
Agent: Instagram Poster
Funcao: Pega o proximo post da fila e marca como publicado.
Quando Instagram API estiver disponivel, faz o posting automatico.
"""
import sys
sys.path.insert(0, "scripts")
import config
from datetime import datetime

config.log("=== AGENT: Instagram Poster ===")

post_file = config.get_next_post()

if post_file is None:
    config.log("Nenhum post na fila para publicar.", "INFO")
    sys.exit(0)

content, published_path = config.mark_as_published(post_file)

# Extrai dados do post para log
lines = content.strip().split("\n")
title = lines[0] if lines else "Post desconhecido"

message = (
    f"\U0001f4f7 **Post Publicado: {title}**\n"
    f"\U0001f4c5 `{datetime.now().strftime('%Y-%m-%d %H:%M')}`\n"
    f"\U0001f4d4 Arquivo: `{published_path.name}`\n"
    f"Publicado pelo Agent Instagram Poster"
)

from llm import notify_discord
notify_discord(message)

config.log(f"Post publicado: {published_path.name}")
print(f"::set-output name=published_file::{published_path.name}")
