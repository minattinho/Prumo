"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Images,
  Briefcase,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/layout/logo";

interface SidebarProps {
  profile: { full_name: string | null };
  professionalProfile: {
    status: string;
    subscription_status: string;
    photo_url: string | null;
    slug: string;
  } | null;
}

const navItems = [
  { label: "Dashboard", href: "/painel", icon: LayoutDashboard, exact: true },
  { label: "Perfil", href: "/painel/perfil", icon: User, exact: false },
  { label: "Portfólio", href: "/painel/portfolio", icon: Images, exact: false },
  { label: "Serviços", href: "/painel/servicos", icon: Briefcase, exact: false },
  { label: "Solicitações", href: "/painel/solicitacoes", icon: MessageSquare, exact: false },
];

const subscriptionLabels: Record<string, { label: string; className: string }> = {
  TRIAL: { label: "Trial", className: "bg-amber-100 text-amber-700" },
  ACTIVE: { label: "Assinante", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-700" },
  SUSPENDED: { label: "Suspenso", className: "bg-gray-100 text-gray-600" },
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
  const subBadge = subscriptionLabels[subStatus] ?? subscriptionLabels.TRIAL;
  const isPending = professionalProfile?.status === "PENDING";

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <Logo className="h-8" />
      </div>

      {/* Perfil do usuário */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {professionalProfile?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={professionalProfile.photo_url}
              alt={profile.full_name ?? ""}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-azul-principal flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {getInitials(profile.full_name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-azul-noite truncate">
              {profile.full_name ?? "Profissional"}
            </p>
            <span
              className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded-full mt-0.5 ${subBadge.className}`}
            >
              {subBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-azul-claro text-azul-principal font-semibold"
                  : "text-cinza-texto hover:bg-gray-50 hover:text-azul-noite"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé */}
      <div className="px-3 pb-4 space-y-3">
        {isPending && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              Seu perfil está em análise. Em até 48h você será ativado.
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-cinza-texto hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}
