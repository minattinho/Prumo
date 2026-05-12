"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Sparkles,
  LayoutDashboard,
  User,
  Images,
  Briefcase,
  MessageSquare,
  Star,
  Activity,
  CreditCard,
  Settings,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { completeOnboarding } from "./onboarding-actions";

const STEPS = [
  {
    icon: Sparkles,
    color: "#1A5DB8",
    bg: "#EAF0FB",
    title: "Bem-vindo ao Prumo!",
    description:
      "Este é o seu painel profissional — o lugar onde você gerencia sua presença, recebe pedidos de clientes e acompanha seu crescimento. Vamos te mostrar tudo em menos de 1 minuto.",
    illustration: (
      <div className="flex items-center justify-center gap-3 py-2">
        <div className="w-8 h-24 rounded-lg bg-[#1A5DB8]/20 flex flex-col gap-1.5 p-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 rounded bg-[#1A5DB8]/40" />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-10 rounded-lg bg-[#1A5DB8]/10 flex items-center justify-center">
            <div className="w-16 h-2 rounded bg-[#1A5DB8]/30" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: LayoutDashboard,
    color: "#1A5DB8",
    bg: "#EAF0FB",
    title: "Dashboard",
    description:
      "Sua visão geral. Acompanhe a completude do perfil, dias restantes no período de teste, métricas de visualizações e contatos recebidos, além de atalhos para as seções principais.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 rounded-lg bg-[#EAF0FB] p-2 flex flex-col justify-between">
            <div className="w-12 h-2 rounded bg-[#1A5DB8]/30" />
            <div className="w-8 h-3 rounded bg-[#1A5DB8]/60" />
          </div>
          <div className="h-16 rounded-lg bg-[#FFF7ED] p-2 flex flex-col justify-between">
            <div className="w-12 h-2 rounded bg-[#E8761A]/30" />
            <div className="w-8 h-3 rounded bg-[#E8761A]/60" />
          </div>
        </div>
        <div className="h-8 rounded-lg bg-gray-100 flex items-center px-3 gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[#1A5DB8] h-2 rounded-full" style={{ width: "60%" }} />
          </div>
          <span className="text-xs text-[#1A5DB8] font-bold shrink-0">60%</span>
        </div>
      </div>
    ),
  },
  {
    icon: User,
    color: "#4A90E2",
    bg: "#EAF0FB",
    title: "Perfil",
    description:
      "Sua identidade no Prumo. Adicione foto, bio, cidade, especialidades e canais de contato. Um perfil completo aparece com mais destaque nas buscas e gera mais confiança nos clientes.",
    illustration: (
      <div className="flex items-start gap-3 py-1">
        <div className="w-14 h-14 rounded-full bg-[#EAF0FB] border-2 border-[#4A90E2]/30 shrink-0 flex items-center justify-center">
          <User className="w-6 h-6 text-[#4A90E2]/50" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-[#1A2B4A]/20" />
          <div className="h-2 w-full rounded bg-gray-100" />
          <div className="h-2 w-3/4 rounded bg-gray-100" />
          <div className="flex gap-1 mt-1">
            {["Elétrica", "Hidráulica", "Pintura"].map((s) => (
              <span
                key={s}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF0FB] text-[#1A5DB8] border border-[#4A90E2]/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Images,
    color: "#16A34A",
    bg: "#F0FDF4",
    title: "Portfólio",
    description:
      "Mostre seu trabalho. Adicione projetos com fotos, descrição e categoria. Os clientes veem seu portfólio antes de entrar em contato — quanto mais completo, mais chances de fechar serviço.",
    illustration: (
      <div className="grid grid-cols-3 gap-2 py-1">
        {[
          { label: "Instalação", color: "bg-green-100" },
          { label: "Reforma", color: "bg-blue-100" },
          { label: "+ Adicionar", color: "bg-gray-50 border-dashed border-2 border-gray-200" },
        ].map(({ label, color }) => (
          <div
            key={label}
            className={`h-20 rounded-lg ${color} flex flex-col items-center justify-end pb-2`}
          >
            <span className="text-[10px] text-gray-500 font-medium">{label}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Briefcase,
    color: "#16A34A",
    bg: "#F0FDF4",
    title: "Serviços",
    description:
      "Registre trabalhos já concluídos — mesmo fora do Prumo. Isso ajuda a construir seu histórico profissional e mostra aos clientes sua experiência acumulada.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        {[
          { name: "Troca de fiação", value: "R$ 850", date: "Mar 2024" },
          { name: "Manutenção hidráulica", value: "R$ 1.200", date: "Fev 2024" },
        ].map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-green-50 border border-green-100"
          >
            <div>
              <p className="text-xs font-medium text-[#1A2B4A]">{s.name}</p>
              <p className="text-[10px] text-gray-400">{s.date}</p>
            </div>
            <span className="text-xs font-semibold text-green-700">{s.value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: MessageSquare,
    color: "#E8761A",
    bg: "#FFF7ED",
    title: "Solicitações",
    description:
      "Pedidos de orçamento enviados por contratantes. Você recebe os detalhes do serviço e pode responder com uma proposta personalizada — valor, prazo e forma de pagamento.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        <div className="rounded-lg border border-orange-100 bg-[#FFF7ED] p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-20 h-2.5 rounded bg-[#E8761A]/30" />
            <span className="text-[10px] text-orange-500 font-medium bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
              Novo
            </span>
          </div>
          <div className="h-2 w-full rounded bg-gray-100 mb-1" />
          <div className="h-2 w-2/3 rounded bg-gray-100" />
          <button className="mt-3 w-full h-7 rounded-lg bg-[#E8761A] text-[10px] text-white font-medium">
            Enviar proposta
          </button>
        </div>
      </div>
    ),
  },
  {
    icon: Star,
    color: "#D97706",
    bg: "#FFFBEB",
    title: "Avaliações",
    description:
      "As notas e comentários dos seus clientes ficam aqui. Você pode responder publicamente a cada avaliação — isso mostra profissionalismo e aumenta a confiança de novos clientes.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
          <div className="flex items-center gap-1 mb-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < 4 ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
              />
            ))}
          </div>
          <div className="h-2 w-full rounded bg-gray-100 mb-1" />
          <div className="h-2 w-1/2 rounded bg-gray-100" />
          <div className="mt-2 pl-3 border-l-2 border-amber-300">
            <div className="h-2 w-3/4 rounded bg-amber-200/50" />
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Activity,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Acessos",
    description:
      "Saiba quem visitou seu perfil e quem consultou seus contatos. Monitore sua visibilidade e entenda quais dias ou períodos geram mais interesse no seu trabalho.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        {[
          { action: "Visualizou seu perfil", time: "há 2h", dot: "bg-purple-400" },
          { action: "Consultou seu WhatsApp", time: "há 5h", dot: "bg-green-400" },
          { action: "Visualizou seu perfil", time: "ontem", dot: "bg-purple-400" },
        ].map((a, i) => (
          <div key={i} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-purple-50">
            <span className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`} />
            <p className="text-[11px] text-gray-600 flex-1">{a.action}</p>
            <span className="text-[10px] text-gray-400">{a.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: CreditCard,
    color: "#1A5DB8",
    bg: "#EAF0FB",
    title: "Assinatura",
    description:
      "Gerencie seu plano no Prumo. Veja o status da assinatura, a data do próximo vencimento e o histórico de pagamentos. Mantenha a assinatura ativa para seu perfil aparecer nas buscas.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        <div className="rounded-lg bg-[#EAF0FB] border border-[#4A90E2]/20 p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1A5DB8] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-xs font-semibold text-green-700">Ativa</p>
            </div>
            <p className="text-[10px] text-gray-500">Próx. cobrança: 06/05/2025</p>
          </div>
          <span className="text-sm font-bold text-[#1A5DB8]">R$79</span>
        </div>
      </div>
    ),
  },
  {
    icon: Settings,
    color: "#555555",
    bg: "#F8FAFC",
    title: "Configurações",
    description:
      "Altere seu nome, e-mail, telefone e senha. Mantenha seus dados de acesso sempre atualizados para garantir a segurança da sua conta.",
    illustration: (
      <div className="flex flex-col gap-2 py-1">
        {["Nome completo", "E-mail", "Telefone"].map((label) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-400 font-medium">{label}</span>
            <div className="h-8 rounded-lg bg-gray-100 border border-gray-200" />
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: CheckCircle,
    color: "#16A34A",
    bg: "#F0FDF4",
    title: "Tudo pronto!",
    description:
      "Agora você conhece todas as seções do painel. O próximo passo é preencher seu perfil para que os clientes possam te encontrar. Comece agora!",
    illustration: (
      <div className="flex flex-col items-center justify-center gap-3 py-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-green-400" />
            ))}
          </div>
          <p className="text-xs text-gray-400">10 seções exploradas</p>
        </div>
      </div>
    ),
  },
];

const TOTAL = STEPS.length - 1; // steps 0 = welcome, last = finish

export function OnboardingTour({ open }: { open: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(open);
  const [step, setStep] = useState(0);
  const [completing, setCompleting] = useState(false);

  async function finish() {
    setCompleting(true);
    await completeOnboarding();
    setIsOpen(false);
    router.push("/painel/perfil");
  }

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;
  const progress = (step / TOTAL) * 100;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <Dialog.Title className="sr-only">Tour de configuração do perfil</Dialog.Title>
          {/* Barra de progresso */}
          <div className="h-1 w-full bg-gray-100">
            <div
              className="h-full bg-[#1A5DB8] transition-all duration-300"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>

          <div className="p-7">
            {/* Topo: ícone + pill de etapa */}
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: current.bg }}
              >
                <Icon className="w-6 h-6" style={{ color: current.color }} />
              </div>
              {step > 0 && (
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  {step} de {TOTAL}
                </span>
              )}
            </div>

            {/* Título e descrição */}
            <h2 className="text-xl font-bold text-[#1A2B4A] mb-2">{current.title}</h2>
            <p className="text-sm text-[#555555] leading-relaxed mb-5">{current.description}</p>

            {/* Ilustração */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 mb-6">
              {current.illustration}
            </div>

            {/* Rodapé */}
            <div className="flex items-center gap-2">
              {/* Pular (apenas nos slides intermediários) */}
              {!isLast && (
                <button
                  onClick={finish}
                  disabled={completing}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors mr-auto disabled:opacity-50"
                >
                  Pular tour
                </button>
              )}

              {/* Anterior */}
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-[#1A2B4A] hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}

              {/* Próximo / Começar */}
              {isLast ? (
                <button
                  onClick={finish}
                  disabled={completing}
                  className="flex items-center gap-1 ml-auto px-5 py-2 rounded-lg bg-[#1A5DB8] text-sm font-medium text-white hover:bg-[#1A2B4A] transition-colors disabled:opacity-60"
                >
                  {completing ? "Salvando..." : "Ir para o Perfil"}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="flex items-center gap-1 ml-auto px-5 py-2 rounded-lg bg-[#1A5DB8] text-sm font-medium text-white hover:bg-[#1A2B4A] transition-colors"
                >
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
