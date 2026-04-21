import { createClient } from "@/lib/supabase/server";
import { ServicesClient } from "./services-client";

export const metadata = {
  title: "Meus Serviços",
};

export default async function PainelServicosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  let services: any[] = [];

  if (pro?.id) {
    const { data } = await supabase
      .from("completed_services")
      .select("id, client_name, service_type, value, execution_date, status, origin")
      .eq("professional_id", pro.id)
      .order("execution_date", { ascending: false }) as { data: any[] | null };

    services = data ?? [];
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Meus Serviços</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Registre seus serviços concluídos para acompanhar seu histórico e receita.
        </p>
      </div>
      <ServicesClient initialServices={services} />
    </div>
  );
}
