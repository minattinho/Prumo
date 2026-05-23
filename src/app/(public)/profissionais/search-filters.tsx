"use client";

import { useState, useCallback, useRef, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Check, ChevronDown, Filter, Loader2, Star, X } from "lucide-react";
import type { BadgeType } from "@/types";
import {
  SERVICE_SUBCATEGORIES,
  SERVICE_TAXONOMY,
  getServiceBySlug,
} from "@/types/services";

const RATING_OPTIONS = [
  { value: "4.5", label: "4,5+", stars: 4.5 },
  { value: "4", label: "4,0+", stars: 4 },
  { value: "3.5", label: "3,5+", stars: 3.5 },
  { value: "3", label: "3,0+", stars: 3 },
];

const BADGE_OPTIONS: { value: BadgeType; label: string }[] = [
  { value: "VERIFIED", label: "Documento validado" },
  { value: "TRUSTWORTHY", label: "Confiável" },
  { value: "CERTIFIED", label: "Certificado" },
];

interface SidebarFiltersProps {
  categoria?: string;
  avaliacao?: string;
  tipo?: string;
  verificacao?: string;
}

function getCategoryLabel(value: string) {
  return (
    getServiceBySlug(value)?.label ??
    SERVICE_TAXONOMY.find((category) => category.slug === value)?.name ??
    SERVICE_SUBCATEGORIES.find((subcategory) => subcategory.slug === value)?.name ??
    value
  );
}

