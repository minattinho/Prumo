import { ProfessionalCard } from "./professional-card";

// Mock temporário — será substituído por query ao Supabase
const MOCK_PROFESSIONALS = [
  {
    id: "1",
    slug: "joao-silva-eletricista",
    name: "João Silva",
    city: "Criciúma",
    state: "SC",
    specialties: ["Elétrica"],
    rating: 4.8,
    reviewCount: 23,
    photoUrl: null,
    isVerified: true,
    portfolioImages: [null, null, null],
  },
  {
    id: "2",
    slug: "ana-reformas",
    name: "Ana Costa",
    city: "Florianópolis",
    state: "SC",
    specialties: ["Pintura", "Acabamento"],
    rating: 4.6,
    reviewCount: 15,
    photoUrl: null,
    isVerified: true,
    portfolioImages: [null, null, null],
  },
  {
    id: "3",
    slug: "pedro-encanador",
    name: "Pedro Mendes",
    city: "Joinville",
    state: "SC",
    specialties: ["Hidráulica"],
    rating: 4.9,
    reviewCount: 41,
    photoUrl: null,
    isVerified: false,
    portfolioImages: [null, null],
  },
  {
    id: "4",
    slug: "carlos-pedreiro",
    name: "Carlos Oliveira",
    city: "Blumenau",
    state: "SC",
    specialties: ["Construção", "Acabamento"],
    rating: 4.3,
    reviewCount: 8,
    photoUrl: null,
    isVerified: true,
    portfolioImages: [null, null, null],
  },
  {
    id: "5",
    slug: "fernanda-arquiteta",
    name: "Fernanda Lima",
    city: "Criciúma",
    state: "SC",
    specialties: ["Projeto", "Engenharia"],
    rating: 5.0,
    reviewCount: 12,
    photoUrl: null,
    isVerified: true,
    portfolioImages: [null, null, null],
  },
  {
    id: "6",
    slug: "roberto-marceneiro",
    name: "Roberto Farias",
    city: "Tubarão",
    state: "SC",
    specialties: ["Marcenaria"],
    rating: 4.7,
    reviewCount: 19,
    photoUrl: null,
    isVerified: false,
    portfolioImages: [null, null],
  },
];

interface SearchResultsProps {
  categoria?: string;
  cidade?: string;
  ordem?: string;
}

export function SearchResults({ categoria, cidade }: SearchResultsProps) {
  const filtered = MOCK_PROFESSIONALS.filter((p) => {
    if (categoria && !p.specialties.some((s) => s.toLowerCase().includes(categoria))) return false;
    if (cidade && !p.city.toLowerCase().includes(cidade.toLowerCase())) return false;
    return true;
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-2">🔍</p>
        <p className="text-azul-noite font-medium mb-1">Nenhum profissional encontrado</p>
        <p className="text-cinza-texto text-sm">Tenta outros filtros ou uma cidade diferente.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-cinza-texto mb-6">
        {filtered.length} profissional{filtered.length !== 1 ? "is" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} />
        ))}
      </div>
    </div>
  );
}
