import { createClient } from "@/lib/supabase/server";
import { Eye, Phone } from "lucide-react";

export const metadata = { title: "Acessos ao Perfil" };

function formatDate(iso: string): { relative: string; full: string } {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffH = Math.floor(diffMs / 3_600_000);
  const diffD = Math.floor(diffMs / 86_400_000);

  let relative: string;
  if (diffMin < 1) relative = "agora mesmo";
  else if (diffMin < 60) relative = `há ${diffMin} min`;
  else if (diffH < 24) relative = `há ${diffH}h`;
  else if (diffD === 1) relative = "ontem";
  else if (diffD < 7) relative = `há ${diffD} dias`;
  else relative = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  const full = date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return { relative, full };
}

type ActivityLog = {
  id: string;
  event_type: "PROFILE_VIEWED" | "CONTACT_VIEWED";
  created_at: string;
  contractor_name: string;
};

export default async function AcessosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  let logs: ActivityLog[] = [];

  if (pro?.id) {
    const { data: rawLogs } = await supabase
      .from("profile_activity_logs")
      .select("id, event_type, created_at, contractor_id")
      .eq("professional_id", pro.id)
      .order("created_at", { ascending: false })
      .limit(100) as {
        data: {
          id: string;
          event_type: "PROFILE_VIEWED" | "CONTACT_VIEWED";
          created_at: string;
          contractor_id: string;
        }[] | null;
      };

    const entries = rawLogs ?? [];

    // Batch-fetch nomes dos contratantes via profiles (contractor_id = auth.users.id)
    const contractorIds = [...new Set(entries.map((e) => e.contractor_id))];
    const nameMap: Record<string, string> = {};

    if (contractorIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", contractorIds) as { data: { id: string; full_name: string | null }[] | null };

      for (const p of profiles ?? []) {
        nameMap[p.id] = p.full_name ?? "Contratante";
      }
    }

    logs = entries.map((e) => ({
      id: e.id,
      event_type: e.event_type,
      created_at: e.created_at,
      contractor_name: nameMap[e.contractor_id] ?? "Contratante",
    }));
  }

  const profileViews = logs.filter((l) => l.event_type === "PROFILE_VIEWED").length;
  const contactViews = logs.filter((l) => l.event_type === "CONTACT_VIEWED").length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Acessos ao perfil</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Veja quem visitou seu perfil e quem consultou seus dados de contato.
        </p>
      </div>

      {/* Métricas resumidas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-azul-principal" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cinza-texto">Visitas</span>
          </div>
          <p className="text-2xl font-bold text-azul-noite">{profileViews}</p>
          <p className="text-xs text-cinza-texto">nos últimos 100 registros</p>
        </div>
        <div className="bg-white rounded-card shadow-card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Phone size={16} className="text-verde-acento" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cinza-texto">Contatos</span>
          </div>
          <p className="text-2xl font-bold text-azul-noite">{contactViews}</p>
          <p className="text-xs text-cinza-texto">nos últimos 100 registros</p>
        </div>
      </div>

      {/* Feed de atividade */}
      <div className="bg-white rounded-card shadow-card">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-azul-claro flex items-center justify-center mb-3">
              <Eye size={22} className="text-azul-principal" />
            </div>
            <p className="text-sm font-medium text-azul-noite mb-1">Nenhum acesso registrado ainda</p>
            <p className="text-sm text-cinza-texto leading-relaxed max-w-xs">
              Quando contratantes visitarem seu perfil, os registros aparecerão aqui.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {logs.map((log) => {
              const { relative, full } = formatDate(log.created_at);
              const isProfile = log.event_type === "PROFILE_VIEWED";
              return (
                <li key={log.id} className="flex items-center gap-4 px-5 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isProfile ? "bg-azul-claro" : "bg-green-50"
                  }`}>
                    {isProfile
                      ? <Eye size={15} className="text-azul-principal" />
                      : <Phone size={15} className="text-verde-acento" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-azul-noite">
                      <span className="font-medium">{log.contractor_name}</span>
                      {isProfile
                        ? " visitou seu perfil"
                        : " visualizou seus dados de contato"}
                    </p>
                  </div>
                  <time
                    dateTime={log.created_at}
                    title={full}
                    className="text-xs text-cinza-texto whitespace-nowrap shrink-0"
                  >
                    {relative}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
