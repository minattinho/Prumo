import { createClient } from "@/lib/supabase/server";
import { RequestsClient } from "./requests-client";

export const metadata = {
  title: "Solicitações de Orçamento",
};

export default async function PainelSolicitacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  let requests: any[] = [];

  if (pro?.id) {
    const { data: requestsData } = await supabase
      .from("budget_requests")
      .select("id, message, status, created_at, contractor_id")
      .eq("professional_id", pro.id)
      .order("created_at", { ascending: false }) as { data: any[] | null };

    if (requestsData && requestsData.length > 0) {
      const contractorIds = [...new Set(requestsData.map((r: any) => r.contractor_id))];

      // Fetch contractor profiles → profiles
      const { data: contractorProfiles } = await supabase
        .from("contractor_profiles")
        .select("id, user_id")
        .in("id", contractorIds) as { data: any[] | null };

      const userIds = (contractorProfiles ?? []).map((cp: any) => cp.user_id);

      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds) as { data: any[] | null };

        const contractorToUser = Object.fromEntries(
          (contractorProfiles ?? []).map((cp: any) => [cp.id, cp.user_id])
        );
        const userToProfile = Object.fromEntries(
          (profilesData ?? []).map((p: any) => [p.id, p])
        );

        profilesMap = Object.fromEntries(
          (contractorProfiles ?? []).map((cp: any) => [
            cp.id,
            userToProfile[contractorToUser[cp.id]] ?? null,
          ])
        );
      }

      requests = requestsData.map((r: any) => ({
        ...r,
        contractor: profilesMap[r.contractor_id] ?? null,
      }));
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Solicitações de Orçamento</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Responda as solicitações enviando propostas detalhadas.
        </p>
      </div>
      <RequestsClient initialRequests={requests} />
    </div>
  );
}
