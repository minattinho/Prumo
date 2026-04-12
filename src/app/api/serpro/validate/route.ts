import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidCpf, isValidCnpj } from "@/lib/serpro/validators";
import { validateCPF, validateCNPJ, SerproApiError } from "@/lib/serpro/client";
import type { DocumentValidationResponse } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Não autenticado." },
      { status: 401 }
    );
  }

  let body: { document?: unknown; type?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Requisição inválida." },
      { status: 400 }
    );
  }

  const { document, type } = body;

  if (typeof document !== "string" || (type !== "cpf" && type !== "cnpj")) {
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Parâmetros inválidos." },
      { status: 400 }
    );
  }

  const digits = document.replace(/\D/g, "");

  // Checksum local antes de chamar a API
  const checksumValid = type === "cpf" ? isValidCpf(digits) : isValidCnpj(digits);
  if (!checksumValid) {
    return NextResponse.json<DocumentValidationResponse>(
      { valid: false, status: "REJECTED", message: `${type.toUpperCase()} inválido.` },
      { status: 422 }
    );
  }

  // Buscar professional_profiles do usuário
  const { data: profile } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Perfil profissional não encontrado." },
      { status: 404 }
    );
  }

  // Verificar cache: se já há validação recente (< 24h), retornar cached
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: cached } = await supabase
    .from("cpf_validations")
    .select("status, reason_if_rejected")
    .eq("professional_id", profile.id)
    .gte("validation_date", since)
    .order("validation_date", { ascending: false })
    .limit(1)
    .single();

  if (cached) {
    const approved = cached.status === "APPROVED";
    return NextResponse.json<DocumentValidationResponse>({
      valid: approved,
      status: cached.status as "APPROVED" | "REJECTED",
      message: approved
        ? "Documento verificado."
        : cached.reason_if_rejected ?? "Documento com situação irregular.",
    });
  }

  if (!process.env.SERPRO_API_KEY) {
    return NextResponse.json<DocumentValidationResponse>(
      { valid: true, status: "UNAVAILABLE", message: "Verificação indisponível no momento." },
      { status: 503 }
    );
  }

  try {
    let approved: boolean;
    let name: string;
    let situacaoDescricao: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rawResponse: any;

    if (type === "cpf") {
      const result = await validateCPF(digits);
      approved = result.situacao.codigo === "0";
      name = result.nome;
      situacaoDescricao = result.situacao.descricao;
      rawResponse = result;
    } else {
      const result = await validateCNPJ(digits);
      approved = result.situacaoCadastral.codigo === "2";
      name = result.nome;
      situacaoDescricao = result.situacaoCadastral.descricao;
      rawResponse = result;
    }

    const validationStatus = approved ? "APPROVED" : "REJECTED";

    await supabase.from("cpf_validations").insert({
      professional_id: profile.id,
      validation_date: new Date().toISOString(),
      status: validationStatus,
      serpro_response: rawResponse,
      reason_if_rejected: approved ? null : situacaoDescricao,
    });

    return NextResponse.json<DocumentValidationResponse>({
      valid: approved,
      status: validationStatus,
      message: approved
        ? "Documento verificado com sucesso."
        : situacaoDescricao || "Documento com situação irregular na Receita Federal.",
      name,
    });
  } catch (err) {
    if (err instanceof SerproApiError) {
      if (err.statusCode === 404) {
        await supabase.from("cpf_validations").insert({
          professional_id: profile.id,
          validation_date: new Date().toISOString(),
          status: "REJECTED",
          reason_if_rejected: "Documento não encontrado na Receita Federal.",
        });

        return NextResponse.json<DocumentValidationResponse>({
          valid: false,
          status: "REJECTED",
          message: `${type.toUpperCase()} não encontrado na Receita Federal.`,
        });
      }

      if (err.statusCode === 429) {
        return NextResponse.json(
          { valid: false, status: "ERROR", message: "Serviço temporariamente sobrecarregado. Tente novamente." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { valid: false, status: "ERROR", message: "Erro ao consultar a Receita Federal." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Erro interno ao verificar documento." },
      { status: 500 }
    );
  }
}
