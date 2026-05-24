import { NextResponse } from "next/server";

// Endpoint removido — e-mails são enviados server-side via Server Actions e webhooks.
// Manter o arquivo evita 404 inesperado em deploys antigos, mas a rota não opera.
export async function POST() {
  return NextResponse.json({ error: "Gone" }, { status: 410 });
}
