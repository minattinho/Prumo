import { getResend, FROM_EMAIL } from "@/lib/resend/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();

  const resend = getResend();
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ data });
}
