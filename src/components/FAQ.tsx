"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "O pagamento é feito pela Prumo?",
    answer: "Não. A Prumo conecta contratantes e profissionais; valores, prazos e pagamento são combinados diretamente entre as partes.",
  },
  {
    question: "Como sei se um profissional é seguro?",
    answer: "Perfis podem incluir verificação, portfólio real, avaliações e histórico de atendimento para apoiar sua decisão antes do contato.",
  },
  {
    question: "Posso trocar de profissional depois do contato?",
    answer: "Sim. Você pode conversar com quantos profissionais quiser e escolher quem combina melhor com o serviço.",
  },
  {
    question: "Quanto custa para contratar?",
    answer: "Buscar e falar com profissionais é gratuito para contratantes. O custo do serviço é negociado diretamente com o profissional.",
  },
  {
    question: "As avaliações são públicas?",
    answer: "Sim. Avaliações ajudam outros contratantes a comparar experiências reais e escolher com mais confiança.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 sm:py-20 px-4 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-laranja-obra uppercase tracking-widest mb-2">Dúvidas comuns</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-azul-noite">Perguntas frequentes</h2>
        </div>

        <div className="divide-y divide-gray-100 rounded-card bg-white shadow-card border border-gray-100">
          {faqs.map(({ question, answer }, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-azul-noite">{question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-cinza-texto transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-cinza-texto leading-relaxed">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
