import { ProfessionalRegisterForm } from "./professional-register-form";
import Link from "next/link";

export const metadata = {
  title: "Anunciar no Prumo",
};

export default function SejaProfissionalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-azul-claro px-4 py-12">
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
          <h1 className="text-xl font-semibold text-azul-noite mb-1">
            Anunciar serviços no Prumo
          </h1>
          <p className="text-sm text-cinza-texto mb-5">
            Crie seu perfil, mostre seu portfólio e receba clientes.
          </p>

          {/* Benefícios */}
          <ul className="space-y-2 mb-6">
            {[
              "30 dias grátis, sem precisar de cartão",
              "Portfólio ilimitado com fotos e vídeos",
              "Sem comissão — você cobra direto do cliente",
            ].map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm text-azul-noite">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
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
                {benefit}
              </li>
            ))}
          </ul>

          <ProfessionalRegisterForm />

          <p className="mt-6 text-center text-sm text-cinza-texto">
            Já tem conta?{" "}
            <Link
              href="/entrar"
              className="text-azul-principal font-medium hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
