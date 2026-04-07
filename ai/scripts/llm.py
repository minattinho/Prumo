"""
Wrapper para chamadas LLM (Groq grátis ou Ollama local).
"""
import os
import json
import urllib.request
import config


def chat(system_prompt, user_message, model=None):
    """
    Faz uma chamada chat completion via OpenRouter, Groq ou Ollama.
    Retorna o texto da resposta.
    """
    if config.LLM_PROVIDER == "openrouter":
        return _openrouter(system_prompt, user_message, model)
    elif config.LLM_PROVIDER == "groq":
        return _groq(system_prompt, user_message, model)
    else:
        return _ollama(system_prompt, user_message, model)


def _openrouter(system_prompt, user_message, model=None):
    """Chama OpenRouter API (suporte a qwen/qwen3.6-plus:free)."""
    model = model or config.LLM_MODEL
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.8,
        "max_tokens": 2000,
    }).encode()
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://prumo.com.br",
            "X-Title": "Prumo Instagram Agents",
        },
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        return data.get("choices", [{}])[0].get("message", {}).get("content", "")


def _groq(system_prompt, user_message, model=None):
    from groq import Groq
    client = Groq(api_key=config.GROQ_API_KEY)
    model = model or "llama-3.3-70b-versatile"
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        temperature=0.8,
        max_tokens=2000,
    )
    return resp.choices[0].message.content


def _ollama(system_prompt, user_message, model=None):
    import urllib.request
    model = model or "llama3"
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "stream": False,
    }).encode()
    req = urllib.request.Request(
        f"{config.OLLAMA_URL}/api/chat",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        return data.get("message", {}).get("content", "")


def notify_discord(message):
    """Envia notificação pro Discord webhook."""
    import urllib.error
    if not config.DISCORD_WEBHOOK:
        config.log("Discord webhook não configurado, pulando notificação.")
        return
    payload = json.dumps({"content": message}).encode()
    try:
        req = urllib.request.Request(
            config.DISCORD_WEBHOOK,
            data=payload,
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            config.log(f"Notificação Discord enviada (status {resp.status})")
    except urllib.error.HTTPError as e:
        if e.code == 403:
            config.log(f"Discord 403: webhook URL invalidado ou deletado. Verifique o secret DISCORD_WEBHOOK.", "ERROR")
        else:
            config.log(f"Discord HTTP Error {e.code}: {e.reason}", "ERROR")
    except Exception as e:
        config.log(f"Erro ao enviar notificação Discord: {e}", "ERROR")
