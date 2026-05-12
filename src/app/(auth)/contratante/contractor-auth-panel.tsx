"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "../login-form";
import { RegisterForm } from "../register-form";

type AuthMode = "login" | "cadastro";

function getMode(value: string | null): AuthMode {
  return value === "cadastro" ? "cadastro" : "login";
}

export function ContractorAuthPanel() {
  const searchParams = useSearchParams();
  const mode = getMode(searchParams.get("modo"));
  const next = searchParams.get("next");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const loginParams = new URLSearchParams();
  const registerParams = new URLSearchParams({ modo: "cadastro" });

  if (next) {
    loginParams.set("next", next);
    registerParams.set("next", next);
  }

  const loginHref = loginParams.size
    ? `/contratante?${loginParams.toString()}`
    : "/contratante";
  const registerHref = `/contratante?${registerParams.toString()}`;
  const showHeader = !(mode === "cadastro" && registerSuccess);

  return (
    <div className="w-full max-w-md">
      {showHeader && <div className="mb-6 text-center lg:text-left">
        <Link href="/" className="inline-flex lg:hidden">
          <span className="text-2xl font-bold tracking-tight text-azul-principal">
            Prumo
          </span>
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-laranja-obra lg:hidden">
          Para contratantes
        </p>
        <h1 className="mt-2 text-2xl font-bold text-azul-noite">
          {mode === "cadastro" ? "Crie sua conta grátis" : "Entre na sua conta"}
        </h1>
        <p className="mt-1 text-sm leading-relaxed text-cinza-texto">
          {mode === "cadastro"
            ? "Salve profissionais, solicite orçamentos e acompanhe seus contatos."
            : "Acesse sua conta para continuar sua busca por profissionais."}
        </p>
      </div>}

      {showHeader && <div className="mb-5 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
        <Link
          href={loginHref}
          onClick={() => setRegisterSuccess(false)}
          aria-current={mode === "login" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
            mode === "login"
              ? "bg-white text-azul-noite shadow-sm"
              : "text-cinza-texto hover:text-azul-noite"
          }`}
        >
          Entrar
        </Link>
        <Link
          href={registerHref}
          onClick={() => setRegisterSuccess(false)}
          aria-current={mode === "cadastro" ? "page" : undefined}
          className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
            mode === "cadastro"
              ? "bg-white text-azul-noite shadow-sm"
              : "text-cinza-texto hover:text-azul-noite"
          }`}
        >
          Criar conta
        </Link>
      </div>}

      {mode === "cadastro" ? (
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
