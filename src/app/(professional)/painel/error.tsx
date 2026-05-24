"use client";

import { useEffect } from "react";

export default function PainelError({
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
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="text-center max-w-sm">
        <h2 className="text-xl font-bold text-azul-noite mb-2">
          Erro ao carregar
        </h2>
        <p className="text-cinza-texto text-sm mb-6">
          Não foi possível carregar esta seção. Tente novamente.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-azul-principal px-5 py-2.5 text-sm font-semibold text-white hover:bg-azul-principal/90 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
