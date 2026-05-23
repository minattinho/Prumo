import Image from "next/image";
import React from "react";

interface MestreTipProps {
  text: string;
  imageSrc?: string;
}

export function MestreTip({ 
  text, 
  imageSrc = "/mascote/8fd51b58-9679-4c58-8bc8-bee7fe5a618e.png" 
}: MestreTipProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0A1628] border border-white/10 p-5 rounded-2xl max-w-3xl mx-auto my-6 hover:shadow-lg hover:border-[#1A5DB8]/40 transition-all duration-200 text-white shadow-xl">
      <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden bg-black border border-white/15 shadow-inner">
        <Image
          src={imageSrc}
          alt="Mestre Prumo"
          fill
          className="object-cover scale-110"
        />
      </div>
      <div className="text-center sm:text-left flex-1">
        <h4 className="text-xs font-bold text-[#4A90E2] uppercase tracking-wider mb-1 font-display">
          Dica do Mestre Prumo
        </h4>
        <p className="text-sm text-blue-100/90 leading-relaxed font-sans font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}

