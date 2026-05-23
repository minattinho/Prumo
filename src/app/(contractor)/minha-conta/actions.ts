"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
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

export async function acceptProposal(
  proposalId: string,
  budgetRequestId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado." };

  // 1. Validar que o orçamento pertence a este contratante
  const { data: budget } = await supabase
    .from("budget_requests")
    .select("id")
    .eq("id", budgetRequestId)
    .eq("contractor_id", user.id)
    .single();

  if (!budget) {
    return { error: "Solicitação de orçamento não encontrada ou não pertence a você." };
  }

  const serviceSupabase = createServiceClient();

  // 2. Marcar a proposta escolhida como ACCEPTED
  const { error: acceptError } = await serviceSupabase
    .from("proposals")
    .update({ status: "ACCEPTED" })
    .eq("id", proposalId);

  if (acceptError) {
    console.error("[acceptProposal] erro ao aceitar:", acceptError.message);
    return { error: "Erro ao aceitar a proposta." };
  }

  // 3. Marcar todas as outras propostas como REJECTED
  await serviceSupabase
    .from("proposals")
    .update({ status: "REJECTED" })
    .eq("budget_request_id", budgetRequestId)
    .neq("id", proposalId);

  // 4. Mudar status da solicitação de orçamento para IN_NEGOTIATION
  await serviceSupabase
    .from("budget_requests")
    .update({ status: "IN_NEGOTIATION" })
    .eq("id", budgetRequestId);

  revalidatePath("/minha-conta");
  return { success: true };
}

export async function rejectProposal(
  proposalId: string,
  budgetRequestId: string
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado." };

  // 1. Validar que o orçamento pertence a este contratante
  const { data: budget } = await supabase
    .from("budget_requests")
    .select("id")
    .eq("id", budgetRequestId)
    .eq("contractor_id", user.id)
    .single();

  if (!budget) {
    return { error: "Solicitação de orçamento não encontrada ou não pertence a você." };
  }

  const serviceSupabase = createServiceClient();

  // 2. Marcar a proposta específica como REJECTED
  const { error } = await serviceSupabase
    .from("proposals")
    .update({ status: "REJECTED" })
    .eq("id", proposalId);

  if (error) {
    console.error("[rejectProposal] erro ao recusar:", error.message);
    return { error: "Erro ao recusar a proposta." };
  }

  revalidatePath("/minha-conta");
  return { success: true };
}
