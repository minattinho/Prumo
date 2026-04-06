"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitProposal(data: {
  budget_request_id: string;
  total_value: number;
  deadline_days: number;
  payment_stages: number;
  approach_description: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!pro) return { error: "Perfil não encontrado" };

  const { error: proposalError } = await supabase.from("proposals").insert({
    budget_request_id: data.budget_request_id,
    professional_id: pro.id,
    total_value: data.total_value,
    deadline_days: data.deadline_days,
    payment_stages: data.payment_stages,
    approach_description: data.approach_description,
  });

  if (proposalError) return { error: "Erro ao enviar proposta" };

  await supabase
    .from("budget_requests")
    .update({ status: "REPLIED" })
    .eq("id", data.budget_request_id)
    .eq("professional_id", pro.id);

  revalidatePath("/painel/solicitacoes");
  redirect("/painel/solicitacoes");
}
