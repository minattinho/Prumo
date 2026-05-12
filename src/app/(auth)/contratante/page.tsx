import { Suspense } from "react";
import { ContractorAuthPanel } from "./contractor-auth-panel";
import { Logo } from "@/components/layout/logo";

export const metadata = {
  title: "Contratante",
};

export default function ContratantePage() {
  return (
    <div className="flex h-full bg-white">
      <aside className="hidden bg-azul-noite px-12 py-10 lg:flex lg:w-[46%]">
        <div className="flex h-full max-w-md flex-col justify-between">
          <Logo variant="white" />

          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-laranja-obra">
              Para contratantes
            </p>
            <h2 className="text-3xl font-black leading-tight text-white xl:text-4xl">
              Encontre profissionais de confiança perto de você.
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-blue-100">
              Perfis verificados, avaliações reais e contato direto para
              resolver sua obra com menos atrito.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8 sm:px-8 lg:px-12">
        <Suspense
          fallback={
            <div className="h-96 w-full max-w-lg animate-pulse rounded-xl bg-gray-100" />
          }
        >
          <ContractorAuthPanel />
        </Suspense>
      </main>
    </div>
  );
}
