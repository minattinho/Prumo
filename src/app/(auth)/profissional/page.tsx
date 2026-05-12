import Link from "next/link";
import { LoginForm } from "../login-form";

export const metadata = {
  title: "Profissional",
};

export default function ProfissionalPage() {
  return (
    <div className="h-full flex">
      <div className="flex-1 flex items-center justify-center px-6 py-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-5">
            <Link
              href="/painel"
              className="inline-flex items-center gap-2 justify-center"
            >
              <div className="w-8 h-8 bg-laranja-obra rounded-xl flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4 text-white"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-azul-principal tracking-tight">
                Prumo
              </span>
            </Link>
            <p className="mt-1.5 text-cinza-texto text-sm">
              Painel do profissional
            </p>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-azul-noite">
              Acesse o painel
            </h1>
            <p className="text-cinza-texto text-sm mt-1">
              Entre com sua conta de profissional.
            </p>
          </div>

          <LoginForm authSource="professional" defaultNext="/painel" />

          <p className="text-center text-sm text-cinza-texto mt-5">
            Ainda não tem perfil?{" "}
            <Link
              href={`${
                process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br"
              }/seja-profissional`}
              className="text-azul-principal font-semibold hover:underline cursor-pointer"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
