import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Star, Search, UserCheck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "Como Funciona | Prumo",
  description: "Entenda como a Prumo conecta clientes a prestadores de serviços de excelência de forma direta, sem comissões.",
};

const stepsContractor = [
  {
    step: "01",
    title: "Busque Profissionais",
    description: "Filtre prestadores por especialidade, cidade, raio de atendimento e veja avaliações reais e portfólios detalhados.",
    icon: Search,
  },
  {
    step: "02",
    title: "Converse Sem Custos",
    description: "Abra o canal de contato direto (WhatsApp, telefone ou e-mail) do profissional. Negocie diretamente, sem intermediários.",
    icon: MessageCircle,
  },
  {
    step: "03",
    title: "Contrate com Segurança",
    description: "Combine escopo, prazos e pagamentos. Após a conclusão, avalie o prestador para ajudar a manter a comunidade qualificada.",
    icon: UserCheck,
  },
];

const stepsProfessional = [
  {
    step: "01",
    title: "Crie Seu Perfil Pro",
    description: "Insira seu CPF/CNPJ, fotos de trabalhos anteriores, áreas de atuação e canais de contato preferenciais.",
    icon: CheckCircle2,
  },
  {
    step: "02",
    title: "Seja Verificado",
    description: "Nossa equipe realiza uma checagem rigorosa de antecedentes criminais e autenticidade cadastral para te conceder o selo de confiança.",
    icon: ShieldCheck,
  },
  {
    step: "03",
    title: "Receba Contatos Diretos",
    description: "Clientes interessados entram em contato diretamente com você. Feche serviços, monte sua clientela e fique com 100% do seu faturamento.",
    icon: Star,
  },
];

