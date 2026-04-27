import { NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { createPrumoProPlan } from "@/lib/mercadopago/plan";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "professional") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://prumo.com.br";

  // PreApproval com preapproval_plan_id retorna init_point (redirect URL).
  // Inline auto_recurring sem plan_id exige card_token_id do frontend — não usar.
  let planId = process.env.MP_PLAN_ID;
  if (!planId) {
    const { id } = await createPrumoProPlan(`${origin}/painel/assinatura`);
    planId = id!;
  }

  const mp = getMercadoPago();
  const preapproval = new PreApproval(mp);

  try {
    const result = await preapproval.create({
      body: {
        preapproval_plan_id: planId,
        payer_email: profile.email ?? user.email!,
        back_url: `${origin}/painel/assinatura`,
        status: "pending" as const,
      },
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao criar assinatura";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
