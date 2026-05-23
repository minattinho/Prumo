"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { CityInput } from "@/components/city-input";

interface SearchBarProps {
  q?: string;
  cidade?: string;
}

export function SearchBar({ q, cidade }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localQ, setLocalQ] = useState(q ?? "");
  const [localCidade, setLocalCidade] = useState(cidade ?? "");

  const handleBuscar = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (localQ.trim()) {
      params.set("q", localQ.trim());
    } else {
      params.delete("q");
    }
    if (localCidade.trim()) {
      params.set("cidade", localCidade.trim());
    } else {
      params.delete("cidade");
    }
    params.delete("pagina");
    startTransition(() => {
      router.push(`/profissionais?${params.toString()}`);
    });
  }, [router, searchParams, localQ, localCidade]);

  return (
    <div className="grid w-full max-w-4xl gap-2 rounded-xl border border-white/20 bg-white p-2 shadow-lg shadow-black/10 sm:grid-cols-[minmax(0,1.3fr)_minmax(180px,0.8fr)_auto] sm:items-center">
      <div className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:border-0 sm:bg-transparent">
        <Search size={18} className="shrink-0 text-cinza-texto" />
        <input
          type="text"
          placeholder="Serviço ou nome do profissional"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          className="min-w-0 flex-1 bg-transparent text-sm text-azul-noite outline-none placeholder:text-slate-400"
        />
      </div>

      <CityInput
        value={localCidade}
        onChange={setLocalCidade}
        className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:border-l sm:border-y-0 sm:border-r-0 sm:border-slate-200 sm:bg-transparent"
        inputClassName="min-w-0 flex-1 bg-transparent text-sm text-azul-noite outline-none placeholder:text-slate-400"
        placeholder="Cidade"
      />

      <button
        onClick={handleBuscar}
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-laranja-obra px-5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-wait disabled:opacity-80"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        Buscar
      </button>
    </div>
  );
}
