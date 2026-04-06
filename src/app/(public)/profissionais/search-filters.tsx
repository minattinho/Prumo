"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/types";
import { CityInput } from "@/components/city-input";

interface SearchFiltersProps {
  categoria?: string;
  cidade?: string;
  ordem?: string;
}

export function SearchFilters({ categoria, cidade, ordem }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/profissionais?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SlidersHorizontal size={16} className="text-cinza-texto shrink-0" />

      {/* Categoria */}
      <select
        value={categoria ?? ""}
        onChange={(e) => updateParam("categoria", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-azul-noite bg-white focus:outline-none focus:ring-2 focus:ring-azul-principal"
      >
        <option value="">Todas as categorias</option>
        {SERVICE_CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Cidade */}
      <CityInput
        value={cidade ?? ""}
        onChange={(val) => updateParam("cidade", val)}
        className="border border-gray-200 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-azul-principal w-48"
        inputClassName="flex-1 min-w-0 text-sm text-azul-noite outline-none bg-transparent placeholder:text-gray-400"
      />

      {/* Ordenação */}
      <select
        value={ordem ?? "avaliacao"}
        onChange={(e) => updateParam("ordem", e.target.value)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-azul-noite bg-white focus:outline-none focus:ring-2 focus:ring-azul-principal"
      >
        <option value="avaliacao">Mais bem avaliado</option>
        <option value="obras">Mais obras</option>
        <option value="recente">Mais recente</option>
      </select>

      {/* Limpar filtros */}
      {(categoria || cidade || ordem) && (
        <button
          onClick={() => router.push("/profissionais")}
          className="text-sm text-cinza-texto hover:text-azul-principal underline underline-offset-2 transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );
}
