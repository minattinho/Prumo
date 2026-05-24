"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#f5f8fc] flex items-center justify-center px-4 font-sans antialiased">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <span className="text-6xl font-bold" style={{ color: "#1A5DB8", opacity: 0.3 }}>
              500
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#1A2B4A" }}>
            Algo deu errado
          </h1>
          <p className="mb-8" style={{ color: "#555555" }}>
            Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              style={{ backgroundColor: "#1A5DB8" }}
              className="rounded-lg px-6 py-3 text-sm font-semibold text-white"
            >
              Tentar novamente
            </button>
            <a
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold"
              style={{ color: "#1A2B4A" }}
            >
              Ir para o início
            </a>
          </div>
          {error.digest && (
            <p className="mt-6 text-xs text-slate-400">Código: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
