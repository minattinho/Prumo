import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: ativar assinatura do profissional
      break;
    case "invoice.payment_succeeded":
      // TODO: renovar assinatura
      break;
    case "invoice.payment_failed":
      // TODO: suspender perfil após 5 dias
      break;
    case "customer.subscription.deleted":
      // TODO: cancelar assinatura
      break;
  }

  return NextResponse.json({ received: true });
}
