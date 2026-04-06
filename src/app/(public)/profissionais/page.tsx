import { Suspense } from "react";
import { SearchFilters } from "./search-filters";
import { SearchResults } from "./search-results";

export const metadata = {
  title: "Encontrar profissional",
};

interface Props {
  searchParams: Promise<{ categoria?: string; cidade?: string; ordem?: string }>;
}

export default async function ProfissionaisPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de filtros */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Suspense>
            <SearchFilters
              categoria={params.categoria}
              cidade={params.cidade}
              ordem={params.ordem}
            />
          </Suspense>
        </div>
      </div>

      {/* Resultados */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults
            categoria={params.categoria}
            cidade={params.cidade}
            ordem={params.ordem}
          />
        </Suspense>
      </div>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-card shadow-card p-4 animate-pulse">
          <div className="flex gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="aspect-square bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
