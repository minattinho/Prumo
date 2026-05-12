"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LockKeyhole, AlertCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { createClient } from "@/lib/supabase/client";

type FormStatus = "loading" | "ready" | "invalid" | "success";

function getDestinationForRole(role: string | null | undefined) {
  if (role === "admin") return "/admin";
  if (role === "professional") return "/painel";
  return "/minha-conta";
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState("/minha-conta");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setStatus("invalid");
        return;
      }

      setEmail(user.email ?? "");
      setStatus("ready");
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Não conseguimos redefinir a senha. Peça um novo link e tente novamente.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      setDestination(getDestinationForRole(profile?.role));
    }

    setStatus("success");
    setLoading(false);
    router.refresh();
  }

  if (status === "loading") {
    return (
      <div className="h-52 animate-pulse rounded-xl bg-gray-100" />
    );
  }

  if (status === "invalid") {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <h2 className="text-base font-bold text-azul-noite">
              Link inválido ou expirado
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-cinza-texto">
              Peça um novo link pela tela de login para redefinir sua senha.
            </p>
            <button
              type="button"
              onClick={() => router.push("/contratante")}
              className="mt-4 rounded-xl bg-azul-principal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azul-noite"
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-700" />
        </div>
        <h2 className="text-lg font-bold text-azul-noite">
          Senha redefinida
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cinza-texto">
          Sua nova senha já está ativa.
        </p>
        <button
          type="button"
          onClick={() => router.push(destination)}
          className="mt-5 w-full rounded-xl bg-azul-principal px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-azul-noite"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
        <div className="flex items-start gap-3">
          <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-azul-principal" />
          <div>
            <p className="text-sm font-semibold text-azul-noite">
              Redefinindo senha
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-cinza-texto">
              {email
                ? `Escolha uma nova senha para ${email}.`
                : "Escolha uma nova senha para sua conta."}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-azul-noite mb-1.5"
        >
          Nova senha
        </label>
        <PasswordInput
          id="new-password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all duration-200"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label
          htmlFor="new-password-confirmation"
          className="block text-sm font-medium text-azul-noite mb-1.5"
        >
          Confirmar nova senha
        </label>
        <PasswordInput
          id="new-password-confirmation"
          required
          minLength={8}
          autoComplete="new-password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all duration-200"
          placeholder="Repita a nova senha"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-azul-principal py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-azul-noite disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Redefinir senha"}
      </button>
    </form>
  );
}
