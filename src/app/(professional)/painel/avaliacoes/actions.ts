"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getProfessionalId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();
  return data?.id ?? null;
}

export async function respondToEvaluation(
  evaluationId: string,
  responseText: string
): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  // Garante que a avaliação pertence a este profissional
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id")
    .eq("id", evaluationId)
    .eq("professional_id", proId)
    .single();

  if (!evaluation) return { error: "Avaliação não encontrada" };

  const { error } = await supabase
    .from("evaluation_responses")
    .upsert(
      {
        evaluation_id: evaluationId,
        professional_id: proId,
        response_text: responseText.trim(),
      },
      { onConflict: "evaluation_id" }
    );

  if (error) return { error: "Erro ao salvar resposta" };

  revalidatePath("/painel/avaliacoes");
  return { success: true };
}
