"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, ChevronDown, Check } from "lucide-react";
import type { BadgeType } from "@/types";
import {
  SERVICE_SUBCATEGORIES,
  SERVICE_TAXONOMY,
  getServiceBySlug,
} from "@/types/services";


const RATING_OPTIONS = [
  { value: "3", stars: 3 },
  { value: "3.5", stars: 3.5 },
  { value: "4", stars: 4 },
  { value: "4.5", stars: 4.5 },
];

const BADGE_OPTIONS: { value: BadgeType; label: string }[] = [
  { value: "VERIFIED", label: "Verificado" },
  { value: "TRUSTWORTHY", label: "Confiável" },
  { value: "CERTIFIED", label: "Certificado" },
];

interface SidebarFiltersProps {
  categoria?: string;
  avaliacao?: string;
  tipo?: string;
  verificacao?: string;
}

export function SearchFilters({ categoria, avaliacao, tipo, verificacao }: SidebarFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localCategoria, setLocalCategoria] = useState(categoria ?? "");
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const categoriaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriaRef.current && !categoriaRef.current.contains(e.target as Node)) {
        setCategoriaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [localAvaliacao, setLocalAvaliacao] = useState(avaliacao ?? "");
  const [localTipo, setLocalTipo] = useState(tipo ?? "todos");
  const [localVerificacao, setLocalVerificacao] = useState<BadgeType[]>(
    verificacao ? (verificacao.split(",") as BadgeType[]) : []
  );

  const toggleVerificacao = useCallback((badge: BadgeType) => {
    setLocalVerificacao((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  }, []);

  const handleAplicar = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (localCategoria) {
      params.set("categoria", localCategoria);
    } else {
      params.delete("categoria");
    }

    if (localAvaliacao) {
      params.set("avaliacao", localAvaliacao);
    } else {
      params.delete("avaliacao");
    }

    if (localTipo && localTipo !== "todos") {
      params.set("tipo", localTipo);
    } else {
      params.delete("tipo");
    }

    if (localVerificacao.length > 0) {
      params.set("verificacao", localVerificacao.join(","));
    } else {
      params.delete("verificacao");
    }

    params.delete("pagina");
    router.push(`/profissionais?${params.toString()}`);
  }, [router, searchParams, localCategoria, localAvaliacao, localTipo, localVerificacao]);

  const hasFilters = localCategoria || localAvaliacao || localTipo !== "todos" || localVerificacao.length > 0;

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
    router.push(`/profissionais?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="bg-white rounded-card shadow-card p-4 flex flex-col gap-5">
      <h2 className="font-semibold text-azul-noite text-sm">Filtros</h2>

      {/* Categoria */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-cinza-texto uppercase tracking-wide">
          Categoria
        </h3>
        <div ref={categoriaRef} className="relative">
          <button
            type="button"
            onClick={() => setCategoriaOpen((o) => !o)}
            className={`w-full flex items-center justify-between gap-2 border rounded-lg px-3 py-2 text-sm bg-white transition-colors ${
              categoriaOpen
                ? "border-azul-principal ring-2 ring-azul-principal"
                : "border-gray-200 hover:border-gray-300"
            } ${localCategoria ? "text-azul-noite font-medium" : "text-gray-400"}`}
          >
            <span className="truncate">
              {localCategoria
                ? getServiceBySlug(localCategoria)?.label ??
                  SERVICE_TAXONOMY.find((c) => c.slug === localCategoria)?.name ??
                  SERVICE_SUBCATEGORIES.find((s) => s.slug === localCategoria)?.name ??
                  localCategoria
                : "Todas"}
            </span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-cinza-texto transition-transform ${categoriaOpen ? "rotate-180" : ""}`}
            />
          </button>

          {categoriaOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              <div className="max-h-52 overflow-y-auto py-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocalCategoria("");
                    setCategoriaOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors hover:bg-azul-claro ${
                    localCategoria === "" ? "text-azul-principal font-medium bg-azul-claro/50" : "text-azul-noite"
                  }`}
                >
                  Todas
                  {localCategoria === "" && <Check size={13} className="text-azul-principal shrink-0" />}
                </button>
                {SERVICE_TAXONOMY.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => {
                      setLocalCategoria(category.slug);
                      setCategoriaOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors hover:bg-azul-claro ${
                      localCategoria === category.slug ? "text-azul-principal font-medium bg-azul-claro/50" : "text-azul-noite"
                    }`}
                  >
                    {category.name}
                    {localCategoria === category.slug && <Check size={13} className="text-azul-principal shrink-0" />}
                  </button>
                ))}
                {SERVICE_TAXONOMY.flatMap((category) =>
                  category.subcategories.flatMap((subcategory) => [
                    <div
                      key={`${subcategory.slug}-label`}
                      className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase text-cinza-texto"
                    >
                      {subcategory.name}
                    </div>,
                    ...subcategory.services.map((service) => (
                      <button
                        key={service.slug}
                        type="button"
                        onClick={() => {
                          setLocalCategoria(service.slug);
                          setCategoriaOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 pl-5 text-sm text-left transition-colors hover:bg-azul-claro ${
                          localCategoria === service.slug
                            ? "text-azul-principal font-medium bg-azul-claro/50"
                            : "text-azul-noite"
                        }`}
                      >
                        {service.name}
                        {localCategoria === service.slug && (
                          <Check size={13} className="text-azul-principal shrink-0" />
                        )}
                      </button>
                    )),
                  ])
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Avaliação mínima */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-cinza-texto uppercase tracking-wide">
          Avaliação mínima
        </h3>
        <div className="flex flex-col gap-1.5">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="avaliacao"
                value={opt.value}
                checked={localAvaliacao === opt.value}
                onChange={() =>
                  setLocalAvaliacao((prev) => (prev === opt.value ? "" : opt.value))
                }
                className="accent-azul-principal"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={
                      i < Math.floor(opt.stars)
                        ? "text-yellow-400 fill-yellow-400"
                        : i < opt.stars
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
                <span className="text-xs text-cinza-texto ml-0.5">{opt.value}+</span>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Tipo de profissional */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-cinza-texto uppercase tracking-wide">
          Tipo de profissional
        </h3>
        <div className="flex flex-col gap-1.5">
          {(["todos", "individual", "empresa"] as const).map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value={t}
                checked={localTipo === t}
                onChange={() => setLocalTipo(t)}
                className="accent-azul-principal"
              />
              <span className="text-sm text-azul-noite capitalize">
                {t === "todos" ? "Todos" : t === "individual" ? "Individual" : "Empresa"}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Verificação */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-cinza-texto uppercase tracking-wide">
          Verificação
        </h3>
        <div className="flex flex-col gap-1.5">
          {BADGE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localVerificacao.includes(opt.value)}
                onChange={() => toggleVerificacao(opt.value)}
                className="accent-azul-principal rounded"
              />
              <span className="text-sm text-azul-noite">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Ações */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          onClick={handleAplicar}
          className="bg-azul-principal hover:bg-blue-800 text-white text-sm font-semibold py-2.5 px-4 rounded-lg w-full transition-colors"
        >
          Aplicar filtros
        </button>
        {hasFilters && (
          <button
            onClick={handleLimpar}
            className="text-xs text-cinza-texto hover:text-azul-principal text-center underline underline-offset-2 transition-colors"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
