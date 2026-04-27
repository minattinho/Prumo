import { RegisterForm } from "./register-form";
import Link from "next/link";
import { ShieldCheck, Star, Phone } from "lucide-react";

export const metadata = {
  title: "Criar conta",
};

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Profissionais verificados",
    description: "CPF e antecedentes validados antes de qualquer ativação.",
  },
  {
    icon: Star,
    title: "Avaliações reais",
    description: "Só avalia quem contratou de verdade. Zero fraude.",
  },
  {
    icon: Phone,
    title: "Contato direto",
    description: "Sem intermediários, sem taxas, sem enrolação.",
  },
];

export default function CadastroPage() {
  return (
    <div className="h-full flex">

      {/* ─── Painel esquerdo (branding) — oculto em mobile ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-azul-noite flex-col justify-between p-10 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-cadastro" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-cadastro)" />
          </svg>
        </div>

        {/* Blob decorativo */}
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #E8761A, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 bg-laranja-obra rounded-xl flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Prumo</span>
          </Link>
          <p className="mt-3 text-blue-300 text-sm">Sua obra no prumo.</p>
        </div>

        {/* Trust items */}
        <div className="relative space-y-6">
          <h2 className="text-white font-bold text-xl leading-snug">
            Crie sua conta e encontre<br />o profissional certo hoje.
          </h2>

          <div className="space-y-5">
            {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-blue-300 text-xs mt-0.5 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testemunho */}
        <div className="relative border-l-2 border-laranja-obra pl-5">
          <p className="text-blue-200 text-sm italic leading-relaxed">
            "Em menos de uma hora já tinha três orçamentos. O portfólio dos profissionais me deu segurança antes mesmo de entrar em contato."
          </p>
          <p className="text-blue-400 text-xs mt-2">— Carlos M., contratante em Curitiba</p>
        </div>
      </div>

      {/* ─── Painel direito (formulário) ─── */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-5">
            <Link href="/" className="inline-flex items-center gap-2 justify-center">
              <div className="w-8 h-8 bg-laranja-obra rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-azul-principal tracking-tight">Prumo</span>
            </Link>
            <p className="mt-1.5 text-cinza-texto text-sm">Sua obra no prumo.</p>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-azul-noite">Crie sua conta</h1>
            <p className="text-cinza-texto text-sm mt-1">
              Para encontrar profissionais e pedir orçamentos.
            </p>
          </div>

          <RegisterForm />

          <div className="mt-5 space-y-2">
            <p className="text-center text-sm text-cinza-texto">
              Já tem conta?{" "}
              <Link href="/entrar" className="text-azul-principal font-semibold hover:underline cursor-pointer">
                Entrar
              </Link>
            </p>
            <p className="text-center text-sm text-cinza-texto">
              É profissional?{" "}
              <Link href="/seja-profissional" className="text-azul-principal font-semibold hover:underline cursor-pointer">
                Cadastre seu perfil
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
