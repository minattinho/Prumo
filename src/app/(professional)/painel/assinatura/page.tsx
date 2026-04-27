import { redirect } from "next/navigation";
import { PreApproval } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getMercadoPago } from "@/lib/mercadopago/client";
import { SubscriptionClient } from "./subscription-client";

export const metadata = { title: "Assinatura" };

export type SubData = {
  plan: string | null;
  status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  mercadopago_subscription_id: string | null;
} | null;

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

const MP_STATUS_MAP: Record<string, "ACTIVE" | "CANCELLED" | "SUSPENDED"> = {
  authorized: "ACTIVE",
  cancelled: "CANCELLED",
  paused: "SUSPENDED",
};

export default async function AssinaturaPage({
  searchParams,
}: {
  searchParams: Promise<{ preapproval_id?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id, subscription_status, trial_ends_at, subscription_paid_until")
    .eq("user_id", user!.id)
    .single() as {
      data: {
        id: string;
        subscription_status: string | null;
        trial_ends_at: string | null;
        subscription_paid_until: string | null;
      } | null;
    };

  // Sync subscription status when MP redirects back with preapproval_id
  const { preapproval_id } = await searchParams;
  if (preapproval_id && pro?.id) {
    try {
      const mp = getMercadoPago();
      const preapprovalClient = new PreApproval(mp);
      const sub = await preapprovalClient.get({ id: preapproval_id });

      const newStatus = MP_STATUS_MAP[sub.status ?? ""];
      if (newStatus) {
        const periodEnd = sub.next_payment_date
          ? new Date(sub.next_payment_date).toISOString()
          : null;

        const db = createServiceClient();
        await Promise.all([
          db.from("professional_subscriptions").upsert(
            {
              professional_id: pro.id,
              plan: "MVP_79",
              mercadopago_subscription_id: sub.id!,
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
          }).eq("id", pro.id),
        ]);
      }
    } catch {
      // Se a API do MP falhar, apenas renderiza com os dados atuais do DB
    }

    redirect("/painel/assinatura");
  }

  let sub: SubData = null;
  let transactions: Transaction[] = [];

  if (pro?.id) {
    const [subResult, txResult] = await Promise.all([
      supabase
        .from("professional_subscriptions")
        .select("plan, status, trial_ends_at, current_period_end, mercadopago_subscription_id")
        .eq("professional_id", pro.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("payment_transactions")
        .select("id, amount, currency, status, created_at")
        .eq("professional_id", pro.id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    sub = subResult.data as SubData;
    transactions = (txResult.data as Transaction[] | null) ?? [];
  }

  const effectiveStatus = sub?.status ?? pro?.subscription_status ?? "TRIAL";
  const effectiveTrialEnd = sub?.trial_ends_at ?? pro?.trial_ends_at ?? null;
  const effectivePeriodEnd = sub?.current_period_end ?? pro?.subscription_paid_until ?? null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Assinatura</h1>
        <p className="text-sm text-cinza-texto mt-0.5">Gerencie seu plano e histórico de pagamentos.</p>
      </div>
      <SubscriptionClient
        status={effectiveStatus}
        trialEndsAt={effectiveTrialEnd}
        periodEnd={effectivePeriodEnd}
        transactions={transactions}
      />
    </div>
  );
}
