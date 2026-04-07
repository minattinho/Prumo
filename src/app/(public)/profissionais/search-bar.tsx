"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { CityInput } from "@/components/city-input";

interface SearchBarProps {
  q?: string;
  cidade?: string;
}

export function SearchBar({ q, cidade }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    router.push(`/profissionais?${params.toString()}`);
  }, [router, searchParams, localQ, localCidade]);

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1.5 max-w-2xl shadow-sm">
      {/* Campo de busca por texto */}
      <div className="flex items-center gap-2 flex-1 px-2">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Ex: eletricista, pintor, encanador..."
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          className="flex-1 text-sm text-azul-noite outline-none bg-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Divisor */}
      <div className="w-px h-6 bg-gray-200 shrink-0" />

      {/* Campo de cidade */}
      <CityInput
        value={localCidade}
        onChange={setLocalCidade}
        className="flex items-center gap-2 px-2 flex-1 min-w-0"
        inputClassName="flex-1 min-w-0 text-sm text-azul-noite outline-none bg-transparent placeholder:text-gray-400"
        placeholder="Cidade"
      />

      {/* Botão buscar */}
      <button
        onClick={handleBuscar}
        className="bg-laranja-obra hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shrink-0"
      >
        Buscar
      </button>
    </div>
  );
}
