"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeOnboarding() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("professional_profiles")
    .update({ onboarding_completed_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    console.error("[completeOnboarding] erro ao salvar:", error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.error("[completeOnboarding] nenhuma linha atualizada — professional_profiles não existe para user_id:", user.id);
    return;
  }

  revalidatePath("/painel", "layout");
  revalidatePath("/painel/perfil", "layout");
}
