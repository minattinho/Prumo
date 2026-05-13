"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const HeroMap = dynamic(() => import("./hero-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gray-100 animate-pulse flex flex-col items-center justify-center gap-2">
      <MapPin size={28} className="text-gray-300" />
      <span className="text-gray-400 text-sm">Carregando mapa...</span>
    </div>
  ),
});

export function HeroMapWrapper() {
  return <HeroMap />;
}
