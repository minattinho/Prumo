import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  AlertCircle,
  Eye,
  Phone,
  Star,
  MessageSquare,
  User,
  Images,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Meu Painel",
};

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING:   { label: "Em análise",  className: "bg-amber-100 text-amber-700 border border-amber-200" },
  ACTIVE:    { label: "Ativo",       className: "bg-green-100 text-green-700 border border-green-200" },
  SUSPENDED: { label: "Suspenso",    className: "bg-red-100 text-red-700 border border-red-200" },
  BANNED:    { label: "Banido",      className: "bg-red-200 text-red-800 border border-red-300" },
};

function StatCard({
  value,
  label,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
}: {
  value: string | number;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-card shadow-card p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-3xl font-bold text-azul-noite leading-none tracking-tight">{value}</p>
        <p className="text-xs text-cinza-texto mt-1.5 font-medium">{label}</p>
      </div>
      {trend && (
        <p className="text-xs text-cinza-texto border-t border-gray-50 pt-2.5 flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-green-500" />
          {trend}
        </p>
      )}
    </div>
  );
}

function ChecklistItem({
  done,
  label,
  href,
  pts,
}: {
  done: boolean;
  label: string;
  href: string;
  pts: number;
}) {
  return (
    <Link
      href={done ? "#" : href}
      className={`flex items-center gap-3 py-3 text-sm border-b border-gray-50 last:border-0 transition-colors ${
        done
          ? "text-cinza-texto cursor-default"
          : "text-azul-noite hover:text-azul-principal group"
      }`}
    >
      {done ? (
        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-azul-principal shrink-0 transition-colors" />
      )}
      <span className={`flex-1 ${done ? "line-through" : "font-medium"}`}>{label}</span>
      {done ? (
        <span className="text-xs font-semibold text-green-600 shrink-0">+{pts}pts</span>
      ) : (
        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-azul-principal shrink-0 transition-colors" />
      )}
    </Link>
  );
}

