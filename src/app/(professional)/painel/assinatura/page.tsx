import { createClient } from "@/lib/supabase/server";
import { SubscriptionClient } from "./subscription-client";

export const metadata = { title: "Assinatura" };

export type SubData = {
  plan: string | null;
  status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
} | null;

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export default async function AssinaturaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  let sub: SubData = null;
  let transactions: Transaction[] = [];

  if (pro?.id) {
    const [{ data: subData }, { data: txData }] = await Promise.all([
      supabase
        .from("professional_subscriptions")
        .select("plan, status, trial_ends_at, current_period_end, stripe_subscription_id")
        .eq("professional_id", pro.id)
        .maybeSingle() as Promise<{ data: SubData }>,
      supabase
        .from("payment_transactions")
        .select("id, amount, currency, status, created_at")
        .eq("professional_id", pro.id)
        .order("created_at", { ascending: false })
        .limit(20) as Promise<{ data: Transaction[] | null }>,
    ]);

    sub = subData;
    transactions = txData ?? [];
  }

  // Fallback para dados do professional_profiles caso não haja row em professional_subscriptions
  const effectiveStatus = sub?.status ?? pro?.subscription_status ?? "TRIAL";
  const effectiveTrialEnd = sub?.trial_ends_at ?? pro?.trial_ends_at ?? null;
  const effectivePeriodEnd = sub?.current_period_end ?? pro?.subscription_paid_until ?? null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
