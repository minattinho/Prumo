"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getProfessionalId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();
  return data?.id ?? null;
}

export async function createService(data: {
  client_name: string;
  service_type: string;
  value: number;
  execution_date: string;
  status: string;
  origin: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  const { error } = await supabase.from("completed_services").insert({
    professional_id: proId,
    client_name: data.client_name,
    service_type: data.service_type,
    value: data.value,
    execution_date: data.execution_date,
    status: data.status as any,
    origin: data.origin as any,
  });

  if (error) return { error: "Erro ao registrar serviço" };
  revalidatePath("/painel/servicos");
  return { success: true };
}

export async function updateService(
  id: string,
  data: {
    client_name: string;
    service_type: string;
    value: number;
    execution_date: string;
    status: string;
    origin: string;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  const { error } = await supabase
    .from("completed_services")
    .update({
      client_name: data.client_name,
      service_type: data.service_type,
      value: data.value,
      execution_date: data.execution_date,
      status: data.status as any,
      origin: data.origin as any,
    })
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao atualizar serviço" };
  revalidatePath("/painel/servicos");
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  const { error } = await supabase
    .from("completed_services")
    .delete()
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao excluir serviço" };
  revalidatePath("/painel/servicos");
  return { success: true };
}
