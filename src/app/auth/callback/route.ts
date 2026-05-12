import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { NextResponse } from "next/server";

function getAuthRoute(authSource: string | null, next: string) {
  if (
    authSource === "professional" ||
    next.startsWith("/painel") ||
    next.startsWith("/admin")
  ) {
    return "/profissional";
  }

  return "/contratante";
}

function redirectToAuthError(origin: string, authRoute: string, next: string) {
  const url = new URL(authRoute, origin);
  url.searchParams.set("error", "auth_callback_error");
  if (next !== "/") {
    url.searchParams.set("next", next);
  }
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const authSource = searchParams.get("auth");
  const authRoute = getAuthRoute(authSource, next);
  const newProfessional = searchParams.get("new_professional") === "true";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirectToAuthError(origin, authRoute, next);
      }

      const isProfessionalSignup =
        newProfessional || user.user_metadata?.role === "professional";

      if (isProfessionalSignup) {
        const {
          full_name,
          name,
          phone,
          city,
          state,
          whatsapp,
          specialty,
          person_type,
          cpf,
          birth_date,
          cnpj,
        } = user.user_metadata ?? {};

        const fullName = full_name ?? name ?? "profissional";

        // 1. Atualiza role + phone na tabela profiles
        await supabase
          .from("profiles")
          .update({ role: "professional", phone: phone ?? null })
          .eq("id", user.id);

        // 2. Cria professional_profiles com todos os dados do cadastro
        const slug = `${slugify(fullName)}-${user.id.slice(0, 6)}`;
        const trialEndsAt = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();

        const { data: proProfile } = await supabase
          .from("professional_profiles")
          .upsert(
            {
              user_id: user.id,
              slug,
              city: city ?? null,
              state: state ?? null,
              cpf: cpf ?? null,
              cnpj: cnpj ?? null,
              birth_date: birth_date ?? null,
              status: "PENDING",
              subscription_status: "TRIAL",
              trial_ends_at: trialEndsAt,
            },
            { onConflict: "user_id", ignoreDuplicates: true }
          )
          .select("id")
          .single();

        // 3. Canal WhatsApp principal
        if (whatsapp && proProfile?.id) {
          await supabase.from("professional_contact_channels").upsert(
            {
              professional_id: proProfile.id,
              type: "WHATSAPP",
              value: whatsapp,
              is_primary: true,
              link_formatted: whatsapp,
            },
            { onConflict: "professional_id,type", ignoreDuplicates: true }
          );
        }

        // 4. Especialidade principal
        if (specialty && proProfile?.id) {
          await supabase.from("professional_specialties").upsert(
            { professional_id: proProfile.id, category: specialty },
            { onConflict: "professional_id,category", ignoreDuplicates: true }
          );
        }

        const destination = next !== "/" ? next : "/painel";
        return NextResponse.redirect(`${origin}${destination}`);
      }

      // Admin não tem perfil subsidiário — redirecionar diretamente
      const { data: roleCheck } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleCheck?.role === "admin") {
        return NextResponse.redirect(`${origin}/admin`);
      }

      // Contratante novo — salva phone e cria contractor_profiles
      const { phone } = user.user_metadata ?? {};

      if (phone) {
        await supabase
          .from("profiles")
          .update({ phone })
          .eq("id", user.id);
      }

      await supabase
        .from("contractor_profiles")
        .upsert(
          { user_id: user.id },
          { onConflict: "user_id", ignoreDuplicates: true }
        );

      // Verifica role para redirecionar corretamente
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const destination =
        profile?.role === "admin"
          ? "/admin"
          : profile?.role === "professional" && next === "/"
          ? "/painel"
          : next;

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return redirectToAuthError(origin, authRoute, next);
}
