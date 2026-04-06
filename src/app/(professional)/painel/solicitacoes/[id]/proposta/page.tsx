import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ProposalForm } from "./proposal-form";

export const metadata = {
  title: "Enviar Proposta",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EnviarPropostaPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  if (!pro) redirect("/painel");

  const { data: requestData } = await supabase
    .from("budget_requests")
    .select("id, message, status, created_at, contractor_id")
    .eq("id", id)
    .eq("professional_id", pro.id)
    .single() as { data: any | null };

  if (!requestData) notFound();

  // Check if already replied
  if (requestData.status === "REFUSED") {
    redirect("/painel/solicitacoes");
  }

  // Get contractor name
  let contractorName: string | null = null;
  if (requestData.contractor_id) {
    const { data: cp } = await supabase
      .from("contractor_profiles")
      .select("user_id")
      .eq("id", requestData.contractor_id)
      .single() as { data: { user_id: string } | null };

    if (cp?.user_id) {
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", cp.user_id)
        .single() as { data: { full_name: string | null } | null };
      contractorName = p?.full_name ?? null;
    }
  }

  return (
    <ProposalForm
      request={{
        id: requestData.id,
        message: requestData.message,
        status: requestData.status,
        created_at: requestData.created_at,
        contractor: { full_name: contractorName },
      }}
    />
  );
}
