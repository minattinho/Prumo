export type Municipio = { nome: string; uf: string };

let cache: Municipio[] | null = null;
let fetchPromise: Promise<Municipio[]> | null = null;

export async function getMunicipios(): Promise<Municipio[]> {
  if (cache) return cache;
  if (!fetchPromise) {
    fetchPromise = fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
    )
      .then((r) => r.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any[]) => {
        cache = data.map((m) => ({
          nome: m.nome as string,
          uf: m.microrregiao.mesorregiao.UF.sigla as string,
        }));
        fetchPromise = null;
        return cache!;
      });
  }
  return fetchPromise;
}

export function searchMunicipios(
  municipios: Municipio[],
  query: string,
  limit = 8
): Municipio[] {
  const normalized = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (!normalized) return [];

  return municipios
    .filter((m) => {
      const nome = m.nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return nome.startsWith(normalized);
    })
    .slice(0, limit);
}