export function SearchFilters({ categoria, avaliacao, tipo, verificacao }: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localCategoria, setLocalCategoria] = useState(categoria ?? "");
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const categoriaRef = useRef<HTMLDivElement>(null);

  const [localAvaliacao, setLocalAvaliacao] = useState(avaliacao ?? "");
  const [localTipo, setLocalTipo] = useState(tipo ?? "todos");
  const [localVerificacao, setLocalVerificacao] = useState<BadgeType[]>(
    verificacao ? (verificacao.split(",").filter(Boolean) as BadgeType[]) : []
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriaRef.current && !categoriaRef.current.contains(e.target as Node)) {
        setCategoriaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleVerificacao = useCallback((badge: BadgeType) => {
    setLocalVerificacao((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }, []);

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `/profissionais?${query}` : "/profissionais");
      });
    },
    [router]
  );

  const handleAplicar = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (localCategoria) params.set("categoria", localCategoria);
    else params.delete("categoria");

    if (localAvaliacao) params.set("avaliacao", localAvaliacao);
    else params.delete("avaliacao");

    if (localTipo && localTipo !== "todos") params.set("tipo", localTipo);
    else params.delete("tipo");

    if (localVerificacao.length > 0) params.set("verificacao", localVerificacao.join(","));
    else params.delete("verificacao");

    params.delete("pagina");
    pushParams(params);
  }, [searchParams, localCategoria, localAvaliacao, localTipo, localVerificacao, pushParams]);

  const handleLimpar = useCallback(() => {
    setLocalCategoria("");
    setLocalAvaliacao("");
    setLocalTipo("todos");
    setLocalVerificacao([]);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categoria");
    params.delete("avaliacao");
    params.delete("tipo");
    params.delete("verificacao");
    params.delete("pagina");
    pushParams(params);
  }, [searchParams, pushParams]);

  const activeCount = [
    Boolean(localCategoria),
    Boolean(localAvaliacao),
    localTipo !== "todos",
    localVerificacao.length > 0,
  ].filter(Boolean).length;
  const hasFilters = activeCount > 0;

  return (
    <div className="rounded-card border border-slate-200 bg-white shadow-card">
      <button
        type="button"
        onClick={() => setFiltersOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left lg:hidden"
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-azul-noite">
          <Filter size={16} />
          Filtros
          {activeCount > 0 && (
            <span className="rounded-full bg-azul-claro px-2 py-0.5 text-xs text-azul-principal">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown size={16} className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`${filtersOpen ? "block" : "hidden"} border-t border-slate-100 p-4 lg:block lg:border-t-0`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-azul-noite">Refinar busca</h2>
            <p className="text-xs text-cinza-texto">Filtros aplicados na listagem pública.</p>
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={handleLimpar}
              className="inline-flex items-center gap-1 text-xs font-medium text-cinza-texto transition-colors hover:text-azul-principal"
            >
              <X size={13} />
              Limpar
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-cinza-texto">
              Categoria
            </h3>
            <div ref={categoriaRef} className="relative">
              <button
                type="button"
                onClick={() => setCategoriaOpen((open) => !open)}
                className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 text-sm transition-colors ${
                  categoriaOpen
                    ? "border-azul-principal ring-2 ring-azul-principal/15"
                    : "border-slate-200 hover:border-slate-300"
                } ${localCategoria ? "font-medium text-azul-noite" : "text-slate-500"}`}
              >
                <span className="truncate">
                  {localCategoria ? getCategoryLabel(localCategoria) : "Todas as categorias"}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 text-cinza-texto transition-transform ${categoriaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {categoriaOpen && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                  <div className="max-h-72 overflow-y-auto py-1">
                    <CategoryOption
                      active={localCategoria === ""}
                      label="Todas as categorias"
                      onClick={() => {
                        setLocalCategoria("");
                        setCategoriaOpen(false);
                      }}
                    />
                    {SERVICE_TAXONOMY.map((category) => (
                      <div key={category.slug}>
                        <CategoryOption
                          active={localCategoria === category.slug}
                          label={category.name}
                          onClick={() => {
                            setLocalCategoria(category.slug);
                            setCategoriaOpen(false);
                          }}
                        />
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.slug}>
                            <CategoryOption
                              active={localCategoria === subcategory.slug}
                              label={subcategory.name}
                              muted
                              onClick={() => {
                                setLocalCategoria(subcategory.slug);
                                setCategoriaOpen(false);
                              }}
                            />
                            {subcategory.services.map((service) => (
                              <CategoryOption
                                key={service.slug}
                                active={localCategoria === service.slug}
                                label={service.name}
                                nested
                                onClick={() => {
                                  setLocalCategoria(service.slug);
                                  setCategoriaOpen(false);
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-cinza-texto">
              Avaliação mínima
            </h3>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {RATING_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLocalAvaliacao((prev) => (prev === option.value ? "" : option.value))}
                  className={`flex min-h-10 items-center justify-between rounded-lg border px-3 text-left text-sm transition-colors ${
                    localAvaliacao === option.value
                      ? "border-azul-principal bg-azul-claro text-azul-principal"
                      : "border-slate-200 text-azul-noite hover:border-slate-300"
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {option.label}
                  </span>
                  {localAvaliacao === option.value && <Check size={14} />}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-cinza-texto">
              Tipo
            </h3>
            <div className="grid grid-cols-3 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(["todos", "individual", "empresa"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLocalTipo(value)}
                  className={`min-h-9 rounded-md px-2 text-xs font-medium transition-colors ${
                    localTipo === value
                      ? "bg-white text-azul-principal shadow-sm"
                      : "text-cinza-texto hover:text-azul-noite"
                  }`}
                >
                  {value === "todos" ? "Todos" : value === "individual" ? "Pessoa" : "Empresa"}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-cinza-texto">
              Confiança
            </h3>
            <div className="flex flex-col gap-2">
              {BADGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleVerificacao(option.value)}
                  className={`flex min-h-10 items-center justify-between rounded-lg border px-3 text-sm transition-colors ${
                    localVerificacao.includes(option.value)
                      ? "border-azul-principal bg-azul-claro text-azul-principal"
                      : "border-slate-200 text-azul-noite hover:border-slate-300"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck size={15} />
                    {option.label}
                  </span>
                  {localVerificacao.includes(option.value) && <Check size={14} />}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-cinza-texto">
            <p className="font-semibold uppercase tracking-wide text-azul-noite">Preço e disponibilidade</p>
            <p>O perfil público ainda não possui campos de preço/hora ou agenda. Os cards mostram preço sob consulta e perfis ativos para contato.</p>
          </section>

          <button
            onClick={handleAplicar}
            disabled={isPending}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-azul-principal px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-wait disabled:opacity-80"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryOption({
  active,
  label,
  nested,
  muted,
  onClick,
}: {
  active: boolean;
  label: string;
  nested?: boolean;
  muted?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-azul-claro ${
        nested ? "pl-8" : muted ? "pl-5" : ""
      } ${active ? "bg-azul-claro/70 font-medium text-azul-principal" : muted ? "text-cinza-texto" : "text-azul-noite"}`}
    >
      <span className="truncate">{label}</span>
      {active && <Check size={13} className="shrink-0 text-azul-principal" />}
    </button>
  );
}
