import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Prumo",
  description:
    "Saiba como o Prumo coleta, usa e protege os seus dados pessoais.",
};

const LAST_UPDATED = "25 de abril de 2025";

const SECTIONS = [
  {
    title: "1. Informações que coletamos",
    content: [
      "Coletamos informações que você nos fornece diretamente ao criar uma conta, preencher formulários ou utilizar nossos serviços. Isso inclui nome, e-mail, telefone, CPF (para verificação de profissionais), endereço e informações de pagamento quando aplicável.",
      "Também coletamos automaticamente dados de uso da plataforma: páginas visitadas, buscas realizadas, interações com perfis de profissionais e informações técnicas do dispositivo (tipo de navegador, endereço IP, sistema operacional).",
    ],
  },
  {
    title: "2. Como usamos os dados",
    content: [
      "Utilizamos suas informações para operar e melhorar a plataforma, processar transações, verificar a identidade de profissionais, exibir avaliações e portfólios, e enviar comunicações relacionadas ao serviço.",
      "Também podemos usar dados agregados e anonimizados para análises internas e melhorias de produto. Nunca vendemos seus dados pessoais a terceiros.",
    ],
  },
  {
    title: "3. Compartilhamento de dados",
    content: [
      "Compartilhamos informações apenas nos seguintes casos: (a) com provedores de serviço que nos auxiliam na operação da plataforma, como processadores de pagamento e provedores de hospedagem, todos sob acordo de confidencialidade; (b) quando exigido por lei ou ordem judicial; (c) para proteger os direitos e segurança do Prumo, de nossos usuários ou do público.",
      "O contato entre contratantes e profissionais (WhatsApp, telefone) é fornecido pelo próprio profissional em seu perfil público. Não intermediamos nem registramos essas conversas.",
    ],
  },
  {
    title: "4. Cookies e tecnologias similares",
    content: [
      "Utilizamos cookies e tecnologias similares para manter sua sessão ativa, lembrar suas preferências, entender como você usa a plataforma e exibir conteúdo relevante.",
      "Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade de algumas partes do site. Não utilizamos cookies para publicidade de terceiros.",
    ],
  },
  {
    title: "5. Seus direitos (LGPD)",
    content: [
      "Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de: acessar os dados que temos sobre você; solicitar a correção de dados incorretos; solicitar a exclusão dos seus dados; revogar consentimentos previamente dados; obter informações sobre o compartilhamento dos seus dados.",
      "Para exercer qualquer desses direitos, entre em contato pelo e-mail contato@prumo.com.br. Responderemos em até 15 dias úteis.",
    ],
  },
  {
    title: "6. Retenção de dados",
    content: [
      "Mantemos seus dados pelo tempo necessário para prestar os serviços e cumprir obrigações legais. Após o encerramento da conta, podemos reter dados por até 5 anos para fins legais e de resolução de disputas.",
    ],
  },
  {
    title: "7. Segurança",
    content: [
      "Adotamos medidas técnicas e organizacionais apropriadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia em trânsito (HTTPS), controle de acesso e monitoramento de atividades suspeitas.",
    ],
  },
  {
    title: "8. Contato",
    content: [
      "Se tiver dúvidas sobre esta política ou sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados (DPO) pelo e-mail contato@prumo.com.br.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-azul-noite text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-laranja-obra text-sm font-semibold uppercase tracking-widest mb-4">
            Empresa
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Política de Privacidade
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
            Esta Política de Privacidade descreve como o Prumo coleta, usa,
            armazena e protege as informações dos usuários da plataforma. Ao
            utilizar nossos serviços, você concorda com as práticas descritas
            neste documento.
          </p>

          <div className="flex flex-col gap-10">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-lg font-bold text-azul-noite mb-4">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.content.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-cinza-texto leading-relaxed text-base"
                    >
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