export default function ComoFuncionaPage() {
  return (
    <div className="bg-background min-h-screen text-azul-noite">
      
      {/* 1. HERO SECTION - Night Foundation Commitment */}
      <section className="bg-azul-noite text-white px-4 py-20 sm:py-28 relative overflow-hidden border-b border-azul-medio/20">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos no fundo */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-azul-principal opacity-[0.12] filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-laranja-obra opacity-[0.06] filter blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-laranja-obra mb-3">
            O JEITO PRUMO
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display mb-6 max-w-3xl mx-auto leading-tight">
            Conexão direta, honesta e sem intermediários.
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-light">
            Esqueça as taxas abusivas dos aplicativos tradicionais. Na Prumo, clientes encontram prestadores de serviços de elite e negociam direto. O trabalho é seu; o resultado também.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/profissionais"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-azul-principal hover:bg-[#154fa0] text-white rounded-lg px-6 py-3.5 text-base font-semibold transition-colors duration-200"
            >
              Encontrar Profissionais
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/planos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-laranja-obra hover:bg-[#cc6515] text-white rounded-2xl px-8 py-3.5 text-base font-semibold transition-colors duration-200"
            >
              Quero Anunciar Meu Serviço
            </Link>
          </div>
        </div>
      </section>

      {/* 2. SECTION: PARA QUEM BUSCA (CLIENTE) - bg-canvas (White) */}
      <section className="bg-background px-4 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-laranja-obra mb-2">
              PARA CLIENTES
            </p>
            <h2 className="text-3xl font-bold tracking-tight font-display text-azul-noite">
              Como contratar o profissional ideal
            </h2>
            <p className="text-sm sm:text-base text-cinza-texto mt-4 leading-relaxed font-sans">
              Sem burocracias, sem comissões ocultas. Apenas três passos simples para resolver sua necessidade com quem entende do assunto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stepsContractor.map(({ step, title, description, icon: Icon }) => (
              <div key={title} className="rounded-card bg-background border border-gray-100 p-8 shadow-card flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-azul-claro text-azul-principal flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className="text-sm font-bold text-azul-medio/80 tracking-wider">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-azul-noite mb-2">{title}</h3>
                  <p className="text-sm text-cinza-texto leading-relaxed font-sans">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/profissionais"
              className="inline-flex items-center gap-2 bg-azul-principal hover:bg-[#154fa0] text-white rounded-lg px-6 py-3.5 text-sm font-semibold transition-colors duration-200"
            >
              Ver prestadores na sua região
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. SECTION: PARA O PROFISSIONAL - bg-[#F4F7FB] (Pale Blueprint) */}
      <section className="bg-[#F4F7FB] px-4 py-16 sm:py-24 border-y border-grid-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-laranja-obra mb-2">
              PARA PROFISSIONAIS
            </p>
            <h2 className="text-3xl font-bold tracking-tight font-display text-azul-noite">
              Conquiste mais clientes e cresça de verdade
            </h2>
            <p className="text-sm sm:text-base text-cinza-texto mt-4 leading-relaxed font-sans">
              Um perfil na Prumo Pro funciona como sua vitrine exclusiva de alto nível. Você recebe contatos diretos sem pagar nenhuma taxa de intermediação por serviço fechado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stepsProfessional.map(({ step, title, description, icon: Icon }) => (
              <div key={title} className="rounded-card bg-white border border-gray-100 p-8 shadow-card flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-azul-claro text-azul-principal flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <span className="text-sm font-bold text-azul-medio/80 tracking-wider">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold font-display text-azul-noite mb-2">{title}</h3>
                  <p className="text-sm text-cinza-texto leading-relaxed font-sans">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 bg-laranja-obra hover:bg-[#cc6515] text-white rounded-2xl px-8 py-4 text-sm font-semibold transition-colors duration-200"
            >
              Criar perfil profissional agora
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SECTION: FAQ (Accordion) - bg-canvas (White) */}
      <section className="bg-background px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-laranja-obra mb-2">
              DÚVIDAS FREQUENTES
            </p>
            <h2 className="text-3xl font-bold tracking-tight font-display text-azul-noite">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-cinza-texto mt-2 font-sans">
              Tem alguma dúvida sobre o funcionamento da plataforma? Encontre sua resposta abaixo.
            </p>
          </div>

          <Accordion multiple={false} className="border-t border-grid-line">
            <AccordionItem value="faq-1" className="border-b border-grid-line py-2">
              <AccordionTrigger className="text-base font-bold text-azul-noite py-4 hover:text-azul-principal hover:no-underline font-display transition-colors">
                Como a Prumo garante a segurança das contratações?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-cinza-texto leading-relaxed font-sans pt-1 pb-4">
                A Prumo realiza um processo rigoroso de verificação de identidade (CPF/CNPJ) e antecedentes criminais de todos os profissionais que possuem o selo de Verificado. Além disso, disponibilizamos um histórico de avaliações reais e portfólios completos para que você contrate com total segurança.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border-b border-grid-line py-2">
              <AccordionTrigger className="text-base font-bold text-azul-noite py-4 hover:text-azul-principal hover:no-underline font-display transition-colors">
                Existe alguma cobrança de comissão sobre os serviços?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-cinza-texto leading-relaxed font-sans pt-1 pb-4">
                Não. A Prumo não cobra nenhuma porcentagem ou comissão sobre os valores negociados entre clientes e profissionais. Acreditamos no livre mercado e na negociação direta. Todo o valor do serviço fechado pertence integralmente ao prestador.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border-b border-grid-line py-2">
              <AccordionTrigger className="text-base font-bold text-azul-noite py-4 hover:text-azul-principal hover:no-underline font-display transition-colors">
                Como funciona a assinatura para profissionais?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-cinza-texto leading-relaxed font-sans pt-1 pb-4">
                Profissionais podem se cadastrar e experimentar a plataforma gratuitamente no período de testes (Trial). Para continuar anunciando seus serviços, recebendo contatos diretos de novos clientes e mantendo o selo de verificação de alto nível ativo, o profissional assina o plano Prumo Pro por uma mensalidade fixa de R$ 79,00, sem contratos de fidelidade.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border-b border-grid-line py-2">
              <AccordionTrigger className="text-base font-bold text-azul-noite py-4 hover:text-azul-principal hover:no-underline font-display transition-colors">
                Como faço para falar direto com o prestador?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-cinza-texto leading-relaxed font-sans pt-1 pb-4">
                Ao acessar o perfil do profissional desejado, basta clicar em um dos botões de contato disponíveis para iniciar a conversa instantaneamente pelo WhatsApp, realizar uma ligação telefônica ou enviar um e-mail. Você escolhe a melhor forma de se comunicar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border-b border-grid-line py-2">
              <AccordionTrigger className="text-base font-bold text-azul-noite py-4 hover:text-azul-principal hover:no-underline font-display transition-colors">
                Como posso avaliar um serviço prestado?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-cinza-texto leading-relaxed font-sans pt-1 pb-4">
                Após entrar em contato com um profissional pela plataforma, o cliente ganha a permissão de registrar uma avaliação sobre o atendimento recebido diretamente na página de perfil do prestador. Sua avaliação ajuda a fortalecer a comunidade de excelência da Prumo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

    </div>
  );
}
