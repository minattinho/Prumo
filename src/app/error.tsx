"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-azul-noite mb-2">
          Algo deu errado
        </h1>
        <p className="text-cinza-texto mb-8">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página
          inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-azul-principal px-6 py-3 text-sm font-semibold text-white hover:bg-azul-principal/90 transition-colors"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-azul-noite hover:bg-slate-50 transition-colors"
          >
            Ir para o início
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-slate-400">Código: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
