"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Images,
  Star,
  CreditCard,
  Settings,
  LogOut,
  Activity,
  MessageSquare,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/layout/logo";
import { ResponsiveImage } from "@/components/ResponsiveImage";

interface SidebarProps {
  profile: { full_name: string | null };
  professionalProfile: {
    status: string;
    subscription_status: string;
    photo_url: string | null;
    slug: string;
  } | null;
}

const navGroups = [
  {
    label: "Geral",
    items: [
      { label: "Dashboard",  href: "/painel",            icon: LayoutDashboard, exact: true  },
    ],
  },
  {
    label: "Meu perfil",
    items: [
      { label: "Perfil",     href: "/painel/perfil",     icon: User,     exact: false },
      { label: "Portfólio",  href: "/painel/portfolio",  icon: Images,   exact: false },
      { label: "Avaliações", href: "/painel/avaliacoes", icon: Star,     exact: false },
      { label: "Acessos",    href: "/painel/acessos",    icon: Activity, exact: false },
    ],
  },
  {
    label: "Negócios",
    items: [
      { label: "Solicitações", href: "/painel/solicitacoes", icon: MessageSquare, exact: false },
      { label: "Serviços",     href: "/painel/servicos",     icon: Briefcase,     exact: false },
    ],
  },
  {
    label: "Conta",
    items: [
      { label: "Assinatura",    href: "/painel/assinatura",    icon: CreditCard, exact: false },
      { label: "Configurações", href: "/painel/configuracoes", icon: Settings,   exact: false },
    ],
  },
];

const subscriptionLabels: Record<string, { label: string; dot: string }> = {
  TRIAL:     { label: "Trial",      dot: "bg-amber-400" },
  ACTIVE:    { label: "Assinante",  dot: "bg-green-500" },
  CANCELLED: { label: "Cancelado",  dot: "bg-red-500"   },
  SUSPENDED: { label: "Suspenso",   dot: "bg-gray-400"  },
};

function getInitials(name: string | null): string {
  if (!name) return "P";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Sidebar({ profile, professionalProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const subStatus = professionalProfile?.subscription_status ?? "TRIAL";
  const subBadge  = subscriptionLabels[subStatus] ?? subscriptionLabels.TRIAL;
  const isPending = professionalProfile?.status === "PENDING";

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Logo className="h-8" />
      </div>

      {/* User card */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {professionalProfile?.photo_url ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-azul-claro">
              <ResponsiveImage
                src={professionalProfile.photo_url}
                alt={`Foto de perfil de ${profile.full_name ?? "profissional"}`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-azul-principal flex items-center justify-center text-white text-sm font-bold shrink-0">
              {getInitials(profile.full_name)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-azul-noite truncate">
              {profile.full_name ?? "Profissional"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${subBadge.dot}`} />
              <span className="text-xs text-cinza-texto">{subBadge.label}</span>
            </div>
          </div>
          {professionalProfile?.slug && (
            <Link
              href={`/profissionais/${professionalProfile.slug}`}
              title="Ver perfil público"
              className="shrink-0 p-1.5 rounded-lg text-cinza-texto hover:text-azul-principal hover:bg-azul-claro transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, exact }) => {
                const isActive = exact ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                      isActive
                        ? "bg-azul-claro text-azul-principal font-semibold"
                        : "text-cinza-texto hover:bg-gray-50 hover:text-azul-noite"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-azul-principal" : ""}`} />
                    <span className="flex-1">{label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-azul-principal shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-2 border-t border-gray-100 pt-3">
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <p className="text-xs text-amber-800 leading-relaxed">
              Seu perfil está em análise. Em até 48h você será ativado.
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-cinza-texto hover:bg-red-50 hover:text-red-600 transition-colors group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-red-500 transition-colors" />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}
