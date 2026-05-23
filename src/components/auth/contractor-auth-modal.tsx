"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContractorAuthPanel } from "@/app/(auth)/contratante/contractor-auth-panel";

interface ContractorAuthModalProps {
  onClose?: () => void;
}

export function ContractorAuthModal({ onClose }: ContractorAuthModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      // Remove the searchParams auth and modo by pushing the current pathname without them
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      url.searchParams.delete("modo");
      router.push(url.pathname + url.search);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Premium backdrop with blur and subtle dimming */}
      <div 
        className="absolute inset-0 bg-azul-noite/50 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-[0_20px_50px_rgba(26,43,74,0.15)] z-10 transform scale-100 transition-all duration-300 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-cinza-texto hover:text-azul-noite rounded-lg p-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        {/* Contractor Auth Panel */}
        <div className="pt-2">
          <ContractorAuthPanel />
        </div>
      </div>
    </div>
  );
}
