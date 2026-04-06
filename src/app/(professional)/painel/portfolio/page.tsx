import { createClient } from "@/lib/supabase/server";
import { PortfolioClient } from "./portfolio-client";

export const metadata = {
  title: "Meu Portfólio",
};

export default async function PainelPortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  let projects: any[] = [];
  let featuredCount = 0;

  if (pro?.id) {
    const { data } = await supabase
      .from("portfolio_projects")
      .select(
        "id, title, category, city_executed, description, is_featured, display_order, view_count, portfolio_images(id, cloudinary_url, order_in_project)"
      )
      .eq("professional_id", pro.id)
      .order("display_order", { ascending: true }) as { data: any[] | null };

    projects = (data ?? []).map((p: any) => ({
      ...p,
      portfolio_images: (p.portfolio_images ?? []).sort(
        (a: any, b: any) => a.order_in_project - b.order_in_project
      ),
    }));
    featuredCount = projects.filter((p: any) => p.is_featured).length;
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Meu Portfólio</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Arraste para reordenar. Marque até 3 projetos em destaque.
        </p>
      </div>
      <PortfolioClient
        initialProjects={projects}
        featuredCount={featuredCount}
        cloudName={cloudName}
      />
    </div>
  );
}
