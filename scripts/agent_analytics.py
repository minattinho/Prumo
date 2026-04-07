"""
Agent: Analytics
Funcao: Analisa posts publicados e gera relatorio de desempenho.
Enquanto o Instagram API nao esta disponivel, gera relatorios da fila de conteúdo.
"""
import sys
sys.path.insert(0, "scripts")
import config
from scripts.llm import chat, notify_discord
from datetime import datetime
import json

config.log("=== AGENT: Analytics ===")

# Conta posts na fila e publicados
queue_count = len(list(config.POST_QUEUE.glob("*.md")))
published_count = len(list(config.PUBLISHED_DIR.glob("*.md")))
published_files = sorted(config.PUBLISHED_DIR.glob("*.md"))

# Le os ultimos 5 posts publicados para analise
recent_topics = []
for f in published_files[-5:]:
    content = f.read_text(encoding="utf-8")
    # Extrai a legenda
    if "## Legenda" in content:
        caption = content.split("## Legenda")[1].split("##")[0].strip()
        recent_topics.append({
            "file": f.name,
            "topic": content.split("\n")[0],
            "caption_preview": caption[:100],
        })

# Analise via LLM
analysis_prompt = f"""Voce e o analista de marketing do Prumo no Instagram.

DADOS ATUAIS:
- Posts na fila de publicacao: {queue_count}
- Posts publicados: {published_count}
- Ultimos posts: {json.dumps(recent_topics, indent=2, ensure_ascii=False)}

IDENTIDADE DA MARCA:
Prumo e um marketplace de prestadores de servicos locais.
"Encontre os melhores prestadores de servicos da sua regiao."

ANALISE:
1. Avalie a saude do calendario de conteudos
2. Sugira 3 melhorias na estrategia
3. Indique se a fila de conteudos esta suficiente
4. Recolha o tom das legendas e de notas sobre consistencia da marca

Output: faca uma analise concisa em portugues brasileiro.
"""

from scripts.llm import chat
analysis = chat(
    system_prompt="Voce e um especialista em estrategia de conteudo para Instagram de startups brasileiras.",
    user_message=analysis_prompt,
)

# Salva relatorio
report = {
    "timestamp": datetime.now().isoformat(),
    "queue_count": queue_count,
    "published_count": published_count,
    "recent_posts": recent_topics,
    "analysis": analysis,
}
report_path = config.save_analytics(report)

config.log(f"Analytics salvo em: {report_path.name}")

message = (
    f"\U0001f4ca **Relatorio de Analytics**\n"
    f"\U0001f4c5 `{datetime.now().strftime('%Y-%m-%d %H:%M')}`\n"
    f"\U0001f4d4 Posts na fila: {queue_count} | Publicados: {published_count}\n"
    f"\U0001f4dd Analise:\n```\n{analysis[:500]}...\n```\n"
    f"Gerado pelo Agent Analytics"
)
notify_discord(message)
