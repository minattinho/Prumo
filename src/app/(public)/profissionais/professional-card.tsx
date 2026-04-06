import Link from "next/link";
import { MapPin, Star, ShieldCheck } from "lucide-react";

interface Professional {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  photoUrl: string | null;
  isVerified: boolean;
  portfolioImages: (string | null)[];
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  const { slug, name, city, state, specialties, rating, reviewCount, photoUrl, isVerified, portfolioImages } = professional;

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/profissionais/${slug}`}
      className="bg-white rounded-card shadow-card hover:shadow-md transition-shadow overflow-hidden flex flex-col group"
    >
      {/* Miniatura do portfólio */}
      <div className="grid grid-cols-3 gap-0.5 h-32 bg-gray-100">
        {portfolioImages.slice(0, 3).map((img, i) =>
          img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              key={i}
              className="w-full h-full bg-linear-to-br from-azul-claro to-blue-100 flex items-center justify-center"
            >
              <span className="text-xs text-azul-medio">Foto</span>
            </div>
          )
        )}
        {portfolioImages.length < 3 &&
          Array.from({ length: 3 - portfolioImages.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200"
            />
          ))}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-3 items-start">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden bg-azul-claro flex items-center justify-center">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-azul-principal font-semibold text-sm">{initials}</span>
            )}
          </div>

          {/* Nome + localização */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-azul-noite text-sm truncate group-hover:text-azul-principal transition-colors">
                {name}
              </span>
              {isVerified && (
                <ShieldCheck size={14} className="text-azul-medio shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-cinza-texto mt-0.5">
              <MapPin size={11} />
              <span>{city}, {state}</span>
            </div>
          </div>
        </div>

        {/* Especialidades */}
        <div className="flex flex-wrap gap-1">
          {specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-xs bg-azul-claro text-azul-principal px-2 py-0.5 rounded-full font-medium"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 pt-1 border-t border-gray-100">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-azul-noite">{rating.toFixed(1)}</span>
          <span className="text-xs text-cinza-texto">({reviewCount} avaliações)</span>
        </div>
      </div>
    </Link>
  );
}
