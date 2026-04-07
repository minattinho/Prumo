"use client";

import { useState, useTransition, useRef } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { CityInput } from "@/components/city-input";
import {
  Camera,
  Plus,
  X,
  Star,
  Save,
  Loader2,
  Link2,
} from "lucide-react";
import {
  updateBasicInfo,
  updatePhoto,
  updateSpecialties,
  updateAffinities,
  addContactChannel,
  deleteContactChannel,
  setChannelPrimary,
  updateSocialNetworks,
} from "./actions";

const CATEGORIES = [
  "Construção",
  "Elétrica",
  "Hidráulica",
  "Acabamento",
  "Pisos",
  "Serralheria",
  "Marcenaria",
  "Jardinagem",
  "Limpeza",
  "Projeto",
  "Engenharia",
  "Tecnologia",
  "Climatização",
  "Pintura",
  "Gesso e Drywall",
  "Impermeabilização",
  "Telhados e Coberturas",
  "Instalações de Gás",
  "Demolição",
  "Reformas Gerais",
];

const CHANNEL_TYPES = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "PHONE", label: "Telefone" },
  { value: "EMAIL", label: "E-mail" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "SITE", label: "Site" },
  { value: "OTHER", label: "Outro" },
];

const SOCIAL_PLATFORMS = [
  { value: "INSTAGRAM", label: "Instagram", abbr: "IG", placeholder: "@seu_usuario" },
  { value: "FACEBOOK", label: "Facebook", abbr: "FB", placeholder: "facebook.com/seu_perfil" },
  { value: "TIKTOK", label: "TikTok", abbr: "TT", placeholder: "@seu_usuario" },
  { value: "LINKEDIN", label: "LinkedIn", abbr: "LI", placeholder: "linkedin.com/in/seu_perfil" },
  { value: "YOUTUBE", label: "YouTube", abbr: "YT", placeholder: "youtube.com/@seu_canal" },
];

const RADIUS_OPTIONS = [
  { value: "10", label: "Até 10 km" },
  { value: "25", label: "Até 25 km" },
  { value: "50", label: "Até 50 km" },
  { value: "100", label: "Até 100 km" },
  { value: "", label: "Todo o Brasil" },
];

type Channel = {
  id: string;
  type: string;
  value: string;
  is_primary: boolean;
};

type SocialNetwork = {
  platform: string;
  handle_or_url: string;
};

type ProfileData = {
  photo_url: string | null;
  personal_description: string | null;
  city: string | null;
  state: string | null;
  service_radius_km: number | null;
};

type Props = {
  profile: ProfileData;
  fullName: string | null;
  specialties: string[];
  affinities: string[];
  channels: Channel[];
  socialNetworks: SocialNetwork[];
  professionalId: string;
};

function SaveButton({ isPending, saved }: { isPending: boolean; saved: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saved ? "Salvo!" : "Salvar"}
    </button>
  );
}

