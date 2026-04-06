"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function declineRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!pro) return { error: "Perfil não encontrado" };

  const { error } = await supabase
    .from("budget_requests")
    .update({ status: "REFUSED" })
    .eq("id", requestId)
    .eq("professional_id", pro.id);

  if (error) return { error: "Erro ao recusar solicitação" };
  revalidatePath("/painel/solicitacoes");
  return { success: true };
}
