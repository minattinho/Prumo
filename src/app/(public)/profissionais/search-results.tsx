import { Suspense } from "react";
import { BriefcaseBusiness, MapPin, SearchX } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { BadgeType } from "@/types";
import {
  SERVICE_CATEGORIES,
  getServiceFilterValues,
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
  elétrica: "eletricista",
  encanador: "encanador",
  encanadores: "encanador",
  hidraulica: "encanador",
  hidráulica: "encanador",
  pedreiro: "pedreiro",
  pedreiros: "pedreiro",
  construcao: "pedreiro",
  construção: "pedreiro",
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
  climatização: "manutencao-de-ar-condicionado",
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

type QueryRow = {
  id: string;
  slug: string;
  city: string | null;
  state: string | null;
  photo_url: string | null;
  created_at: string;
  cnpj: string | null;
  subscription_status: string | null;
  profiles: { name: string } | null;
  professional_specialties: { category: string }[];
  professional_metrics: {
    average_rating: number;
    total_evaluations: number;
    total_completed_services_via_prumo: number;
    contacts_received: number;
  } | null;
  verification_badges: { type: string }[];
  portfolio_projects: { portfolio_images: { cloudinary_url: string; order_in_project: number }[] }[];
};

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function resolveServiceFilter(q?: string, categoria?: string) {
  if (categoria) return categoria;
  if (!q) return "";

  const normalizedQuery = normalizeSearch(q);
  return (
    Q_TO_SERVICE[normalizedQuery] ??
    SERVICE_CATEGORIES.find((service) =>
      normalizeSearch(service.label).includes(normalizedQuery)
    )?.value ??
    ""
  );
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
  const serviceFilter = resolveServiceFilter(q, categoria);
  const serviceValues = serviceFilter ? getServiceFilterValues(serviceFilter) : [];
  const minRating = avaliacao ? Number.parseFloat(avaliacao) : null;

  const specialtiesRelation = serviceValues.length > 0 ? "professional_specialties!inner" : "professional_specialties";
  const metricsRelation = minRating && !Number.isNaN(minRating) ? "professional_metrics!inner" : "professional_metrics";

  let query = supabase
    .from("professional_profiles")
    .select(`
      id, slug, city, state, photo_url, created_at, cnpj, subscription_status,
      profiles!user_id(name),
      ${specialtiesRelation}(category),
      ${metricsRelation}(average_rating, total_evaluations, total_completed_services_via_prumo, contacts_received),
      verification_badges(type),
      portfolio_projects(
        portfolio_images(cloudinary_url, order_in_project)
      )
    `)
    .eq("status", "ACTIVE");

  if (cidade?.trim()) {
    query = query.ilike("city", `%${cidade.trim()}%`);
  }

  if (tipo === "empresa") {
    query = query.not("cnpj", "is", null);
  } else if (tipo === "individual") {
    query = query.is("cnpj", null);
  }

  if (serviceValues.length > 0) {
    query = query.in("professional_specialties.category", serviceValues);
  }

  if (minRating && !Number.isNaN(minRating)) {
    query = query.gte("professional_metrics.average_rating", minRating);
  }

  if (ordem === "recente") {
    query = query.order("created_at", { ascending: false });
  } else if (!ordem || ordem === "avaliacao") {
    query = query.order("average_rating", {
      referencedTable: "professional_metrics",
      ascending: false,
      nullsFirst: false,
    });
  }

  const { data, error } = await query;

  if (error) {
    return (
      <div className="rounded-card border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        Não foi possível carregar os profissionais agora. Tente novamente em alguns instantes.
      </div>
    );
  }

  const rows = (data ?? []) as QueryRow[];
  const normalizedTextQuery = q && !serviceFilter ? normalizeSearch(q) : "";

  let results = rows.map((p) => {
    const specialties = p.professional_specialties.map((s) => getServiceLabel(s.category));
    const specialtyValues = p.professional_specialties.map((s) => s.category);
    const badges = p.verification_badges.map((b) => b.type as BadgeType);
    const portfolioImages = p.portfolio_projects
      .flatMap((proj) =>
        [...proj.portfolio_images]
          .sort((a, b) => a.order_in_project - b.order_in_project)
          .map((img) => img.cloudinary_url)
      )
      .slice(0, 3);

    return {
      id: p.id,
      slug: p.slug,
      name: p.profiles?.name ?? "Profissional",
      city: p.city ?? "",
      state: p.state ?? "",
      specialties,
      specialtyValues,
      rating: Number(p.professional_metrics?.average_rating ?? 0),
      reviewCount: p.professional_metrics?.total_evaluations ?? 0,
      completedServices:
        p.professional_metrics?.total_completed_services_via_prumo ??
        p.professional_metrics?.total_evaluations ??
        0,
      contactsReceived: p.professional_metrics?.contacts_received ?? 0,
      photoUrl: p.photo_url ?? null,
      badges,
      portfolioImages,
      professionalType: (p.cnpj ? "empresa" : "individual") as "empresa" | "individual",
      subscriptionStatus: p.subscription_status ?? "TRIAL",
      createdAt: p.created_at,
    };
  });

  if (normalizedTextQuery) {
    results = results.filter((p) => normalizeSearch(p.name).includes(normalizedTextQuery));
  }

  if (serviceFilter) {
    results = results.filter((p) =>
      p.specialtyValues.some((value) => serviceValueMatchesFilter(value, serviceFilter))
    );
  }

  if (verificacao) {
    const requiredBadges = verificacao.split(",").filter(Boolean) as BadgeType[];
    results = results.filter((p) => requiredBadges.every((badge) => p.badges.includes(badge)));
  }

  if (ordem === "obras") {
    results = [...results].sort((a, b) => b.portfolioImages.length - a.portfolioImages.length);
  } else if (!ordem || ordem === "avaliacao") {
    results = [...results].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }

  const totalCount = results.length;
  const currentPage = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedResults = results.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);
  const locationLabel = cidade ? ` em ${cidade}` : "";

  if (totalCount === 0) {
    return (
      <div className="rounded-card border border-slate-200 bg-white px-6 py-16 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-azul-claro text-azul-principal">
          <SearchX size={22} />
        </div>
        <p className="font-semibold text-azul-noite">Nenhum profissional encontrado</p>
        <p className="mt-1 text-sm text-cinza-texto">Tente remover filtros ou buscar uma cidade próxima.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-cinza-texto">
            <span className="font-semibold text-azul-noite">{totalCount}</span>{" "}
            profissional{totalCount !== 1 ? "is" : ""} encontrado{totalCount !== 1 ? "s" : ""}
            {locationLabel}
          </p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-cinza-texto">
            {serviceFilter && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">
                <BriefcaseBusiness size={12} />
                {getServiceLabel(serviceFilter)}
              </span>
            )}
            {cidade && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 ring-1 ring-slate-200">
                <MapPin size={12} />
                {cidade}
              </span>
            )}
          </div>
        </div>
        <Suspense>
          <OrdemSelect ordem={ordem} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paginatedResults.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>

      {totalPages > 1 && (
        <Suspense>
          <Pagination currentPage={safeCurrentPage} totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
