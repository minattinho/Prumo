import { Suspense } from "react";
import { SearchBar } from "./search-bar";
import { SearchFilters } from "./search-filters";
import { SearchResults } from "./search-results";

export const metadata = {
  title: "Encontrar profissional",
};

interface Props {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
    cidade?: string;
    ordem?: string;
    avaliacao?: string;
    verificacao?: string;
    tipo?: string;
    pagina?: string;
  }>;
}

export default async function ProfissionaisPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de busca */}
      <div className="bg-azul-noite border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Suspense>
            <SearchBar q={params.q} cidade={params.cidade} />
          </Suspense>
        </div>
      </div>

      {/* Layout two-column */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6 items-start">
          {/* Sidebar de filtros */}
          <aside className="w-44 shrink-0 sticky top-24 self-start hidden md:block">
            <Suspense>
              <SearchFilters
                categoria={params.categoria}
                avaliacao={params.avaliacao}
                tipo={params.tipo}
                verificacao={params.verificacao}
              />
            </Suspense>
          </aside>

          {/* Resultados */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<SearchResultsSkeleton />}>
              <SearchResults
                q={params.q}
                categoria={params.categoria}
                cidade={params.cidade}
                ordem={params.ordem}
                avaliacao={params.avaliacao}
                verificacao={params.verificacao}
                tipo={params.tipo}
                pagina={params.pagina}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-card shadow-card overflow-hidden animate-pulse">
            {/* Header */}
            <div className="p-4 flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            {/* Rating */}
            <div className="px-4 pb-3">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            {/* Fotos */}
            <div className="grid grid-cols-3 gap-0.5 mx-4 rounded-lg overflow-hidden">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="aspect-square bg-gray-200" />
              ))}
            </div>
            {/* Botão */}
            <div className="p-4">
              <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
