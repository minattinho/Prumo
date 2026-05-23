import Link from "next/link";
import { ShieldCheck, Banknote, Target } from "lucide-react";
import type { Metadata } from "next";

const displayStyle: React.CSSProperties = { fontFamily: "var(--font-display)" };

export const metadata: Metadata = {
  title: "Sobre o Prumo",
  description:
    "Conheça o Prumo — o marketplace que conecta contratantes e profissionais de forma direta, sem intermediários e sem comissões.",
};

const VALUES = [
  {
    icon: Target,
    title: "Transparência",
    description:
      "Avaliações reais de quem contratou de verdade. Portfólios verificados. Nenhuma estrela comprada ou perfil falso.",
  },
  {
    icon: Banknote,
    title: "Sem comissões",
    description:
      "O contratante fala diretamente com o profissional. Nenhuma porcentagem é descontada de nenhum dos lados.",
  },
  {
    icon: ShieldCheck,
    title: "Profissionais verificados",
    description:
      "CPF validado e verificação de antecedentes antes de qualquer perfil ser ativado na plataforma.",
  },
];

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-azul-noite text-white py-20 px-6 relative overflow-hidden">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos no fundo */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-azul-principal opacity-[0.10] filter blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <p
            className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-3"
            style={displayStyle}
          >
            Empresa
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-[1.02] tracking-tight mb-6"
            style={displayStyle}
          >
            Sobre o Prumo
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
            Marketplace de profissionais — do encanador ao arquiteto. Direto,
            sem intermediários, sem comissão.
          </p>
        </div>
      </section>

      {/* Missão */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-azul-noite mb-4" style={displayStyle}>
            Nossa missão
          </h2>
          <p className="text-cinza-texto leading-relaxed text-base mb-4">
            O Prumo existe para tornar a contratação de profissionais de obras e
            serviços mais justa, rápida e segura para todo mundo. Contratantes
            encontram profissionais verificados com portfólio real e avaliações
            de clientes reais. Profissionais constroem reputação e recebem
            contatos qualificados sem pagar comissão por job fechado.
          </p>
          <p className="text-cinza-texto leading-relaxed text-base">
            Acreditamos que a relação entre quem precisa de um serviço e quem o
            presta deve ser direta. Sem plataformas no meio que cobram dos dois
            lados e decidem quem aparece mais.
          </p>
        </div>
      </section>

      {/* Como surgiu */}
      <section className="py-16 px-6 bg-azul-claro">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-azul-noite mb-4" style={displayStyle}>
            Como surgiu o Prumo
          </h2>
          <p className="text-cinza-texto leading-relaxed text-base mb-4">
            A ideia nasceu de uma frustração comum: contratar um bom profissional
            de obra era difícil, lento e cheio de incerteza. As indicações boca a
            boca funcionavam para poucos. As plataformas existentes cobravam taxas
            altas ou misturavam profissionais sem critério de qualidade.
          </p>
          <p className="text-cinza-texto leading-relaxed text-base">
            O Prumo foi criado para resolver isso de forma simples: um lugar onde
            profissionais sérios constroem uma reputação verificável e contratantes
            encontram exatamente quem precisam — com transparência e sem surpresas.
          </p>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-azul-noite mb-10" style={displayStyle}>
            Nossos valores
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-4 p-6 rounded-xl border border-gray-100 shadow-card"
              >
                <div className="w-10 h-10 rounded-lg bg-azul-claro flex items-center justify-center">
                  <v.icon className="w-5 h-5 text-azul-principal" />
                </div>
                <h3 className="font-semibold text-azul-noite" style={displayStyle}>{v.title}</h3>
                <p className="text-cinza-texto text-sm leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-azul-noite text-white relative overflow-hidden">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold mb-2" style={displayStyle}>Faça parte do Prumo</h2>
            <p className="text-white/55 text-sm">
              Seja como contratante ou como profissional.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/profissionais"
              className="px-5 py-2.5 rounded-lg border border-white/20 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-150"
            >
              Encontrar profissional
            </Link>
            <Link
              href="/seja-profissional"
              className="px-5 py-2.5 rounded-lg bg-laranja-obra text-white text-sm font-medium hover:bg-orange-600 transition-colors duration-150"
            >
              Seja um profissional
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
