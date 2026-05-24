import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-8xl font-bold text-azul-principal/20 select-none">
            404
          </span>
        </div>
        <h1 className="text-2xl font-bold text-azul-noite mb-2">
          Página não encontrada
        </h1>
        <p className="text-cinza-texto mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-azul-principal px-6 py-3 text-sm font-semibold text-white hover:bg-azul-principal/90 transition-colors"
          >
            Ir para o início
          </Link>
          <Link
            href="/profissionais"
            className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-azul-noite hover:bg-slate-50 transition-colors"
          >
            Ver profissionais
          </Link>
        </div>
      </div>
    </div>
  );
}
