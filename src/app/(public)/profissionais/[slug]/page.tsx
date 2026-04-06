import { notFound } from "next/navigation";
import { MapPin, Star, ShieldCheck, Phone, Mail, MessageCircle, ExternalLink, ChevronRight } from "lucide-react";
import { ContactButton } from "./contact-button";

interface Props {
  params: Promise<{ slug: string }>;
}

// Mock temporário — será substituído por query ao Supabase
const MOCK_PROFESSIONAL = {
  id: "1",
  slug: "joao-silva-eletricista",
  name: "João Silva",
  city: "Criciúma",
  state: "SC",
  serviceRadiusKm: 50,
  description:
    "Eletricista com mais de 12 anos de experiência em instalações residenciais e comerciais. Trabalho com materiais de qualidade, deixo tudo documentado e entrego laudo após o serviço. Atendo finais de semana e emergências.",
  specialties: ["Elétrica", "Automação"],
  affinities: ["Atendo finais de semana", "Emite nota fiscal", "Orçamento gratuito", "Pequenas reformas"],
  photoUrl: null,
  isVerified: true,
  badges: ["VERIFIED", "TRUSTWORTHY"],
  rating: 4.8,
  reviewCount: 23,
  primaryContact: {
    type: "WHATSAPP" as const,
    value: "48999990000",
    link: "https://wa.me/5548999990000",
  },
  secondaryContacts: [
    { type: "PHONE" as const, value: "(48) 3333-4444", link: "tel:4833334444" },
    { type: "EMAIL" as const, value: "joao@email.com", link: "mailto:joao@email.com" },
  ],
  socialNetworks: [
    { platform: "INSTAGRAM" as const, url: "https://instagram.com/joaoeletricista" },
  ],
  portfolioProjects: [
    {
      id: "p1",
      title: "Instalação elétrica completa — sobrado 3 andares",
      category: "Elétrica",
      city: "Criciúma",
      description: "Projeto e execução completa da instalação elétrica de sobrado com 3 andares e 4 quartos. Passagem de fiação, quadro de distribuição, spda e automação de iluminação.",
      images: [null, null, null, null],
      isFeatured: true,
    },
    {
      id: "p2",
      title: "Reforma elétrica — apartamento",
      category: "Elétrica",
      city: "Içara",
      description: "Modernização do quadro elétrico e troca de fiação antiga.",
      images: [null, null],
      isFeatured: false,
    },
    {
      id: "p3",
      title: "Automação residencial",
      category: "Automação",
      city: "Criciúma",
      description: "Instalação de sistema de automação para controle de iluminação e climatização.",
      images: [null, null, null],
      isFeatured: false,
    },
  ],
  evaluations: [
    {
      id: "e1",
      contractorName: "Maria Fernanda",
      rating: 5,
      comment: "João foi muito profissional. Chegou no horário, trabalhou limpo e entregou tudo funcionando. Super recomendo!",
      createdAt: "2024-11-10",
      response: "Obrigado pela confiança, Maria! Foi um prazer trabalhar no seu imóvel.",
    },
    {
      id: "e2",
      contractorName: "Carlos Henrique",
      rating: 5,
      comment: "Excelente serviço. Muito cuidadoso e organizado.",
      createdAt: "2024-10-22",
      response: null,
    },
    {
      id: "e3",
      contractorName: "Juliana Costa",
      rating: 4,
      comment: "Bom profissional, trabalho bem feito. Só um pequeno atraso no prazo.",
      createdAt: "2024-09-15",
      response: "Obrigado pelo feedback, Juliana. Tivemos um imprevisto com o material, mas ficou tudo certo!",
    },
  ],
};

const CONTACT_ICONS = {
  WHATSAPP: MessageCircle,
  PHONE: Phone,
  EMAIL: Mail,
};

const CONTACT_LABELS = {
  WHATSAPP: "WhatsApp",
  PHONE: "Telefone",
  EMAIL: "E-mail",
};

// lucide-react não tem ícones de redes sociais — usando SVGs inline via mapa de labels
const SOCIAL_LABELS: Record<string, string> = {
  INSTAGRAM: "IG",
  FACEBOOK: "FB",
  YOUTUBE: "YT",
  LINKEDIN: "IN",
  TIKTOK: "TK",
};

const BADGE_LABELS: Record<string, { label: string; color: string }> = {
  VERIFIED: { label: "Verificado", color: "bg-blue-100 text-azul-principal" },
  TRUSTWORTHY: { label: "Confiável", color: "bg-green-100 text-green-700" },
  CERTIFIED: { label: "Certificado", color: "bg-purple-100 text-purple-700" },
};

