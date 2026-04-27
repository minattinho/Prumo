import { createClient } from "@/lib/supabase/server";

export default async function AdminUsuariosPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, name, email, role, created_at")
    .in("role", ["professional", "contractor"])
    .order("created_at", { ascending: false })
    .limit(100);

  const roleLabel: Record<string, string> = {
    professional: "Profissional",
    contractor: "Contratante",
  };

  const roleBadge: Record<string, string> = {
    professional: "bg-azul-claro text-azul-principal",
    contractor: "bg-green-50 text-green-700",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-azul-noite">Usuários</h1>
        <p className="text-sm text-cinza-texto mt-1">Todos os usuários cadastrados na plataforma</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Nome
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                E-mail
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Tipo
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Cadastrado em
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(users ?? []).map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-azul-noite">{u.name}</td>
                <td className="px-5 py-3 text-cinza-texto">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] ?? ""}`}>
                    {roleLabel[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-cinza-texto">
                  {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
            {!users?.length && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-cinza-texto">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
