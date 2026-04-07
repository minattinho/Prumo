"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

const OPTIONS = [
  { value: "avaliacao", label: "Mais bem avaliados" },
  { value: "obras", label: "Mais obras" },
  { value: "recente", label: "Mais recente" },
];

interface OrdemSelectProps {
  ordem?: string;
}

export function OrdemSelect({ ordem }: OrdemSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.value === (ordem ?? "avaliacao")) ?? OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "avaliacao") {
        params.set("ordem", value);
      } else {
        params.delete("ordem");
      }
      params.delete("pagina");
      router.push(`/profissionais?${params.toString()}`);
      setOpen(false);
    },
    [router, searchParams]
  );

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <span className="text-sm text-cinza-texto">Ordenar:</span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-sm bg-white font-medium transition-colors ${
            open
              ? "border-azul-principal ring-2 ring-azul-principal text-azul-principal"
              : "border-gray-200 hover:border-gray-300 text-azul-noite"
          }`}
        >
          {current.label}
          <ChevronDown
            size={13}
            className={`text-cinza-texto transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden min-w-42">
            <div className="py-1">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors hover:bg-azul-claro ${
                    current.value === opt.value
                      ? "text-azul-principal font-medium bg-azul-claro/50"
                      : "text-azul-noite"
                  }`}
                >
                  {opt.label}
                  {current.value === opt.value && <Check size={13} className="text-azul-principal shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
