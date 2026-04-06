"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { submitProposal } from "./actions";

type Request = {
  id: string;
  message: string;
  status: string;
  created_at: string;
  contractor: { full_name: string | null } | null;
};

type Props = {
  request: Request;
};

export function ProposalForm({ request }: Props) {
  const [totalValue, setTotalValue] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [paymentStages, setPaymentStages] = useState<1 | 2 | 3>(1);
  const [approachDescription, setApproachDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const value = parseFloat(totalValue.replace(",", "."));
    const days = parseInt(deadlineDays);

    if (isNaN(value) || value <= 0) {
      setError("Informe um valor válido");
      return;
    }
    if (isNaN(days) || days < 1) {
      setError("Informe um prazo válido em dias");
      return;
    }
    if (!approachDescription.trim()) {
      setError("Descreva sua abordagem para o serviço");
      return;
    }

    startTransition(async () => {
      const res = await submitProposal({
        budget_request_id: request.id,
        total_value: value,
        deadline_days: days,
        payment_stages: paymentStages,
        approach_description: approachDescription,
      });
      if (res && "error" in res) {
        setError(res.error);
      }
    });
  }

  const contractorName = request.contractor?.full_name ?? "Contratante";

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-cinza-texto">
        <a href="/painel/solicitacoes" className="hover:text-azul-principal transition-colors">
          Solicitações
        </a>
        <span>/</span>
        <span className="text-azul-noite font-medium">Enviar proposta</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-azul-noite">Enviar proposta</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Responda a solicitação de {contractorName} com uma proposta detalhada.
        </p>
      </div>

      {/* Request summary */}
      <div className="bg-azul-claro/50 border border-azul-principal/10 rounded-card p-5 space-y-2">
        <p className="text-xs font-semibold text-azul-principal uppercase tracking-wide">
          Mensagem do contratante
        </p>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-azul-principal text-white flex items-center justify-center text-xs font-semibold shrink-0">
            {contractorName[0]?.toUpperCase()}
          </div>
          <p className="text-sm font-medium text-azul-noite">{contractorName}</p>
        </div>
        <p className="text-sm text-azul-noite leading-relaxed pl-9">{request.message}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-card p-5 space-y-5">
        <h2 className="text-sm font-semibold text-azul-noite">Sua proposta</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-azul-noite mb-1.5">
              Valor total (R$) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              placeholder="Ex: 3500,00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-azul-noite mb-1.5">
              Prazo (dias) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={deadlineDays}
              onChange={(e) => setDeadlineDays(e.target.value)}
              placeholder="Ex: 15"
              min={1}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-2">
            Forma de pagamento
          </label>
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPaymentStages(n)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  paymentStages === n
                    ? "border-azul-principal bg-azul-claro text-azul-principal"
                    : "border-gray-200 text-cinza-texto hover:border-azul-principal/40"
                }`}
              >
                {n === 1 ? "À vista" : `${n}x parcelas`}
              </button>
            ))}
          </div>
          {paymentStages > 1 && (
            <p className="text-xs text-cinza-texto mt-1.5">
              Valor por parcela: R$ {(parseFloat(totalValue.replace(",", ".") || "0") / paymentStages).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">
            Descrição da abordagem <span className="text-red-500">*</span>
          </label>
          <textarea
            value={approachDescription}
            onChange={(e) => setApproachDescription(e.target.value)}
            rows={5}
            maxLength={1000}
            placeholder="Descreva como você vai executar o serviço, quais materiais vai usar, etapas do trabalho, garantias oferecidas..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder-gray-400 resize-none focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
          />
          <p className="text-xs text-cinza-texto mt-1 text-right">
            {approachDescription.length}/1000
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <a
            href="/painel/solicitacoes"
            className="flex-1 text-center border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </a>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isPending ? "Enviando..." : "Enviar proposta"}
          </button>
        </div>
      </form>
    </div>
  );
}
