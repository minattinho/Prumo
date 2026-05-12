"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function CheckoutButton({ isLoggedIn, isProfessional }: { isLoggedIn: boolean; isProfessional: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!isLoggedIn) {
      router.push("/profissional?next=/planos");
      return;
    }
    if (!isProfessional) {
      router.push("/seja-profissional");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/mercadopago/checkout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Erro ao iniciar pagamento");

      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full bg-laranja-obra hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-sm transition-opacity"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Aguarde...
          </>
        ) : (
          <>
            Assinar agora — R$79/mês
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
