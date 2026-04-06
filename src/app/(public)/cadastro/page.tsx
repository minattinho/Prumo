import { RegisterForm } from "./register-form";
import Link from "next/link";

export const metadata = {
  title: "Criar conta",
};

export default function CadastroPage() {
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
          <h1 className="text-xl font-semibold text-azul-noite mb-2">
            Criar conta
          </h1>
          <p className="text-sm text-cinza-texto mb-6">
            Para encontrar profissionais e pedir orçamentos.
          </p>
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-cinza-texto">
            Já tem conta?{" "}
            <Link
              href="/entrar"
              className="text-azul-principal font-medium hover:underline"
            >
              Entrar
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
