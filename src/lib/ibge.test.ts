import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchMunicipios, type Municipio } from "./ibge";

describe("ibge", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("should fetch and parse municipios successfully", async () => {
    const mockData = [
      {
        nome: "São Paulo",
        microrregiao: {
          mesorregiao: {
            UF: {
              sigla: "SP"
            }
          }
        }
      },
      {
        nome: "Rio de Janeiro",
        microrregiao: {
          mesorregiao: {
            UF: {
              sigla: "RJ"
            }
          }
        }
      }
    ];

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => mockData
    } as Response);

    const { getMunicipios } = await import("./ibge");
    const result = await getMunicipios();
    expect(fetchSpy).toHaveBeenCalledWith(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome"
    );
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ nome: "São Paulo", uf: "SP" });
    expect(result[1]).toEqual({ nome: "Rio de Janeiro", uf: "RJ" });
  });

  it("should return cached municipios on subsequent calls", async () => {
    const mockData = [{ nome: "Curitiba", microrregiao: { mesorregiao: { UF: { sigla: "PR" } } } }];
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => mockData
    } as Response);

    const { getMunicipios } = await import("./ibge");
    
    const firstResult = await getMunicipios();
    expect(firstResult).toHaveLength(1);
    
    const secondResult = await getMunicipios();
    expect(secondResult).toBe(firstResult);
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it("should handle fetch error and reset promise", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network Error"));

    const { getMunicipios } = await import("./ibge");
    await expect(getMunicipios()).rejects.toThrow("Network Error");
    expect(fetchSpy).toHaveBeenCalledOnce();
  });

  it("should return the same promise for concurrent calls to getMunicipios", async () => {
    let resolveFetch: any;
    const fetchPromiseMock = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      json: () => fetchPromiseMock
    } as Response);

    const { getMunicipios } = await import("./ibge");

    const p1 = getMunicipios();
    const p2 = getMunicipios();

    resolveFetch([]);
    
    const [res1, res2] = await Promise.all([p1, p2]);
    expect(res1).toBe(res2); // Devem resolver para a mesma referência de cache
    expect(fetchSpy).toHaveBeenCalledOnce(); // O fetch só deve ser acionado uma vez
  });

  it("should filter and normalise query in searchMunicipios", () => {
    const municipios: Municipio[] = [
      { nome: "São Paulo", uf: "SP" },
      { nome: "São José", uf: "SP" },
      { nome: "Rio de Janeiro", uf: "RJ" },
      { nome: "Curitiba", uf: "PR" }
    ];

    // Busca exata/prefixo sem acento
    expect(searchMunicipios(municipios, "sao")).toEqual([
      { nome: "São Paulo", uf: "SP" },
      { nome: "São José", uf: "SP" }
    ]);

    // Ignorar case e espaços
    expect(searchMunicipios(municipios, "   RIO   ")).toEqual([
      { nome: "Rio de Janeiro", uf: "RJ" }
    ]);

    // Limite de resultados
    expect(searchMunicipios(municipios, "s", 1)).toEqual([
      { nome: "São Paulo", uf: "SP" }
    ]);

    // Query vazia
    expect(searchMunicipios(municipios, "")).toEqual([]);
  });
});
