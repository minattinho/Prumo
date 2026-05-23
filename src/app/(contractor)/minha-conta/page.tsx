import { createClient } from "@/lib/supabase/server";
import { MinhaContaClient } from "./minha-conta-client";

export const metadata = {
  title: "Minha Conta",
};

export default async function MinhaContaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: contractorProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("name, email, phone")
      .eq("id", user!.id)
      .single(),
    supabase
      .from("contractor_profiles")
      .select("id")
      .eq("user_id", user!.id)
      .single(),
  ]);

  let contacts: any[] = [];
  let evaluations: any[] = [];

  if (contractorProfile?.id) {
    const [{ data: contactLogs }, { data: evalData }] = await Promise.all([
      supabase
        .from("contact_logs")
        .select("id, professional_id, contact_type, created_at")
        .eq("contractor_id", contractorProfile.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("evaluations")
        .select("id, rating, comment, created_at, professional_id")
        .eq("contractor_id", contractorProfile.id)
        .order("created_at", { ascending: false }),
    ]);

    // Deduplicate contacts by professional_id (keep most recent)
    const uniqueContactsMap = new Map<string, any>();
    for (const c of contactLogs ?? []) {
      if (!uniqueContactsMap.has(c.professional_id)) {
        uniqueContactsMap.set(c.professional_id, c);
      }
    }
    const uniqueContacts = Array.from(uniqueContactsMap.values());

    // Fetch professional details for all unique professionals
    const allProIds = [
      ...new Set([
        ...uniqueContacts.map((c) => c.professional_id),
        ...(evalData ?? []).map((e) => e.professional_id),
      ]),
    ];

    let prosMap: Record<string, any> = {};
    if (allProIds.length > 0) {
      const { data: prosData } = await supabase
        .from("professional_profiles")
        .select(
          "id, slug, city, photo_url, profiles(full_name:name), professional_specialties(category)"
        )
        .in("id", allProIds);

      prosMap = Object.fromEntries((prosData ?? []).map((p: any) => [p.id, p]));
    }

    contacts = uniqueContacts.map((c) => ({
      ...c,
      professional: prosMap[c.professional_id] ?? null,
    }));

    evaluations = (evalData ?? []).map((e) => ({
      ...e,
      professional: prosMap[e.professional_id] ?? null,
    }));
  }

  const evaluatedProIds = new Set(evaluations.map((e: any) => e.professional_id));
  const pendingContacts = contacts.filter((c: any) => !evaluatedProIds.has(c.professional_id));

  // Buscar solicitações de orçamento enviadas por este contratante e propostas recebidas
  const { data: brData } = await supabase
    .from("budget_requests")
    .select(`
      id,
      message,
      status,
      created_at,
      professional_profiles (
        id,
        slug,
        city,
        photo_url,
        profiles (
          name
        ),
        professional_specialties (
          category
        )
      ),
      proposals (
        id,
        total_value,
        deadline_days,
        payment_stages,
        approach_description,
        status,
        created_at
      )
    `)
    .eq("contractor_id", user!.id)
    .order("created_at", { ascending: false });

  const budgetRequests = (brData ?? []).map((br: any) => ({
    id: br.id,
    message: br.message,
    status: br.status,
    created_at: br.created_at,
    professional: br.professional_profiles
      ? {
          id: br.professional_profiles.id,
          slug: br.professional_profiles.slug,
          city: br.professional_profiles.city,
          photo_url: br.professional_profiles.photo_url,
          profiles: {
            full_name: br.professional_profiles.profiles?.name ?? null,
          },
          professional_specialties: br.professional_profiles.professional_specialties ?? [],
        }
      : null,
    proposals: br.proposals ?? [],
  }));

  return (
    <MinhaContaClient
      profile={{
        full_name: (profile as any)?.name ?? null,
        email: profile?.email ?? user?.email ?? null,
        phone: profile?.phone ?? null,
      }}
      contractorId={contractorProfile?.id ?? null}
      contacts={contacts}
      evaluations={evaluations}
      pendingContacts={pendingContacts}
      budgetRequests={budgetRequests}
    />
  );
}
