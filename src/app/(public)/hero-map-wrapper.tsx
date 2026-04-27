"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const HeroMap = dynamic(() => import("./hero-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-white/5 animate-pulse flex flex-col items-center justify-center gap-2">
      <MapPin size={28} className="text-blue-400/50" />
      <span className="text-blue-300/60 text-sm">Carregando mapa...</span>
    </div>
  ),
});

export function HeroMapWrapper() {
  return <HeroMap />;
}
