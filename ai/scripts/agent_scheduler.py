"""
Agent: Scheduler
Funcao: Verifica a fila de posts e gera conteudo extra se estiver vazia.
Garante que sempre haja conteudo pronto para publicacao automatica.
"""
import os, sys
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

import config
from llm import notify_discord
from datetime import datetime
import subprocess

config.log("=== AGENT: Scheduler ===")

queue_count = len(list(config.POST_QUEUE.glob("*.md")))
published_count = len(list(config.PUBLISHED_DIR.glob("*.md")))

config.log(f"Fila atual: {queue_count} na fila, {published_count} publicados")

MIN_QUEUE = 3  # minimo de posts na fila

if queue_count < MIN_QUEUE:
    needed = MIN_QUEUE - queue_count
    config.log(f"Fila baixa ({queue_count} < {MIN_QUEUE}). Solicitando {needed} posts extras...", "WARN")

    message = (
        f"\u26a0\ufe0f **Fila de Conteudo Baixa**\n"
        f"\U0001f4c5 `{datetime.now().strftime('%Y-%m-%d %H:%M')}`\n"
        f"\U0001f4d4 Posts na fila: {queue_count} (minimo: {MIN_QUEUE})\n"
        f"Agent Scheduler disparando geracao de {needed} post(s) extra..."
    )
    notify_discord(message)

    for i in range(needed):
        config.log(f"Gerando post extra #{i+1} de {needed}...")
        result = subprocess.run(
            [sys.executable, f"{SCRIPT_DIR}/agent_writer.py"],
            capture_output=True, text=True, encoding="utf-8",
        )
        if result.returncode == 0:
            config.log(f"Post extra gerado com sucesso #{i+1}")
        else:
            config.log(f"Erro ao gerar post extra #{i+1}: {result.stderr}", "ERROR")
else:
    config.log(f"Fila saudavel ({queue_count} >= {MIN_QUEUE}). Nenhuma acao necessaria.")
    message = (
        f"\u2705 **Scheduler OK**\n"
        f"\U0001f4c5 `{datetime.now().strftime('%Y-%m-%d %H:%M')}`\n"
        f"\U0001f4d4 {queue_count} posts na fila — tudo em ordem."
    )
    notify_discord(message)
