import { NextResponse } from "next/server";
import { PreApproval, Payment } from "mercadopago";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { createServiceClient } from "@/lib/supabase/server";

const MP_STATUS_MAP: Record<string, "ACTIVE" | "CANCELLED" | "SUSPENDED"> = {
  authorized: "ACTIVE",
  cancelled: "CANCELLED",
  paused: "SUSPENDED",
};

const PAYMENT_STATUS_MAP: Record<string, "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"> = {
  approved: "COMPLETED",
  pending: "PENDING",
  in_process: "PENDING",
  rejected: "FAILED",
  cancelled: "FAILED",
  refunded: "REFUNDED",
  charged_back: "REFUNDED",
};

async function findProfessionalByEmail(db: any, email: string): Promise<string | null> {
  const { data: profile, error } = await db
    .from("profiles")
    .select(`
      id,
      professional_profiles (
        id
      )
    `)
    .eq("email", email)
    .maybeSingle();

  if (error || !profile) return null;

  const profs = profile.professional_profiles;
  if (!profs) return null;

  if (Array.isArray(profs)) {
    return profs[0]?.id || null;
  }
  return profs.id || null;
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    // Validação de segurança via query parameter token comparado à env MP_WEBHOOK_SECRET
    const webhookSecret = process.env.MP_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Webhook Mercado Pago] MP_WEBHOOK_SECRET não está configurado nas variáveis de ambiente.");
      return NextResponse.json({ error: "Configuração do servidor pendente" }, { status: 500 });
    }

    if (!token || token !== webhookSecret) {
      console.warn(`[Webhook Mercado Pago] Tentativa de acesso não autorizada com token: ${token}`);
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    console.log("[Webhook Mercado Pago] Payload recebido:", JSON.stringify(body));

    // Identifica o ID do recurso e o tipo de evento (suporta Notification V2 e formato antigo)
    const resourceId = body.data?.id || searchParams.get("id");
    const type = body.type || searchParams.get("topic");

    if (!resourceId || !type) {
      console.warn("[Webhook Mercado Pago] Evento inválido ou sem dados suficientes:", { resourceId, type });
      return NextResponse.json({ error: "Dados ausentes" }, { status: 400 });
    }

    const mp = getMercadoPago();
    const db = createServiceClient();

    // 1. Trata evento de Assinatura ('preapproval')
    if (type === "preapproval" || type === "subscription") {
      console.log(`[Webhook Mercado Pago] Processando assinatura: ${resourceId}`);
      const preapprovalClient = new PreApproval(mp);
      const sub: any = await preapprovalClient.get({ id: resourceId.toString() });

      const newStatus = MP_STATUS_MAP[sub.status ?? ""] ?? "TRIAL";
      let professionalId: string | null = null;

      // Localização do profissional pelo ID da assinatura no banco
      const { data: existingSub } = await db
        .from("professional_subscriptions")
        .select("professional_id")
        .eq("mercadopago_subscription_id", sub.id)
        .maybeSingle();

      if (existingSub) {
        professionalId = existingSub.professional_id;
      } else if (sub.payer_email) {
        // Fallback de localização do profissional pelo e-mail do pagador
        console.log(`[Webhook Mercado Pago] Assinatura não associada no DB. Buscando por e-mail do pagador: ${sub.payer_email}`);
        professionalId = await findProfessionalByEmail(db, sub.payer_email);
      }

      if (!professionalId) {
        console.warn(`[Webhook Mercado Pago] Profissional não localizado para a assinatura ${sub.id} (E-mail: ${sub.payer_email})`);
        return NextResponse.json({ warning: "Profissional não localizado" }, { status: 200 });
      }

      const periodEnd = sub.next_payment_date
        ? new Date(sub.next_payment_date).toISOString()
        : null;

      // Sincroniza status nas tabelas professional_profiles e professional_subscriptions
      await Promise.all([
        db.from("professional_subscriptions").upsert(
          {
            professional_id: professionalId,
            plan: "MVP_79",
            mercadopago_subscription_id: sub.id!,
            mercadopago_plan_id: sub.preapproval_plan_id || null,
            status: newStatus,
            ...(periodEnd ? { current_period_end: periodEnd } : {}),
            ...(newStatus === "CANCELLED" ? { cancelled_at: new Date().toISOString() } : {}),
          },
          { onConflict: "mercadopago_subscription_id" }
        ),
        db.from("professional_profiles").update({
          subscription_status: newStatus,
          ...(newStatus === "ACTIVE" && periodEnd ? { subscription_paid_until: periodEnd } : {}),
          ...(sub.payer_id ? { mercadopago_customer_id: sub.payer_id.toString() } : {}),
        }).eq("id", professionalId),
      ]);

      console.log(`[Webhook Mercado Pago] Assinatura ${sub.id} sincronizada com sucesso para o profissional ${professionalId}`);
      return NextResponse.json({ success: true, message: "Assinatura sincronizada" });
    }

    // 2. Trata evento de Pagamento ('payment')
    if (type === "payment") {
      console.log(`[Webhook Mercado Pago] Processando pagamento: ${resourceId}`);
      const paymentClient = new Payment(mp);
      const payment: any = await paymentClient.get({ id: Number(resourceId) });

      const txStatus = PAYMENT_STATUS_MAP[payment.status ?? ""] ?? "PENDING";
      let professionalId: string | null = payment.metadata?.professional_id || null;

      if (!professionalId && payment.payer?.email) {
        // Fallback de localização do profissional pelo e-mail do pagador
        console.log(`[Webhook Mercado Pago] Pagamento sem professional_id na metadata. Buscando por e-mail do pagador: ${payment.payer.email}`);
        professionalId = await findProfessionalByEmail(db, payment.payer.email);
      }

      if (!professionalId) {
        console.warn(`[Webhook Mercado Pago] Profissional não localizado para o pagamento ${payment.id} (E-mail: ${payment.payer?.email})`);
        return NextResponse.json({ warning: "Profissional não localizado" }, { status: 200 });
      }

      const amount = payment.transaction_amount ?? 0;
      const currency = payment.currency_id ?? "BRL";
      const paymentIdStr = payment.id!.toString();

      // Evita duplicidade no banco usando mercadopago_payment_id
      const { data: existingTx } = await db
        .from("payment_transactions")
        .select("id")
        .eq("mercadopago_payment_id", paymentIdStr)
        .maybeSingle();

      if (existingTx) {
        await db
          .from("payment_transactions")
          .update({ status: txStatus })
          .eq("id", existingTx.id);
        console.log(`[Webhook Mercado Pago] Transação existente ${paymentIdStr} atualizada para ${txStatus}`);
      } else {
        await db.from("payment_transactions").insert({
          professional_id: professionalId,
          amount: amount,
          currency: currency,
          status: txStatus,
          mercadopago_payment_id: paymentIdStr,
        });
        console.log(`[Webhook Mercado Pago] Nova transação ${paymentIdStr} inserida como ${txStatus}`);
      }

      // Se o pagamento recorrente/avulso foi completado com sucesso, sincroniza/ativa o profissional
      if (txStatus === "COMPLETED") {
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        const nextMonthISO = nextMonth.toISOString();

        await Promise.all([
          db.from("professional_profiles")
            .update({
              subscription_status: "ACTIVE",
              subscription_paid_until: nextMonthISO,
            })
            .eq("id", professionalId),
          
          db.from("professional_subscriptions")
            .update({
              status: "ACTIVE",
              current_period_end: nextMonthISO,
            })
            .eq("professional_id", professionalId)
        ]);
        console.log(`[Webhook Mercado Pago] Profissional ${professionalId} e assinatura ativados devido a pagamento COMPLETED`);
      }

      return NextResponse.json({ success: true, message: "Pagamento processado" });
    }

    // Caso receba algum evento não mapeado
    console.log(`[Webhook Mercado Pago] Evento do tipo '${type}' ignorado.`);
    return NextResponse.json({ success: true, message: "Evento ignorado" });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
    console.error("[Webhook Mercado Pago] Erro crítico no processamento:", err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
