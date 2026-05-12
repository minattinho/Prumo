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
      <section className="relative overflow-hidden bg-azul-noite">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pro" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pro)" />
          </svg>
        </div>

        {/* Gradient blobs */}
        <div
          className="absolute -top-32 -right-32 w-125 h-125 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4A90E2, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-100 h-100 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #E8761A, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-blue-200 font-medium mb-5">
                <Clock size={11} />
                30 dias grátis — sem cartão de crédito
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
                Mostre seu trabalho<br />
                <span className="text-laranja-obra">para clientes</span><br />
                que precisam de você
              </h1>

              <p className="text-base sm:text-lg text-blue-200 max-w-lg mb-8 leading-relaxed">
                Crie seu perfil profissional, exiba seu portfólio e receba contatos diretos.
                Sem comissão, sem intermediários, sem enrolação.
              </p>

              {/* Benefits */}
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

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                {[
                  { value: "5.000+", label: "clientes buscando" },
                  { value: "R$0", label: "de comissão" },
                  { value: "13", label: "especialidades" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-xs text-blue-300 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form card */}
            <div id="cadastro" className="lg:sticky lg:top-24">
              <div className="bg-white rounded-card shadow-card p-8">
                <div className="mb-6">
                  <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-1">
                    Cadastro profissional
                  </p>
                  <h2 className="text-xl font-bold text-azul-noite">Crie sua conta grátis</h2>
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
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-4xl mx-auto px-4 py-5 grid grid-cols-3 divide-x divide-white/10">
            {[
              { label: "Contato direto", sublabel: "Sem intermediários ou taxas" },
              { label: "Portfólio verificado", sublabel: "Fotos de obras reais" },
              { label: "13 categorias", sublabel: "De construção a projeto" },
            ].map(({ label, sublabel }) => (
              <div key={label} className="text-center px-4">
                <div className="text-sm sm:text-base font-bold text-white">{label}</div>
                <div className="text-xs text-blue-300 mt-0.5">{sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-2">
              Para profissionais
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-azul-noite">
              Como funciona para você
            </h2>
            <p className="text-cinza-texto mt-2 text-sm max-w-md mx-auto">
              Três passos para começar a receber clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connecting line desktop */}
            <div
              className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-linear-to-r from-azul-principal/20 via-azul-principal/60 to-azul-principal/20"
              aria-hidden="true"
            />

            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description, highlight }) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-azul-claro border-2 border-azul-principal/10 flex items-center justify-center shadow-sm">
                    <Icon size={30} className="text-azul-principal" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-azul-principal text-white text-xs font-bold flex items-center justify-center">
                    {step.slice(1)}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-3">
                  <CheckCircle2 size={12} />
                  {highlight}
                </div>

                <h3 className="font-bold text-azul-noite mb-2 text-base">{title}</h3>
                <p className="text-sm text-cinza-texto leading-relaxed max-w-xs mx-auto">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-azul-claro">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-2">
              Diferenciais
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-azul-noite">
              Por que anunciar no Prumo?
            </h2>
            <p className="text-cinza-texto mt-2 text-sm max-w-md mx-auto">
              Uma plataforma construída para valorizar quem faz o trabalho de verdade
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-card shadow-card p-7 border border-azul-principal/10"
              >
                <div className="w-12 h-12 rounded-xl bg-azul-claro flex items-center justify-center mb-5">
                  <Icon size={22} className="text-azul-principal" />
                </div>
                <h3 className="font-bold text-azul-noite mb-2">{title}</h3>
                <p className="text-sm text-cinza-texto leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
