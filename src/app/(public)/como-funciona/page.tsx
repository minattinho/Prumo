import Link from "next/link";
import { ArrowRight, MessageCircle, Search, UserCheck } from "lucide-react";

const steps = [
  {
    title: "Busque",
    description: "Filtre por serviço, cidade e perfil ideal para o trabalho.",
    icon: Search,
  },
  {
    title: "Contate",
    description: "Veja portfólio, avaliações e fale diretamente com o profissional.",
    icon: MessageCircle,
  },
  {
    title: "Contrate",
    description: "Combine escopo, prazo e pagamento sem intermediação da Prumo.",
    icon: UserCheck,
  },
];

export default function ComoFuncionaPage() {
  return (
    <section className="bg-[#F8FAFC] px-4 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-laranja-obra mb-3">
            Em breve
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-azul-noite">
            Uma página completa de como funciona está a caminho.
          </h1>
          <p className="text-sm sm:text-base text-cinza-texto mt-4 leading-relaxed">
            Enquanto isso, o fluxo da Prumo já é simples: encontre profissionais, converse direto e contrate com confiança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <div key={title} className="rounded-card bg-white border border-gray-100 p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-azul-claro text-azul-principal flex items-center justify-center">
                  <Icon size={22} />
                </div>
                <span className="text-xs font-bold text-cinza-texto">0{index + 1}</span>
              </div>
              <h2 className="font-bold text-azul-noite">{title}</h2>
              <p className="text-sm text-cinza-texto mt-2 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-3 text-sm font-semibold transition-colors"
          >
            Buscar profissionais
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
