import { NextRequest, NextResponse } from "next/server";
import { isValidCpf, isValidCnpj } from "@/lib/serpro/validators";
import { validateCPF, validateCNPJ, SerproApiError } from "@/lib/serpro/client";
import type { DocumentValidationResponse } from "@/types";

// Rate limiting: max 10 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > window) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= 10) return false;

  entry.count++;
  return true;
}

function unavailable(message = "Verificação indisponível no momento."): NextResponse {
  return NextResponse.json<DocumentValidationResponse>(
    { valid: true, status: "UNAVAILABLE", message },
    { status: 200 }
  );
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { valid: false, status: "ERROR", message: "Muitas tentativas. Tente novamente em um minuto." },
      { status: 429 }
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

  // Math checksum first — free, instant
  const checksumValid = type === "cpf" ? isValidCpf(digits) : isValidCnpj(digits);
  if (!checksumValid) {
    return NextResponse.json<DocumentValidationResponse>(
      { valid: false, status: "REJECTED", message: `${type.toUpperCase()} inválido.` },
      { status: 422 }
    );
  }

  // Skip SERPRO call if key not configured (dev/staging)
  if (!process.env.SERPRO_API_KEY) {
    return unavailable();
  }

  try {
    if (type === "cpf") {
      const result = await validateCPF(digits);
      const approved = result.situacao.codigo === "0";
      return NextResponse.json<DocumentValidationResponse>({
        valid: approved,
        status: approved ? "APPROVED" : "REJECTED",
        message: approved
          ? "CPF regular na Receita Federal."
          : result.situacao.descricao || "CPF com situação irregular na Receita Federal.",
      });
    } else {
      const result = await validateCNPJ(digits);
      const approved = result.situacaoCadastral.codigo === "2";
      return NextResponse.json<DocumentValidationResponse>({
        valid: approved,
        status: approved ? "APPROVED" : "REJECTED",
        message: approved
          ? "CNPJ ativo na Receita Federal."
          : result.situacaoCadastral.descricao || "CNPJ com situação irregular na Receita Federal.",
      });
    }
  } catch (err) {
    if (err instanceof SerproApiError) {
      if (err.statusCode === 404) {
        return NextResponse.json<DocumentValidationResponse>({
          valid: false,
          status: "REJECTED",
          message: `${type.toUpperCase()} não encontrado na Receita Federal.`,
        });
      }
      // 429, 5xx, auth errors → allow proceed with warning
      return unavailable();
    }
    // Network/timeout errors → allow proceed with warning
    return unavailable();
  }
}
