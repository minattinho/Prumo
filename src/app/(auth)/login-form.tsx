"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { buildPasswordResetRedirectUrl } from "@/lib/auth/password-reset";
import { createClient } from "@/lib/supabase/client";

type AuthSource = "contractor" | "professional";

type LoginFormProps = {
  defaultNext?: string;
  authSource?: AuthSource;
};

function LoginFormInner({
  defaultNext = "/",
  authSource = "contractor",
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? defaultNext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha incorretos. Tenta de novo?");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).single()
      : { data: null };

    let destination: string;
    if (profile?.role === "admin") {
      destination = "/admin";
    } else if (profile?.role === "professional" && next === "/") {
      destination = "/painel";
    } else {
      destination = next;
    }

    router.push(destination);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    const callbackParams = new URLSearchParams({
      next,
      auth: authSource,
    });

    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?${callbackParams.toString()}`,
      },
    });
  }

  function openPasswordRecovery() {
    setRecoveryOpen(true);
    setRecoveryEmail(email);
    setRecoveryError(null);
    setRecoverySent(false);
  }

  async function handlePasswordRecovery(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = recoveryEmail.trim();

    if (!normalizedEmail) {
      setRecoveryError("Confirme o e-mail para receber o link.");
      return;
    }

    setRecoveryError(null);
    setRecoverySent(false);
    setRecoveryLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: buildPasswordResetRedirectUrl(window.location.origin),
      }
    );

    if (error) {
      setRecoveryError(
        "Não conseguimos enviar o link agora. Tente novamente em alguns minutos."
      );
      setRecoveryLoading(false);
      return;
    }

    setRecoverySent(true);
    setRecoveryLoading(false);
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 text-sm font-medium text-azul-noite bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-60 cursor-pointer"
      >
        <GoogleIcon />
        {googleLoading ? "Redirecionando..." : "Continuar com Google"}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-cinza-texto">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
          className="block text-sm font-medium text-azul-noite mb-1.5"
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
            className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all duration-200"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
          className="block text-sm font-medium text-azul-noite mb-1.5"
          >
            Senha
          </label>
          <PasswordInput
            id="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all duration-200"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-azul-principal hover:bg-azul-noite text-white font-semibold rounded-xl py-3 text-sm transition-colors duration-200 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          onClick={openPasswordRecovery}
          className="block w-full text-center text-xs font-medium text-azul-principal hover:underline cursor-pointer"
        >
          Esqueceu a senha?
        </button>
      </form>

      {recoveryOpen && (
        <form
          onSubmit={handlePasswordRecovery}
          className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3"
        >
          <div>
            <p className="text-sm font-semibold text-azul-noite">
              Confirme seu e-mail
            </p>
            <p className="mt-1 text-xs leading-relaxed text-cinza-texto">
              Enviaremos um link do Supabase para redefinir sua senha.
            </p>
          </div>

          <div>
            <label
              htmlFor="recovery-email"
              className="block text-sm font-medium text-azul-noite mb-1.5"
            >
              E-mail
            </label>
            <input
              id="recovery-email"
              type="email"
              required
              autoComplete="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent transition-all duration-200"
              placeholder="seu@email.com"
            />
          </div>

          {recoveryError && (
            <p className="text-sm text-red-600">{recoveryError}</p>
          )}

          {recoverySent && (
            <p className="text-sm leading-relaxed text-green-700">
              Se esse e-mail estiver cadastrado, o link de redefinição chegará
              em instantes.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={recoveryLoading}
              className="flex-1 rounded-xl bg-azul-principal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azul-noite disabled:opacity-60"
            >
              {recoveryLoading ? "Enviando..." : "Enviar link"}
            </button>
            <button
              type="button"
              onClick={() => setRecoveryOpen(false)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-azul-noite transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Suspense
      fallback={<div className="h-48 animate-pulse bg-gray-100 rounded-xl" />}
    >
      <LoginFormInner {...props} />
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
