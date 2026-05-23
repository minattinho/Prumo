"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProfessionalPricing } from "@/types";

async function getProfessionalId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) console.error("[getProfessionalId] Supabase error:", error);
  return data?.id ?? null;
}

export async function updateBasicInfo(data: {
  personal_description: string;
  city: string;
  state: string;
  service_radius_km: number | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("professional_profiles")
    .update({
      personal_description: data.personal_description || null,
      city: data.city || null,
      state: data.state || null,
      service_radius_km: data.service_radius_km,
    })
    .eq("user_id", user.id);

  if (error) return { error: "Erro ao salvar informações" };
  revalidatePath("/painel/perfil");
  revalidatePath("/painel");
  return { success: true };
}

export async function updatePhoto(cloudinary_url: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("professional_profiles")
    .update({ photo_url: cloudinary_url })
    .eq("user_id", user.id);

  if (error) return { error: "Erro ao salvar foto" };
  revalidatePath("/painel/perfil");
  revalidatePath("/painel");
  return { success: true };
}

export async function updatePricing(data: ProfessionalPricing) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const normalizePrice = (value: number | null) =>
    typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;

  const { error } = await supabase
    .from("professional_profiles")
    .update({
      price_per_hour: normalizePrice(data.price_per_hour),
      price_per_day: normalizePrice(data.price_per_day),
      price_per_month: normalizePrice(data.price_per_month),
      price_per_service: normalizePrice(data.price_per_service),
      price_currency: data.price_currency || "BRL",
    })
    .eq("user_id", user.id);

  if (error) return { error: "Erro ao salvar valores" };
  revalidatePath("/painel/perfil");
  revalidatePath("/painel");
  return { success: true };
}

export async function updateSpecialties(categories: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  await supabase.from("professional_specialties").delete().eq("professional_id", proId);

  if (categories.length > 0) {
    const { error } = await supabase.from("professional_specialties").insert(
      categories.map((category) => ({ professional_id: proId, category }))
    );
    if (error) return { error: "Erro ao salvar especialidades" };
  }

  revalidatePath("/painel/perfil");
  revalidatePath("/painel");
  return { success: true };
}

export async function updateAffinities(tags: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  await supabase.from("professional_affinities").delete().eq("professional_id", proId);

  if (tags.length > 0) {
    const { error } = await supabase.from("professional_affinities").insert(
      tags.map((tag) => ({ professional_id: proId, tag }))
    );
    if (error) return { error: "Erro ao salvar afinidades" };
  }

  revalidatePath("/painel/perfil");
  return { success: true };
}

export async function addContactChannel(data: {
  type: string;
  value: string;
  is_primary: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  if (data.is_primary) {
    await supabase
      .from("professional_contact_channels")
      .update({ is_primary: false })
      .eq("professional_id", proId);
  }

  const { error } = await supabase.from("professional_contact_channels").insert({
    professional_id: proId,
    type: data.type as any,
    value: data.value,
    is_primary: data.is_primary,
    link_formatted: data.value,
  });

  if (error) return { error: "Erro ao adicionar canal" };
  revalidatePath("/painel/perfil");
  return { success: true };
}

export async function deleteContactChannel(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  const { error } = await supabase
    .from("professional_contact_channels")
    .delete()
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao remover canal" };
  revalidatePath("/painel/perfil");
  return { success: true };
}

export async function setChannelPrimary(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  await supabase
    .from("professional_contact_channels")
    .update({ is_primary: false })
    .eq("professional_id", proId);

  const { error } = await supabase
    .from("professional_contact_channels")
    .update({ is_primary: true })
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao definir canal principal" };
  revalidatePath("/painel/perfil");
  return { success: true };
}

export async function updateSocialNetworks(
  networks: { platform: string; handle_or_url: string }[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  await supabase.from("professional_social_networks").delete().eq("professional_id", proId);

  const nonEmpty = networks.filter((n) => n.handle_or_url.trim());
  if (nonEmpty.length > 0) {
    const { error } = await supabase.from("professional_social_networks").insert(
      nonEmpty.map((n) => ({
        professional_id: proId,
        platform: n.platform as any,
        handle_or_url: n.handle_or_url,
      }))
    );
    if (error) return { error: "Erro ao salvar redes sociais" };
  }

  revalidatePath("/painel/perfil");
  return { success: true };
}
