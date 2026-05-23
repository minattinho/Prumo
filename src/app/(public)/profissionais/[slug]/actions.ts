"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBudgetRequest(data: {
  professional_id: string;
  message: string;
}): Promise<{ success?: boolean; error?: string }> {
  if (!data.message.trim()) {
    return { error: "A mensagem do orçamento não pode estar vazia." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Você precisa estar autenticado para solicitar um orçamento." };
  }

  // 1. Verificar se o usuário logado possui a role 'contractor'
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "contractor") {
    return { error: "Apenas contratantes podem solicitar orçamentos por esta via." };
  }

  // 2. Inserir a nova solicitação em budget_requests
  const { error } = await supabase.from("budget_requests").insert({
    contractor_id: user.id,
    professional_id: data.professional_id,
    message: data.message.trim(),
    status: "NEW",
  });

  if (error) {
    console.error("[createBudgetRequest] erro ao salvar orçamento:", error.message);
    return { error: "Erro ao enviar a solicitação. Tente novamente." };
  }

  // Revalidar caminhos
  revalidatePath("/minha-conta", "page");
  revalidatePath("/painel/solicitacoes", "page");

  return { success: true };
}
