"use client";

import { useState, useRef } from "react";
import { MapPin, LocateFixed, Loader2 } from "lucide-react";

type GeoState = "idle" | "loading" | "error";

interface CityInputProps {
  value: string;
  onChange: (city: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

async function fetchCityFromCoords(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { "Accept-Language": "pt-BR" } }
  );
  const data = await res.json();
  return (
    data.address?.city ??
    data.address?.town ??
    data.address?.village ??
    data.address?.municipality ??
    ""
  );
}

export function CityInput({
  value,
  onChange,
  className,
  inputClassName,
  placeholder = "Cidade",
}: CityInputProps) {
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
          const city = await fetchCityFromCoords(
            pos.coords.latitude,
            pos.coords.longitude
          );
          if (city) {
            onChange(city);
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
    <div className={`relative flex items-center gap-2 ${className ?? ""}`}>
      <MapPin size={16} className="text-gray-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (geoState === "error") setGeoState("idle");
        }}
        className={inputClassName}
      />
      <button
        type="button"
        onClick={handleGeoClick}
        disabled={geoState === "loading"}
        title={geoState === "error" ? errorMsg : "Usar minha localização atual"}
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
      {geoState === "error" && errorMsg && (
        <span className="absolute top-full left-0 mt-1 text-xs text-red-500 whitespace-nowrap z-10">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
