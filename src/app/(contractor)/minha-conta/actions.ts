"use server";

import { createClient } from "@/lib/supabase/server";
import {
  buildPasswordResetRedirectUrl,
  getDefaultAuthOrigin,
} from "@/lib/auth/password-reset";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateContractorProfile(data: {
  full_name: string;
  phone: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("profiles")
    .update({ name: data.full_name, phone: data.phone })
    .eq("id", user.id);

  if (error) return { error: "Erro ao salvar perfil" };
  revalidatePath("/minha-conta");
  return { success: true };
}

export async function submitEvaluation(data: {
  professional_id: string;
  rating: number;
  comment: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: contractorProfile } = await supabase
    .from("contractor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!contractorProfile) return { error: "Perfil de contratante não encontrado" };

  const { error } = await supabase.from("evaluations").upsert(
    {
      contractor_id: contractorProfile.id,
      professional_id: data.professional_id,
      rating: data.rating,
      comment: data.comment,
    },
    { onConflict: "contractor_id,professional_id" }
  );

  if (error) return { error: "Erro ao enviar avaliação" };
  revalidatePath("/minha-conta");
  return { success: true };
}

export async function sendPasswordReset(email: string) {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? getDefaultAuthOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: buildPasswordResetRedirectUrl(origin),
  });
  if (error) return { error: "Erro ao enviar e-mail" };
  return { success: true };
}
