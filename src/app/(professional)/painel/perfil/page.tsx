import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import Link from "next/link";
import { Eye } from "lucide-react";
import type { ProfessionalPricing } from "@/types";

export const metadata = {
  title: "Editar Perfil",
};

type SpecialtyRow = { category: string };
type AffinityRow = { tag: string };
type ChannelRow = { id: string; type: string; value: string; is_primary: boolean };
type SocialNetworkRow = { platform: string; handle_or_url: string };

export default async function PainelPerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user!.user_metadata?.full_name ?? user!.email ?? null;

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id, photo_url, personal_description, city, state, service_radius_km, slug, price_per_hour, price_per_day, price_per_month, price_per_service, price_currency")
    .eq("user_id", user!.id)
    .single() as {
    data: ProfessionalPricing & {
      id: string;
      photo_url: string | null;
      personal_description: string | null;
      city: string | null;
      state: string | null;
      service_radius_km: number | null;
      slug: string | null;
    } | null;
  };

  let specialtiesData: SpecialtyRow[] = [];
  let affinitiesData: AffinityRow[] = [];
  let channelsData: ChannelRow[] = [];
  let socialsData: SocialNetworkRow[] = [];

  if (pro?.id) {
    const [sp, af, ch, sn] = await Promise.all([
      supabase.from("professional_specialties").select("category").eq("professional_id", pro.id),
      supabase.from("professional_affinities").select("tag").eq("professional_id", pro.id),
      supabase
        .from("professional_contact_channels")
        .select("id, type, value, is_primary")
        .eq("professional_id", pro.id)
        .order("is_primary", { ascending: false }),
      supabase
        .from("professional_social_networks")
        .select("platform, handle_or_url")
        .eq("professional_id", pro.id),
    ]);
    specialtiesData = (sp.data as SpecialtyRow[] | null) ?? [];
    affinitiesData = (af.data as AffinityRow[] | null) ?? [];
    channelsData = (ch.data as ChannelRow[] | null) ?? [];
    socialsData = (sn.data as SocialNetworkRow[] | null) ?? [];
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-azul-noite">Editar perfil</h1>
          <p className="text-sm text-cinza-texto mt-0.5">
            Mantenha seu perfil atualizado para atrair mais clientes.
          </p>
        </div>
        {pro?.slug && (
          <Link
            href={`/profissionais/${pro.slug}`}
            target="_blank"
            className="flex items-center gap-2 border border-gray-200 text-azul-noite hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <Eye className="w-4 h-4" />
            Ver perfil público
          </Link>
        )}
      </div>

      <ProfileForm
        profile={{
          photo_url: pro?.photo_url ?? null,
          personal_description: pro?.personal_description ?? null,
          city: pro?.city ?? null,
          state: pro?.state ?? null,
          service_radius_km: pro?.service_radius_km ?? null,
          price_per_hour: pro?.price_per_hour ?? null,
          price_per_day: pro?.price_per_day ?? null,
          price_per_month: pro?.price_per_month ?? null,
          price_per_service: pro?.price_per_service ?? null,
          price_currency: pro?.price_currency ?? "BRL",
        }}
        fullName={fullName}
        specialties={specialtiesData.map((s) => s.category)}
        affinities={affinitiesData.map((a) => a.tag)}
        channels={channelsData}
        socialNetworks={socialsData}
      />
    </div>
  );
}
