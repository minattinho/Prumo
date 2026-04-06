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

export async function createProject(data: {
  title: string;
  category: string;
  city_executed: string;
  description: string;
  is_featured: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  if (data.is_featured) {
    const { count } = await supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", proId)
      .eq("is_featured", true);
    if ((count ?? 0) >= 3) {
      return { error: "Máximo de 3 projetos em destaque atingido" };
    }
  }

  const { count: total } = await supabase
    .from("portfolio_projects")
    .select("id", { count: "exact", head: true })
    .eq("professional_id", proId);

  const { data: project, error } = await supabase
    .from("portfolio_projects")
    .insert({
      professional_id: proId,
      title: data.title,
      category: data.category,
      city_executed: data.city_executed || null,
      description: data.description || null,
      is_featured: data.is_featured,
      display_order: total ?? 0,
    })
    .select("id")
    .single();

  if (error) return { error: "Erro ao criar projeto" };
  revalidatePath("/painel/portfolio");
  revalidatePath("/painel");
  return { success: true, projectId: project.id };
}

export async function updateProject(
  id: string,
  data: {
    title: string;
    category: string;
    city_executed: string;
    description: string;
    is_featured: boolean;
  }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  if (data.is_featured) {
    const { count } = await supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", proId)
      .eq("is_featured", true)
      .neq("id", id);
    if ((count ?? 0) >= 3) {
      return { error: "Máximo de 3 projetos em destaque atingido" };
    }
  }

  const { error } = await supabase
    .from("portfolio_projects")
    .update({
      title: data.title,
      category: data.category,
      city_executed: data.city_executed || null,
      description: data.description || null,
      is_featured: data.is_featured,
    })
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao atualizar projeto" };
  revalidatePath("/painel/portfolio");
  return { success: true };
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  const { error } = await supabase
    .from("portfolio_projects")
    .delete()
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao excluir projeto" };
  revalidatePath("/painel/portfolio");
  revalidatePath("/painel");
  return { success: true };
}

export async function toggleFeatured(id: string, value: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  if (value) {
    const { count } = await supabase
      .from("portfolio_projects")
      .select("id", { count: "exact", head: true })
      .eq("professional_id", proId)
      .eq("is_featured", true)
      .neq("id", id);
    if ((count ?? 0) >= 3) {
      return { error: "Máximo de 3 projetos em destaque atingido" };
    }
  }

  const { error } = await supabase
    .from("portfolio_projects")
    .update({ is_featured: value })
    .eq("id", id)
    .eq("professional_id", proId);

  if (error) return { error: "Erro ao atualizar destaque" };
  revalidatePath("/painel/portfolio");
  return { success: true };
}

export async function reorderProjects(items: { id: string; order: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  await Promise.all(
    items.map(({ id, order }) =>
      supabase
        .from("portfolio_projects")
        .update({ display_order: order })
        .eq("id", id)
    )
  );

  revalidatePath("/painel/portfolio");
  return { success: true };
}

export async function addProjectImage(
  projectId: string,
  cloudinary_url: string,
  cloudinary_id: string,
  order: number
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase.from("portfolio_images").insert({
    project_id: projectId,
    cloudinary_url,
    cloudinary_id,
    order_in_project: order,
    status: "APPROVED",
  });

  if (error) return { error: "Erro ao salvar imagem" };
  revalidatePath("/painel/portfolio");
  return { success: true };
}

export async function deleteProjectImage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase.from("portfolio_images").delete().eq("id", id);
  if (error) return { error: "Erro ao remover imagem" };
  revalidatePath("/painel/portfolio");
  return { success: true };
}
