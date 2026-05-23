"use client";

import { useState, useTransition } from "react";
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Search,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { approveProfessional, rejectProfessional } from "./actions";
import { toast } from "sonner";

export type ProfessionalWithDetails = {
  id: string;
  slug: string;
  city: string | null;
  state: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "BANNED";
  cpf: string | null;
  cnpj: string | null;
  created_at: string;
  personal_description: string | null;
  profiles: {
    name: string;
    email: string;
    phone: string | null;
  };
  professional_specialties: {
    category: string;
  }[];
  cpf_validations: {
    status: "APPROVED" | "REJECTED" | "UNAVAILABLE";
    validation_date: string;
    reason_if_rejected: string | null;
    serpro_response: any;
  }[];
};

type Props = {
  initialProfessionals: ProfessionalWithDetails[];
};

const STATUS_TABS = [
  { value: "PENDING",   label: "Pendentes",   icon: Clock          },
  { value: "ACTIVE",    label: "Ativos",      icon: CheckCircle2   },
  { value: "SUSPENDED", label: "Suspensos",   icon: XCircle        },
  { value: "ALL",       label: "Todos",       icon: Briefcase      },
] as const;

type StatusTab = (typeof STATUS_TABS)[number]["value"];

const STATUS_CONFIG = {
  PENDING:   { label: "Pendente",  className: "bg-amber-50 text-amber-700 border-amber-200" },
  ACTIVE:    { label: "Ativo",     className: "bg-green-50 text-green-700 border-green-200" },
  SUSPENDED: { label: "Suspenso",  className: "bg-red-50 text-red-700 border-red-200"       },
  BANNED:    { label: "Banido",    className: "bg-gray-100 text-gray-700 border-gray-200"   },
};

