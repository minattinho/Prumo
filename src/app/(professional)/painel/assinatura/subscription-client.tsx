"use client";

import Link from "next/link";
import { CreditCard, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { Transaction } from "./page";

type Props = {
  status: string;
  trialEndsAt: string | null;
  periodEnd: string | null;
  transactions: Transaction[];
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  TRIAL: {
    label: "Trial gratuito",
    className: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  ACTIVE: {
    label: "Ativo",
    className: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
    icon: <XCircle className="w-4 h-4 text-red-500" />,
  },
  SUSPENDED: {
    label: "Suspenso",
    className: "bg-gray-100 text-gray-600",
    icon: <AlertTriangle className="w-4 h-4 text-gray-500" />,
  },
};

const TX_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  COMPLETED: { label: "Pago",        className: "bg-green-100 text-green-700" },
  PENDING:   { label: "Pendente",    className: "bg-amber-100 text-amber-700" },
  FAILED:    { label: "Falhou",      className: "bg-red-100 text-red-600"     },
  REFUNDED:  { label: "Reembolsado", className: "bg-gray-100 text-gray-600"   },
};

function formatCurrency(amount: number, currency: string): string {
  // amount stored as decimal (ex: 79.00), not in cents
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

  return (
    <div className="space-y-6">
      {/* Card do plano */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-azul-claro flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-azul-principal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-azul-noite">Plano Prumo Pro</p>
              <p className="text-xs text-cinza-texto">R$79/mês</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>

        {/* Linha informativa contextual */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-cinza-texto">
          {status === "TRIAL" && trialDaysLeft !== null && (
            <p>
              <span className="font-semibold text-azul-noite">{trialDaysLeft}</span>{" "}
              {trialDaysLeft === 1 ? "dia restante" : "dias restantes"} no período gratuito.
            </p>
          )}
          {status === "ACTIVE" && periodEnd && (
            <p>
              Próxima cobrança em{" "}
              <span className="font-medium text-azul-noite">
                {new Date(periodEnd).toLocaleDateString("pt-BR")}
              </span>
              .
            </p>
          )}
          {(status === "CANCELLED" || status === "SUSPENDED") && (
            <p className="text-amber-700">
              Seu perfil ficará oculto até a reativação da assinatura.
            </p>
          )}
        </div>

        {/* CTA contextual */}
        <div className="mt-4">
          {status === "TRIAL" && (
            <Link
              href="/planos"
              className="inline-block bg-laranja-obra hover:opacity-90 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity"
            >
              Assinar agora — R$79/mês
            </Link>
          )}
          {status === "ACTIVE" && (
            <div className="relative inline-block group">
              <button
                disabled
                className="border border-gray-200 text-cinza-texto text-sm font-medium px-5 py-2.5 rounded-lg cursor-not-allowed opacity-60"
              >
                Gerenciar assinatura
              </button>
              <span className="absolute left-0 -top-8 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Disponível em breve
              </span>
            </div>
          )}
          {(status === "CANCELLED" || status === "SUSPENDED") && (
            <Link
              href="/planos"
              className="inline-block bg-azul-principal hover:bg-azul-noite text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Reativar assinatura
            </Link>
          )}
        </div>
      </div>

      {/* Histórico de pagamentos */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="text-sm font-semibold text-azul-noite mb-4">Histórico de pagamentos</h2>

        {transactions.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <CreditCard className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-cinza-texto">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-cinza-texto">
                  <th className="text-left pb-2 font-medium">Data</th>
                  <th className="text-left pb-2 font-medium">Descrição</th>
                  <th className="text-right pb-2 font-medium">Valor</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const txCfg = TX_STATUS_CONFIG[tx.status] ?? TX_STATUS_CONFIG.PENDING;
                  return (
                    <tr key={tx.id}>
                      <td className="py-3 text-cinza-texto">
                        {new Date(tx.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 text-azul-noite">Plano Prumo Pro — mensal</td>
                      <td className="py-3 text-right font-medium text-azul-noite">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${txCfg.className}`}>
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
