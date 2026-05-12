"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";

type RegisterFormProps = {
  defaultNext?: string;
  onSuccess?: () => void;
};

function getPasswordStrength(pwd: string): number {
  if (pwd.length === 0) return 0;
  if (pwd.length < 8) return 1;
  let score = 2;
  if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  return score;
}

const STRENGTH_CONFIG = [
  { label: "", color: "bg-gray-200" },
  { label: "Muito fraca", color: "bg-red-400" },
  { label: "Fraca", color: "bg-orange-400" },
  { label: "Boa", color: "bg-yellow-400" },
  { label: "Forte", color: "bg-green-500" },
];

function RegisterFormInner({ defaultNext = "/", onSuccess }: RegisterFormProps) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? defaultNext;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const strengthInfo = STRENGTH_CONFIG[passwordStrength];

  function getCallbackUrl() {
    const callbackParams = new URLSearchParams({
      next,
      auth: "contractor",
    });
    return `${window.location.origin}/auth/callback?${callbackParams.toString()}`;
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getCallbackUrl(),
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
        data: { full_name: name, phone: phone || null },
        emailRedirectTo: getCallbackUrl(),
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
    onSuccess?.();
  }

  if (success) {
    return (
      <div data-register-success="true" className="text-center py-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-azul-noite mb-2">
          Pronto! Confirma o e-mail
        </h2>
        <p className="text-sm text-cinza-texto leading-relaxed">
          Enviamos um link de confirmação para{" "}
          <strong className="text-azul-noite">{email}</strong>. Abre lá e clica
          no link para ativar sua conta.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all duration-200";

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleGoogleSignup}
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

      <form onSubmit={handleSubmit} className="space-y-3">
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
            className={inputClass}
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
            className={inputClass}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-azul-noite mb-1"
          >
            Telefone{" "}
            <span className="text-cinza-texto font-normal">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className={inputClass}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-azul-noite mb-1"
          >
            Senha
          </label>
          <PasswordInput
            id="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Mínimo 8 caracteres"
          />
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      passwordStrength >= i ? strengthInfo.color : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs mt-1 text-cinza-texto">
                {strengthInfo.label}
              </p>
            </div>
          )}
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
          {loading ? "Criando conta..." : "Criar conta grátis"}
        </button>

        <p className="text-xs text-cinza-texto text-center leading-relaxed">
          Ao criar sua conta, você concorda com nossos{" "}
          <a
            href="/termos"
            className="underline hover:text-azul-principal cursor-pointer"
          >
            Termos de Uso
          </a>{" "}
          e{" "}
          <a
            href="/privacidade"
            className="underline hover:text-azul-principal cursor-pointer"
          >
            Política de Privacidade
          </a>
          .
        </p>
      </form>
    </div>
  );
}

export function RegisterForm(props: RegisterFormProps) {
  return (
    <Suspense
      fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-xl" />}
    >
      <RegisterFormInner {...props} />
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
