import { ShieldCheck, Star, Wrench } from "lucide-react";

const metrics = [
  { value: "1.200+", label: "profissionais verificados" },
  { value: "5.000+", label: "serviços realizados" },
  { value: "4.8★", label: "avaliação média" },
];

const testimonials = [
  {
    name: "Marina Costa",
    role: "Contratante em São Paulo",
    quote: "Encontrei um eletricista no mesmo dia e consegui comparar portfólios antes de chamar.",
  },
  {
    name: "Rafael Lima",
    role: "Arquiteto parceiro",
    quote: "O perfil com fotos dos projetos ajuda clientes certos a chegarem com mais contexto.",
  },
  {
    name: "Bianca Torres",
    role: "Contratante em Campinas",
    quote: "Gostei de falar direto com o profissional e ver avaliações de outros clientes.",
  },
];

export function SocialProof() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {metrics.map(({ value, label }) => (
            <div key={label} className="rounded-card border border-gray-100 bg-[#F8FAFC] p-5 text-center">
              <p className="text-2xl font-bold text-azul-noite">{value}</p>
              <p className="text-sm text-cinza-texto mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map(({ name, role, quote }, index) => {
            const Icon = index === 0 ? Wrench : index === 1 ? ShieldCheck : Star;
            return (
              <article key={name} className="rounded-card border border-gray-100 p-5 shadow-card bg-white">
                <div className="w-10 h-10 rounded-lg bg-azul-claro text-azul-principal flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <p className="text-sm text-cinza-texto leading-relaxed">{quote}</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-azul-noite">{name}</p>
                  <p className="text-xs text-cinza-texto">{role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
