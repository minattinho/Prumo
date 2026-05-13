import Link from "next/link";
import { HeroSearch } from "./hero-search";
import { HeroMapWrapper } from "./hero-map-wrapper";
import { FAQ } from "@/components/FAQ";
import { SocialProof } from "@/components/SocialProof";
import {
  Search,
  Star,
  ShieldCheck,
  TrendingUp,
  Wrench,
  PaintBucket,
  Hammer,
  Wifi,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Phone,
} from "lucide-react";
import { SERVICE_CATEGORIES, SERVICE_TAXONOMY } from "@/types/services";

const CATEGORY_ICONS = {
  home: Hammer,
  wrench: Wrench,
  code: Wifi,
  palette: PaintBucket,
  megaphone: TrendingUp,
} as const;

const CATEGORY_STYLES = [
  {
    color: "bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    accent: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    color: "bg-zinc-50 text-zinc-600 group-hover:bg-zinc-500 group-hover:text-white",
    accent: "bg-zinc-500",
    chip: "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
  },
  {
    color: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-500 group-hover:text-white",
    accent: "bg-cyan-500",
    chip: "bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
  },
  {
    color: "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
    accent: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 hover:bg-rose-100",
  },
  {
    color: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    accent: "bg-green-500",
    chip: "bg-green-50 text-green-700 hover:bg-green-100",
  },
] as const;

const CATEGORIES = SERVICE_TAXONOMY.map((category, index) => {
  const services = category.subcategories.flatMap((subcategory) =>
    subcategory.services.map((service) => ({
      ...service,
      subcategoryName: subcategory.name,
    }))
  );
  const style = CATEGORY_STYLES[index] ?? CATEGORY_STYLES[0];

  return {
    label: category.name,
    icon: CATEGORY_ICONS[category.icon],
    slug: category.slug,
    serviceCount: services.length,
    subcategoryNames: category.subcategories.map((subcategory) => subcategory.name),
    previewServices: services.slice(0, 4),
    ...style,
  };
});

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Busque pelo serviço",
    description: "Filtre por categoria e cidade. Veja portfólios reais e avaliações verificadas de outros contratantes.",
    highlight: "Mais de 13 categorias",
  },
  {
    step: "02",
    icon: Phone,
    title: "Contato direto",
    description: "Acesse o WhatsApp ou telefone do profissional. Negocie diretamente, sem intermediários ou taxas.",
    highlight: "Sem comissões",
  },
  {
    step: "03",
    icon: Star,
    title: "Avalie após o serviço",
    description: "Sua avaliação ajuda outros contratantes a escolherem com segurança. Só avalia quem contratou.",
    highlight: "Avaliações verificadas",
  },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Profissionais verificados",
    description: "CPF validado e verificação de antecedentes antes da ativação de qualquer perfil.",
  },
  {
    icon: Star,
    title: "Avaliações reais",
    description: "Só avalia quem contratou de verdade. Zero avaliação falsa ou comprada na plataforma.",
  },
  {
    icon: TrendingUp,
    title: "Portfólio com fotos reais",
    description: "Veja obras executadas antes de decidir. Sem foto de stock ou promessas vazias.",
  },
];



