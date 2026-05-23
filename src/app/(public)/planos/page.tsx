import { createClient } from "@/lib/supabase/server";
import { CheckoutButton } from "./checkout-button";
import { CheckCircle2, Zap, Shield, TrendingUp, CreditCard, Clock } from "lucide-react";
import type { Metadata } from "next";

const displayStyle: React.CSSProperties = { fontFamily: "var(--font-display)" };

export const metadata: Metadata = {
  title: "Planos — Prumo",
  description: "Assine o Prumo Pro e apareça para mais clientes na sua região.",
};

const FEATURES = [
  { icon: Zap,          label: "Perfil destacado nas buscas" },
  { icon: Shield,       label: "Selo de profissional verificado" },
  { icon: TrendingUp,   label: "Relatórios de acessos e métricas" },
  { icon: CreditCard,   label: "Cancele quando quiser" },
  { icon: CheckCircle2, label: "Receba solicitações de orçamento" },
  { icon: Clock,        label: "30 dias grátis para novos profissionais" },
];

export default async function PlanosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isLoggedIn = false;
  let isProfessional = false;

  if (user) {
    isLoggedIn = true;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isProfessional = profile?.role === "professional";
  }

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-azul-noite tracking-tight" style={displayStyle}>Prumo Pro</h1>
          <p className="text-cinza-texto mt-2 text-sm">
            Tudo que você precisa para conquistar mais clientes.
          </p>
        </div>

        {/* Plan card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="h-1 bg-azul-principal" />

          <div className="p-7">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-sm text-cinza-texto font-medium">R$</span>
                <span className="text-5xl font-extrabold text-azul-noite" style={displayStyle}>79</span>
                <span className="text-sm text-cinza-texto">/mês</span>
              </div>
              <p className="text-xs text-green-600 font-semibold mt-1.5">
                30 dias grátis para novos profissionais
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-7">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-cinza-texto">
                  <div className="w-5 h-5 rounded-full bg-azul-claro flex items-center justify-center shrink-0">
                    <Icon className="w-3 h-3 text-azul-principal" />
                  </div>
                  {label}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <CheckoutButton isLoggedIn={isLoggedIn} isProfessional={isProfessional} />

            <p className="text-center text-xs text-cinza-texto mt-4">
              Pagamento seguro via Mercado Pago · PIX, boleto ou cartão
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-cinza-texto mt-6">
          Ao assinar você concorda com os{" "}
          <a href="/termos" className="underline hover:text-azul-principal">termos de uso</a>.
        </p>
      </div>
    </main>
  );
}
