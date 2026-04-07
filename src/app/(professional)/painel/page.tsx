import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Images, User, Briefcase, MessageSquare, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Meu Painel",
};

const statusLabels: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Em análise", className: "bg-amber-100 text-amber-700" },
  ACTIVE: { label: "Ativo", className: "bg-green-100 text-green-700" },
  SUSPENDED: { label: "Suspenso", className: "bg-red-100 text-red-700" },
  BANNED: { label: "Banido", className: "bg-red-200 text-red-800" },
};

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-white rounded-card shadow-card p-4">
      <p className="text-2xl font-bold text-azul-noite">{value}</p>
      <p className="text-xs text-cinza-texto mt-0.5">{label}</p>
    </div>
  );
}

function ChecklistItem({
  done,
  label,
  href,
}: {
  done: boolean;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={done ? "#" : href}
      className={`flex items-center gap-3 py-2 text-sm ${
        done ? "text-cinza-texto cursor-default" : "text-azul-principal hover:underline"
      }`}
    >
      {done ? (
        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      ) : (
        <span className="w-5 h-5 rounded-full border-2 border-amber-400 shrink-0" />
      )}
      <span className={done ? "line-through" : ""}>{label}</span>
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

  // Queries secundárias (contagens)
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

  // Completion score
  const checks = [
    { done: !!pro?.photo_url, pts: 20, label: "Adicionar foto de perfil", href: "/painel/perfil" },
    { done: !!pro?.personal_description, pts: 20, label: "Escrever sobre você", href: "/painel/perfil" },
    { done: !!pro?.city, pts: 10, label: "Informar sua cidade", href: "/painel/perfil" },
    { done: (specialtiesCount ?? 0) > 0, pts: 20, label: "Escolher especialidades", href: "/painel/perfil" },
    { done: (channelsCount ?? 0) > 0, pts: 15, label: "Adicionar canal de contato", href: "/painel/perfil" },
    { done: (projectsCount ?? 0) > 0, pts: 15, label: "Publicar primeiro projeto no portfólio", href: "/painel/portfolio" },
  ];
  const completionScore = checks.reduce((acc, c) => acc + (c.done ? c.pts : 0), 0);

  const status = pro?.status ?? "PENDING";
  const subStatus = pro?.subscription_status ?? "TRIAL";
  const statusBadge = statusLabels[status] ?? statusLabels.PENDING;

  // Dias restantes no trial
  let trialDaysLeft: number | null = null;
  if (subStatus === "TRIAL" && pro?.trial_ends_at) {
    const diff = new Date(pro.trial_ends_at).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Banner de perfil pendente */}
      {status === "PENDING" && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-card px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            Seu perfil está em análise. Nossa equipe vai revisá-lo em até 48h.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-azul-noite">Olá, {firstName}!</h1>
          <p className="text-sm text-cinza-texto mt-0.5">Bem-vindo ao seu painel.</p>
        </div>
        <span
          className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge.className}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Cards: completude + assinatura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Completude */}
        {completionScore < 100 && (
          <div className="bg-white rounded-card shadow-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-azul-noite">Completude do perfil</h2>
              <span className="text-sm font-bold text-azul-principal">{completionScore}%</span>
            </div>
            {/* Barra de progresso simples */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div
                className="bg-azul-principal h-2 rounded-full transition-all"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <div className="divide-y divide-gray-50">
              {checks.map((c) => (
                <ChecklistItem key={c.label} done={c.done} label={c.label} href={c.href} />
              ))}
            </div>
          </div>
        )}

        {/* Assinatura */}
        <div className="bg-white rounded-card shadow-card p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-azul-noite mb-3">Assinatura</h2>
          {subStatus === "TRIAL" && (
            <>
              <p className="text-sm text-cinza-texto">
                Você está no período de teste gratuito.
              </p>
              {trialDaysLeft !== null && (
                <p className="mt-1 text-2xl font-bold text-azul-noite">
                  {trialDaysLeft}{" "}
                  <span className="text-sm font-normal text-cinza-texto">
                    {trialDaysLeft === 1 ? "dia restante" : "dias restantes"}
                  </span>
                </p>
              )}
              <div className="mt-auto pt-4">
                <Link
                  href="/planos"
                  className="block w-full text-center bg-laranja-obra hover:opacity-90 text-white font-medium rounded-lg py-2.5 text-sm transition-opacity"
                >
                  Assinar agora — R$79/mês
                </Link>
              </div>
            </>
          )}
          {subStatus === "ACTIVE" && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-sm text-green-700 font-medium">Assinatura ativa</p>
              </div>
              {pro?.subscription_paid_until && (
                <p className="mt-2 text-xs text-cinza-texto">
                  Próxima cobrança em{" "}
                  {new Date(pro.subscription_paid_until).toLocaleDateString("pt-BR")}
                </p>
              )}
              <div className="mt-auto pt-4">
                <Link
                  href="/planos"
                  className="block w-full text-center border border-gray-200 text-azul-noite font-medium rounded-lg py-2.5 text-sm hover:bg-gray-50 transition-colors"
                >
                  Gerenciar assinatura
                </Link>
              </div>
            </>
          )}
          {(subStatus === "CANCELLED" || subStatus === "SUSPENDED") && (
            <>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm text-red-600 font-medium">
                  {subStatus === "CANCELLED" ? "Assinatura cancelada" : "Assinatura suspensa"}
                </p>
              </div>
              <p className="mt-2 text-xs text-cinza-texto">
                Reative sua assinatura para que seu perfil fique visível.
              </p>
              <div className="mt-auto pt-4">
                <Link
                  href="/planos"
                  className="block w-full text-center bg-azul-principal hover:bg-azul-noite text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
                >
                  Reativar assinatura
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value={metrics?.profile_views ?? 0} label="Visualizações" />
        <StatCard value={metrics?.contacts_received ?? 0} label="Contatos recebidos" />
        <StatCard
          value={
            metrics?.average_rating
              ? Number(metrics.average_rating).toFixed(1)
              : "—"
          }
          label="Avaliação média"
        />
        <StatCard value={metrics?.total_evaluations ?? 0} label="Avaliações" />
      </div>

      {/* Acesso rápido */}
      <div>
        <h2 className="text-sm font-semibold text-azul-noite mb-3">Acesso rápido</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Editar perfil", href: "/painel/perfil", icon: User, color: "text-azul-principal" },
            { label: "Portfólio", href: "/painel/portfolio", icon: Images, color: "text-azul-medio" },
            { label: "Serviços", href: "/painel/servicos", icon: Briefcase, color: "text-green-600" },
            { label: "Solicitações", href: "/painel/solicitacoes", icon: MessageSquare, color: "text-laranja-obra" },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-card shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow group"
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="text-xs font-medium text-azul-noite group-hover:text-azul-principal transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
