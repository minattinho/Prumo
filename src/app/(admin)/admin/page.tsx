import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserPlus, Users, Briefcase } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: totalProfessionals } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "professional");

  const { count: totalContractors } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "contractor");

  const stats = [
    {
      label: "Profissionais",
      value: totalProfessionals ?? 0,
      icon: Briefcase,
      color: "text-azul-principal",
      bg: "bg-azul-claro",
    },
    {
      label: "Contratantes",
      value: totalContractors ?? 0,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-extrabold text-azul-noite tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Painel Admin
        </h1>
        <p className="text-sm text-cinza-texto mt-1">Visão geral da plataforma Prumo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-lg">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-azul-noite">{value}</p>
            <p className="text-sm text-cinza-texto">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
        <h2
          className="text-sm font-semibold text-azul-noite mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ações rápidas
        </h2>
        <div className="space-y-2">
          <Link
            href="/admin/criar-usuario"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-azul-principal text-white text-sm font-medium hover:bg-azul-noite transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Criar novo usuário
          </Link>
          <Link
            href="/admin/usuarios"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-azul-noite text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Ver todos os usuários
          </Link>
        </div>
      </div>
    </div>
  );
}
