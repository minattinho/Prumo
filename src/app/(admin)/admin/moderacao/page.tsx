import { createClient } from "@/lib/supabase/server";
import { ModerationClient, type ProfessionalWithDetails } from "./moderation-client";

export const metadata = {
  title: "Moderação de Profissionais — Painel Admin",
};

export default async function AdminModeracaoPage() {
  const supabase = await createClient();

  // Buscar todos os perfis profissionais com detalhes associados
  const { data: professionals, error } = await supabase
    .from("professional_profiles")
    .select(`
      id,
      slug,
      city,
      state,
      status,
      cpf,
      cnpj,
      created_at,
      personal_description,
      profiles (
        name,
        email,
        phone
      ),
      professional_specialties (
        category
      ),
      cpf_validations (
        status,
        validation_date,
        reason_if_rejected,
        serpro_response
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AdminModeracaoPage] erro ao buscar profissionais:", error.message);
  }

  // Ordenar validações de CPF/CNPJ de forma que a mais recente fique sempre no topo
  const formattedProfessionals = (professionals ?? []).map((p: any) => {
    const validations = p.cpf_validations ?? [];
    const sortedValidations = [...validations].sort(
      (a: any, b: any) => new Date(b.validation_date).getTime() - new Date(a.validation_date).getTime()
    );

    return {
      ...p,
      cpf_validations: sortedValidations,
    };
  }) as unknown as ProfessionalWithDetails[];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1
          className="text-2xl font-extrabold text-azul-noite tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Moderação de Profissionais
        </h1>
        <p className="text-sm text-cinza-texto mt-1">
          Analise a documentação do SERPRO e aprove ou suspenda prestadores de serviços.
        </p>
      </div>

      <ModerationClient initialProfessionals={formattedProfessionals} />
    </div>
  );
}
