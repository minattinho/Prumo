"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Briefcase,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createService, updateService, deleteService } from "./actions";

type Service = {
  id: string;
  client_name: string;
  service_type: string;
  value: number;
  execution_date: string;
  status: "IN_PROGRESS" | "COMPLETED";
  origin: "PRUMO" | "REFERRAL" | "OTHER";
};

type FormData = {
  client_name: string;
  service_type: string;
  value: string;
  execution_date: string;
  status: string;
  origin: string;
};

const EMPTY_FORM: FormData = {
  client_name: "",
  service_type: "",
  value: "",
  execution_date: new Date().toISOString().split("T")[0],
  status: "COMPLETED",
  origin: "PRUMO",
};

const STATUS_CONFIG = {
  COMPLETED:   { label: "Concluído",    className: "bg-green-100 text-green-700 border border-green-200" },
  IN_PROGRESS: { label: "Em andamento", className: "bg-amber-100 text-amber-700 border border-amber-200" },
};

const ORIGIN_CONFIG = {
  PRUMO:    { label: "Prumo",     className: "bg-azul-claro text-azul-principal border border-azul-principal/20" },
  REFERRAL: { label: "Indicação", className: "bg-purple-50 text-purple-600 border border-purple-200" },
  OTHER:    { label: "Outro",     className: "bg-gray-100 text-cinza-texto border border-gray-200" },
};

type Props = {
  initialServices: Service[];
};

