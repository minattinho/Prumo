"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Clock,
  Send,
  ThumbsDown,
  Inbox,
  CheckCheck,
  Handshake,
  XCircle,
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
  NEW:            { label: "Nova",           className: "bg-azul-claro text-azul-principal border border-azul-principal/20" },
  REPLIED:        { label: "Respondida",     className: "bg-green-100 text-green-700 border border-green-200" },
  IN_NEGOTIATION: { label: "Em negociação",  className: "bg-amber-100 text-amber-700 border border-amber-200" },
  REFUSED:        { label: "Recusada",       className: "bg-gray-100 text-gray-500 border border-gray-200" },
};

const TABS = [
  { value: "ALL",            label: "Todas",          icon: Inbox     },
  { value: "NEW",            label: "Novas",          icon: MessageSquare },
  { value: "IN_NEGOTIATION", label: "Em negociação",  icon: Handshake },
  { value: "REPLIED",        label: "Respondidas",    icon: CheckCheck },
  { value: "REFUSED",        label: "Recusadas",      icon: XCircle   },
] as const;

type TabValue = (typeof TABS)[number]["value"];

type Props = {
  initialRequests: Request[];
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

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
  const isActionable = request.status === "NEW" || request.status === "IN_NEGOTIATION";

  function handleDecline() {
    if (!confirm("Recusar esta solicitação?")) return;
    startDecline(async () => {
      await declineRequest(request.id);
      onDecline(request.id);
    });
  }

  return (
    <div className={`bg-white rounded-card shadow-card overflow-hidden transition-shadow hover:shadow-md ${
      request.status === "NEW" ? "ring-1 ring-azul-principal/10" : ""
    }`}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-azul-claro text-azul-principal flex items-center justify-center text-sm font-bold shrink-0">
            {getInitials(contractorName)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-azul-noite">{contractorName}</p>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusCfg.className}`}>
                  {statusCfg.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-cinza-texto shrink-0">
                <Clock className="w-3 h-3" />
                {formatDate(request.created_at)}
              </div>
            </div>

            {/* Message */}
            <p className="text-sm text-cinza-texto line-clamp-2 leading-relaxed">
              {request.message}
            </p>
          </div>
        </div>

        {/* Actions */}
        {isActionable && (
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 ml-13">
            <Link
              href={`/painel/solicitacoes/${request.id}/proposta`}
              className="flex items-center gap-1.5 bg-azul-principal hover:bg-azul-noite text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar proposta
            </Link>
            <button
              type="button"
              onClick={handleDecline}
              disabled={declining}
              className="flex items-center gap-1.5 text-sm text-cinza-texto hover:text-red-500 border border-gray-200 hover:border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Recusar
            </button>
          </div>
        )}
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
    ALL:            requests.length,
    NEW:            requests.filter((r) => r.status === "NEW").length,
    REPLIED:        requests.filter((r) => r.status === "REPLIED").length,
    IN_NEGOTIATION: requests.filter((r) => r.status === "IN_NEGOTIATION").length,
    REFUSED:        requests.filter((r) => r.status === "REFUSED").length,
  };

  return (
    <>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",          count: counts.ALL,            iconColor: "text-azul-principal", bg: "bg-azul-claro"  },
          { label: "Novas",          count: counts.NEW,            iconColor: "text-azul-principal", bg: "bg-azul-claro"  },
          { label: "Em negociação",  count: counts.IN_NEGOTIATION, iconColor: "text-amber-600",      bg: "bg-amber-50"    },
          { label: "Respondidas",    count: counts.REPLIED,        iconColor: "text-green-600",      bg: "bg-green-50"    },
        ].map(({ label, count, iconColor, bg }) => (
          <div key={label} className="bg-white rounded-card shadow-card p-4 flex flex-col gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
              <MessageSquare className={`w-4 h-4 ${iconColor}`} />
            </div>
            <p className={`text-2xl font-bold leading-none ${iconColor}`}>{count}</p>
            <p className="text-xs text-cinza-texto">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-5 flex-wrap">
        {TABS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              activeTab === value
                ? "bg-white text-azul-principal shadow-sm"
                : "text-cinza-texto hover:text-azul-noite"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {counts[value] > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center font-semibold ${
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
        <div className="bg-white rounded-card shadow-card text-center py-16 px-6">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-azul-noite mb-1">
            {activeTab === "ALL"
              ? "Nenhuma solicitação ainda"
              : `Nenhuma solicitação ${STATUS_CONFIG[activeTab as keyof typeof STATUS_CONFIG]?.label.toLowerCase()}`}
          </h3>
          <p className="text-sm text-cinza-texto max-w-xs mx-auto">
            {activeTab === "ALL"
              ? "Quando contratantes enviarem pedidos de orçamento, eles aparecerão aqui."
              : "Nenhuma solicitação nesta categoria no momento."}
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
