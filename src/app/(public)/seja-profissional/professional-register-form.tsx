"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function ProfessionalRegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/painel";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/painel&new_professional=true`,
        queryParams: { prompt: "select_account" },
      },
    });
  }

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
        data: { full_name: name, role: "professional" },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/painel`,
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
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-azul-noite mb-2">
          Pronto! Confirma o e-mail
        </h2>
        <p className="text-sm text-cinza-texto">
          Enviamos um link de confirmação para{" "}
          <strong className="text-azul-noite">{email}</strong>. Abre lá e clica
          no link para ativar sua conta.
        </p>
        <p className="mt-3 text-xs text-cinza-texto">
          Você será redirecionado ao seu painel após confirmar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 px-4 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        <GoogleIcon />
        {googleLoading ? "Redirecionando..." : "Cadastrar com Google"}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-cinza-texto">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Email + senha */}
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
          className="w-full bg-laranja-obra hover:opacity-90 text-white font-medium rounded-lg py-2.5 text-sm transition-opacity disabled:opacity-60"
        >
          {loading ? "Criando conta..." : "Criar conta grátis — 30 dias trial"}
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
    </div>
  );
}

export function ProfessionalRegisterForm() {
  return (
    <Suspense
      fallback={
        <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
      }
    >
      <ProfessionalRegisterFormInner />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
