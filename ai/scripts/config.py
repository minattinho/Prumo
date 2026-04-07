"""
Configuração base dos agents do Prumo.
Cada agent importa este arquivo para acessar variáveis de ambiente e paths.
"""
import os
import json
from pathlib import Path

# Paths
ROOT = Path(__file__).resolve().parent.parent
INSTAGRAM_DIR = ROOT / "ai" / "content" / "instagram"
POST_QUEUE = INSTAGRAM_DIR / "queue"
PUBLISHED_DIR = INSTAGRAM_DIR / "published"
ANALYTICS_DIR = INSTAGRAM_DIR / "analytics"

# LLM — usa OpenRouter (qwen/qwen3.6-plus:free) por padrão
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "openrouter")
OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
LLM_MODEL = os.environ.get("LLM_MODEL", "qwen/qwen3.6-plus:free")

# Discord webhook (notificações)
DISCORD_WEBHOOK = os.environ.get("DISCORD_WEBHOOK", "")

# Instagram API (se quiser publicar direto — precisa de Meta App aprovado)
INSTAGRAM_ACCESS_TOKEN = os.environ.get("INSTAGRAM_ACCESS_TOKEN", "")
INSTAGRAM_ACCOUNT_ID = os.environ.get("INSTAGRAM_ACCOUNT_ID", "")


def get_next_post():
    """Pega o próximo arquivo da fila (ordem alfabética)."""
    files = sorted(POST_QUEUE.glob("*.md"))
    if not files:
        return None
    return files[0]


def mark_as_published(filepath):
    """Move post da queue para published e retorna conteúdo."""
    import shutil
    content = filepath.read_text(encoding="utf-8")
    dest = PUBLISHED_DIR / filepath.name
    filepath.rename(dest)
    return content, dest


def save_analytics(data):
    """Salva dados de analytics no diretório correspondente."""
    from datetime import datetime
    ts = datetime.now().strftime("%Y-%m-%d_%H-%M")
    path = ANALYTICS_DIR / f"{ts}.json"
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def log(message, level="INFO"):
    """Log simples para console (GitHub Actions captura)."""
    print(f"[{level}] {message}")
