"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Star,
  Users,
  ClipboardCheck,
  Clock,
  MapPin,
  ExternalLink,
  X,
  Settings,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  Hammer,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  updateContractorProfile,
  submitEvaluation,
  sendPasswordReset,
} from "./actions";

type Professional = {
  id: string;
  slug: string;
  city: string | null;
  photo_url: string | null;
  profiles: { full_name: string | null } | null;
  professional_specialties: { category: string }[];
};

type Contact = {
  id: string;
  professional_id: string;
  created_at: string;
  professional: Professional | null;
};

type Evaluation = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  professional_id: string;
  professional: Professional | null;
};

type Props = {
  profile: { full_name: string | null; email: string | null; phone: string | null };
  contractorId: string | null;
  contacts: Contact[];
  evaluations: Evaluation[];
  pendingContacts: Contact[];
};

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`w-8 h-8 transition-colors cursor-pointer ${
            star <= value ? "text-amber-400" : "text-gray-200 hover:text-amber-200"
          }`}
        >
          <Star className="w-full h-full fill-current" />
        </button>
      ))}
    </div>
  );
}

function ProfessionalAvatar({ pro }: { pro: Professional | null }) {
  const name = pro?.profiles?.full_name ?? "P";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  if (pro?.photo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pro.photo_url}
        alt={name}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-azul-claro text-azul-principal flex items-center justify-center text-sm font-semibold shrink-0">
      {initials}
    </div>
  );
}

function EvaluateModal({
  contact,
  onClose,
}: {
  contact: Contact;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (rating === 0) {
      setError("Selecione uma nota");
      return;
    }
    startTransition(async () => {
      const res = await submitEvaluation({
        professional_id: contact.professional_id,
        rating,
        comment,
      });
      if (res?.error) setError(res.error);
      else onClose();
    });
  }

  const proName = contact.professional?.profiles?.full_name ?? "Profissional";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <ProfessionalAvatar pro={contact.professional} />
        <div>
          <p className="font-medium text-azul-noite">{proName}</p>
          <p className="text-xs text-cinza-texto">
            {contact.professional?.professional_specialties?.[0]?.category ?? "Profissional"}
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-azul-noite mb-2">Sua nota</p>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="text-sm font-medium text-azul-noite block mb-1.5">
          Comentário <span className="text-cinza-texto font-normal">(opcional)</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Como foi a experiência com este profissional?"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-azul-noite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="flex-1 bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {isPending ? "Enviando..." : "Enviar avaliação"}
        </button>
      </div>
    </div>
  );
}

