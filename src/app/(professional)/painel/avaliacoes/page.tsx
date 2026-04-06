import { createClient } from "@/lib/supabase/server";
import { EvaluationsClient } from "./evaluations-client";

export const metadata = { title: "Avaliações Recebidas" };

export type Evaluation = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  contractor_name: string;
  response_text: string | null;
};

export default async function AvaliacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  let evaluations: Evaluation[] = [];

  if (pro?.id) {
    const { data: rawEvals } = await supabase
      .from("evaluations")
      .select("id, rating, comment, created_at, contractor_id, evaluation_responses(response_text)")
      .eq("professional_id", pro.id)
      .order("created_at", { ascending: false }) as {
        data: {
          id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          contractor_id: string;
          evaluation_responses: { response_text: string }[];
        }[] | null;
      };

    const evals = rawEvals ?? [];

    // Batch-fetch nomes dos contratantes
    const contractorIds = [...new Set(evals.map((e) => e.contractor_id).filter(Boolean))];
    const contractorNames: Record<string, string> = {};

    if (contractorIds.length > 0) {
      const { data: contractors } = await supabase
        .from("contractor_profiles")
        .select("id, user_id")
        .in("id", contractorIds) as { data: { id: string; user_id: string }[] | null };

      if (contractors) {
        const userIds = contractors.map((c) => c.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds) as { data: { id: string; full_name: string | null }[] | null };

        const profileMap: Record<string, string> = {};
        for (const p of profiles ?? []) {
          profileMap[p.id] = p.full_name ?? "Contratante";
        }
        for (const c of contractors) {
          contractorNames[c.id] = profileMap[c.user_id] ?? "Contratante";
        }
      }
    }

    evaluations = evals.map((e) => ({
      id: e.id,
      rating: e.rating,
      comment: e.comment,
      created_at: e.created_at,
      contractor_name: contractorNames[e.contractor_id] ?? "Contratante",
      response_text: e.evaluation_responses?.[0]?.response_text ?? null,
    }));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Avaliações recebidas</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Veja o que seus clientes dizem e responda publicamente.
        </p>
      </div>
      <EvaluationsClient evaluations={evaluations} />
    </div>
  );
}
