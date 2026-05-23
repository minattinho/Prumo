import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "./hero-search";
import { HeroMapWrapper } from "./hero-map-wrapper";
import { FAQ } from "@/components/FAQ";
import { SocialProof } from "@/components/SocialProof";
import { MestreTip } from "@/components/ui/mestre-tip";
import {
  Wrench,
  PaintBucket,
  Hammer,
  Wifi,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { SERVICE_CATEGORIES, SERVICE_TAXONOMY } from "@/types/services";
import { ContractorAuthModal } from "@/components/auth/contractor-auth-modal";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const CATEGORY_ICONS = {
  home: Hammer,
  wrench: Wrench,
  code: Wifi,
  palette: PaintBucket,
  megaphone: TrendingUp,
} as const;

const CATEGORIES = SERVICE_TAXONOMY.map((category) => {
  const services = category.subcategories.flatMap((sub) =>
    sub.services.map((s) => ({ ...s, subcategoryName: sub.name }))
  );
  return {
    label: category.name,
    icon: CATEGORY_ICONS[category.icon],
    slug: category.slug,
    serviceCount: services.length,
    subcategoryNames: category.subcategories.map((s) => s.name),
    previewServices: services.slice(0, 4),
  };
});

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Busque pelo serviço",
    description:
      "Filtre por categoria e cidade. Veja portfólios reais e avaliações verificadas de outros contratantes.",
    highlight: "Mais de 13 categorias",
  },
  {
    step: "02",
    title: "Contato direto",
    description:
      "Acesse o WhatsApp ou telefone do profissional. Negocie diretamente, sem intermediários ou taxas.",
    highlight: "Sem comissões",
  },
  {
    step: "03",
    title: "Avalie após o serviço",
    description:
      "Sua avaliação ajuda outros contratantes a escolherem com segurança. Só avalia quem contratou.",
    highlight: "Avaliações verificadas",
  },
];

const TRUST_ITEMS = [
  {
    title: "Perfis verificados",
    body: "CPF validado e verificação de antecedentes antes da ativação de qualquer perfil.",
  },
  {
    title: "Avaliações reais",
    body: "Só avalia quem contratou de verdade. Zero avaliação falsa ou comprada na plataforma.",
  },
  {
    title: "Portfólio com fotos reais",
    body: "Veja obras executadas antes de decidir. Sem foto de stock ou promessas vazias.",
  },
];

const displayStyle: React.CSSProperties = { fontFamily: "var(--font-display)" };

interface Props {
  searchParams: Promise<{ auth?: string; modo?: string; next?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const { auth } = await searchParams;
  const showAuthModal = auth === "login" || auth === "cadastro" || auth === "register";

  return (
    <div className="flex flex-col">

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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-12 lg:gap-16">

            {/* Left: headline + search */}
            <div className="flex-1 flex flex-col justify-center">
              <p
                className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-5"
                style={displayStyle}
              >
                Encontre quem faz
              </p>

              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.02] tracking-tight mb-6"
                style={displayStyle}
              >
                O profissional<br />
                certo para<br />
                <span className="text-laranja-obra">o seu serviço.</span>
              </h1>

              <p className="text-base sm:text-lg text-blue-200 max-w-lg mb-9 leading-relaxed">
                Do encanador ao arquiteto. Portfólio real, avaliações verificadas, contato direto.
                Sem intermediários.
              </p>

              <HeroSearch />

              <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg">
                <Link
                  href="/profissionais"
                  className="group flex-1 bg-azul-principal hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors duration-200 flex items-center justify-between border border-white/10 cursor-pointer"
                >
                  Buscar profissional
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/seja-profissional"
                  className="group flex-1 bg-laranja-obra hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors duration-200 flex items-center justify-between border border-white/10 cursor-pointer"
                >
                  Sou profissional
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right: map — lg+ only */}
            <div className="hidden lg:block lg:w-[520px] xl:w-[580px] shrink-0 self-stretch">
              <div className="rounded-2xl overflow-hidden border border-white/10 h-full relative shadow-2xl shadow-black/40">
                <HeroMapWrapper />
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
              { label: `${SERVICE_CATEGORIES.length} serviços`, sublabel: `${CATEGORIES.length} categorias principais` },
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

      <SocialProof />

