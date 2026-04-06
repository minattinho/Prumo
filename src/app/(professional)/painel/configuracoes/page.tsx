import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email")
    .eq("id", user!.id)
    .single() as {
      data: { full_name: string | null; phone: string | null; email: string | null } | null;
    };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Configurações</h1>
        <p className="text-sm text-cinza-texto mt-0.5">Gerencie sua conta e segurança.</p>
      </div>
      <SettingsClient
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
        email={profile?.email ?? user?.email ?? ""}
      />
    </div>
  );
}
