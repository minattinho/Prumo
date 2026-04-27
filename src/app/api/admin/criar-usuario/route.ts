import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  // 1. Verificar que o caller é admin via session cookie
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  // 2. Parsear body
  const body = await request.json();
  const { name, email, password, role, city, state, specialty } = body as {
    name: string;
    email: string;
    password: string;
    role: string;
    city?: string;
    state?: string;
    specialty?: string;
  };

  if (!name || !email || !password || !["professional", "contractor"].includes(role)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  // 3. Criar usuário no Supabase Auth (service role — bypassa RLS e confirmação de e-mail)
  const serviceSupabase = createServiceClient();
  const { data: newUser, error: createError } = await serviceSupabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: name,
      role,
    },
  });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Erro ao criar usuário." },
      { status: 500 }
    );
  }

  const newUserId = newUser.user.id;
  const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

  // 4. Criar perfil subsidiário com base no role
  if (role === "professional") {
    const slug = `${slugify(name)}-${newUserId.slice(0, 6)}`;

    const { data: proProfile, error: proError } = await serviceSupabase
      .from("professional_profiles")
      .insert({
        user_id: newUserId,
        slug,
        city: city ?? null,
        state: state ?? null,
        status: "ACTIVE",
        subscription_status: "ACTIVE",
        trial_ends_at: oneYearFromNow,
        subscription_paid_until: oneYearFromNow,
      })
      .select("id")
      .single();

    if (proError || !proProfile) {
      return NextResponse.json(
        { error: "Usuário criado, mas erro ao criar perfil profissional." },
        { status: 500 }
      );
    }

    // Especialidade (opcional)
    if (specialty) {
      await serviceSupabase.from("professional_specialties").insert({
        professional_id: proProfile.id,
        category: specialty,
      });
    }

    // Assinatura como ADMIN_CREATED (sem MercadoPago)
    await serviceSupabase.from("professional_subscriptions").insert({
      professional_id: proProfile.id,
      plan: "ADMIN_CREATED",
      status: "ACTIVE",
      trial_ends_at: oneYearFromNow,
      current_period_end: oneYearFromNow,
    });

    // Inicializar métricas
    await serviceSupabase.from("professional_metrics").insert({
      professional_id: proProfile.id,
    });
  } else {
    await serviceSupabase.from("contractor_profiles").insert({
      user_id: newUserId,
    });
  }

  return NextResponse.json({ success: true, userId: newUserId });
}
