import { createClient } from "@/lib/supabase/server";
import { SERVICE_CATEGORIES } from "@/types";
import { ProfessionalCard } from "./professional-card";

interface SearchResultsProps {
  categoria?: string;
  cidade?: string;
  ordem?: string;
}

export async function SearchResults({ categoria, cidade, ordem }: SearchResultsProps) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("professional_profiles")
    .select(`
      id, slug, city, state, photo_url, created_at,
      profiles!user_id(name),
      professional_specialties(category),
      professional_metrics(average_rating, total_evaluations),
      verification_badges(type),
      portfolio_projects(
        portfolio_images(cloudinary_url, order_in_project)
      )
    `)
    .eq("status", "ACTIVE");

  const professionals = (data ?? []).map((p) => {
    const prof = p.profiles as { name: string } | null;
    const metrics = p.professional_metrics as { average_rating: number; total_evaluations: number } | null;
    const specialties = (p.professional_specialties as { category: string }[])
      .map((s) => SERVICE_CATEGORIES.find((c) => c.value === s.category)?.label ?? s.category);
    const isVerified = (p.verification_badges as { type: string }[]).some((b) => b.type === "VERIFIED");
    const portfolioImages = (p.portfolio_projects as { portfolio_images: { cloudinary_url: string; order_in_project: number }[] }[])
      .flatMap((proj) => proj.portfolio_images.map((img) => img.cloudinary_url))
      .slice(0, 3);

    return {
      id: p.id,
      slug: p.slug,
      name: prof?.name ?? "Profissional",
      city: p.city ?? "",
      state: p.state ?? "",
      specialties,
      rating: metrics?.average_rating ?? 0,
      reviewCount: metrics?.total_evaluations ?? 0,
      photoUrl: p.photo_url ?? null,
      isVerified,
      portfolioImages,
      createdAt: p.created_at as string,
    };
  });

  // Filter
  let results = professionals;
  if (categoria) {
    results = results.filter((p) =>
      p.specialties.some((s) => s.toLowerCase().includes(categoria.toLowerCase()))
    );
  }
  if (cidade) {
    results = results.filter((p) =>
      p.city.toLowerCase().includes(cidade.toLowerCase())
    );
  }

  // Sort
  if (!ordem || ordem === "avaliacao") {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (ordem === "obras") {
    results = [...results].sort((a, b) => b.portfolioImages.length - a.portfolioImages.length);
  } else if (ordem === "recente") {
    results = [...results].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  if (results.length === 0) {
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
      <p className="text-sm text-cinza-texto mb-6">
        {results.length} profissional{results.length !== 1 ? "is" : ""} encontrado{results.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>
    </div>
  );
}
