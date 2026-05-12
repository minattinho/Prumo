import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getServiceLabel } from "@/types/services";

type QueryRow = {
  id: string;
  slug: string;
  city: string;
  state: string;
  profiles: { name: string } | null;
  professional_specialties: { category: string }[];
  professional_metrics: { average_rating: number } | null;
};

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("professional_profiles")
    .select(`
      id, slug, city, state,
      profiles!user_id(name),
      professional_specialties(category),
      professional_metrics(average_rating)
    `)
    .eq("status", "ACTIVE")
    .not("city", "is", null)
    .not("state", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as QueryRow[];

  const payload = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.profiles?.name ?? "Profissional",
    city: p.city.trim(),
    state: p.state,
    specialty: p.professional_specialties[0]?.category
      ? getServiceLabel(p.professional_specialties[0].category)
      : "Serviços gerais",
    rating: p.professional_metrics?.average_rating ?? 0,
  }));

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
