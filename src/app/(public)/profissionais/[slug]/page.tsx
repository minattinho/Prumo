import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Star, ShieldCheck, ExternalLink, ChevronRight, Lock, BadgeDollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ContactButton } from "./contact-button";
import type { ProfessionalPricing } from "@/types";
import { getServiceLabel } from "@/types/services";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { BudgetRequestModal } from "./budget-request-modal";

const BASE_URL = process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id, photo_url, personal_description, city, state, user_id")
    .eq("slug", slug)
    .single();

  if (!pro) return { title: "Profissional não encontrado | Prumo" };

  const [{ data: profile }, { data: specialties }] = await Promise.all([
    supabase.from("profiles").select("name").eq("id", pro.user_id).single(),
    supabase.from("professional_specialties").select("category").eq("professional_id", pro.id).limit(3),
  ]);

  const name = profile?.name ?? "Profissional";
  const location = [pro.city, pro.state].filter(Boolean).join(", ");
  const specs = (specialties ?? []).map((s: { category: string }) => getServiceLabel(s.category)).join(", ");
  const description = pro.personal_description
    ?? `${name} é profissional${location ? ` em ${location}` : ""}${specs ? ` especializado em ${specs}` : ""}. Veja portfólio, avaliações e entre em contato pelo Prumo.`;
  const title = `${name}${location ? ` — ${location}` : ""} | Prumo`;
  const url = `${BASE_URL}/profissionais/${slug}`;

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url,
      type: "profile",
      images: pro.photo_url
        ? [{ url: pro.photo_url, width: 400, height: 400, alt: `Foto de ${name}` }]
        : [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary",
      title,
      description: description.slice(0, 160),
      images: pro.photo_url ? [pro.photo_url] : [`${BASE_URL}/og-image.png`],
    },
  };
}

const CONTACT_LABELS: Record<string, string> = {
  WHATSAPP: "WhatsApp",
  PHONE: "Telefone",
  EMAIL: "E-mail",
};

function getContactLink(type: string, value: string, linkFormatted: string | null): string {
  if (linkFormatted) return linkFormatted;
  if (type === "EMAIL") return `mailto:${value}`;
  if (type === "WHATSAPP") return `https://api.whatsapp.com/send/?phone=${value}&text=Ol%C3%A1,+Vim+pelo+Prumo!`;
  return `tel:${value}`;
}

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

const PRICE_LABELS: Array<{ key: "price_per_hour" | "price_per_day" | "price_per_month" | "price_per_service"; label: string }> = [
  { key: "price_per_hour", label: "Por hora" },
  { key: "price_per_day", label: "Por dia" },
  { key: "price_per_month", label: "Por mês" },
  { key: "price_per_service", label: "Por serviço" },
];

function formatPrice(value: number | string | null, currency: string | null) {
  if (value === null) return null;
  const numericValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numericValue)) return null;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(numericValue);
}

