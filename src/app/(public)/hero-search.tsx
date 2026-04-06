"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Link from "next/link";
import { CityInput } from "@/components/city-input";

const POPULAR_SEARCHES = [
  "Encanador",
  "Eletricista",
  "Pedreiro",
  "Pintor",
  "Marceneiro",
];

export function HeroSearch() {
  const router = useRouter();
  const [servico, setServico] = useState("");
  const [cidade, setCidade] = useState("");

  function handleBuscar() {
    const params = new URLSearchParams();
    if (servico) params.set("q", servico.toLowerCase());
    if (cidade) params.set("cidade", cidade);
    router.push(`/profissionais${params.size > 0 ? `?${params.toString()}` : ""}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleBuscar();
  }

  return (
    <>
      {/* Search bar */}
      <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl shadow-black/30 mb-6">
        <div className="flex-1 flex items-center gap-3 px-4 py-1">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Qual serviço você precisa?"
            value={servico}
            onChange={(e) => setServico(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-azul-noite text-sm outline-none placeholder:text-gray-400 bg-transparent"
          />
        </div>
        <div className="hidden sm:block w-px bg-gray-200 my-2" />
        <CityInput
          value={cidade}
          onChange={setCidade}
          className="px-4 py-1 sm:w-52"
          inputClassName="flex-1 min-w-0 text-azul-noite text-sm outline-none placeholder:text-gray-400 bg-transparent"
        />
        <button
          onClick={handleBuscar}
          className="bg-laranja-obra hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-xl text-sm transition-colors duration-200 text-center cursor-pointer"
        >
          Buscar
        </button>
      </div>

      {/* Popular searches */}
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <span className="text-blue-400 text-xs mt-0.5">Buscas populares:</span>
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            href={`/profissionais?q=${term.toLowerCase()}`}
            className="text-blue-200 hover:text-white text-xs underline underline-offset-2 transition-colors cursor-pointer"
          >
            {term}
          </Link>
        ))}
      </div>
    </>
  );
}