export default async function PainelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = (user!.user_metadata?.full_name ?? user!.email ?? "Profissional").split(" ")[0];

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id, status, subscription_status, trial_ends_at, subscription_paid_until, photo_url, personal_description, city, slug")
    .eq("user_id", user!.id)
    .single();

  const [
    { count: specialtiesCount },
    { count: channelsCount },
    { count: projectsCount },
    { data: metrics },
  ] = await Promise.all([
    pro
      ? supabase.from("professional_specialties").select("id", { count: "exact", head: true }).eq("professional_id", pro.id)
      : Promise.resolve({ count: 0 }),
    pro
      ? supabase.from("professional_contact_channels").select("id", { count: "exact", head: true }).eq("professional_id", pro.id)
      : Promise.resolve({ count: 0 }),
    pro
      ? supabase.from("portfolio_projects").select("id", { count: "exact", head: true }).eq("professional_id", pro.id)
      : Promise.resolve({ count: 0 }),
    pro
      ? supabase.from("professional_metrics").select("average_rating, total_evaluations, profile_views, contacts_received").eq("professional_id", pro.id).single()
      : Promise.resolve({ data: null }),
  ]);

  const checks = [
    { done: !!pro?.photo_url,            pts: 20, label: "Adicionar foto de perfil",                href: "/painel/perfil"    },
    { done: !!pro?.personal_description, pts: 20, label: "Escrever sobre você",                     href: "/painel/perfil"    },
    { done: !!pro?.city,                 pts: 10, label: "Informar sua cidade",                      href: "/painel/perfil"    },
    { done: (specialtiesCount ?? 0) > 0, pts: 20, label: "Escolher especialidades",                 href: "/painel/perfil"    },
    { done: (channelsCount ?? 0) > 0,    pts: 15, label: "Adicionar canal de contato",              href: "/painel/perfil"    },
    { done: (projectsCount ?? 0) > 0,   pts: 15, label: "Publicar projeto no portfólio",            href: "/painel/portfolio" },
  ];
  const completionScore = checks.reduce((acc, c) => acc + (c.done ? c.pts : 0), 0);

  const status    = pro?.status ?? "PENDING";
  const subStatus = pro?.subscription_status ?? "TRIAL";
  const statusBadge = statusLabels[status] ?? statusLabels.PENDING;

  let trialDaysLeft: number | null = null;
  if (subStatus === "TRIAL" && pro?.trial_ends_at) {
    const diff = new Date(pro.trial_ends_at).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const progressColor =
    completionScore >= 80 ? "bg-green-500" :
    completionScore >= 50 ? "bg-azul-principal" :
    "bg-amber-400";

  const isTrialUrgent = subStatus === "TRIAL" && trialDaysLeft !== null && trialDaysLeft <= 7;
  const profileComplete = completionScore === 100;

  const quickLinks = [
    {
      label: "Editar perfil",
      href: "/painel/perfil",
      icon: User,
      color: "text-azul-principal",
      bg: "bg-azul-claro",
      accentBg: "group-hover:bg-azul-principal",
      description: "Foto, bio e especialidades",
    },
    {
      label: "Portfólio",
      href: "/painel/portfolio",
      icon: Images,
      color: "text-azul-medio",
      bg: "bg-blue-50",
      accentBg: "group-hover:bg-azul-medio",
      description: "Projetos e trabalhos",
    },
    {
      label: "Serviços",
      href: "/painel/servicos",
      icon: Briefcase,
      color: "text-green-600",
      bg: "bg-green-50",
      accentBg: "group-hover:bg-green-600",
      description: "Histórico de serviços",
    },
    {
      label: "Solicitações",
      href: "/painel/solicitacoes",
      icon: MessageSquare,
      color: "text-laranja-obra",
      bg: "bg-orange-50",
      accentBg: "group-hover:bg-laranja-obra",
      description: "Pedidos de orçamento",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* Banner: perfil pendente */}
      {status === "PENDING" && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-card px-4 py-3.5">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Perfil em análise</p>
            <p className="text-xs text-amber-700 mt-0.5">Nossa equipe vai revisá-lo em até 48h. Você receberá um e-mail quando for aprovado.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-medium text-cinza-texto uppercase tracking-widest mb-1">Painel profissional</p>
          <h1 className="text-2xl font-bold text-azul-noite">Olá, {firstName}!</h1>
          <p className="text-sm text-cinza-texto mt-1">
            {profileComplete
              ? "Seu perfil está completo e aparece nas buscas."
              : `Complete seu perfil para aparecer nos resultados de busca — ${completionScore}% concluído.`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge.className}`}>
            {statusBadge.label}
          </span>
          {pro?.slug && (
            <Link
              href={`/profissionais/${pro.slug}`}
              className="flex items-center gap-1.5 text-xs font-medium text-azul-principal border border-azul-principal/20 bg-azul-claro hover:bg-azul-principal hover:text-white px-3 py-1.5 rounded-full transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver perfil
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          value={metrics?.profile_views ?? 0}
          label="Visualizações"
          icon={Eye}
          iconColor="text-azul-principal"
          iconBg="bg-azul-claro"
        />
        <StatCard
          value={metrics?.contacts_received ?? 0}
          label="Contatos recebidos"
          icon={Phone}
          iconColor="text-laranja-obra"
          iconBg="bg-orange-50"
        />
        <StatCard
          value={metrics?.average_rating ? Number(metrics.average_rating).toFixed(1) : "—"}
          label="Avaliação média"
          icon={Star}
          iconColor="text-amber-500"
          iconBg="bg-amber-50"
        />
        <StatCard
          value={metrics?.total_evaluations ?? 0}
          label="Avaliações"
          icon={MessageSquare}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
      </div>

      {/* Profile completion + Subscription */}
      <div className={`grid gap-4 ${profileComplete ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>

        {/* Completude */}
        {!profileComplete && (
          <div className="bg-white rounded-card shadow-card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-azul-noite">Completude do perfil</h2>
              <span className={`text-lg font-bold ${completionScore >= 80 ? "text-green-600" : completionScore >= 50 ? "text-azul-principal" : "text-amber-500"}`}>
                {completionScore}%
              </span>
            </div>
            <p className="text-xs text-cinza-texto mb-3">Complete seu perfil para aumentar sua visibilidade</p>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
              <div
                className={`${progressColor} h-2 rounded-full transition-all duration-700`}
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div>
              {checks.map((c) => (
                <ChecklistItem key={c.label} done={c.done} label={c.label} href={c.href} pts={c.pts} />
              ))}
            </div>
          </div>
        )}

        {/* Assinatura */}
        <div className={`rounded-card shadow-card p-5 flex flex-col ${isTrialUrgent ? "bg-orange-50 border border-orange-200" : "bg-white"}`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-azul-claro flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-azul-principal" />
            </div>
            <h2 className="text-sm font-semibold text-azul-noite">Assinatura</h2>
          </div>

          {subStatus === "TRIAL" && (
            <>
              <p className="text-xs text-cinza-texto mb-2">Período de teste gratuito</p>
              {trialDaysLeft !== null && (
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className={`text-4xl font-bold leading-none ${isTrialUrgent ? "text-orange-600" : "text-azul-noite"}`}>
                    {trialDaysLeft}
                  </span>
                  <span className="text-sm text-cinza-texto">
                    {trialDaysLeft === 1 ? "dia restante" : "dias restantes"}
                  </span>
                </div>
              )}
              {isTrialUrgent && (
                <p className="text-xs text-orange-700 font-medium mb-3">
                  Assine agora para manter seu perfil visível após o trial.
                </p>
              )}
              <div className="mt-auto pt-4">
                <Link
                  href="/planos"
                  className="block w-full text-center bg-laranja-obra hover:opacity-90 text-white font-semibold rounded-lg py-3 text-sm transition-opacity"
                >
                  Assinar agora — R$79/mês
                </Link>
              </div>
            </>
          )}

          {subStatus === "ACTIVE" && (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-sm font-semibold text-green-700">Assinatura ativa</p>
              </div>
              {pro?.subscription_paid_until && (
                <p className="mt-2 text-xs text-cinza-texto">
                  Próxima cobrança:{" "}
                  <span className="font-semibold text-azul-noite">
                    {new Date(pro.subscription_paid_until).toLocaleDateString("pt-BR")}
                  </span>
                </p>
              )}
              <div className="mt-auto pt-4">
                <Link
                  href="/painel/assinatura"
                  className="block w-full text-center border border-gray-200 text-azul-noite font-medium rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  Ver detalhes da assinatura
                </Link>
              </div>
            </>
          )}

          {(subStatus === "CANCELLED" || subStatus === "SUSPENDED") && (
            <>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm font-semibold text-red-600">
                  {subStatus === "CANCELLED" ? "Assinatura cancelada" : "Assinatura suspensa"}
                </p>
              </div>
              <p className="mt-2 text-xs text-cinza-texto leading-relaxed">
                Seu perfil está oculto. Reative para voltar a aparecer nos resultados.
              </p>
              <div className="mt-auto pt-4">
                <Link
                  href="/planos"
                  className="block w-full text-center bg-azul-principal hover:bg-azul-noite text-white font-semibold rounded-lg py-3 text-sm transition-colors"
                >
                  Reativar assinatura
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Acesso rápido */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-azul-noite">Acesso rápido</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickLinks.map(({ label, href, icon: Icon, color, bg, description }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-card shadow-card p-4 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} transition-colors duration-200`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <span className="text-sm font-semibold text-azul-noite group-hover:text-azul-principal transition-colors block">
                  {label}
                </span>
                <span className="text-xs text-cinza-texto leading-tight block mt-0.5">{description}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-azul-principal transition-all duration-200 group-hover:translate-x-0.5 mt-auto" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