function ConfiguracoesTab({
  profile,
}: {
  profile: Props["profile"];
}) {
  const [name, setName] = useState(profile.full_name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await updateContractorProfile({ full_name: name, phone });
      if (res?.error) setError(res.error);
      else setSaved(true);
    });
  }

  function handleResetPassword() {
    if (!profile.email) return;
    startTransition(async () => {
      await sendPasswordReset(profile.email!);
      setResetSent(true);
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      <form onSubmit={handleSave} className="bg-white rounded-card shadow-card p-5 space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-azul-noite">Dados pessoais</h3>
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">
            Nome completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">
            E-mail
          </label>
          <div className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2.5 bg-gray-50">
            <Mail className="w-4 h-4 text-cinza-texto shrink-0" />
            <span className="text-sm text-cinza-texto">{profile.email ?? "—"}</span>
          </div>
          <p className="text-xs text-cinza-texto mt-1">O e-mail não pode ser alterado.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cinza-texto" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-azul-noite focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {saved && <p className="text-sm text-green-600">Salvo com sucesso!</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
        >
          {isPending ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <div className="bg-white rounded-card shadow-card p-5">
        <div className="pb-3 border-b border-gray-100 mb-3">
          <h3 className="text-sm font-semibold text-azul-noite">Senha</h3>
        </div>
        <p className="text-xs text-cinza-texto mb-4">
          Enviaremos um link de redefinição para seu e-mail.
        </p>
        {resetSent ? (
          <p className="text-sm text-green-600">E-mail enviado! Verifique sua caixa de entrada.</p>
        ) : (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={isPending}
            className="flex items-center gap-2 text-sm font-medium text-azul-principal hover:text-azul-noite transition-colors"
          >
            <Lock className="w-4 h-4" />
            Redefinir senha
          </button>
        )}
      </div>
    </div>
  );
}

function UserInitialsAvatar({ name }: { name: string | null }) {
  const initials = (name ?? "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <div className="w-12 h-12 rounded-full bg-azul-principal text-white flex items-center justify-center text-base font-semibold shrink-0">
      {initials}
    </div>
  );
}

export function MinhaContaClient({
  profile,
  contractorId,
  contacts,
  evaluations,
  pendingContacts,
}: Props) {
  const [evaluateContact, setEvaluateContact] = useState<Contact | null>(null);
  const evaluatedIds = new Set(evaluations.map((e) => e.professional_id));

  const recentContacts = contacts.slice(0, 5);

  return (
    <>
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4">
          <UserInitialsAvatar name={profile.full_name} />
          <div>
            <h1 className="text-2xl font-bold text-azul-noite">
              Olá, {profile.full_name?.split(" ")[0] ?? ""}!
            </h1>
            <p className="text-sm text-cinza-texto mt-0.5">Gerencie sua conta e histórico de contatos.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: Users, value: contacts.length, label: "Profissionais contactados", accent: false },
            { icon: ClipboardCheck, value: evaluations.length, label: "Avaliações feitas", accent: false },
            { icon: Clock, value: pendingContacts.length, label: "Pendentes de avaliação", accent: pendingContacts.length > 0 },
          ].map(({ icon: Icon, value, label, accent }) => (
            <div key={label} className={`rounded-card shadow-card p-4 flex items-center gap-3 ${accent ? "bg-orange-50 border border-orange-100" : "bg-white"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent ? "bg-laranja-obra/10" : "bg-azul-claro"}`}>
                <Icon className={`w-5 h-5 ${accent ? "text-laranja-obra" : "text-azul-principal"}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${accent ? "text-laranja-obra" : "text-azul-noite"}`}>{value}</p>
                <p className="text-xs text-cinza-texto leading-tight">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs.Root defaultValue="overview" className="mt-8">
          <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden w-full sm:w-fit">
            {[
              { value: "overview", label: "Visão Geral" },
              { value: "professionals", label: contacts.length > 0 ? `Profissionais (${contacts.length})` : "Profissionais" },
              { value: "evaluations", label: evaluations.length > 0 ? `Avaliações (${evaluations.length})` : "Avaliações" },
              { value: "pending", label: pendingContacts.length > 0 ? `Pendentes (${pendingContacts.length})` : "Pendentes" },
              { value: "settings", label: "Configurações" },
            ].map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="px-4 py-2 text-sm font-medium rounded-md text-cinza-texto transition-colors data-[state=active]:bg-white data-[state=active]:text-azul-principal data-[state=active]:shadow-sm shrink-0 cursor-pointer"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Visão Geral */}
          <Tabs.Content value="overview" className="space-y-6">
            <div className="bg-white rounded-card shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-azul-noite">Contatos recentes</h2>
              </div>
              {recentContacts.length === 0 ? (
                <div className="text-center py-8">
                  <Hammer className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-cinza-texto">Nenhum contato ainda.</p>
                  <Link
                    href="/profissionais"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-azul-principal font-medium hover:underline"
                  >
                    Buscar profissionais <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentContacts.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 py-3">
                      <ProfessionalAvatar pro={c.professional} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-azul-noite truncate">
                          {c.professional?.profiles?.full_name ?? "Profissional"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {c.professional?.city && (
                            <span className="flex items-center gap-1 text-xs text-cinza-texto">
                              <MapPin className="w-3 h-3" />
                              {c.professional.city}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-cinza-texto">{formatDate(c.created_at)}</span>
                        {!evaluatedIds.has(c.professional_id) && (
                          <button
                            onClick={() => setEvaluateContact(c)}
                            className="text-xs bg-azul-claro text-azul-principal font-medium px-2.5 py-1.5 rounded-md hover:bg-azul-principal hover:text-white transition-colors cursor-pointer"
                          >
                            Avaliar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-azul-noite rounded-card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">Precisa de um profissional?</p>
                <p className="text-sm text-azul-medio mt-0.5">Encontre o especialista certo para sua obra.</p>
              </div>
              <Link
                href="/profissionais"
                className="shrink-0 bg-laranja-obra hover:bg-orange-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                Buscar profissionais
              </Link>
            </div>
          </Tabs.Content>

          {/* Profissionais */}
          <Tabs.Content value="professionals">
            <div className="bg-white rounded-card shadow-card divide-y divide-gray-50">
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-cinza-texto">Nenhum profissional contactado ainda.</p>
                  <Link
                    href="/profissionais"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-azul-principal font-medium hover:underline"
                  >
                    Encontrar profissional <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-4">
                    <ProfessionalAvatar pro={c.professional} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-azul-noite truncate">
                        {c.professional?.profiles?.full_name ?? "Profissional"}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {c.professional?.professional_specialties?.[0] && (
                          <span className="text-xs bg-azul-claro text-azul-principal px-2 py-0.5 rounded-full font-medium">
                            {c.professional.professional_specialties[0].category}
                          </span>
                        )}
                        {c.professional?.city && (
                          <span className="flex items-center gap-1 text-xs text-cinza-texto">
                            <MapPin className="w-3 h-3" />
                            {c.professional.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-cinza-texto hidden sm:block">
                        {formatDate(c.created_at)}
                      </span>
                      {c.professional?.slug && (
                        <Link
                          href={`/profissionais/${c.professional.slug}`}
                          className="text-cinza-texto hover:text-azul-principal transition-colors cursor-pointer"
                          title="Ver perfil"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                      {!evaluatedIds.has(c.professional_id) ? (
                        <button
                          onClick={() => setEvaluateContact(c)}
                          className="text-xs bg-azul-claro text-azul-principal font-medium px-3 py-1.5 rounded-lg hover:bg-azul-principal hover:text-white transition-colors"
                        >
                          Avaliar
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <Star className="w-3 h-3 fill-current" />
                          Avaliado
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs.Content>

          {/* Avaliações */}
          <Tabs.Content value="evaluations">
            <div className="space-y-3">
              {evaluations.length === 0 ? (
                <div className="bg-white rounded-card shadow-card text-center py-12">
                  <Star className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-cinza-texto">Você ainda não fez nenhuma avaliação.</p>
                </div>
              ) : (
                evaluations.map((ev) => (
                  <div key={ev.id} className="bg-white rounded-card shadow-card p-5">
                    <div className="flex items-start gap-3">
                      <ProfessionalAvatar pro={ev.professional} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-azul-noite">
                            {ev.professional?.profiles?.full_name ?? "Profissional"}
                          </p>
                          <span className="text-xs text-cinza-texto shrink-0">
                            {formatDate(ev.created_at)}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-5 h-5 ${s <= ev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
                            />
                          ))}
                        </div>
                        {ev.comment && (
                          <p className="mt-2 text-sm text-cinza-texto">{ev.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Tabs.Content>

          {/* Pendentes */}
          <Tabs.Content value="pending">
            <div className="space-y-3">
              {pendingContacts.length === 0 ? (
                <div className="bg-white rounded-card shadow-card text-center py-12">
                  <ClipboardCheck className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-cinza-texto">Nenhuma avaliação pendente.</p>
                </div>
              ) : (
                pendingContacts.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white rounded-card shadow-card p-5 flex items-center gap-3"
                  >
                    <ProfessionalAvatar pro={c.professional} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-azul-noite">
                        {c.professional?.profiles?.full_name ?? "Profissional"}
                      </p>
                      <p className="text-xs text-cinza-texto mt-0.5">
                        Contactado em {formatDate(c.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => setEvaluateContact(c)}
                      className="shrink-0 bg-azul-principal hover:bg-azul-noite text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Avaliar
                    </button>
                  </div>
                ))
              )}
            </div>
          </Tabs.Content>

          {/* Configurações */}
          <Tabs.Content value="settings">
            <ConfiguracoesTab profile={profile} />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Evaluate Modal */}
      <Dialog.Root open={!!evaluateContact} onOpenChange={(open) => !open && setEvaluateContact(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 data-[state=closed]:opacity-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-card shadow-2xl p-6 transition-all duration-200 data-[state=closed]:opacity-0 data-[state=closed]:scale-95">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-base font-semibold text-azul-noite">
                Avaliar profissional
              </Dialog.Title>
              <Dialog.Close className="text-cinza-texto hover:text-azul-noite transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
            {evaluateContact && (
              <EvaluateModal
                contact={evaluateContact}
                onClose={() => setEvaluateContact(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
