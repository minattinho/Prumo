import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  { url: `${BASE_URL}/profissionais`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
  { url: `${BASE_URL}/seja-profissional`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/como-funciona`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/planos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/termos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  { url: `${BASE_URL}/privacidade`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = await createClient();
    const { data: professionals } = await supabase
      .from("professional_profiles")
      .select("slug, updated_at")
      .eq("status", "ACTIVE");

    const professionalRoutes: MetadataRoute.Sitemap = (professionals ?? []).map(
      (p) => ({
        url: `${BASE_URL}/profissionais/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [...STATIC_ROUTES, ...professionalRoutes];
  } catch {
    return STATIC_ROUTES;
  }
}
