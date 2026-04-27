import { PreApprovalPlan } from "mercadopago";
import { getMercadoPago } from "./client";

// One-time helper to create the Prumo Pro subscription plan in Mercado Pago.
// Run once via: POST /api/mercadopago/setup-plan (admin-only endpoint)
// Store the returned ID as MP_PLAN_ID in your env vars.
export async function createPrumoProPlan(backUrl: string) {
  const mp = getMercadoPago();
  const planClient = new PreApprovalPlan(mp);

  const result = await planClient.create({
    body: {
      reason: "Prumo Pro",
      auto_recurring: {
        frequency: 1,
        frequency_type: "months",
        transaction_amount: 79,
        currency_id: "BRL",
      },
      payment_methods_allowed: {
        payment_types: [
          { id: "credit_card" },
          { id: "account_money" },
          { id: "debit_card" },
        ],
      },
      back_url: backUrl,
    },
  });

  return { id: result.id, init_point: result.init_point };
}
