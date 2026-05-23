import { ProfessionalRegisterForm } from "./professional-register-form";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Star,
  LayoutGrid,
} from "lucide-react";

export const metadata = {
  title: "Anunciar serviços no Prumo — Crie seu perfil grátis",
};

const displayStyle: React.CSSProperties = { fontFamily: "var(--font-display)" };

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: LayoutGrid,
    title: "Crie seu perfil",
    description:
      "Preencha seus dados, especialidade e cidade. Adicione fotos do seu trabalho para se destacar.",
    highlight: "Leva 3 minutos",
  },
  {
    step: "02",
    icon: Phone,
    title: "Receba contatos",
    description:
      "Clientes da sua região encontram seu perfil e entram em contato diretamente pelo WhatsApp.",
    highlight: "Contato direto",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Cresça sem comissão",
    description:
      "Você negocia e fecha direto com o cliente. O Prumo não cobra nada sobre seus serviços.",
    highlight: "R$0 de comissão",
  },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Perfil verificado e confiável",
    description:
      "CPF validado e badge de verificação. Clientes confiam mais em profissionais verificados.",
  },
  {
    icon: Users,
    title: "Alcance clientes na sua cidade",
    description:
      "Apareça nas buscas de quem procura serviço na sua região. Sem disputar com o Brasil inteiro.",
  },
  {
    icon: Star,
    title: "Avaliações que constroem reputação",
    description:
      "Cada serviço bem feito vira avaliação pública. Sua reputação trabalha por você 24h.",
  },
];

export default function SejaProfissionalPage() {
  return (
    <div className="flex flex-col scroll-smooth">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="bg-azul-noite relative overflow-hidden">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos e distintos no fundo */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-azul-principal opacity-[0.12] filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-laranja-obra opacity-[0.06] filter blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-blue-200 font-medium mb-6">
                <Clock size={11} />
                30 dias grátis — sem cartão de crédito
              </div>

              <h1
                className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.02] tracking-tight mb-5"
                style={displayStyle}
              >
                Mostre seu trabalho<br />
                <span className="text-laranja-obra">para clientes</span><br />
                que precisam de você
              </h1>

              <p className="text-base sm:text-lg text-blue-200 max-w-lg mb-8 leading-relaxed">
                Crie seu perfil profissional, exiba seu portfólio e receba contatos diretos.
                Sem comissão, sem intermediários, sem enrolação.
              </p>

              <ul className="space-y-3 mb-10">
                {[
                  "Perfil verificado com badge de confiança",
                  "Contato direto via WhatsApp — sem intermediários",
                  "Portfólio ilimitado com fotos e vídeos",
                  "R$0 de comissão — você fica com tudo",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-blue-100">
                    <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                {[
                  { value: "5.000+", label: "clientes buscando" },
                  { value: "R$0", label: "de comissão" },
                  { value: "13", label: "especialidades" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div
                      className="text-xl font-extrabold text-white"
                      style={displayStyle}
                    >
                      {value}
                    </div>
                    <div className="text-xs text-blue-300 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div id="cadastro" className="lg:sticky lg:top-24">
              <div className="bg-white rounded-card shadow-card p-8">
                <div className="mb-6">
                  <p
                    className="text-xs font-bold text-laranja-obra uppercase tracking-[0.12em] mb-2"
                    style={displayStyle}
                  >
                    Cadastro profissional
                  </p>
                  <h2
                    className="text-xl font-extrabold text-azul-noite tracking-tight"
                    style={displayStyle}
                  >
                    Crie sua conta grátis
                  </h2>
                  <p className="text-sm text-cinza-texto mt-1">
                    Leva menos de 3 minutos para começar.
                  </p>
                </div>

                <ProfessionalRegisterForm />

                <p className="mt-6 text-center text-sm text-cinza-texto">
                  Já tem conta?{" "}
                  <Link href="/profissional" className="text-azul-principal font-medium hover:underline">
                    Entrar
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature bar */}
        <div className="border-t border-white/10 bg-white/5 relative z-10">
          <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {[
              { label: "Contato direto", sublabel: "Sem intermediários ou taxas" },
              { label: "Portfólio verificado", sublabel: "Fotos de obras reais" },
              { label: "13 categorias", sublabel: "De construção a projeto" },
            ].map(({ label, sublabel }) => (
              <div key={label} className="flex-1 text-center px-4 py-3 sm:py-0">
                <div
                  className="text-sm sm:text-base font-bold text-white"
                  style={displayStyle}
                >
                  {label}
                </div>
                <div className="text-xs text-blue-300 mt-0.5">{sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-3"
              style={displayStyle}
            >
              Para profissionais
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-azul-noite tracking-tight"
              style={displayStyle}
            >
              Como funciona para você
            </h2>
            <p className="text-cinza-texto mt-2 text-sm">
              Três passos para começar a receber clientes
            </p>
          </div>

          <div className="flex flex-col gap-0 divide-y divide-gray-100">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description, highlight }) => (
              <div
                key={step}
                className="flex flex-col md:flex-row md:items-start gap-5 py-8 first:pt-0 last:pb-0"
              >
                <div
                  className="text-7xl sm:text-8xl font-extrabold text-azul-claro leading-none select-none shrink-0 w-28 text-right hidden md:block"
                  style={displayStyle}
                  aria-hidden="true"
                >
                  {step}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-azul-claro flex items-center justify-center shrink-0 md:hidden">
                      <Icon size={16} className="text-azul-principal" />
                    </div>
                    <span className="text-xs font-bold text-laranja-obra uppercase tracking-widest">
                      {highlight}
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-azul-claro items-center justify-center shrink-0 hidden md:flex">
                      <Icon size={18} className="text-azul-principal" />
                    </div>
                    <div>
                      <h3
                        className="text-xl font-bold text-azul-noite mb-2"
                        style={displayStyle}
                      >
                        {title}
                      </h3>
                      <p className="text-sm text-cinza-texto leading-relaxed max-w-md">
                        {description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-azul-claro">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-3"
              style={displayStyle}
            >
              Diferenciais
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-azul-noite tracking-tight"
              style={displayStyle}
            >
              Por que anunciar no Prumo?
            </h2>
            <p className="text-cinza-texto mt-2 text-sm max-w-md">
              Uma plataforma construída para valorizar quem faz o trabalho de verdade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl shadow-card p-7 border border-azul-principal/10"
              >
                <div className="w-10 h-10 rounded-lg bg-azul-claro flex items-center justify-center mb-5">
                  <Icon size={18} className="text-azul-principal" />
                </div>
                <h3
                  className="font-bold text-azul-noite mb-2"
                  style={displayStyle}
                >
                  {title}
                </h3>
                <p className="text-sm text-cinza-texto leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
