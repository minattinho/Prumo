import { NextResponse } from "next/server";
import { createPrumoProPlan } from "@/lib/mercadopago/plan";

// One-time endpoint to create the Mercado Pago subscription plan.
// Protect it with a secret to avoid accidental re-creation.
// Usage: POST /api/mercadopago/setup-plan
//   Header: x-setup-secret: <SETUP_SECRET env var>
// After running, set MP_PLAN_ID=<returned id> in your environment.
export async function POST(request: Request) {
  const secret = request.headers.get("x-setup-secret");
  if (!secret || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://prumo.com.br";
  const plan = await createPrumoProPlan(`${origin}/painel/assinatura`);

  return NextResponse.json({ id: plan.id, init_point: plan.init_point });
}
