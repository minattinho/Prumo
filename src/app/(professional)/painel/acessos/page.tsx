import { createClient } from "@/lib/supabase/server";
import { Eye, Phone, Users, TrendingUp } from "lucide-react";

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

function getDayLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffD = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffD === 0) return "Hoje";
  if (diffD === 1) return "Ontem";
  return date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });
}

type ActivityLog = {
  id: string;
  event_type: "PROFILE_VIEWED" | "CONTACT_VIEWED";
  created_at: string;
  contractor_name: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
  const uniqueVisitors = new Set(logs.map((l) => l.contractor_name)).size;
  const conversionRate = profileViews > 0
    ? Math.round((contactViews / profileViews) * 100)
    : 0;

  // Group logs by day label
  const grouped: { day: string; logs: ActivityLog[] }[] = [];
  for (const log of logs) {
    const day = getDayLabel(log.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) {
      last.logs.push(log);
    } else {
      grouped.push({ day, logs: [log] });
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-medium text-cinza-texto uppercase tracking-widest mb-1">Monitoramento</p>
        <h1 className="text-2xl font-bold text-azul-noite">Acessos ao perfil</h1>
        <p className="text-sm text-cinza-texto mt-1">
          Veja quem visitou seu perfil e consultou seus dados de contato.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Eye,       value: profileViews,    label: "Visitas ao perfil",    color: "text-azul-principal", bg: "bg-azul-claro"  },
          { icon: Phone,     value: contactViews,    label: "Contatos visualizados", color: "text-green-600",      bg: "bg-green-50"    },
          { icon: Users,     value: uniqueVisitors,  label: "Visitantes únicos",     color: "text-azul-medio",     bg: "bg-blue-50"     },
          { icon: TrendingUp,value: `${conversionRate}%`, label: "Taxa de contato", color: "text-laranja-obra",   bg: "bg-orange-50"   },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className="bg-white rounded-card shadow-card p-4 flex flex-col gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-azul-noite leading-none">{value}</p>
            <p className="text-xs text-cinza-texto">{label}</p>
          </div>
        ))}
      </div>

      {/* Feed de atividade */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-azul-noite">Atividade recente</h2>
          <span className="text-xs text-cinza-texto">Últimos 100 registros</span>
        </div>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-14 h-14 rounded-full bg-azul-claro flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-azul-principal" />
            </div>
            <p className="text-sm font-semibold text-azul-noite mb-1">Nenhum acesso registrado ainda</p>
            <p className="text-sm text-cinza-texto leading-relaxed max-w-xs">
              Quando contratantes visitarem seu perfil, os registros aparecerão aqui.
            </p>
          </div>
        ) : (
          <div>
            {grouped.map(({ day, logs: dayLogs }) => (
              <div key={day}>
                {/* Day separator */}
                <div className="px-5 py-2 bg-gray-50 border-y border-gray-100">
                  <p className="text-xs font-semibold text-cinza-texto capitalize">{day}</p>
                </div>
                <ul className="divide-y divide-gray-50">
                  {dayLogs.map((log) => {
                    const { relative, full } = formatDate(log.created_at);
                    const isProfile = log.event_type === "PROFILE_VIEWED";
                    return (
                      <li key={log.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-azul-claro flex items-center justify-center text-azul-principal text-xs font-bold shrink-0">
                          {getInitials(log.contractor_name)}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-azul-noite">
                            <span className="font-semibold">{log.contractor_name}</span>
                            {isProfile ? " visitou seu perfil" : " visualizou seus dados de contato"}
                          </p>
                        </div>
                        {/* Event type + time */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                            isProfile ? "bg-azul-claro text-azul-principal" : "bg-green-50 text-green-600"
                          }`}>
                            {isProfile
                              ? <Eye className="w-3 h-3" />
                              : <Phone className="w-3 h-3" />
                            }
                            {isProfile ? "Visita" : "Contato"}
                          </span>
                          <time
                            dateTime={log.created_at}
                            title={full}
                            className="text-xs text-cinza-texto whitespace-nowrap"
                          >
                            {relative}
                          </time>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
