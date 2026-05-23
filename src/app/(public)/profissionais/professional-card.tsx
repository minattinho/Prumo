import Link from "next/link";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Camera,
  MapPin,
  Star,
  UserRound,
} from "lucide-react";
import type { BadgeType } from "@/types";
import { ResponsiveImage } from "@/components/ResponsiveImage";

interface Professional {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  completedServices: number;
  contactsReceived?: number;
  photoUrl: string | null;
  badges: BadgeType[];
  portfolioImages: (string | null)[];
  professionalType?: "empresa" | "individual";
}

const BADGE_CONFIG: Record<BadgeType, { label: string; className: string }> = {
  CERTIFIED: {
    label: "Certificado",
    className: "bg-orange-50 text-laranja-obra ring-orange-200",
  },
  TRUSTWORTHY: {
    label: "Confiável",
    className: "bg-azul-claro text-azul-principal ring-azul-medio/20",
  },
  VERIFIED: {
    label: "Verificado",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

function getPrimaryBadge(badges: BadgeType[]): BadgeType | null {
  if (badges.includes("CERTIFIED")) return "CERTIFIED";
  if (badges.includes("TRUSTWORTHY")) return "TRUSTWORTHY";
  if (badges.includes("VERIFIED")) return "VERIFIED";
  return null;
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const {
    slug,
    name,
    city,
    state,
    specialties,
    rating,
    reviewCount,
    completedServices,
    contactsReceived = 0,
    photoUrl,
    badges,
    portfolioImages,
    professionalType = "individual",
  } = professional;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const primaryBadge = getPrimaryBadge(badges);
  const filledStars = Math.round(rating);
  const location = [city, state].filter(Boolean).join(", ") || "Localização a confirmar";
  const secondarySpecialties = specialties.slice(1, 3);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-azul-medio/30 hover:shadow-lg">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-azul-claro ring-1 ring-slate-200">
            {photoUrl ? (
              <ResponsiveImage
                src={photoUrl}
                alt={`Foto de perfil de ${name}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-azul-principal">{initials || "P"}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-azul-noite">{name}</h2>
                <p className="mt-0.5 truncate text-sm text-cinza-texto">
                  {specialties[0] ?? "Profissional"}
                </p>
              </div>
              {primaryBadge && (
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${BADGE_CONFIG[primaryBadge].className}`}
                >
                  <BadgeCheck size={12} />
                  {BADGE_CONFIG[primaryBadge].label}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-1 text-xs text-cinza-texto">
              <MapPin size={13} className="shrink-0 text-azul-principal" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {secondarySpecialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {secondarySpecialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-cinza-texto"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={13}
                  className={
                    index < filledStars
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-slate-200 text-slate-200"
                  }
                />
              ))}
            </div>
            <p className="mt-1 font-semibold text-azul-noite">
              {rating > 0 ? rating.toFixed(1) : "Novo"}
            </p>
            <p className="text-xs text-cinza-texto">
              {reviewCount} avaliação{reviewCount !== 1 ? "ões" : ""}
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-1 text-azul-principal">
              <BriefcaseBusiness size={14} />
              <span className="text-xs font-semibold uppercase">Histórico</span>
            </div>
            <p className="mt-1 font-semibold text-azul-noite">{completedServices}</p>
            <p className="text-xs text-cinza-texto">serviços concluídos</p>
          </div>
        </div>
      </div>

      <div className="mx-4 grid grid-cols-3 gap-1 overflow-hidden rounded-lg bg-slate-100">
        {[0, 1, 2].map((index) => {
          const img = portfolioImages[index];
          return img ? (
            <div key={index} className="relative aspect-square w-full overflow-hidden">
              <ResponsiveImage
                src={img}
                alt={`Foto de portfólio de ${name}`}
                fill
                sizes="(min-width: 1280px) 110px, (min-width: 640px) 28vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ) : (
            <div key={index} className="flex aspect-square items-center justify-center bg-slate-100">
              <Camera size={16} className="text-slate-300" />
            </div>
          );
        })}
      </div>

      <div className="mt-auto p-4">
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-cinza-texto">
            {professionalType === "empresa" ? <Building2 size={14} /> : <UserRound size={14} />}
            <span className="truncate">{professionalType === "empresa" ? "Empresa" : "Pessoa física"}</span>
          </div>
          <div className="rounded-lg border border-slate-200 px-2 py-2 text-cinza-texto">
            <span className="font-medium text-azul-noite">Preço sob consulta</span>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          <span className="font-medium">Disponível para contato</span>
          {contactsReceived > 0 && <span>{contactsReceived} contatos</span>}
        </div>

        <Link
          href={`/profissionais/${slug}`}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-azul-principal px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Ver perfil e portfólio
        </Link>
      </div>
    </article>
  );
}
