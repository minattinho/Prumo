"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, UserPlus, Users, LogOut, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/layout/logo";

interface AdminSidebarProps {
  profile: { name: string; email: string };
}

const navItems = [
  { label: "Dashboard",      href: "/admin",              icon: LayoutDashboard, exact: true  },
  { label: "Criar usuário",  href: "/admin/criar-usuario", icon: UserPlus,        exact: false },
  { label: "Usuários",       href: "/admin/usuarios",      icon: Users,           exact: false },
];

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminSidebar({ profile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-white border-r border-gray-100 min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Logo className="h-8" />
      </div>

      {/* Admin badge + user card */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-azul-principal flex items-center justify-center text-white text-sm font-bold shrink-0">
            {getInitials(profile.name || profile.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-azul-noite truncate">
              {profile.name || profile.email}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-azul-principal shrink-0" />
              <span className="text-xs text-azul-principal font-medium">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Painel Admin
        </p>
        <div className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon, exact }) => {
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
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
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
