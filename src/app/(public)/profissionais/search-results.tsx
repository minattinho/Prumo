import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import type { BadgeType } from "@/types";
import {
  SERVICE_CATEGORIES,
  getServiceLabel,
  serviceValueMatchesFilter,
} from "@/types/services";
import { ProfessionalCard } from "./professional-card";
import { OrdemSelect } from "./ordem-select";
import { Pagination } from "./pagination";

const PAGE_SIZE = 12;

const Q_TO_SERVICE: Record<string, string> = {
  eletricista: "eletricista",
  eletricistas: "eletricista",
  eletrica: "eletricista",
  encanador: "encanador",
  encanadores: "encanador",
  hidraulica: "encanador",
  pedreiro: "pedreiro",
  pedreiros: "pedreiro",
  construcao: "pedreiro",
  pintor: "pintor",
  pintores: "pintor",
  pintura: "pintor",
  marceneiro: "marceneiro",
  marcenaria: "marceneiro",
  gesseiro: "gesseiro",
  gesso: "gesseiro",
  engenheiro: "engenharia-civil",
  engenheiros: "engenharia-civil",
  engenharia: "engenharia-civil",
  arquitetura: "arquitetura",
  arquiteto: "arquitetura",
  climatizacao: "manutencao-de-ar-condicionado",
  "ar condicionado": "manutencao-de-ar-condicionado",
  site: "criacao-de-sites",
  sites: "criacao-de-sites",
  aplicativo: "desenvolvimento-de-aplicativos",
  aplicativos: "desenvolvimento-de-aplicativos",
  chatbot: "chatbots-para-whatsapp",
  chatbots: "chatbots-para-whatsapp",
  seo: "seo",
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

  type QueryRow = {
    id: string;
    slug: string;
    city: string | null;
    state: string | null;
    photo_url: string | null;
    created_at: string;
    cnpj: string | null;
    profiles: { name: string } | null;
    professional_specialties: { category: string }[];
    professional_metrics: {
      average_rating: number;
      total_evaluations: number;
      total_completed_services_via_prumo: number;
    } | null;
    verification_badges: { type: string }[];
    portfolio_projects: { portfolio_images: { cloudinary_url: string; order_in_project: number }[] }[];
  };

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

  const rows = (data ?? []) as QueryRow[];

  const professionals = rows.map((p) => {
    const specialties = p.professional_specialties.map((s) => getServiceLabel(s.category));
    const specialtyValues = p.professional_specialties.map((s) => s.category);
    const badges = p.verification_badges.map((b) => b.type as BadgeType);
    const portfolioImages = p.portfolio_projects
      .flatMap((proj) => proj.portfolio_images.map((img) => img.cloudinary_url))
      .slice(0, 3);

    return {
      id: p.id,
      slug: p.slug,
      name: p.profiles?.name ?? "Profissional",
      city: p.city ?? "",
      state: p.state ?? "",
      specialties,
      specialtyValues,
      rating: p.professional_metrics?.average_rating ?? 0,
      reviewCount: p.professional_metrics?.total_evaluations ?? 0,
      completedServices:
        p.professional_metrics?.total_completed_services_via_prumo ??
        p.professional_metrics?.total_evaluations ??
        0,
      photoUrl: p.photo_url ?? null,
      badges,
      portfolioImages,
      professionalType: (p.cnpj ? "empresa" : "individual") as "empresa" | "individual",
      createdAt: p.created_at,
    };
  });

  let results = professionals;

  let qMappedToService = "";
  if (q) {
    const normalizedQuery = q.toLowerCase().trim();
    const mapped =
      Q_TO_SERVICE[normalizedQuery] ??
      SERVICE_CATEGORIES.find((service) =>
        service.label.toLowerCase().includes(normalizedQuery)
      )?.value;

    if (mapped) {
      qMappedToService = mapped;
      results = results.filter((p) =>
        p.specialtyValues.some((value) => serviceValueMatchesFilter(value, mapped))
      );
    } else {
      results = results.filter((p) => p.name.toLowerCase().includes(normalizedQuery));
    }
  }

  if (categoria && !qMappedToService) {
    results = results.filter((p) =>
      p.specialtyValues.some((value) => serviceValueMatchesFilter(value, categoria))
    );
  }

  if (cidade) {
    results = results.filter((p) => p.city.toLowerCase().includes(cidade.toLowerCase()));
  }

  if (avaliacao) {
    const minRating = parseFloat(avaliacao);
    if (!isNaN(minRating)) {
      results = results.filter((p) => p.rating >= minRating);
    }
  }

  if (verificacao) {
    const requiredBadges = verificacao.split(",") as BadgeType[];
    results = results.filter((p) => requiredBadges.every((b) => p.badges.includes(b)));
  }

  if (tipo && tipo !== "todos") {
    results = results.filter((p) => p.professionalType === tipo);
  }

  if (!ordem || ordem === "avaliacao") {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (ordem === "obras") {
    results = [...results].sort((a, b) => b.portfolioImages.length - a.portfolioImages.length);
  } else if (ordem === "recente") {
    results = [...results].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const totalCount = results.length;
  const currentPage = Math.max(1, parseInt(pagina ?? "1", 10));
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const locationLabel = cidade ? ` em ${cidade}` : "";

  if (totalCount === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-azul-noite font-medium mb-1">Nenhum profissional encontrado</p>
        <p className="text-cinza-texto text-sm">Tente outros filtros ou uma cidade diferente.</p>
      </div>
    );
  }

  return (
    <div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedResults.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>

      {totalPages > 1 && (
        <Suspense>
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
