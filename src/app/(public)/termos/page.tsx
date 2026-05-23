import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Prumo",
  description: "Leia os termos de uso da plataforma Prumo antes de utilizar nossos serviços.",
};

const LAST_UPDATED = "25 de abril de 2025";

const SECTIONS = [
  {
    title: "1. Aceitação dos termos",
    content: [
      "Ao acessar ou utilizar a plataforma Prumo, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços. Estes termos se aplicam a todos os usuários da plataforma, incluindo contratantes e profissionais.",
    ],
  },
  {
    title: "2. Descrição do serviço",
    content: [
      "O Prumo é uma plataforma de marketplace que conecta pessoas que precisam de serviços (contratantes) com profissionais autônomos e empresas (profissionais). O Prumo facilita a conexão, mas não é parte do contrato de prestação de serviço celebrado entre contratante e profissional.",
      "O Prumo não garante a qualidade, segurança ou legalidade dos serviços prestados pelos profissionais cadastrados, nem a capacidade dos contratantes de efetuar pagamentos.",
    ],
  },
  {
    title: "3. Cadastro e responsabilidades",
    content: [
      "Para utilizar recursos completos da plataforma, você deve criar uma conta com informações verdadeiras, completas e atualizadas. Você é responsável por manter a confidencialidade da sua senha e por todas as atividades realizadas em sua conta.",
      "Profissionais que se cadastram como tal declaram ser juridicamente capazes de prestar os serviços anunciados e autorizam o Prumo a realizar verificação de CPF e antecedentes antes da ativação do perfil.",
      "O uso de informações falsas ou enganosas pode resultar na suspensão ou exclusão da conta sem aviso prévio.",
    ],
  },
  {
    title: "4. Conteúdo do usuário",
    content: [
      "Ao publicar fotos, avaliações, descrições ou qualquer outro conteúdo na plataforma, você garante que possui os direitos necessários sobre esse conteúdo e concede ao Prumo uma licença não exclusiva, gratuita e mundial para exibir esse conteúdo na plataforma.",
      "É proibido publicar conteúdo falso, difamatório, ilegal, que viole direitos de terceiros ou que seja impróprio. O Prumo pode remover qualquer conteúdo que viole estas regras, a seu exclusivo critério.",
      "Avaliações só podem ser publicadas por usuários que efetivamente contrataram o profissional avaliado. Avaliações falsas ou compradas resultam em exclusão da conta.",
    ],
  },
  {
    title: "5. Uso proibido",
    content: [
      "É proibido utilizar a plataforma para: praticar fraudes, coletar dados de usuários sem autorização, realizar spam ou comunicações não solicitadas, tentar acessar sistemas ou dados de outros usuários, publicar informações de contato em campos não destinados a isso, ou qualquer atividade que viole leis brasileiras ou direitos de terceiros.",
    ],
  },
  {
    title: "6. Limitação de responsabilidade",
    content: [
      "O Prumo não se responsabiliza por danos diretos, indiretos, incidentais ou consequentes decorrentes do uso da plataforma, incluindo mas não limitado a: qualidade dos serviços prestados por profissionais, disputas entre contratantes e profissionais, perda de dados, ou interrupções no serviço.",
      "A responsabilidade máxima do Prumo em relação a qualquer reclamação fica limitada ao valor pago pelo usuário à plataforma nos últimos 12 meses, ou R$ 100,00, o que for maior.",
    ],
  },
  {
    title: "7. Planos e pagamentos",
    content: [
      "Profissionais podem contratar planos pagos para acesso a recursos adicionais. Os planos são cobrados de forma recorrente conforme o período escolhido. O cancelamento pode ser feito a qualquer momento, com efeito ao final do período vigente.",
      "O Prumo reserva-se o direito de alterar os preços dos planos com aviso prévio de 30 dias. Reembolsos são concedidos apenas nos casos previstos no Código de Defesa do Consumidor.",
    ],
  },
  {
    title: "8. Modificações dos termos",
    content: [
      "O Prumo pode modificar estes termos a qualquer momento. Mudanças significativas serão comunicadas por e-mail ou notificação na plataforma com antecedência mínima de 15 dias. O uso continuado da plataforma após a vigência das alterações constitui aceitação dos novos termos.",
    ],
  },
  {
    title: "9. Rescisão",
    content: [
      "O Prumo pode suspender ou encerrar sua conta a qualquer momento, com ou sem aviso, se você violar estes termos. Você pode encerrar sua conta a qualquer momento através das configurações do perfil ou pelo e-mail suporte@prumo.com.br.",
    ],
  },
  {
    title: "10. Lei aplicável e foro",
    content: [
      "Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da Comarca de São Paulo, SP, como competente para dirimir quaisquer disputas decorrentes destes termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.",
    ],
  },
  {
    title: "11. Contato",
    content: [
      "Para dúvidas sobre estes termos, entre em contato pelo e-mail juridico@prumo.com.br ou pelo endereço registrado na nossa Política de Privacidade.",
    ],
  },
];

export default function TermosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-azul-noite text-white py-20 px-6 relative overflow-hidden">
        {/* Linhas sutis de blueprint em SVG no fundo */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos no fundo */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-azul-principal opacity-[0.10] filter blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-laranja-obra text-sm font-semibold uppercase tracking-widest mb-4">
            Empresa
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Termos de Uso
          </h1>
          <p className="text-white/50 text-sm">
            Última atualização: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-cinza-texto leading-relaxed text-base mb-12 pb-12 border-b border-gray-100">
            Leia estes Termos de Uso com atenção antes de utilizar a plataforma
            Prumo. Ao utilizar nossos serviços, você concorda com todas as
            condições aqui descritas.
          </p>

          <div className="flex flex-col gap-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold text-azul-noite mb-4">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="text-cinza-texto leading-relaxed text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
