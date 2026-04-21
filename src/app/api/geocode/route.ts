import { NextRequest, NextResponse } from "next/server";

const STATE_ABBR: Record<string, string> = {
  "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM",
  "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF",
  "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA",
  "Mato Grosso": "MT", "Mato Grosso do Sul": "MS", "Minas Gerais": "MG",
  "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", "Pernambuco": "PE",
  "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR",
  "Santa Catarina": "SC", "São Paulo": "SP", "Sergipe": "SE",
  "Tocantins": "TO",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat e lon são obrigatórios" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`,
      { headers: { "User-Agent": "Prumo/1.0" }, redirect: "follow" }
    );
    const data = await res.json();

    const city: string = data.city || data.locality || "";
    const stateFull: string = data.principalSubdivision ?? "";
    const state =
      STATE_ABBR[stateFull] ??
      (data.principalSubdivisionCode ?? "").replace(/^BR-/, "");

    return NextResponse.json({ city, state });
  } catch {
    return NextResponse.json({ error: "Erro ao buscar localização" }, { status: 502 });
  }
}
