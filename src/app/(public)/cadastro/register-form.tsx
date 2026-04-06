"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setError("Esse e-mail já está cadastrado. Tenta entrar.");
      } else {
        setError("Algo deu errado. Tenta de novo?");
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-azul-noite mb-2">
          Pronto! Confirma o e-mail
        </h2>
        <p className="text-sm text-cinza-texto">
          Enviamos um link de confirmação para{" "}
          <strong className="text-azul-noite">{email}</strong>. Abre lá e
          clica no link para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-azul-noite mb-1"
        >
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent"
          placeholder="João Silva"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-azul-noite mb-1"
        >
          E-mail
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-azul-noite mb-1"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-azul-principal hover:bg-azul-noite text-white font-medium rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-xs text-cinza-texto text-center">
        Ao criar sua conta, você concorda com nossos{" "}
        <a href="/termos" className="underline hover:text-azul-principal">
          Termos de Uso
        </a>{" "}
        e{" "}
        <a href="/privacidade" className="underline hover:text-azul-principal">
          Política de Privacidade
        </a>
        .
      </p>
    </form>
  );
}
