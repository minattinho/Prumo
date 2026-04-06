import { LoginForm } from "./login-form";
import Link from "next/link";

export const metadata = {
  title: "Entrar",
};

export default function EntrarPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-azul-claro px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-azul-principal tracking-tight">
              Prumo
            </span>
          </Link>
          <p className="mt-2 text-cinza-texto text-sm">Sua obra no prumo.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-card shadow-card p-8">
          <h1 className="text-xl font-semibold text-azul-noite mb-6">
            Entrar na conta
          </h1>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-cinza-texto">
            Não tem conta?{" "}
            <Link
              href="/cadastro"
              className="text-azul-principal font-medium hover:underline"
            >
              Criar conta grátis
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-cinza-texto">
            É profissional?{" "}
            <Link
              href="/seja-profissional"
              className="text-azul-principal font-medium hover:underline"
            >
              Cadastre seu perfil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
