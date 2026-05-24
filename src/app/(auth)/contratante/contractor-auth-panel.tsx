"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "../login-form";
import { RegisterForm } from "../register-form";

type AuthMode = "login" | "cadastro";

function getMode(value: string | null): AuthMode {
  return value === "cadastro" ? "cadastro" : "login";
}

export function ContractorAuthPanel() {
  const searchParams = useSearchParams();
  const initialMode = getMode(searchParams.get("modo"));
  const next = searchParams.get("next");
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Sincroniza o modo caso mude externamente (ex: abertura do modal em outro modo)
  useEffect(() => {
    const currentMode = getMode(searchParams.get("modo"));
    setMode(currentMode);
  }, [searchParams]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setRegisterSuccess(false);

    // Atualiza a URL de forma silenciosa no lado do cliente
    const url = new URL(window.location.href);
    url.searchParams.set("modo", newMode);
    url.searchParams.set("auth", newMode === "cadastro" ? "cadastro" : "login");
    window.history.pushState(null, "", url.pathname + url.search);
  };

  const showHeader = !(mode === "cadastro" && registerSuccess);
  const isRegister = mode === "cadastro";

  return (
    <div
      className={`w-full ${isRegister ? "max-w-[25rem] sm:max-w-md" : "max-w-md"}`}
    >
      {showHeader && (
        <div
          className={`${isRegister ? "mb-3 sm:mb-4" : "mb-6"} text-center lg:text-left`}
        >
          <Link
            href="/"
            className="inline-flex lg:hidden [@media(max-height:700px)]:hidden"
          >
            <span className="text-2xl font-bold tracking-tight text-azul-principal">
              Prumo
            </span>
          </Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-laranja-obra lg:hidden [@media(max-height:700px)]:hidden">
            Para contratantes
          </p>
          <h1
            className={`${isRegister ? "mt-1 text-xl sm:mt-2 sm:text-2xl" : "mt-2 text-2xl"} font-bold text-azul-noite`}
          >
            {mode === "cadastro"
              ? "Crie sua conta grátis"
              : "Entre na sua conta"}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-cinza-texto [@media(max-height:700px)]:hidden">
            {mode === "cadastro"
              ? "Salve profissionais, solicite orçamentos e acompanhe seus contatos."
              : "Acesse sua conta para continuar sua busca por profissionais."}
          </p>
        </div>
      )}

      {showHeader && (
        <div
          className={`${isRegister ? "mb-3 sm:mb-4" : "mb-5"} grid grid-cols-2 rounded-xl bg-gray-100 p-1`}
        >
          <button
            type="button"
            onClick={() => handleModeChange("login")}
            aria-current={mode === "login" ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors cursor-pointer ${
              mode === "login"
                ? "bg-white text-azul-noite shadow-sm"
                : "text-cinza-texto hover:text-azul-noite"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("cadastro")}
            aria-current={isRegister ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors cursor-pointer ${
              isRegister
                ? "bg-white text-azul-noite shadow-sm"
                : "text-cinza-texto hover:text-azul-noite"
            }`}
          >
            Criar conta
          </button>
        </div>
      )}

      {isRegister ? (
        <RegisterForm
          defaultNext={next ?? "/"}
          onSuccess={() => setRegisterSuccess(true)}
        />
      ) : (
        <LoginForm defaultNext={next ?? "/"} authSource="contractor" />
      )}
    </div>
  );
}