export function ModerationClient({ initialProfessionals }: Props) {
  const [professionals, setProfessionals] = useState<ProfessionalWithDetails[]>(initialProfessionals);
  const [activeTab, setActiveTab] = useState<StatusTab>("PENDING");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Ações de moderação
  const [isPending, startTransition] = useTransition();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filtered = professionals.filter((p) => {
    // 1. Filtro de abas
    if (activeTab !== "ALL" && p.status !== activeTab) return false;

    // 2. Filtro de busca (nome, e-mail, cpf, cnpj)
    if (search.trim()) {
      const q = search.toLowerCase();
      const nameMatch = p.profiles.name.toLowerCase().includes(q);
      const emailMatch = p.profiles.email.toLowerCase().includes(q);
      const cpfMatch = p.cpf?.includes(q) ?? false;
      const cnpjMatch = p.cnpj?.includes(q) ?? false;
      return nameMatch || emailMatch || cpfMatch || cnpjMatch;
    }

    return true;
  });

  const counts = {
    PENDING:   professionals.filter((p) => p.status === "PENDING").length,
    ACTIVE:    professionals.filter((p) => p.status === "ACTIVE").length,
    SUSPENDED: professionals.filter((p) => p.status === "SUSPENDED").length,
    ALL:       professionals.length,
  };

  async function handleApprove(id: string, name: string) {
    if (!confirm(`Deseja aprovar o perfil de ${name}?`)) return;

    startTransition(async () => {
      const res = await approveProfessional(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Perfil de ${name} aprovado com sucesso!`);
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "ACTIVE" as const } : p))
        );
        if (expandedId === id) setExpandedId(null);
      }
    });
  }

  async function handleReject(id: string, name: string) {
    if (!rejectReason.trim()) {
      toast.error("Informe a justificativa da recusa.");
      return;
    }

    startTransition(async () => {
      const res = await rejectProfessional(id, rejectReason);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Perfil de ${name} rejeitado e suspenso.`);
        setProfessionals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "SUSPENDED" as const } : p))
        );
        setRejectingId(null);
        setRejectReason("");
        if (expandedId === id) setExpandedId(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Abas e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Abas */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
          {STATUS_TABS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setActiveTab(value);
                setExpandedId(null);
                setRejectingId(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                activeTab === value
                  ? "bg-white text-azul-principal shadow-sm"
                  : "text-cinza-texto hover:text-azul-noite"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {counts[value] > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full min-w-5 text-center font-bold ${
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

        {/* Campo de Busca */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou CPF..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal transition-all"
          />
        </div>
      </div>

      {/* Tabela de Profissionais */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Profissional</th>
                <th className="px-4 py-4">Localização</th>
                <th className="px-4 py-4">Documento</th>
                <th className="px-4 py-4">Validação</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => {
                const isExpanded = expandedId === p.id;
                const latestValidation = p.cpf_validations?.[0];
                const statusCfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;

                // Format document
                const docText = p.cpf
                  ? `CPF: ${p.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}`
                  : p.cnpj
                  ? `CNPJ: ${p.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}`
                  : "—";

                return (
                  <>
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50/70 transition-colors ${
                        isExpanded ? "bg-azul-claro/20" : ""
                      }`}
                    >
                      {/* Name / Specialties */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-azul-noite text-base">
                            {p.profiles.name}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {p.professional_specialties.map((s) => (
                              <span
                                key={s.category}
                                className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-cinza-texto uppercase tracking-wider"
                              >
                                {s.category}
                              </span>
                            ))}
                            {p.professional_specialties.length === 0 && (
                              <span className="text-xs text-gray-400 italic">Sem especialidade</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4 text-cinza-texto">
                        {p.city && p.state ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {p.city} - {p.state}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Não informado</span>
                        )}
                      </td>

                      {/* Document */}
                      <td className="px-4 py-4 font-mono text-xs text-azul-noite">
                        {docText}
                      </td>

                      {/* Serpro Validation status */}
                      <td className="px-4 py-4">
                        {latestValidation ? (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                              latestValidation.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {latestValidation.status === "APPROVED" ? (
                              <>
                                <Check className="w-3 h-3" />
                                Validado
                              </>
                            ) : (
                              <>
                                <X className="w-3 h-3" />
                                Rejeitado
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            Não verificado
                          </span>
                        )}
                      </td>

                      {/* User status badge */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Actions trigger */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setExpandedId(isExpanded ? null : p.id);
                            setRejectingId(null);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-azul-principal hover:text-azul-noite transition-colors bg-azul-claro/50 px-3 py-1.5 rounded-lg border border-azul-principal/10"
                        >
                          {isExpanded ? (
                            <>
                              Fechar
                              <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Detalhes
                              <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Detalhes Expansíveis */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50/70 px-8 py-6 border-b border-gray-100">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Coluna 1: Informações de Perfil */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Informações Cadastrais
                              </h4>
                              <div className="space-y-2.5 text-sm">
                                <p className="flex items-center gap-2 text-azul-noite font-medium">
                                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                                  {p.profiles.email}
                                </p>
                                <p className="flex items-center gap-2 text-azul-noite">
                                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                                  {p.profiles.phone ?? (
                                    <span className="text-gray-400 italic">Sem telefone</span>
                                  )}
                                </p>
                                <p className="text-cinza-texto leading-relaxed">
                                  <span className="font-semibold text-azul-noite block text-xs uppercase mb-1">
                                    Biografia:
                                  </span>
                                  {p.personal_description ?? (
                                    <span className="text-gray-400 italic">
                                      Profissional ainda não preencheu sua biografia.
                                    </span>
                                  )}
                                </p>
                                {p.status === "ACTIVE" && (
                                  <a
                                    href={`/profissionais/${p.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-azul-principal font-bold hover:underline"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Ver perfil público
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Coluna 2: Detalhes da Validação (SERPRO) */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Auditoria de Documento (SERPRO)
                              </h4>
                              {latestValidation ? (
                                <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-2.5 text-xs">
                                  <p className="text-azul-noite">
                                    <span className="font-semibold text-gray-400 block">Validação em:</span>
                                    {new Date(latestValidation.validation_date).toLocaleString("pt-BR")}
                                  </p>
                                  <p className="text-azul-noite">
                                    <span className="font-semibold text-gray-400 block">Resultado:</span>
                                    <span
                                      className={`font-bold ${
                                        latestValidation.status === "APPROVED"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {latestValidation.status === "APPROVED" ? "Aprovado" : "Rejeitado"}
                                    </span>
                                  </p>
                                  {latestValidation.reason_if_rejected && (
                                    <p className="text-red-700 bg-red-50 border border-red-100 rounded p-2 font-medium">
                                      <span className="font-bold block text-[10px] uppercase text-red-500 mb-0.5">
                                        Motivo da Recusa:
                                      </span>
                                      {latestValidation.reason_if_rejected}
                                    </p>
                                  )}
                                  {latestValidation.serpro_response && (
                                    <div>
                                      <span className="font-semibold text-gray-400 block mb-1">
                                        Retorno Receita Federal:
                                      </span>
                                      <pre className="bg-gray-50 border border-gray-100 rounded p-2 overflow-x-auto text-[10px] text-gray-600 max-h-36 font-mono leading-tight">
                                        {JSON.stringify(latestValidation.serpro_response, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-xs font-semibold text-amber-800">
                                      Sem verificação recente
                                    </p>
                                    <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                      Este perfil ainda não passou pela consulta automática da Receita
                                      Federal via SERPRO ou o cadastro foi efetuado sem o envio do CPF.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Coluna 3: Ações Administrativas */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Ações do Administrador
                              </h4>
                              
                              {rejectingId === p.id ? (
                                <div className="space-y-3 bg-white border border-gray-100 rounded-xl p-4">
                                  <p className="text-xs font-semibold text-azul-noite">
                                    Justificativa de rejeição
                                  </p>
                                  <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Ex: CPF inválido ou situação irregular no SERPRO."
                                    rows={3}
                                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal resize-none"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleReject(p.id, p.profiles.name)}
                                      disabled={isPending || !rejectReason.trim()}
                                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg text-xs transition-colors"
                                    >
                                      Confirmar Rejeição
                                    </button>
                                    <button
                                      onClick={() => {
                                        setRejectingId(null);
                                        setRejectReason("");
                                      }}
                                      disabled={isPending}
                                      className="border border-gray-200 text-cinza-texto hover:bg-gray-50 py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                                    >
                                      Voltar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {p.status !== "ACTIVE" && (
                                    <button
                                      onClick={() => handleApprove(p.id, p.profiles.name)}
                                      disabled={isPending}
                                      className="w-full inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-green-600/10 cursor-pointer"
                                    >
                                      <Check className="w-4 h-4 shrink-0" />
                                      Aprovar Profissional
                                    </button>
                                  )}

                                  {p.status !== "SUSPENDED" && (
                                    <button
                                      onClick={() => setRejectingId(p.id)}
                                      disabled={isPending}
                                      className="w-full inline-flex items-center justify-center gap-1.5 border border-red-200 hover:border-red-300 hover:bg-red-50 disabled:opacity-50 text-red-600 font-semibold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer"
                                    >
                                      <X className="w-4 h-4 shrink-0" />
                                      Rejeitar / Suspender
                                    </button>
                                  )}

                                  {p.status === "ACTIVE" && (
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 flex items-center gap-2.5">
                                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                      <p className="text-xs text-green-700 font-medium">
                                        Este perfil está ativo na plataforma e visível nas buscas públicas.
                                      </p>
                                    </div>
                                  )}

                                  {p.status === "SUSPENDED" && (
                                    <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-center gap-2.5">
                                      <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                                      <p className="text-xs text-red-700 font-medium">
                                        Este perfil está suspenso e oculto para buscas públicas.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}

                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-cinza-texto">
                    Nenhum profissional encontrado nesta aba.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
