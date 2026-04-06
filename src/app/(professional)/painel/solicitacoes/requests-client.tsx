"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  ChevronRight,
  X,
  Send,
  ThumbsDown,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { declineRequest } from "./actions";

type Request = {
  id: string;
  message: string;
  status: "NEW" | "REPLIED" | "IN_NEGOTIATION" | "REFUSED";
  created_at: string;
  contractor: {
    full_name: string | null;
  } | null;
};

const STATUS_CONFIG = {
  NEW: { label: "Nova", className: "bg-azul-claro text-azul-principal" },
  REPLIED: { label: "Respondida", className: "bg-green-100 text-green-700" },
  IN_NEGOTIATION: { label: "Em negociação", className: "bg-amber-100 text-amber-700" },
  REFUSED: { label: "Recusada", className: "bg-red-100 text-red-600" },
};

const TABS = [
  { value: "ALL", label: "Todas" },
  { value: "NEW", label: "Novas" },
  { value: "REPLIED", label: "Respondidas" },
  { value: "IN_NEGOTIATION", label: "Em negociação" },
  { value: "REFUSED", label: "Recusadas" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

type Props = {
  initialRequests: Request[];
};

function RequestCard({
  request,
  onDecline,
}: {
  request: Request;
  onDecline: (id: string) => void;
}) {
  const [declining, startDecline] = useTransition();
  const statusCfg = STATUS_CONFIG[request.status];
  const contractorName = request.contractor?.full_name ?? "Contratante";

  const initials = contractorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  function handleDecline() {
    if (!confirm("Recusar esta solicitação?")) return;
    startDecline(async () => {
      await declineRequest(request.id);
      onDecline(request.id);
    });
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-azul-claro text-azul-principal flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-medium text-azul-noite">{contractorName}</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.className}`}
              >
                {statusCfg.label}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-cinza-texto shrink-0">
              <Clock className="w-3 h-3" />
              {formatDate(request.created_at)}
            </div>
          </div>

          <p className="mt-2 text-sm text-cinza-texto line-clamp-2 leading-relaxed">
            {request.message}
          </p>

          {/* Actions */}
          {(request.status === "NEW" || request.status === "IN_NEGOTIATION") && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
              <Link
                href={`/painel/solicitacoes/${request.id}/proposta`}
                className="flex items-center gap-1.5 text-sm text-azul-principal font-medium hover:text-azul-noite transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar proposta
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-gray-200">·</span>
              <button
                type="button"
                onClick={handleDecline}
                disabled={declining}
                className="flex items-center gap-1.5 text-sm text-cinza-texto hover:text-red-500 transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Recusar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RequestsClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<TabValue>("ALL");

  function handleDecline(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "REFUSED" as const } : r))
    );
  }

  const filtered =
    activeTab === "ALL"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  const counts = {
    ALL: requests.length,
    NEW: requests.filter((r) => r.status === "NEW").length,
    REPLIED: requests.filter((r) => r.status === "REPLIED").length,
    IN_NEGOTIATION: requests.filter((r) => r.status === "IN_NEGOTIATION").length,
    REFUSED: requests.filter((r) => r.status === "REFUSED").length,
  };

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: counts.ALL, className: "text-azul-principal bg-azul-claro" },
          { label: "Novas", count: counts.NEW, className: "text-azul-principal bg-azul-claro" },
          { label: "Em negociação", count: counts.IN_NEGOTIATION, className: "text-amber-600 bg-amber-50" },
          { label: "Respondidas", count: counts.REPLIED, className: "text-green-600 bg-green-50" },
        ].map(({ label, count, className }) => (
          <div key={label} className="bg-white rounded-card shadow-card p-4 text-center">
            <p className={`text-2xl font-bold ${className.split(" ")[0]}`}>{count}</p>
            <p className="text-xs text-cinza-texto mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-5 flex-wrap">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === value
                ? "bg-white text-azul-principal shadow-sm"
                : "text-cinza-texto hover:text-azul-noite"
            }`}
          >
            {label}
            {counts[value] > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center ${
                  activeTab === value
                    ? "bg-azul-principal text-white"
                    : "bg-gray-200 text-cinza-texto"
                }`}
              >
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-card shadow-card text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-azul-noite mb-1">
            {activeTab === "ALL"
              ? "Nenhuma solicitação ainda"
              : `Nenhuma solicitação ${STATUS_CONFIG[activeTab as keyof typeof STATUS_CONFIG]?.label.toLowerCase()}`}
          </h3>
          <p className="text-sm text-cinza-texto">
            {activeTab === "ALL"
              ? "Quando contratantes enviarem orçamentos, eles aparecerão aqui."
              : "Nenhuma solicitação nesta categoria."}
          </p>
        </div>
      )}

      {/* Requests list */}
      {filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onDecline={handleDecline}
            />
          ))}
        </div>
      )}
    </>
  );
}
