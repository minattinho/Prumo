import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_CATEGORIES } from "@/types";
import type { BadgeType } from "@/types";
import { ProfessionalCard } from "./professional-card";
import { OrdemSelect } from "./ordem-select";
import { Pagination } from "./pagination";

const PAGE_SIZE = 12;

// Mapeamento de termos comuns para valores de categoria
const Q_TO_CATEGORY: Record<string, string> = {
  eletricista: "eletrica",
  eletricistas: "eletrica",
  elétrica: "eletrica",
  eletrica: "eletrica",
  encanador: "hidraulica",
  encanadores: "hidraulica",
  hidráulica: "hidraulica",
  hidraulica: "hidraulica",
  pedreiro: "construcao",
  pedreiros: "construcao",
  construção: "construcao",
  construcao: "construcao",
  pintor: "acabamento",
  pintores: "acabamento",
  pintura: "acabamento",
  marceneiro: "marcenaria",
  marcenaria: "marcenaria",
  gesseiro: "acabamento",
  gesso: "acabamento",
  engenheiro: "engenharia",
  engenheiros: "engenharia",
  engenharia: "engenharia",
  jardineiro: "jardinagem",
  jardinagem: "jardinagem",
  climatização: "climatizacao",
  climatizacao: "climatizacao",
  "ar condicionado": "climatizacao",
};

interface SearchResultsProps {
  q?: string;
  categoria?: string;
  cidade?: string;
  ordem?: string;
  avaliacao?: string;
  verificacao?: string;
  tipo?: string;
  pagina?: string;
}

export async function SearchResults({
  q,
  categoria,
  cidade,
  ordem,
  avaliacao,
  verificacao,
  tipo,
  pagina,
}: SearchResultsProps) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("professional_profiles")
    .select(`
      id, slug, city, state, photo_url, created_at, cnpj,
      profiles!user_id(name),
      professional_specialties(category),
      professional_metrics(average_rating, total_evaluations, total_completed_services_via_prumo),
      verification_badges(type),
      portfolio_projects(
        portfolio_images(cloudinary_url, order_in_project)
      )
    `)
    .eq("status", "ACTIVE");

  const professionals = (data ?? []).map((p) => {
    const prof = p.profiles as { name: string } | null;
    const metrics = p.professional_metrics as {
      average_rating: number;
      total_evaluations: number;
      total_completed_services_via_prumo: number;
    } | null;
    const specialties = (p.professional_specialties as { category: string }[]).map(
      (s) => SERVICE_CATEGORIES.find((c) => c.value === s.category)?.label ?? s.category
    );
    const specialtyValues = (p.professional_specialties as { category: string }[]).map((s) => s.category);
    const badges = (p.verification_badges as { type: string }[]).map((b) => b.type as BadgeType);
    const portfolioImages = (
      p.portfolio_projects as { portfolio_images: { cloudinary_url: string; order_in_project: number }[] }[]
    )
      .flatMap((proj) => proj.portfolio_images.map((img) => img.cloudinary_url))
      .slice(0, 3);

    return {
      id: p.id,
      slug: p.slug,
      name: prof?.name ?? "Profissional",
      city: p.city ?? "",
      state: p.state ?? "",
      specialties,
      specialtyValues,
      rating: metrics?.average_rating ?? 0,
      reviewCount: metrics?.total_evaluations ?? 0,
      completedServices: metrics?.total_completed_services_via_prumo ?? metrics?.total_evaluations ?? 0,
      photoUrl: p.photo_url ?? null,
      badges,
      portfolioImages,
      professionalType: (p.cnpj ? "empresa" : "individual") as "empresa" | "individual",
      createdAt: p.created_at as string,
    };
  });

  // Filtros
  let results = professionals;

  // 1. Busca por texto (q)
  let qMappedToCategory = "";
  if (q) {
    const mapped = Q_TO_CATEGORY[q.toLowerCase().trim()];
    if (mapped) {
      qMappedToCategory = mapped;
      results = results.filter((p) => p.specialtyValues.includes(mapped));
    } else {
      results = results.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    }
  }

  // 2. Categoria (apenas se q não mapeou)
  if (categoria && !qMappedToCategory) {
    results = results.filter((p) => p.specialtyValues.includes(categoria));
  }

  // 3. Cidade
  if (cidade) {
    results = results.filter((p) => p.city.toLowerCase().includes(cidade.toLowerCase()));
  }

  // 4. Avaliação mínima
  if (avaliacao) {
    const minRating = parseFloat(avaliacao);
    if (!isNaN(minRating)) {
      results = results.filter((p) => p.rating >= minRating);
    }
  }

  // 5. Verificação (badges)
  if (verificacao) {
    const requiredBadges = verificacao.split(",") as BadgeType[];
    results = results.filter((p) => requiredBadges.every((b) => p.badges.includes(b)));
  }

  // 6. Tipo de profissional
  if (tipo && tipo !== "todos") {
    results = results.filter((p) => p.professionalType === tipo);
  }

  // Ordenação
  if (!ordem || ordem === "avaliacao") {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (ordem === "obras") {
    results = [...results].sort((a, b) => b.portfolioImages.length - a.portfolioImages.length);
  } else if (ordem === "recente") {
    results = [...results].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // Paginação
  const totalCount = results.length;
  const currentPage = Math.max(1, parseInt(pagina ?? "1", 10));
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Label de localização para o header
  const locationLabel = cidade ? ` em ${cidade}` : "";

  if (totalCount === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-azul-noite font-medium mb-1">Nenhum profissional encontrado</p>
        <p className="text-cinza-texto text-sm">Tenta outros filtros ou uma cidade diferente.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header: count + ordenação */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-cinza-texto">
          <span className="font-semibold text-azul-noite">{totalCount}</span>{" "}
          profissional{totalCount !== 1 ? "is" : ""} encontrado{totalCount !== 1 ? "s" : ""}
          {locationLabel}
        </p>
        <Suspense>
          <OrdemSelect ordem={ordem} />
        </Suspense>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedResults.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
