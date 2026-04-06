import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const newProfessional = searchParams.get("new_professional") === "true";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.redirect(`${origin}/entrar?error=auth_callback_error`);
      }

      const isProfessionalSignup =
        newProfessional || user.user_metadata?.role === "professional";

      if (isProfessionalSignup) {
        // Atualiza role na tabela profiles
        await supabase
          .from("profiles")
          .update({ role: "professional" })
          .eq("id", user.id);

        // Cria professional_profiles se ainda não existe
        const fullName =
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "profissional";
        const slug = `${slugify(fullName)}-${user.id.slice(0, 6)}`;
        const trialEndsAt = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();

        await supabase.from("professional_profiles").upsert(
          {
            user_id: user.id,
            slug,
            status: "PENDING",
            subscription_status: "TRIAL",
            trial_ends_at: trialEndsAt,
          },
          { onConflict: "user_id", ignoreDuplicates: true }
        );

        const destination = next !== "/" ? next : "/painel";
        return NextResponse.redirect(`${origin}${destination}`);
      }

      // Usuário já existente — verifica role para redirecionar corretamente
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const destination =
        profile?.role === "professional" && next === "/" ? "/painel" : next;

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/entrar?error=auth_callback_error`);
}