function IdentidadeTab({ profile, fullName }: { profile: ProfileData; fullName: string | null }) {
  const [description, setDescription] = useState(profile.personal_description ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [state, setState] = useState(profile.state ?? "");
  const [radius, setRadius] = useState(profile.service_radius_km ? String(profile.service_radius_km) : "");
  const [photoUrl, setPhotoUrl] = useState(profile.photo_url ?? "");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = (fullName ?? "P")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "profiles");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      const { url, error: uploadError } = await uploadRes.json();

      if (uploadError) {
        setError("Erro ao fazer upload da foto");
        return;
      }

      setPhotoUrl(url);
      const res = await updatePhoto(url);
      if (res?.error) setError(res.error);
    } catch {
      setError("Erro ao fazer upload da foto");
    } finally {
      setIsUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const res = await updateBasicInfo({
        personal_description: description,
        city,
        state,
        service_radius_km: radius ? Number(radius) : null,
      });
      if (res?.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Photo */}
      <div className="bg-white rounded-card shadow-card p-5">
        <h3 className="text-sm font-semibold text-azul-noite mb-4">Foto de perfil</h3>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="relative w-20 h-20 rounded-full overflow-hidden group cursor-pointer shrink-0"
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-azul-claro text-azul-principal flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </button>
          <div>
            <p className="text-sm text-azul-noite font-medium">Clique na foto para alterar</p>
            <p className="text-xs text-cinza-texto mt-0.5">JPG, PNG ou WebP — máx. 5 MB</p>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-card shadow-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-azul-noite">Informações básicas</h3>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">
            Sobre você
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Descreva sua experiência, diferenciais e tipo de trabalho que você realiza..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal resize-none"
          />
          <p className="text-xs text-cinza-texto mt-1 text-right">
            {description.length}/500
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">Cidade</label>
          <CityInput
            value={city}
            onChange={setCity}
            onCityStateChange={({ city: c, state: s }) => {
              setCity(c);
              setState(s);
            }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-azul-principal/20 focus-within:border-azul-principal"
            inputClassName="flex-1 min-w-0 text-sm text-azul-noite placeholder-gray-400 outline-none bg-transparent"
            placeholder="Ex: São Paulo"
          />
          {state && (
            <p className="text-xs text-cinza-texto mt-1">Estado: {state}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-azul-noite mb-1.5">
            Raio de atendimento
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite bg-white focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent"
          >
            {RADIUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <SaveButton isPending={isPending} saved={saved} />
      </div>
    </form>
  );
}

function EspecialidadesTab({
  initialSpecialties,
  initialAffinities,
}: {
  initialSpecialties: string[];
  initialAffinities: string[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSpecialties));
  const [tags, setTags] = useState<string[]>(initialAffinities);
  const [tagInput, setTagInput] = useState("");
  const [isPendingSpec, startTransitionSpec] = useTransition();
  const [isPendingAff, startTransitionAff] = useTransition();
  const [savedSpec, setSavedSpec] = useState(false);
  const [savedAff, setSavedAff] = useState(false);
  const [errorSpec, setErrorSpec] = useState<string | null>(null);
  const [errorAff, setErrorAff] = useState<string | null>(null);

  function toggleCategory(cat: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
    setSavedSpec(false);
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setSavedAff(false);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
    setSavedAff(false);
  }

  function saveSpecialties() {
    setErrorSpec(null);
    setSavedSpec(false);
    startTransitionSpec(async () => {
      const res = await updateSpecialties(Array.from(selected));
      if (res?.error) setErrorSpec(res.error);
      else setSavedSpec(true);
    });
  }

  function saveAffinities() {
    setErrorAff(null);
    setSavedAff(false);
    startTransitionAff(async () => {
      const res = await updateAffinities(tags);
      if (res?.error) setErrorAff(res.error);
      else setSavedAff(true);
    });
  }

  return (
    <div className="space-y-6">
      {/* Especialidades */}
      <div className="bg-white rounded-card shadow-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-azul-noite">Especialidades</h3>
        <p className="text-xs text-cinza-texto -mt-2">
          Selecione as áreas em que você atua.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selected.has(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-left ${
                  isSelected
                    ? "bg-azul-claro border-azul-principal text-azul-principal"
                    : "border-gray-200 text-cinza-texto hover:border-azul-principal/40 hover:text-azul-noite"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-azul-principal border-azul-principal" : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {cat}
              </button>
            );
          })}
        </div>
        {errorSpec && <p className="text-sm text-red-600">{errorSpec}</p>}
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-cinza-texto">{selected.size} selecionada(s)</p>
          <button
            type="button"
            onClick={saveSpecialties}
            disabled={isPendingSpec}
            className="flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isPendingSpec ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {savedSpec ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Afinidades */}
      <div className="bg-white rounded-card shadow-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-azul-noite">Afinidades</h3>
        <p className="text-xs text-cinza-texto -mt-2">
          Palavras-chave que descrevem seu trabalho (ex: "reforma completa", "atendimento rápido").
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 bg-azul-claro text-azul-principal text-sm px-3 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-azul-principal/60 hover:text-azul-noite transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Digite e pressione Enter para adicionar"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-cinza-texto hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {errorAff && <p className="text-sm text-red-600">{errorAff}</p>}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={saveAffinities}
            disabled={isPendingAff}
            className="flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isPendingAff ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {savedAff ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContatosTab({ initialChannels }: { initialChannels: Channel[] }) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState("WHATSAPP");
  const [newValue, setNewValue] = useState("");
  const [newPrimary, setNewPrimary] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    if (!newValue.trim()) return;
    setError(null);
    startTransition(async () => {
      const res = await addContactChannel({
        type: newType,
        value: newValue.trim(),
        is_primary: newPrimary,
      });
      if (res?.error) {
        setError(res.error);
      } else {
        setAdding(false);
        setNewValue("");
        setNewPrimary(false);
        // Optimistically update
        setChannels((prev) => {
          const updated = newPrimary ? prev.map((c) => ({ ...c, is_primary: false })) : prev;
          return [
            ...updated,
            {
              id: Date.now().toString(),
              type: newType,
              value: newValue.trim(),
              is_primary: newPrimary,
            },
          ];
        });
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteContactChannel(id);
      if (!res?.error) {
        setChannels((prev) => prev.filter((c) => c.id !== id));
      }
    });
  }

  function handleSetPrimary(id: string) {
    startTransition(async () => {
      const res = await setChannelPrimary(id);
      if (!res?.error) {
        setChannels((prev) =>
          prev.map((c) => ({ ...c, is_primary: c.id === id }))
        );
      }
    });
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-azul-noite">Canais de contato</h3>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 text-sm text-azul-principal font-medium hover:text-azul-noite transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar canal
        </button>
      </div>

      {channels.length === 0 && !adding && (
        <p className="text-sm text-cinza-texto py-4 text-center">
          Nenhum canal de contato adicionado.
        </p>
      )}

      <div className="divide-y divide-gray-50">
        {channels.map((ch) => (
          <div key={ch.id} className="flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 bg-azul-claro text-azul-principal rounded-full">
                  {CHANNEL_TYPES.find((t) => t.value === ch.type)?.label ?? ch.type}
                </span>
                {ch.is_primary && (
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400" />
                    Principal
                  </span>
                )}
              </div>
              <p className="text-sm text-azul-noite mt-0.5 truncate">{ch.value}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!ch.is_primary && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(ch.id)}
                  disabled={isPending}
                  className="text-xs text-cinza-texto hover:text-azul-principal transition-colors"
                >
                  Definir principal
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(ch.id)}
                disabled={isPending}
                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <div className="border border-azul-principal/20 bg-azul-claro/30 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-azul-noite">Novo canal</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-azul-noite mb-1">Tipo</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite bg-white focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent"
              >
                {CHANNEL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-azul-noite mb-1">Valor</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-azul-principal"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-azul-noite cursor-pointer">
            <input
              type="checkbox"
              checked={newPrimary}
              onChange={(e) => setNewPrimary(e.target.checked)}
              className="w-4 h-4 rounded accent-azul-principal"
            />
            Definir como canal principal
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setAdding(false); setError(null); }}
              className="flex-1 border border-gray-200 rounded-lg py-2 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isPending}
              className="flex-1 bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-60"
            >
              {isPending ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RedesSociaisTab({
  initialNetworks,
}: {
  initialNetworks: SocialNetwork[];
}) {
  const getInitialValue = (platform: string) =>
    initialNetworks.find((n) => n.platform === platform)?.handle_or_url ?? "";

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.value, getInitialValue(p.value)]))
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const networks = SOCIAL_PLATFORMS.map((p) => ({
        platform: p.value,
        handle_or_url: values[p.value] ?? "",
      }));
      const res = await updateSocialNetworks(networks);
      if (res?.error) setError(res.error);
      else setSaved(true);
    });
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 space-y-5">
      <h3 className="text-sm font-semibold text-azul-noite">Redes sociais</h3>

      <div className="space-y-4">
        {SOCIAL_PLATFORMS.map(({ value, label, abbr, placeholder }) => (
          <div key={value} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-cinza-texto">{abbr}</span>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-azul-noite mb-1">{label}</label>
              <input
                type="text"
                value={values[value] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [value]: e.target.value }))
                }
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-azul-noite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal"
              />
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between pt-1">
        {saved && <p className="text-sm text-green-600">Salvo com sucesso!</p>}
        <div className="ml-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 bg-azul-principal hover:bg-azul-noite text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar redes
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfileForm({
  profile,
  fullName,
  specialties,
  affinities,
  channels,
  socialNetworks,
  professionalId,
}: Props) {
  return (
    <Tabs.Root defaultValue="identidade">
      <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 flex-wrap">
        {[
          { value: "identidade", label: "Identidade" },
          { value: "especialidades", label: "Especialidades" },
          { value: "contatos", label: "Contatos" },
          { value: "redes", label: "Redes Sociais" },
        ].map(({ value, label }) => (
          <Tabs.Trigger
            key={value}
            value={value}
            className="px-4 py-2 text-sm font-medium rounded-md text-cinza-texto transition-colors data-[state=active]:bg-white data-[state=active]:text-azul-principal data-[state=active]:shadow-sm"
          >
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="identidade">
        <IdentidadeTab profile={profile} fullName={fullName} />
      </Tabs.Content>
      <Tabs.Content value="especialidades">
        <EspecialidadesTab
          initialSpecialties={specialties}
          initialAffinities={affinities}
        />
      </Tabs.Content>
      <Tabs.Content value="contatos">
        <ContatosTab initialChannels={channels} />
      </Tabs.Content>
      <Tabs.Content value="redes">
        <RedesSociaisTab initialNetworks={socialNetworks} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
