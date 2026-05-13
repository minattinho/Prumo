"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MapPin, LocateFixed, Loader2 } from "lucide-react";
import { getMunicipios, searchMunicipios, type Municipio } from "@/lib/ibge";

type GeoState = "idle" | "loading" | "error";

interface CityInputProps {
  id?: string;
  value: string;
  onChange: (city: string) => void;
  onCityStateChange?: (location: { city: string; state: string }) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

async function fetchLocationFromCoords(
  lat: number,
  lon: number
): Promise<{ city: string; state: string }> {
  const res = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error("Geocode failed");
  return res.json();
}

export function CityInput({
  id,
  value,
  onChange,
  onCityStateChange,
  className,
  inputClassName,
  placeholder = "Cidade",
}: CityInputProps) {
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestions, setSuggestions] = useState<Municipio[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const municipiosRef = useRef<Municipio[] | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    function updatePosition() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        });
      }
    }

    if (isOpen) {
      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  const selectSuggestion = useCallback(
    (m: Municipio) => {
      onChange(m.nome);
      onCityStateChange?.({ city: m.nome, state: m.uf });
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onChange, onCityStateChange]
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    if (geoState === "error") setGeoState("idle");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      setIsOpen(true);
      try {
        if (!municipiosRef.current) {
          municipiosRef.current = await getMunicipios();
        }
        const results = searchMunicipios(municipiosRef.current, val);
        setSuggestions(results);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  function handleGeoClick() {
    if (!navigator.geolocation) {
      setGeoState("error");
      setErrorMsg("Geolocalização não suportada neste navegador.");
      return;
    }

    setGeoState("loading");
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { city, state } = await fetchLocationFromCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          if (!city) {
            setGeoState("error");
            setErrorMsg("Não foi possível identificar a cidade.");
            return;
          }

          const normalize = (s: string) =>
            s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

          const cityNorm = normalize(city);
          const stateNorm = state.toUpperCase();

          // Tenta encontrar na lista do IBGE para normalizar o nome oficial
          let municipios: Awaited<ReturnType<typeof getMunicipios>> = [];
          try {
            municipios = await getMunicipios();
          } catch {
            // Se o IBGE falhar, usa o dado direto da geocode API
          }

          let match = municipios.find(
            (m) => normalize(m.nome) === cityNorm && m.uf === stateNorm
          );
          if (!match && stateNorm) {
            match = municipios.find(
              (m) => normalize(m.nome).startsWith(cityNorm) && m.uf === stateNorm
            );
          }
          if (!match) {
            match = municipios.find((m) => normalize(m.nome) === cityNorm);
          }

          if (match) {
            selectSuggestion(match);
            setGeoState("idle");
          } else if (stateNorm) {
            // A API retornou city+state válidos — usa diretamente mesmo sem match no IBGE
            onChange(city);
            onCityStateChange?.({ city, state });
            setGeoState("idle");
          } else {
            setGeoState("error");
            setErrorMsg("Não foi possível identificar a cidade.");
          }
        } catch {
          setGeoState("error");
          setErrorMsg("Erro ao buscar localização.");
        }
      },
      (err) => {
        setGeoState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Permissão de localização negada.");
        } else {
          setErrorMsg("Não foi possível obter sua localização.");
        }
      },
      { timeout: 10000 }
    );
  }

  return (
    <div ref={containerRef} className={`relative flex items-center ${className ?? ""}`}>
      <div className="flex items-center gap-2 w-full min-w-0">
        <MapPin size={16} className="text-gray-400 shrink-0" />
        <input
          id={id}
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `city-option-${activeIndex}` : undefined
          }
          className={inputClassName}
        />
        <button
          type="button"
          onClick={handleGeoClick}
          disabled={geoState === "loading"}
          title={
            geoState === "error" ? errorMsg : "Usar minha localização atual"
          }
          aria-label="Usar minha localização atual"
          className={`shrink-0 transition-colors ${
            geoState === "error"
              ? "text-red-400 hover:text-red-500"
              : geoState === "loading"
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-400 hover:text-azul-principal"
          }`}
        >
          {geoState === "loading" ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LocateFixed size={16} />
          )}
        </button>
      </div>

      {geoState === "error" && errorMsg && (
        <span className="absolute top-full left-0 mt-1 text-xs text-red-500 whitespace-nowrap z-10">
          {errorMsg}
        </span>
      )}

      {mounted && isOpen && createPortal(
        <ul
          role="listbox"
          style={dropdownStyle}
          className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          {isLoadingSuggestions && (
            <li className="px-4 py-3 text-sm text-cinza-texto flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Buscando cidades...
            </li>
          )}
          {!isLoadingSuggestions &&
            suggestions.map((m, i) => (
              <li
                key={`${m.nome}-${m.uf}`}
                id={`city-option-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(m);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2 transition-colors ${
                  i === activeIndex
                    ? "bg-blue-50 text-azul-principal"
                    : "text-azul-noite hover:bg-gray-50"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cinza-texto shrink-0" />
                <span>
                  <span className="font-medium">{m.nome}</span>
                  <span className="text-cinza-texto"> — {m.uf}</span>
                </span>
              </li>
            ))}
          {!isLoadingSuggestions && suggestions.length === 0 && (
            <li className="px-4 py-3 text-sm text-cinza-texto">
              Nenhuma cidade encontrada.
            </li>
          )}
        </ul>,
        document.body
      )}
    </div>
  );
}