      {/* ─── CATEGORIAS ───────────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-3"
                style={displayStyle}
              >
                Categorias
              </p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-azul-noite tracking-tight"
                style={displayStyle}
              >
                O que você precisa?
              </h2>
              <p className="text-cinza-texto mt-2 text-sm">
                {CATEGORIES.length} categorias — {SERVICE_CATEGORIES.length} serviços disponíveis
              </p>
            </div>
            <Link
              href="/profissionais"
              className="flex items-center gap-1.5 text-sm font-semibold text-azul-principal hover:text-azul-noite transition-colors cursor-pointer group"
            >
              Ver todos os profissionais
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CATEGORIES.map(({ label, icon: Icon, slug, serviceCount, subcategoryNames, previewServices }) => (
              <div
                key={slug}
                className="group relative rounded-xl bg-white border border-gray-100 overflow-hidden hover:border-azul-principal/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Link href={`/profissionais?categoria=${slug}`} className="block p-5 cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-azul-claro text-azul-principal flex items-center justify-center group-hover:bg-azul-principal group-hover:text-white transition-colors duration-200">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-cinza-texto/60 tabular-nums">
                      {serviceCount} serviços
                    </span>
                  </div>
                  <h3
                    className="text-base font-bold text-azul-noite leading-tight mb-2"
                    style={displayStyle}
                  >
                    {label}
                  </h3>
                  <p className="text-xs text-cinza-texto leading-relaxed min-h-8">
                    {subcategoryNames.join(" · ")}
                  </p>
                </Link>
                <div className="px-5 pb-5 flex flex-wrap gap-1.5">
                  {previewServices.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/profissionais?categoria=${service.slug}`}
                      className="text-xs font-medium rounded-full px-2.5 py-1 bg-azul-claro text-azul-principal hover:bg-azul-principal/20 transition-colors cursor-pointer"
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
      <section className="py-16 sm:py-20 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-3"
              style={displayStyle}
            >
              Processo
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-azul-noite tracking-tight"
              style={displayStyle}
            >
              Como funciona
            </h2>
            <p className="text-cinza-texto mt-2 text-sm">
              Simples e direto — do primeiro clique ao serviço concluído
            </p>
          </div>

          <div className="flex flex-col gap-0 divide-y divide-gray-100">
            {HOW_IT_WORKS.map(({ step, title, description, highlight }) => (
              <div key={step} className="flex flex-col md:flex-row md:items-start gap-5 py-8 first:pt-0 last:pb-0">
                <div
                  className="text-7xl sm:text-8xl font-extrabold text-azul-claro leading-none select-none shrink-0 w-28 text-right hidden md:block"
                  style={displayStyle}
                  aria-hidden="true"
                >
                  {step}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-2xl font-extrabold text-azul-claro md:hidden"
                      style={displayStyle}
                    >
                      {step}
                    </span>
                    <span className="text-xs font-bold text-laranja-obra uppercase tracking-widest">
                      {highlight}
                    </span>
                  </div>
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
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONFIANÇA / TRUST ────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-azul-noite relative overflow-hidden">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos no fundo */}
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-azul-principal opacity-[0.08] filter blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-3"
              style={displayStyle}
            >
              Segurança
            </p>
            <h2
              className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              style={displayStyle}
            >
              Por que confiar no Prumo?
            </h2>
            <p className="text-blue-300 mt-2 text-sm max-w-md">
              Transparência e qualidade não são opcionais aqui.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-white/10">
            {TRUST_ITEMS.map(({ title, body }) => (
              <div key={title} className="flex flex-col sm:flex-row sm:items-start gap-3 py-8 first:pt-0 last:pb-0">
                <h3
                  className="text-base font-bold text-white shrink-0 sm:w-56"
                  style={displayStyle}
                >
                  {title}
                </h3>
                <p className="text-sm text-blue-300 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA PROFISSIONAL ─────────────────────────────────── */}
      <section className="py-16 sm:py-20 px-4 bg-[#F8FAFC] border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">

            <div className="flex-1">
              <p
                className="text-xs font-bold uppercase tracking-[0.12em] text-laranja-obra mb-4"
                style={displayStyle}
              >
                Para profissionais
              </p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-azul-noite tracking-tight mb-4"
                style={displayStyle}
              >
                Você faz o serviço.<br />
                Prumo traz o cliente.
              </h2>
              <p className="text-cinza-texto text-sm leading-relaxed max-w-md">
                Crie seu perfil com portfólio real, receba contatos diretamente e cresça sem pagar comissão por serviço. 30 dias grátis.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                {["Perfil verificado", "Portfólio ilimitado", "Contato direto", "Sem comissão"].map((item) => (
                  <span key={item} className="text-xs font-semibold text-azul-principal">
                    — {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Coluna do Mascote */}
            <div className="hidden lg:flex items-center justify-center shrink-0">
              <div className="relative w-36 h-36">
                <Image
                  src="/mascote/f33fcdef-61d8-4c99-896a-b9da770a0f0e.png"
                  alt="Mascote Prumo Pro com Ferramentas"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
              <div className="text-right">
                <div
                  className="text-4xl font-extrabold text-azul-noite"
                  style={displayStyle}
                >
                  R$&nbsp;79
                </div>
                <div className="text-xs text-cinza-texto">/mês após 30 dias grátis</div>
              </div>
              <Link
                href="/seja-profissional"
                className="inline-flex items-center gap-2 bg-laranja-obra hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-colors duration-200 text-sm shadow-lg shadow-laranja-obra/25 cursor-pointer"
              >
                Criar meu perfil grátis
                <ArrowRight size={16} />
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-cinza-texto">
                <Clock size={11} />
                Sem cartão de crédito
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        <MestreTip text="Dúvidas sobre a contratação? Fale diretamente com o profissional por WhatsApp ou telefone. Na Prumo, a negociação é 100% direta e sem taxas de intermediação!" />
      </div>

      <FAQ />

      {showAuthModal && <ContractorAuthModal />}
    </div>
  );
}
