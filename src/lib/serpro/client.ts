import type { SerproCpfResponse, SerproCnpjResponse } from "@/types";

const SERPRO_BASE = "https://gateway.apiserpro.serpro.gov.br";

export class SerproApiError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = "SerproApiError";
  }
}

function getSerproKey(): string {
  const key = process.env.SERPRO_API_KEY;
  if (!key) {
    throw new Error("SERPRO_API_KEY is not set");
  }
  return key;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    ),
  ]);
}

export async function validateCPF(cpf: string): Promise<SerproCpfResponse> {
  const key = getSerproKey();
  const digits = cpf.replace(/\D/g, "");

  const fetchPromise = fetch(
    `${SERPRO_BASE}/consulta-cpf/v1/cpf/${digits}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const response = await withTimeout(fetchPromise, 8000);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new SerproApiError(response.status, text);
  }

  return response.json() as Promise<SerproCpfResponse>;
}

export async function validateCNPJ(cnpj: string): Promise<SerproCnpjResponse> {
  const key = getSerproKey();
  const digits = cnpj.replace(/\D/g, "");

  const fetchPromise = fetch(
    `${SERPRO_BASE}/consulta-cnpj/v1/cnpj/${digits}`,
    {
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const response = await withTimeout(fetchPromise, 8000);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new SerproApiError(response.status, text);
  }

  return response.json() as Promise<SerproCnpjResponse>;
}
