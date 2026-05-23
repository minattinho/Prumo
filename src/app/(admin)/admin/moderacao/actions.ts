"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function verifyAdmin(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Não autenticado." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Não autorizado. Acesso restrito a administradores." };
  }

  return {};
}

export async function approveProfessional(profileId: string): Promise<{ success?: boolean; error?: string }> {
  const check = await verifyAdmin();
  if (check.error) return { error: check.error };

  const serviceSupabase = createServiceClient();

  // 1. Atualizar o status do perfil profissional para ACTIVE
  const { error: profileError } = await serviceSupabase
    .from("professional_profiles")
    .update({ status: "ACTIVE" })
    .eq("id", profileId);

  if (profileError) {
    console.error("[approveProfessional] erro ao ativar perfil:", profileError.message);
    return { error: "Erro ao ativar o perfil do profissional." };
  }

  // 2. Conceder o selo VERIFIED na tabela verification_badges
  const { error: badgeError } = await serviceSupabase
    .from("verification_badges")
    .upsert(
      { professional_id: profileId, type: "VERIFIED" },
      { onConflict: "professional_id,type" }
    );

  if (badgeError) {
    console.error("[approveProfessional] erro ao conceder selo:", badgeError.message);
  }

  // 3. Registrar validação aprovada em cpf_validations
  const { error: validationError } = await serviceSupabase
    .from("cpf_validations")
    .insert({
      professional_id: profileId,
      status: "APPROVED",
      validation_date: new Date().toISOString(),
    });

  if (validationError) {
    console.error("[approveProfessional] erro ao registrar validação:", validationError.message);
  }

  revalidatePath("/admin/moderacao", "page");
  revalidatePath("/profissionais", "page");
  revalidatePath("/", "layout");

  return { success: true };
}

export async function rejectProfessional(
  profileId: string,
  reason: string
): Promise<{ success?: boolean; error?: string }> {
  if (!reason.trim()) {
    return { error: "O motivo da rejeição é obrigatório." };
  }

  const check = await verifyAdmin();
  if (check.error) return { error: check.error };

  const serviceSupabase = createServiceClient();

  // 1. Atualizar o status do perfil profissional para SUSPENDED
  const { error: profileError } = await serviceSupabase
    .from("professional_profiles")
    .update({ status: "SUSPENDED" })
    .eq("id", profileId);

  if (profileError) {
    console.error("[rejectProfessional] erro ao suspender perfil:", profileError.message);
    return { error: "Erro ao atualizar status do perfil." };
  }

  // 2. Registrar validação rejeitada em cpf_validations com justificativa
  const { error: validationError } = await serviceSupabase
    .from("cpf_validations")
    .insert({
      professional_id: profileId,
      status: "REJECTED",
      reason_if_rejected: reason.trim(),
      validation_date: new Date().toISOString(),
    });

  if (validationError) {
    console.error("[rejectProfessional] erro ao registrar validação rejeitada:", validationError.message);
  }

  // 3. Remover selo de verificação se existir
  await serviceSupabase
    .from("verification_badges")
    .delete()
    .eq("professional_id", profileId)
    .eq("type", "VERIFIED");

  revalidatePath("/admin/moderacao", "page");
  revalidatePath("/profissionais", "page");
  revalidatePath("/", "layout");

  return { success: true };
}
