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
    <section className="py-14 px-4 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Stat strip */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-0 mb-14 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {metrics.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center px-10 py-4 sm:py-0">
              <span
                className="text-4xl font-extrabold text-azul-noite leading-none tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {value}
              </span>
              <span className="text-sm text-cinza-texto/70 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, quote }) => (
            <article key={name} className="border border-gray-100 rounded-xl p-6 bg-[#F8FAFC]">
              <p className="text-sm text-cinza-texto leading-relaxed mb-5">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-azul-noite">{name}</p>
                <p className="text-xs text-cinza-texto/70 mt-0.5">{role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