function ServiceModal({
  open,
  onClose,
  editService,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  editService: Service | null;
  onSuccess: (service: Service) => void;
}) {
  const [form, setForm] = useState<FormData>(
    editService
      ? {
          client_name: editService.client_name,
          service_type: editService.service_type,
          value: String(editService.value),
          execution_date: editService.execution_date.split("T")[0],
          status: editService.status,
          origin: editService.origin,
        }
      : EMPTY_FORM
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!form.client_name.trim() || !form.service_type.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }
    const value = parseFloat(form.value.replace(",", "."));
    if (isNaN(value) || value < 0) {
      setError("Valor inválido");
      return;
    }
    setError(null);
    startTransition(async () => {
      const data = { ...form, value };
      let res;
      if (editService) {
        res = await updateService(editService.id, data);
      } else {
        res = await createService(data);
      }
      if (res?.error) {
        setError(res.error);
        return;
      }
      onSuccess({
        id: editService?.id ?? Date.now().toString(),
        client_name: form.client_name,
        service_type: form.service_type,
        value,
        execution_date: form.execution_date,
        status: form.status as Service["status"],
        origin: form.origin as Service["origin"],
      });
    });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-card shadow-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <Dialog.Title className="text-base font-bold text-azul-noite">
                {editService ? "Editar serviço" : "Registrar serviço"}
              </Dialog.Title>
              <p className="text-xs text-cinza-texto mt-0.5">
                {editService ? "Atualize as informações do serviço" : "Adicione um novo serviço ao seu histórico"}
              </p>
            </div>
            <Dialog.Close className="p-1.5 text-cinza-texto hover:text-azul-noite hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-azul-noite mb-1.5">
                  Cliente <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.client_name}
                  onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                  placeholder="Nome do cliente"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-azul-noite mb-1.5">
                  Tipo de serviço <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.service_type}
                  onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
                  placeholder="Ex: Instalação elétrica"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-azul-noite mb-1.5">Valor (R$)</label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                  placeholder="0,00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal focus:ring-2 focus:ring-azul-principal/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-azul-noite mb-1.5">Data</label>
                <input
                  type="date"
                  value={form.execution_date}
                  onChange={(e) => setForm((f) => ({ ...f, execution_date: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-azul-noite mb-2">Status</label>
              <div className="flex gap-2">
                {(["COMPLETED", "IN_PROGRESS"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.status === s
                        ? "border-azul-principal bg-azul-claro text-azul-principal"
                        : "border-gray-200 text-cinza-texto hover:border-azul-principal/40"
                    }`}
                  >
                    {STATUS_CONFIG[s].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-azul-noite mb-2">Origem</label>
              <div className="flex gap-2">
                {(["PRUMO", "REFERRAL", "OTHER"] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, origin: o }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.origin === o
                        ? "border-azul-principal bg-azul-claro text-azul-principal"
                        : "border-gray-200 text-cinza-texto hover:border-azul-principal/40"
                    }`}
                  >
                    {ORIGIN_CONFIG[o].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-5">
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="flex-1 bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </span>
              ) : editService ? (
                "Salvar alterações"
              ) : (
                "Registrar serviço"
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ServicesClient({ initialServices }: Props) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [filter, setFilter] = useState<"ALL" | "COMPLETED" | "IN_PROGRESS">("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = filter === "ALL" ? services : services.filter((s) => s.status === filter);

  const totalRevenue = services
    .filter((s) => s.status === "COMPLETED")
    .reduce((sum, s) => sum + s.value, 0);
  const completedCount = services.filter((s) => s.status === "COMPLETED").length;
  const inProgressCount = services.filter((s) => s.status === "IN_PROGRESS").length;

  function openCreate() {
    setEditService(null);
    setModalOpen(true);
  }

  function openEdit(s: Service) {
    setEditService(s);
    setModalOpen(true);
  }

  function handleModalSuccess(service: Service) {
    setServices((prev) => {
      const idx = prev.findIndex((s) => s.id === service.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = service;
        return updated;
      }
      return [service, ...prev];
    });
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Excluir este serviço?")) return;
    startTransition(async () => {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    });
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Briefcase,   value: services.length,          label: "Total",        iconColor: "text-azul-principal", bg: "bg-azul-claro"  },
          { icon: CheckCircle2,value: completedCount,           label: "Concluídos",   iconColor: "text-green-600",      bg: "bg-green-50"    },
          { icon: Clock,       value: inProgressCount,          label: "Em andamento", iconColor: "text-amber-600",      bg: "bg-amber-50"    },
          { icon: DollarSign,  value: formatCurrency(totalRevenue), label: "Receita total", iconColor: "text-laranja-obra", bg: "bg-orange-50" },
        ].map(({ icon: Icon, value, label, iconColor, bg }) => (
          <div key={label} className="bg-white rounded-card shadow-card p-4 flex flex-col gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <p className={`text-xl font-bold text-azul-noite leading-none truncate`}>{value}</p>
            <p className="text-xs text-cinza-texto">{label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(["ALL", "COMPLETED", "IN_PROGRESS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                filter === tab
                  ? "bg-white text-azul-principal shadow-sm"
                  : "text-cinza-texto hover:text-azul-noite"
              }`}
            >
              {tab === "ALL" ? "Todos" : STATUS_CONFIG[tab].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrar serviço
        </button>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="bg-white rounded-card shadow-card text-center py-16 px-6">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base font-semibold text-azul-noite mb-1">
            {filter === "ALL" ? "Nenhum serviço registrado" : `Nenhum serviço ${STATUS_CONFIG[filter as keyof typeof STATUS_CONFIG]?.label.toLowerCase()}`}
          </h3>
          <p className="text-sm text-cinza-texto mb-5 max-w-xs mx-auto">
            Registre seus serviços para acompanhar sua receita e histórico de trabalhos.
          </p>
          {filter === "ALL" && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar primeiro serviço
            </button>
          )}
        </div>
      )}

      {/* List */}
      {filtered.length > 0 && (
        <div className="bg-white rounded-card shadow-card overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-cinza-texto uppercase tracking-wide">
            <span>Cliente / Serviço</span>
            <span className="hidden md:block">Data</span>
            <span className="hidden sm:block text-right">Valor</span>
            <span />
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map((service) => {
              const statusCfg = STATUS_CONFIG[service.status];
              const originCfg = ORIGIN_CONFIG[service.origin];
              return (
                <div key={service.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl bg-azul-claro flex items-center justify-center shrink-0">
                    <Briefcase className="w-4.5 h-4.5 text-azul-principal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold text-azul-noite truncate">{service.client_name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${originCfg.className}`}>
                        {originCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cinza-texto flex-wrap">
                      <span>{service.service_type}</span>
                      <span className="hidden md:inline">·  {formatDate(service.execution_date)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <p className="text-sm font-bold text-azul-noite hidden sm:block whitespace-nowrap">
                      {formatCurrency(service.value)}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEdit(service)}
                        className="p-1.5 text-cinza-texto hover:text-azul-principal hover:bg-azul-claro rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(service.id)}
                        disabled={isPending}
                        className="p-1.5 text-cinza-texto hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <ServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editService={editService}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