export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-azul-noite">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Gradient blob top-right */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4A90E2, transparent 70%)" }}
          aria-hidden="true"
        />
        {/* Gradient blob bottom-left */}
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #E8761A, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-16">

            {/* Coluna esquerda: título + busca */}
            <div className="flex-1 text-center lg:text-left flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
                Encontre os melhores<br className="hidden sm:block" />
                <span className="text-laranja-obra"> prestadores de serviços</span>
                <br />
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"> na sua região.</span>
              </h1>

              <p className="text-base sm:text-lg text-blue-200 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                Do encanador ao arquiteto — portfólio real, avaliações verificadas e contato direto.<br className="hidden sm:block" />
                Sem intermediários, sem taxas, sem enrolação.
              </p>

              <HeroSearch />

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto lg:mx-0">
                <Link
                  href="/profissionais"
                  className="group rounded-2xl bg-azul-principal hover:bg-blue-700 border border-white/10 px-5 py-4 text-left transition-colors shadow-lg shadow-black/20"
                >
                  <span className="text-xs font-semibold text-blue-100">Contratantes</span>
                  <span className="mt-1 flex items-center justify-between gap-3 text-white font-bold">
                    Buscar Profissional Agora
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/seja-profissional"
                  className="group rounded-2xl bg-laranja-obra hover:bg-orange-600 border border-white/10 px-5 py-4 text-left transition-colors shadow-lg shadow-black/20"
                >
                  <span className="text-xs font-semibold text-orange-100">Profissionais</span>
                  <span className="mt-1 flex items-center justify-between gap-3 text-white font-bold">
                    Criar Perfil Grátis
                    <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Coluna direita: mapa — apenas lg+ */}
            <div className="hidden lg:block lg:w-130 xl:w-145 shrink-0 self-stretch">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10 h-full relative">
                <HeroMapWrapper />
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
              { label: `${SERVICE_CATEGORIES.length} serviços`, sublabel: `${CATEGORIES.length} categorias principais` },
            ].map(({ label, sublabel }) => (
              <div key={label} className="text-center px-4">
                <div className="text-sm sm:text-base font-bold text-white">{label}</div>
                <div className="text-xs text-blue-300 mt-0.5">{sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SocialProof />
      <FAQ />

      {/* ─── CATEGORIAS ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-2">Categorias</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-azul-noite">O que você precisa?</h2>
              <p className="text-cinza-texto mt-2 text-sm">
                {CATEGORIES.length} categorias e {SERVICE_CATEGORIES.length} serviços para cada etapa do seu imóvel
              </p>
            </div>
            <Link
              href="/profissionais"
              className="flex items-center gap-1.5 text-sm font-medium text-azul-principal hover:text-azul-noite transition-colors cursor-pointer group"
            >
              Ver todos os profissionais
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CATEGORIES.map(({ label, icon: Icon, slug, color, accent, chip, serviceCount, subcategoryNames, previewServices }) => (
              <div
                key={slug}
                className="group relative rounded-2xl bg-white border border-gray-100 overflow-hidden hover:border-transparent hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`absolute top-0 inset-x-0 h-[3px] ${accent}`} />
                <Link href={`/profissionais?categoria=${slug}`} className="block p-5 cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${color}`}>
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-semibold text-cinza-texto bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                      {serviceCount} serviços
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-azul-noite leading-tight mb-2">{label}</h3>
                  <p className="text-xs text-cinza-texto leading-relaxed min-h-8">
                    {subcategoryNames.join(" • ")}
                  </p>
                </Link>
                <div className="px-5 pb-5 flex flex-wrap gap-2">
                  {previewServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/profissionais?categoria=${service.slug}`}
                      className={`text-xs font-medium rounded-full px-2.5 py-1 transition-colors ${chip}`}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-2">Processo</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-azul-noite">Como funciona</h2>
            <p className="text-cinza-texto mt-2 text-sm max-w-md mx-auto">Simples e direto — do primeiro clique ao serviço concluído</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Connecting line desktop */}
            <div className="hidden sm:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-azul-principal/20 via-azul-principal/60 to-azul-principal/20" aria-hidden="true" />

            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description, highlight }) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                {/* Step circle */}
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
                <p className="text-sm text-cinza-texto leading-relaxed max-w-xs mx-auto">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONFIANÇA / TRUST ────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-azul-noite relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-2">Segurança</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Por que confiar no Prumo?</h2>
            <p className="text-blue-300 mt-2 text-sm max-w-md mx-auto">Construímos um marketplace onde transparência e qualidade não são opcionais</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-default">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-blue-300" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-blue-300 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA PROFISSIONAL ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-azul-principal to-azul-noite rounded-3xl overflow-hidden">
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10" aria-hidden="true"
              style={{ background: "radial-gradient(circle at top right, #E8761A, transparent 70%)" }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10" aria-hidden="true"
              style={{ background: "radial-gradient(circle at bottom left, white, transparent 70%)" }} />

            <div className="relative px-8 sm:px-14 py-14 sm:py-16 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs text-blue-200 font-medium mb-4">
                  <Clock size={11} />
                  30 dias grátis — sem cartão de crédito
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Você é profissional?<br />
                  <span className="text-laranja-obra">Mostre seu trabalho.</span>
                </h2>
                <p className="text-blue-200 text-sm sm:text-base leading-relaxed max-w-md">
                  Crie seu perfil com portfólio, receba contatos de clientes e cresça sem pagar comissão. Depois dos 30 dias, apenas R$&nbsp;79/mês.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
                  {["Perfil verificado", "Portfólio ilimitado", "Contato direto", "Sem comissão"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-blue-200">
                      <CheckCircle2 size={13} className="text-green-400" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                <Link
                  href="/seja-profissional"
                  className="inline-flex items-center gap-2 bg-laranja-obra hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl transition-colors duration-200 text-base shadow-lg shadow-orange-900/30 cursor-pointer"
                >
                  Criar meu perfil grátis
                  <ArrowRight size={18} />
                </Link>
                <p className="text-xs text-blue-300">Já tem conta? <Link href="/profissional" className="underline hover:text-white transition-colors cursor-pointer">Entre aqui</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL TRUST BAR ──────────────────────────────────── */}
      <section className="py-8 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 sm:gap-10">
          {[
            { icon: ShieldCheck, text: "Perfis verificados" },
            { icon: Award, text: "Portfólio com fotos reais" },
            { icon: Users, text: "Avaliações de contratantes reais" },
            { icon: CheckCircle2, text: "Contato direto, sem taxa" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-cinza-texto text-sm">
              <Icon size={16} className="text-azul-principal" />
              {text}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
