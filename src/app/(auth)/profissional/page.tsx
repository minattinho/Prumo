import Link from "next/link";
import { LoginForm } from "../login-form";
import { Logo } from "@/components/layout/logo";

export const metadata = {
  title: "Acesso Profissional - Prumo",
};

export default function ProfissionalPage() {
  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      {/* Coluna Lateral — Esquerda (Night Foundation com Toques Quentes de Obras) */}
      <aside className="hidden min-h-screen bg-azul-noite px-10 py-8 lg:flex lg:w-[46%] xl:px-12 xl:py-10 border-r border-white/10 relative overflow-hidden select-none shrink-0">
        {/* Linhas sutis de blueprint em SVG no fundo da coluna lateral */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Efeitos de iluminação modernos e distintos no fundo */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-azul-principal opacity-[0.12] filter blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-laranja-obra opacity-[0.06] filter blur-3xl" />
        
        <div className="flex h-full max-w-md flex-col justify-between relative z-10">
          <Logo variant="white" />

          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-laranja-obra/10 border border-laranja-obra/25 px-3 py-1 text-xs font-bold uppercase tracking-wider text-laranja-obra mb-4">
                🛠️ Área do Profissional
              </span>
            </div>
            <h2
              className="text-3xl font-black leading-tight tracking-tight text-white xl:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Seu trabalho de excelência merece a melhor vitrine.
            </h2>
            <p className="text-sm leading-relaxed text-blue-100/90">
              Conectamos especialistas da construção civil e arquitetura aos melhores projetos do Brasil, com total transparência e autonomia.
            </p>

            {/* Lista distinta de benefícios com design técnico para profissionais */}
            <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-laranja-obra/10 text-laranja-obra text-xs font-bold">✓</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Negociações Diretas</h4>
                  <p className="text-xs text-blue-200/75 mt-0.5">Combine orçamentos e prazos direto no seu WhatsApp, sem taxas ocultas.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-laranja-obra/10 text-laranja-obra text-xs font-bold">✓</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Preço sob Consulta</h4>
                  <p className="text-xs text-blue-200/75 mt-0.5">Defina valores de referência ou escolha combinar o valor diretamente com o cliente.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-laranja-obra/10 text-laranja-obra text-xs font-bold">✓</span>
                <div>
                  <h4 className="text-sm font-semibold text-white">Sua Marca em Destaque</h4>
                  <p className="text-xs text-blue-200/75 mt-0.5">Exiba fotos de projetos reais concluídos e construa uma reputação sólida.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-blue-200/40">
            © {new Date().getFullYear()} Prumo. Ferramentas de trabalho para quem constrói.
          </div>
        </div>
      </aside>

      {/* Coluna Central — Direita (Formulário) */}
      <main 
        className="min-h-screen flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 flex flex-col justify-center bg-white relative"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #e2eaf4 1.2px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      >
        {/* Card do Formulário com detalhe de topo em Laranja Obra diferenciando completamente do Contratante */}
        <div className="mx-auto w-full max-w-md bg-white border-t-4 border-t-laranja-obra border-x border-b border-gray-100 rounded-b-2xl rounded-t-lg p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-sm z-10">
          
          {/* Tag de Contexto no topo */}
          <div className="flex justify-center lg:justify-start mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-laranja-obra/5 border border-laranja-obra/10 px-2.5 py-0.5 text-xs font-semibold text-laranja-obra select-none">
              Painel do Profissional
            </span>
          </div>

          {/* Logo no mobile */}
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <Logo variant="default" className="mb-2" />
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1
              className="text-2xl font-black text-azul-noite tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Acesse o painel
            </h1>
            <p className="text-cinza-texto text-sm mt-1">
              Faça login para gerenciar seus serviços, portfólio e contatos.
            </p>
          </div>

          <LoginForm authSource="professional" defaultNext="/painel" />

          <p className="text-center text-sm text-cinza-texto mt-6 pt-6 border-t border-gray-100">
            Ainda não tem perfil profissional?{" "}
            <Link
              href={`${
                process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br"
              }/seja-profissional`}
              className="text-laranja-obra font-bold hover:text-orange-700 hover:underline transition-colors cursor-pointer"
            >
              Cadastre-se na plataforma
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
