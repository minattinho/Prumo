"use client";

import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { Transaction } from "./page";

type Props = {
  status: string;
  trialEndsAt: string | null;
  periodEnd: string | null;
  transactions: Transaction[];
};

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: React.ReactNode; heroClass: string }
> = {
  TRIAL: {
    label: "Trial gratuito",
    badgeClass: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: <Clock className="w-4 h-4" />,
    heroClass: "bg-amber-50 border-amber-200",
  },
  ACTIVE: {
    label: "Ativo",
    badgeClass: "bg-green-100 text-green-700 border border-green-200",
    icon: <CheckCircle2 className="w-4 h-4" />,
    heroClass: "bg-green-50 border-green-200",
  },
  CANCELLED: {
    label: "Cancelado",
    badgeClass: "bg-red-100 text-red-700 border border-red-200",
    icon: <XCircle className="w-4 h-4" />,
    heroClass: "bg-red-50 border-red-200",
  },
  SUSPENDED: {
    label: "Suspenso",
    badgeClass: "bg-gray-100 text-gray-600 border border-gray-200",
    icon: <AlertTriangle className="w-4 h-4" />,
    heroClass: "bg-gray-50 border-gray-200",
  },
};

const TX_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  COMPLETED: { label: "Pago",        className: "bg-green-100 text-green-700" },
  PENDING:   { label: "Pendente",    className: "bg-amber-100 text-amber-700" },
  FAILED:    { label: "Falhou",      className: "bg-red-100 text-red-600"     },
  REFUNDED:  { label: "Reembolsado", className: "bg-gray-100 text-gray-600"   },
};

const PLAN_FEATURES = [
  { icon: Zap,        label: "Perfil destacado nas buscas" },
  { icon: Shield,     label: "Selo de profissional verificado" },
  { icon: TrendingUp, label: "Relatórios de acessos e métricas" },
  { icon: CreditCard, label: "Cancele quando quiser" },
];

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function SubscriptionClient({ status, trialEndsAt, periodEnd, transactions }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.TRIAL;

  let trialDaysLeft: number | null = null;
  if (status === "TRIAL" && trialEndsAt) {
    const diff = new Date(trialEndsAt).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const isUrgent = status === "TRIAL" && trialDaysLeft !== null && trialDaysLeft <= 7;

  return (
    <div className="space-y-5">

      {/* Plan hero card */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {/* Top accent */}
        <div className="h-1 bg-linear-to-r from-azul-principal to-azul-medio" />

        <div className="p-6">
          {/* Plan header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-azul-claro flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-azul-principal" />
              </div>
              <div>
                <p className="text-base font-bold text-azul-noite">Plano Prumo Pro</p>
                <p className="text-sm text-cinza-texto">
                  <span className="font-bold text-azul-noite text-lg">R$79</span>
                  <span className="text-xs ml-0.5">/mês</span>
                </p>
              </div>
            </div>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${cfg.badgeClass}`}>
              {cfg.icon}
              {cfg.label}
            </span>
          </div>

          {/* Status message */}
          <div className={`rounded-xl border p-4 mb-5 ${cfg.heroClass}`}>
            {status === "TRIAL" && trialDaysLeft !== null && (
              <div className="flex items-center gap-3">
                <div>
                  <p className={`text-3xl font-bold leading-none ${isUrgent ? "text-orange-600" : "text-azul-noite"}`}>
                    {trialDaysLeft}
                    <span className="text-sm font-normal text-cinza-texto ml-1.5">
                      {trialDaysLeft === 1 ? "dia restante" : "dias restantes"}
                    </span>
                  </p>
                  <p className="text-xs text-cinza-texto mt-1">
                    {isUrgent
                      ? "Assine agora para manter seu perfil visível."
                      : "Seu trial termina em breve. Assine para continuar."}
                  </p>
                </div>
              </div>
            )}
            {status === "ACTIVE" && periodEnd && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Assinatura ativa</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Próxima cobrança:{" "}
                    <span className="font-bold">
                      {new Date(periodEnd).toLocaleDateString("pt-BR")}
                    </span>
                  </p>
                </div>
              </div>
            )}
            {(status === "CANCELLED" || status === "SUSPENDED") && (
              <div className="flex items-center gap-2">
                {status === "CANCELLED"
                  ? <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  : <AlertTriangle className="w-5 h-5 text-gray-500 shrink-0" />
                }
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    {status === "CANCELLED" ? "Assinatura cancelada" : "Assinatura suspensa"}
                  </p>
                  <p className="text-xs text-red-700 mt-0.5">
                    Seu perfil está oculto na plataforma até a reativação.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {PLAN_FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-cinza-texto">
                <Icon className="w-3.5 h-3.5 text-azul-principal shrink-0" />
                {label}
              </div>
            ))}
          </div>

          {/* CTA */}
          {status === "TRIAL" && (
            <Link
              href="/planos"
              className="flex items-center justify-center gap-2 w-full bg-laranja-obra hover:opacity-90 text-white font-semibold rounded-xl py-3 text-sm transition-opacity"
            >
              Assinar agora — R$79/mês
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {status === "ACTIVE" && (
            <div className="relative group inline-block w-full">
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-cinza-texto font-medium rounded-xl py-3 text-sm cursor-not-allowed opacity-60"
              >
                Gerenciar assinatura
              </button>
              <span className="absolute left-1/2 -translate-x-1/2 -top-9 text-xs bg-azul-noite text-white px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Disponível em breve
              </span>
            </div>
          )}
          {(status === "CANCELLED" || status === "SUSPENDED") && (
            <Link
              href="/planos"
              className="flex items-center justify-center gap-2 w-full bg-azul-principal hover:bg-azul-noite text-white font-semibold rounded-xl py-3 text-sm transition-colors"
            >
              Reativar assinatura
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-azul-noite">Histórico de pagamentos</h2>
          {transactions.length > 0 && (
            <span className="text-xs text-cinza-texto">{transactions.length} transações</span>
          )}
        </div>

        {transactions.length === 0 ? (
          <div className="py-12 flex flex-col items-center gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-cinza-texto">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-cinza-texto">
                  <th className="text-left px-6 py-3 font-semibold">Data</th>
                  <th className="text-left px-4 py-3 font-semibold">Descrição</th>
                  <th className="text-right px-4 py-3 font-semibold">Valor</th>
                  <th className="text-right px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const txCfg = TX_STATUS_CONFIG[tx.status] ?? TX_STATUS_CONFIG.PENDING;
                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-6 text-cinza-texto text-xs whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-azul-noite">Prumo Pro — mensal</td>
                      <td className="py-3.5 px-4 text-right font-semibold text-azul-noite whitespace-nowrap">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${txCfg.className}`}>
                          {txCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
