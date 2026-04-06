"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";

interface HeaderUserMenuProps {
  user: User;
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const name = user.user_metadata?.full_name ?? user.email ?? "Usuário";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium text-azul-noite hover:text-azul-principal transition-colors"
      >
        <span className="w-8 h-8 rounded-full bg-azul-claro text-azul-principal flex items-center justify-center text-xs font-semibold">
          {initials}
        </span>
        <span className="hidden sm:block max-w-[120px] truncate">{name.split(" ")[0]}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-48 bg-white border border-gray-100 rounded-card shadow-card py-1">
            <a
              href="/minha-conta"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-azul-noite hover:bg-azul-claro transition-colors"
              onClick={() => setOpen(false)}
            >
              <UserIcon size={15} />
              Minha conta
            </a>
            <a
              href="/painel"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-azul-noite hover:bg-azul-claro transition-colors"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard size={15} />
              Painel profissional
            </a>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}