export default async function ProfissionalProfilePage({ params }: Props) {
  const { slug } = await params;

  // TODO: buscar do Supabase
  if (slug !== MOCK_PROFESSIONAL.slug) notFound();

  const pro = MOCK_PROFESSIONAL;
  const initials = pro.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const PrimaryIcon = CONTACT_ICONS[pro.primaryContact.type];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card de identidade */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex gap-4 items-start">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full shrink-0 overflow-hidden bg-azul-claro flex items-center justify-center">
                  {pro.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pro.photoUrl} alt={pro.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-azul-principal font-bold text-2xl">{initials}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-semibold text-azul-noite">{pro.name}</h1>
                    {pro.isVerified && <ShieldCheck size={18} className="text-azul-medio" />}
                  </div>

                  {/* Localização */}
                  <div className="flex items-center gap-1 text-sm text-cinza-texto mb-3">
                    <MapPin size={13} />
                    <span>{pro.city}, {pro.state} · Atende até {pro.serviceRadiusKm}km</span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {pro.badges.map((badge) => {
                      const b = BADGE_LABELS[badge];
                      return (
                        <span key={badge} className={`text-xs font-medium px-2.5 py-1 rounded-full ${b.color}`}>
                          {b.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-azul-noite">{pro.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-cinza-texto">{pro.reviewCount} avaliações</p>
                </div>
              </div>

              {/* Descrição */}
              <p className="mt-4 text-sm text-cinza-texto leading-relaxed border-t border-gray-100 pt-4">
                {pro.description}
              </p>

              {/* Especialidades */}
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto mb-2">Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {pro.specialties.map((s) => (
                    <span key={s} className="text-sm bg-azul-claro text-azul-principal px-3 py-1 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Afinidades */}
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto mb-2">Diferenciais</p>
                <div className="flex flex-wrap gap-2">
                  {pro.affinities.map((tag) => (
                    <span key={tag} className="text-xs border border-gray-200 text-cinza-texto px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfólio */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-lg font-semibold text-azul-noite mb-4">Portfólio</h2>
              <div className="space-y-6">
                {pro.portfolioProjects.map((project) => (
                  <div key={project.id} className="border border-gray-100 rounded-lg overflow-hidden">
                    {/* Galeria de fotos */}
                    <div className="grid grid-cols-4 gap-0.5 h-40 bg-gray-100">
                      {project.images.slice(0, 4).map((img, i) => (
                        <div
                          key={i}
                          className={`relative overflow-hidden bg-linear-to-br from-azul-claro to-blue-100 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                          style={i === 0 ? { gridRow: "span 2" } : {}}
                        >
                          {img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-azul-medio">Foto</span>
                            </div>
                          )}
                          {i === 3 && project.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">+{project.images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Info do projeto */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {project.isFeatured && (
                              <span className="text-xs bg-laranja-obra/10 text-laranja-obra px-2 py-0.5 rounded-full font-medium">
                                Destaque
                              </span>
                            )}
                            <span className="text-xs text-cinza-texto">{project.category}</span>
                            <span className="text-xs text-cinza-texto">· {project.city}</span>
                          </div>
                          <h3 className="font-medium text-azul-noite text-sm">{project.title}</h3>
                          {project.description && (
                            <p className="text-xs text-cinza-texto mt-1 leading-relaxed">{project.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Avaliações */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-azul-noite">Avaliações</h2>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-azul-noite">{pro.rating.toFixed(1)}</span>
                  <span className="text-sm text-cinza-texto">({pro.reviewCount})</span>
                </div>
              </div>

              <div className="space-y-4">
                {pro.evaluations.map((ev) => {
                  const evInitials = ev.contractorName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
                  return (
                    <div key={ev.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-cinza-texto text-xs font-semibold flex items-center justify-center shrink-0">
                          {evInitials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-azul-noite">{ev.contractorName}</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={11}
                                  className={i < ev.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-cinza-texto leading-relaxed">{ev.comment}</p>
                          {ev.response && (
                            <div className="mt-2 pl-3 border-l-2 border-azul-claro">
                              <p className="text-xs text-azul-noite font-medium mb-0.5">Resposta do profissional:</p>
                              <p className="text-xs text-cinza-texto leading-relaxed">{ev.response}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Coluna lateral — Contato */}
          <div className="space-y-4">

            {/* Card contato principal */}
            <div className="bg-white rounded-card shadow-card p-5 sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto mb-3">
                Entrar em contato
              </p>

              {/* Contato principal destacado */}
              <ContactButton
                type={pro.primaryContact.type}
                link={pro.primaryContact.link}
                label={`${CONTACT_LABELS[pro.primaryContact.type]}: ${pro.primaryContact.value}`}
                primary
              />

              {/* Contatos secundários */}
              {pro.secondaryContacts.length > 0 && (
                <div className="mt-3 space-y-2">
                  {pro.secondaryContacts.map((contact) => {
                    return (
                      <ContactButton
                        key={contact.type}
                        type={contact.type}
                        link={contact.link}
                        label={`${CONTACT_LABELS[contact.type]}: ${contact.value}`}
                        primary={false}
                      />
                    );
                  })}
                </div>
              )}

              {/* Redes sociais */}
              {pro.socialNetworks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-cinza-texto mb-2">Redes sociais</p>
                  <div className="flex gap-2">
                    {pro.socialNetworks.map((sn) => (
                      <a
                        key={sn.platform}
                        href={sn.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={sn.platform}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-azul-claro flex items-center justify-center transition-colors"
                      >
                        <span className="text-[10px] font-bold text-azul-noite">
                          {SOCIAL_LABELS[sn.platform] ?? <ExternalLink size={13} />}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs text-cinza-texto leading-relaxed">
                Negocie diretamente com o profissional. O Prumo não intermedia pagamentos.
              </p>
            </div>

            {/* Breadcrumb de volta */}
            <a
              href="/profissionais"
              className="flex items-center gap-1 text-sm text-cinza-texto hover:text-azul-principal transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" />
              Ver outros profissionais
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
