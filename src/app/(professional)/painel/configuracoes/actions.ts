"use server";

import { createClient } from "@/lib/supabase/server";
import {
  buildPasswordResetRedirectUrl,
  getDefaultAuthOrigin,
} from "@/lib/auth/password-reset";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function updateAccountSettings(data: {
  full_name: string;
  phone: string;
}): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("profiles")
    .update({ name: data.full_name, phone: data.phone })
    .eq("id", user.id);

  if (error) return { error: "Erro ao salvar configurações" };
  revalidatePath("/painel/configuracoes");
  return { success: true };
}

export async function sendPasswordReset(): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Não autenticado" };

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? getDefaultAuthOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: buildPasswordResetRedirectUrl(origin),
  });

  if (error) return { error: "Erro ao enviar e-mail" };
  return { success: true };
}
