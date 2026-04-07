import Link from "next/link";
import { Star, Camera } from "lucide-react";
import type { BadgeType } from "@/types";

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
  photoUrl: string | null;
  badges: BadgeType[];
  portfolioImages: (string | null)[];
}

const BADGE_CONFIG: Record<BadgeType, { label: string; className: string }> = {
  CERTIFIED: {
    label: "Certificado",
    className: "bg-orange-50 text-laranja-obra border border-laranja-obra/20",
  },
  TRUSTWORTHY: {
    label: "Confiável",
    className: "bg-azul-claro text-azul-principal border border-azul-medio/20",
  },
  VERIFIED: {
    label: "Verificado",
    className: "bg-green-50 text-green-700 border border-green-200",
  },
};

function getPrimaryBadge(badges: BadgeType[]): BadgeType | null {
  if (badges.includes("CERTIFIED")) return "CERTIFIED";
  if (badges.includes("TRUSTWORTHY")) return "TRUSTWORTHY";
  if (badges.includes("VERIFIED")) return "VERIFIED";
  return null;
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const { slug, name, city, state, specialties, rating, completedServices, photoUrl, badges, portfolioImages } =
    professional;

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const primaryBadge = getPrimaryBadge(badges);
  const filledStars = Math.round(rating);

  return (
    <div className="bg-white rounded-card shadow-card flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Header: Avatar + Info + Badge */}
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-azul-claro flex items-center justify-center">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-azul-principal font-semibold text-sm">{initials}</span>
          )}
        </div>

        {/* Nome + especialidade + cidade */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-azul-noite text-sm truncate">{name}</p>
          <p className="text-xs text-cinza-texto truncate mt-0.5">
            {specialties[0] ?? "Profissional"} · {city}, {state}
          </p>
        </div>

        {/* Badge primário */}
        {primaryBadge && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${BADGE_CONFIG[primaryBadge].className}`}
          >
            {BADGE_CONFIG[primaryBadge].label}
          </span>
        )}
      </div>

      {/* Rating + serviços concluídos */}
      <div className="px-4 pb-3 flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < filledStars
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-azul-noite">{rating.toFixed(1)}</span>
        <span className="text-xs text-cinza-texto">· {completedServices} serviços concluídos</span>
      </div>

      {/* Grid 3 fotos portfólio */}
      <div className="grid grid-cols-3 gap-0.5 mx-4 rounded-lg overflow-hidden">
        {[0, 1, 2].map((i) => {
          const img = portfolioImages[i];
          return img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div
              key={i}
              className="aspect-square bg-gray-100 flex items-center justify-center"
            >
              <Camera size={16} className="text-gray-300" />
            </div>
          );
        })}
      </div>

      {/* Botão Ver perfil */}
      <div className="p-4">
        <Link
          href={`/profissionais/${slug}`}
          className="block w-full text-center bg-azul-principal hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          Ver perfil e portfólio
        </Link>
      </div>
    </div>
  );
}
