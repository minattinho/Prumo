import { Suspense } from "react";
import { SearchBar } from "./search-bar";
import { SearchFilters } from "./search-filters";
import { SearchResults } from "./search-results";

const displayStyle: React.CSSProperties = { fontFamily: "var(--font-display)" };

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
    <div className="min-h-screen bg-[#f5f8fc]">
      <div className="border-b border-white/10 bg-azul-noite relative overflow-hidden">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos no fundo */}
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-azul-principal opacity-[0.10] filter blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-4">
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] text-azul-claro/80 mb-1"
              style={displayStyle}
            >
              Profissionais Prumo
            </p>
            <h1
              className="mt-1 text-2xl font-extrabold text-white tracking-tight sm:text-3xl"
              style={displayStyle}
            >
              Encontre profissionais disponíveis na sua região
            </h1>
          </div>
          <Suspense>
            <SearchBar q={params.q} cidade={params.cidade} />
          </Suspense>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-24">
            <Suspense>
              <SearchFilters
                categoria={params.categoria}
                avaliacao={params.avaliacao}
                tipo={params.tipo}
                verificacao={params.verificacao}
              />
            </Suspense>
          </aside>

          <div className="min-w-0">
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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-slate-200 sm:w-48" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-card">
            <div className="flex gap-3 p-4">
              <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            </div>
            <div className="mx-4 grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="aspect-square animate-pulse bg-slate-200" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-10 animate-pulse rounded-lg bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