export default async function ProfissionalProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Perfil profissional (RLS filtra status=ACTIVE para visitantes)
  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id, user_id, slug, photo_url, personal_description, city, state, service_radius_km, price_per_hour, price_per_day, price_per_month, price_per_service, price_currency")
    .eq("slug", slug)
    .single() as { data: Omit<ProfessionalPricing, "price_per_hour" | "price_per_day" | "price_per_month" | "price_per_service"> & {
      id: string; user_id: string; slug: string; photo_url: string | null;
      personal_description: string | null; city: string | null; state: string | null;
      service_radius_km: number | null;
      price_per_hour: number | string | null;
      price_per_day: number | string | null;
      price_per_month: number | string | null;
      price_per_service: number | string | null;
      price_currency: string | null;
    } | null };

  if (!pro) notFound();

  // 2. Nome do profissional
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", pro.user_id)
    .single() as { data: { name: string } | null };

  // 3. Auth check (server-side)
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  let isContractor = false;
  if (user) {
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isContractor = userProfile?.role === "contractor";
  }

  // 4. Dados públicos em paralelo
  const [
    { data: specialties },
    { data: affinities },
    { data: projects },
    { data: metrics },
    { data: badges },
    { data: socials },
    { data: evals },
  ] = await Promise.all([
    supabase.from("professional_specialties").select("category").eq("professional_id", pro.id),
    supabase.from("professional_affinities").select("tag").eq("professional_id", pro.id),
    supabase
      .from("portfolio_projects")
      .select("id, title, category, city_executed, description, is_featured, display_order, portfolio_images(cloudinary_url, order_in_project)")
      .eq("professional_id", pro.id)
      .order("display_order"),
    supabase
      .from("professional_metrics")
      .select("average_rating, total_evaluations")
      .eq("professional_id", pro.id)
      .single(),
    supabase.from("verification_badges").select("type").eq("professional_id", pro.id),
    supabase.from("professional_social_networks").select("platform, handle_or_url").eq("professional_id", pro.id),
    supabase
      .from("evaluations")
      .select("id, rating, comment, created_at, profiles!contractor_id(name), evaluation_responses(response_text)")
      .eq("professional_id", pro.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // 5. Canais de contato — somente se autenticado (RLS também garante isso)
  let channels: Array<{ id: string; type: string; value: string; is_primary: boolean; link_formatted: string | null }> = [];
  if (isAuthenticated) {
    const { data: channelData } = await supabase
      .from("professional_contact_channels")
      .select("id, type, value, is_primary, link_formatted")
      .eq("professional_id", pro.id)
      .order("is_primary", { ascending: false });
    channels = channelData ?? [];

    // Logs de atividade (não registra o próprio profissional)
    if (user!.id !== pro.user_id) {
      // PROFILE_VIEWED: toda visita autenticada ao perfil
      await supabase.from("profile_activity_logs").insert({
        professional_id: pro.id,
        contractor_id: user!.id,
        event_type: "PROFILE_VIEWED",
      });

      // contact_logs: só primeira vez (controla métricas e permissão de avaliação)
      if (channels.length > 0) {
        const { count } = await supabase
          .from("contact_logs")
          .select("id", { count: "exact", head: true })
          .eq("contractor_id", user!.id)
          .eq("professional_id", pro.id);

        if (count === 0) {
          const primary = channels.find((c) => c.is_primary) ?? channels[0];
          const logType =
            primary.type === "WHATSAPP" ? "VIEWED_WHATSAPP"
            : primary.type === "PHONE" ? "VIEWED_PHONE"
            : "VIEWED_EMAIL";
          await supabase.from("contact_logs").insert({
            contractor_id: user!.id,
            professional_id: pro.id,
            contact_type: logType,
          });
        }

        // CONTACT_VIEWED: toda vez que contatos são exibidos
        await supabase.from("profile_activity_logs").insert({
          professional_id: pro.id,
          contractor_id: user!.id,
          event_type: "CONTACT_VIEWED",
        });
      }
    }
  }

  const name = profile?.name ?? "Profissional";
  const initials = name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
  const avgRating = (metrics as any)?.average_rating ?? 0;
  const totalEvals = (metrics as any)?.total_evaluations ?? 0;

  const primaryChannel = channels.find((c) => c.is_primary) ?? channels[0] ?? null;
  const secondaryChannels = channels.filter((c) => c !== primaryChannel && ["WHATSAPP", "PHONE", "EMAIL"].includes(c.type));
  const prices = PRICE_LABELS.map(({ key, label }) => ({
    label,
    value: formatPrice(pro[key], pro.price_currency),
  })).filter((price) => price.value);

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
                <div className="relative w-20 h-20 rounded-full shrink-0 overflow-hidden bg-azul-claro flex items-center justify-center">
                  {pro.photo_url ? (
                    <ResponsiveImage src={pro.photo_url} alt={`Foto de perfil de ${name}`} fill sizes="80px" className="object-cover" priority />
                  ) : (
                    <span className="text-azul-principal font-bold text-2xl">{initials}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-xl font-semibold text-azul-noite">{name}</h1>
                    {(badges ?? []).some((b: any) => b.type === "VERIFIED") && (
                      <ShieldCheck size={18} className="text-azul-medio" />
                    )}
                  </div>

                  {/* Localização */}
                  {(pro.city || pro.state) && (
                    <div className="flex items-center gap-1 text-sm text-cinza-texto mb-3">
                      <MapPin size={13} />
                      <span>
                        {[pro.city, pro.state].filter(Boolean).join(", ")}
                        {pro.service_radius_km ? ` · Atende até ${pro.service_radius_km}km` : ""}
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  {(badges ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(badges as any[]).map((b: any) => {
                        const badge = BADGE_LABELS[b.type];
                        if (!badge) return null;
                        return (
                          <span key={b.type} className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Rating */}
                {totalEvals > 0 && (
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-azul-noite">{Number(avgRating).toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-cinza-texto">{totalEvals} avaliações</p>
                  </div>
                )}
              </div>

              {/* Descrição */}
              {pro.personal_description && (
                <p className="mt-4 text-sm text-cinza-texto leading-relaxed border-t border-gray-100 pt-4">
                  {pro.personal_description}
                </p>
              )}

              {/* Especialidades */}
              {(specialties ?? []).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto mb-2">Especialidades</p>
                  <div className="flex flex-wrap gap-2">
                    {(specialties as any[]).map((s: any) => (
                      <span key={s.category} className="text-sm bg-azul-claro text-azul-principal px-3 py-1 rounded-full font-medium">
                        {getServiceLabel(s.category)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Afinidades */}
              {(affinities ?? []).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto mb-2">Diferenciais</p>
                  <div className="flex flex-wrap gap-2">
                    {(affinities as any[]).map((a: any) => (
                      <span key={a.tag} className="text-xs border border-gray-200 text-cinza-texto px-2.5 py-1 rounded-full">
                        {a.tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portfólio */}
            {(projects ?? []).length > 0 && (
              <div className="bg-white rounded-card shadow-card p-6">
                <h2 className="text-lg font-semibold text-azul-noite mb-4">Portfólio</h2>
                <div className="space-y-6">
                  {(projects as any[]).map((project: any) => {
                    const images: any[] = (project.portfolio_images ?? []).sort((a: any, b: any) => a.order_in_project - b.order_in_project);
                    return (
                      <div key={project.id} className="border border-gray-100 rounded-lg overflow-hidden">
                        {/* Galeria de fotos */}
                        {images.length > 0 && (
                          <div className="grid grid-cols-4 gap-0.5 h-40 bg-gray-100">
                            {images.slice(0, 4).map((img: any, i: number) => (
                              <div
                                key={img.cloudinary_url}
                                className={`relative overflow-hidden bg-linear-to-br from-azul-claro to-blue-100 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                                style={i === 0 ? { gridRow: "span 2" } : {}}
                              >
                                <ResponsiveImage
                                  src={img.cloudinary_url}
                                  alt={`Foto do projeto ${project.title}`}
                                  fill
                                  sizes={i === 0 ? "(min-width: 1024px) 384px, 50vw" : "(min-width: 1024px) 192px, 25vw"}
                                  className="object-cover"
                                  loading="lazy"
                                />
                                {i === 3 && images.length > 4 && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">+{images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Info do projeto */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                {project.is_featured && (
                                  <span className="text-xs bg-laranja-obra/10 text-laranja-obra px-2 py-0.5 rounded-full font-medium">
                                    Destaque
                                  </span>
                                )}
                                <span className="text-xs text-cinza-texto">{getServiceLabel(project.category)}</span>
                                {project.city_executed && (
                                  <span className="text-xs text-cinza-texto">· {project.city_executed}</span>
                                )}
                              </div>
                              <h3 className="font-medium text-azul-noite text-sm">{project.title}</h3>
                              {project.description && (
                                <p className="text-xs text-cinza-texto mt-1 leading-relaxed">{project.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Avaliações */}
            {(evals ?? []).length > 0 && (
              <div className="bg-white rounded-card shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-azul-noite">Avaliações</h2>
                  {totalEvals > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-azul-noite">{Number(avgRating).toFixed(1)}</span>
                      <span className="text-sm text-cinza-texto">({totalEvals})</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {(evals as any[]).map((ev: any) => {
                    const contractorName = ev.profiles?.name ?? "Contratante";
                    const evInitials = contractorName.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
                    const responseText = ev.evaluation_responses?.[0]?.response_text ?? null;
                    return (
                      <div key={ev.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 text-cinza-texto text-xs font-semibold flex items-center justify-center shrink-0">
                            {evInitials}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-azul-noite">{contractorName}</span>
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
                            {ev.comment && (
                              <p className="text-sm text-cinza-texto leading-relaxed">{ev.comment}</p>
                            )}
                            {responseText && (
                              <div className="mt-2 pl-3 border-l-2 border-azul-claro">
                                <p className="text-xs text-azul-noite font-medium mb-0.5">Resposta do profissional:</p>
                                <p className="text-xs text-cinza-texto leading-relaxed">{responseText}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Coluna lateral — Contato */}
          <div className="space-y-4">
            <div className="bg-white rounded-card shadow-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <BadgeDollarSign size={18} className="text-azul-principal" />
                <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto">
                  Valores de referência
                </p>
              </div>
              {prices.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {prices.map((price) => (
                    <div key={price.label} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                      <span className="text-sm text-cinza-texto">{price.label}</span>
                      <span className="text-sm font-semibold text-azul-noite">{price.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-1">
                  <p className="text-sm font-semibold text-azul-noite mb-1">
                    Preço sob consulta
                  </p>
                  <p className="text-xs text-cinza-texto leading-relaxed">
                    Este profissional prefere combinar os valores diretamente após entender os detalhes do serviço.
                  </p>
                </div>
              )}
            </div>

            {/* Card contato */}
            <div className="bg-white rounded-card shadow-card p-5 sticky top-24">
              <p className="text-xs font-semibold uppercase tracking-wider text-cinza-texto mb-3">
                Entrar em contato
              </p>

              {isAuthenticated ? (
                <>
                  {isContractor && (
                    <BudgetRequestModal
                      professionalId={pro.id}
                      professionalName={name}
                    />
                  )}

                  {primaryChannel ? (
                    <>
                      <ContactButton
                        type={primaryChannel.type as "WHATSAPP" | "PHONE" | "EMAIL"}
                        link={getContactLink(primaryChannel.type, primaryChannel.value, primaryChannel.link_formatted)}
                        label={`${CONTACT_LABELS[primaryChannel.type] ?? primaryChannel.type}: ${primaryChannel.value}`}
                        primary
                      />

                      {secondaryChannels.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {secondaryChannels.map((channel) => (
                            <ContactButton
                              key={channel.id}
                              type={channel.type as "WHATSAPP" | "PHONE" | "EMAIL"}
                              link={getContactLink(channel.type, channel.value, channel.link_formatted)}
                              label={`${CONTACT_LABELS[channel.type] ?? channel.type}: ${channel.value}`}
                              primary={false}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-cinza-texto text-center py-2">
                      Nenhum canal de contato cadastrado.
                    </p>
                  )}

                  {/* Redes sociais */}
                  {(socials ?? []).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-cinza-texto mb-2">Redes sociais</p>
                      <div className="flex gap-2 flex-wrap">
                        {(socials as any[]).map((sn: any) => (
                          <a
                            key={sn.platform}
                            href={sn.handle_or_url}
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
                </>
              ) : (
                <div className="flex flex-col items-center text-center py-4 gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Lock size={18} className="text-cinza-texto" />
                  </div>
                  <p className="text-sm text-cinza-texto leading-snug">
                    Faça login para ver as formas de contato deste profissional.
                  </p>
                  <a
                    href={`/contratante?next=${encodeURIComponent(`/profissionais/${slug}`)}`}
                    className="w-full bg-azul-principal hover:bg-azul-noite text-white rounded-lg py-2.5 text-sm font-medium text-center transition-colors"
                  >
                    Entrar
                  </a>
                  <a
                    href={`/contratante?modo=cadastro&next=${encodeURIComponent(`/profissionais/${slug}`)}`}
                    className="w-full border border-gray-200 hover:border-azul-principal text-azul-noite rounded-lg py-2.5 text-sm font-medium text-center transition-colors"
                  >
                    Criar conta grátis
                  </a>
                </div>
              )}
            </div>

            {/* Voltar para listagem */}
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
