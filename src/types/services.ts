export type ServiceItem = {
  name: string;
  slug: string;
};

export type ServiceSubcategory = {
  name: string;
  slug: string;
  services: ServiceItem[];
};

export type ServiceCategoryGroup = {
  name: string;
  slug: string;
  icon: "home" | "wrench" | "code" | "palette" | "megaphone";
  subcategories: ServiceSubcategory[];
};

export const SERVICE_TAXONOMY = [
  {
    name: "Casa e Construção",
    slug: "casa-e-construcao",
    icon: "home",
    subcategories: [
      {
        name: "Obras e Reformas",
        slug: "obras-e-reformas",
        services: [
          { name: "Pedreiro", slug: "pedreiro" },
          { name: "Pintor", slug: "pintor" },
          { name: "Eletricista", slug: "eletricista" },
          { name: "Encanador", slug: "encanador" },
          { name: "Gesseiro", slug: "gesseiro" },
          { name: "Azulejista", slug: "azulejista" },
          { name: "Marceneiro", slug: "marceneiro" },
          { name: "Serralheiro", slug: "serralheiro" },
          { name: "Vidraceiro", slug: "vidraceiro" },
          { name: "Telhadista", slug: "telhadista" },
          { name: "Impermeabilização", slug: "impermeabilizacao" },
          { name: "Instalação de Drywall", slug: "instalacao-de-drywall" },
          { name: "Reparo de Pisos", slug: "reparo-de-pisos" },
        ],
      },
      {
        name: "Projetos",
        slug: "projetos",
        services: [
          { name: "Arquitetura", slug: "arquitetura" },
          { name: "Design de Interiores", slug: "design-de-interiores" },
          { name: "Engenharia Civil", slug: "engenharia-civil" },
        ],
      },
    ],
  },
  {
    name: "Reparos e Manutenção",
    slug: "reparos-e-manutencao",
    icon: "wrench",
    subcategories: [
      {
        name: "Instalações",
        slug: "instalacoes",
        services: [
          { name: "Montagem de Móveis", slug: "montagem-de-moveis" },
          { name: "Instalação de TV", slug: "instalacao-de-tv" },
          { name: "Instalação de Antena", slug: "instalacao-de-antena" },
          { name: "Automação Residencial", slug: "automacao-residencial" },
        ],
      },
      {
        name: "Assistência Técnica",
        slug: "assistencia-tecnica",
        services: [
          { name: "Conserto de Eletrodomésticos", slug: "conserto-de-eletrodomesticos" },
          { name: "Manutenção de Ar-Condicionado", slug: "manutencao-de-ar-condicionado" },
          { name: "Assistência Técnica de Computadores", slug: "assistencia-tecnica-de-computadores" },
          { name: "Conserto de Celulares", slug: "conserto-de-celulares" },
        ],
      },
    ],
  },
  {
    name: "Tecnologia e Desenvolvimento",
    slug: "tecnologia-e-desenvolvimento",
    icon: "code",
    subcategories: [
      {
        name: "Desenvolvimento",
        slug: "desenvolvimento",
        services: [
          { name: "Criação de Sites", slug: "criacao-de-sites" },
          { name: "Desenvolvimento de Sistemas Web", slug: "desenvolvimento-de-sistemas-web" },
          { name: "Desenvolvimento de Aplicativos", slug: "desenvolvimento-de-aplicativos" },
          { name: "E-commerce", slug: "e-commerce" },
          { name: "Desenvolvimento de SaaS", slug: "desenvolvimento-de-saas" },
        ],
      },
      {
        name: "Automação e IA",
        slug: "automacao-e-ia",
        services: [
          { name: "Chatbots para WhatsApp", slug: "chatbots-para-whatsapp" },
          { name: "Automação com n8n", slug: "automacao-com-n8n" },
          { name: "Integrações de Sistemas", slug: "integracoes-de-sistemas" },
          { name: "Agentes de Inteligência Artificial", slug: "agentes-de-inteligencia-artificial" },
        ],
      },
      {
        name: "Infraestrutura",
        slug: "infraestrutura",
        services: [
          { name: "Banco de Dados", slug: "banco-de-dados" },
          { name: "Cloud Computing", slug: "cloud-computing" },
          { name: "DevOps", slug: "devops" },
        ],
      },
    ],
  },
  {
    name: "Design e Criatividade",
    slug: "design-e-criatividade",
    icon: "palette",
    subcategories: [
      {
        name: "Design Gráfico",
        slug: "design-grafico",
        services: [
          { name: "Criação de Logotipos", slug: "criacao-de-logotipos" },
          { name: "Identidade Visual", slug: "identidade-visual" },
          { name: "Material Publicitário", slug: "material-publicitario" },
        ],
      },
      {
        name: "UX/UI",
        slug: "ux-ui",
        services: [
          { name: "Design de Interfaces", slug: "design-de-interfaces" },
          { name: "Prototipação", slug: "prototipacao" },
        ],
      },
      {
        name: "Audiovisual",
        slug: "audiovisual",
        services: [
          { name: "Edição de Vídeos", slug: "edicao-de-videos" },
          { name: "Motion Design", slug: "motion-design" },
          { name: "Modelagem 3D", slug: "modelagem-3d" },
        ],
      },
    ],
  },
  {
    name: "Marketing e Vendas",
    slug: "marketing-e-vendas",
    icon: "megaphone",
    subcategories: [
      {
        name: "Marketing Digital",
        slug: "marketing-digital",
        services: [
          { name: "Gestão de Redes Sociais", slug: "gestao-de-redes-sociais" },
          { name: "Tráfego Pago", slug: "trafego-pago" },
          { name: "SEO", slug: "seo" },
          { name: "Copywriting", slug: "copywriting" },
          { name: "E-mail Marketing", slug: "email-marketing" },
        ],
      },
      {
        name: "Vendas",
        slug: "vendas",
        services: [
          { name: "SDR", slug: "sdr" },
          { name: "Consultoria Comercial", slug: "consultoria-comercial" },
        ],
      },
    ],
  },
] as const satisfies readonly ServiceCategoryGroup[];

export const SERVICE_CATEGORY_ALIASES: Record<string, string[]> = {
  "Casa e Construção": ["pedreiro"],
  "Construção": ["pedreiro"],
  "Elétrica": ["eletricista"],
  "Hidráulica": ["encanador"],
  "Acabamento": ["pintor", "gesseiro"],
  "Pisos": ["reparo-de-pisos", "azulejista"],
  "Serralheria": ["serralheiro"],
  "Marcenaria": ["marceneiro"],
  "Projeto": ["arquitetura"],
  "Engenharia": ["engenharia-civil"],
  "Tecnologia": ["criacao-de-sites", "desenvolvimento-de-sistemas-web"],
  "Climatização": ["manutencao-de-ar-condicionado"],
  "Pintura": ["pintor"],
  "Gesso e Drywall": ["gesseiro", "instalacao-de-drywall"],
  "Impermeabilização": ["impermeabilizacao"],
  "Telhados e Coberturas": ["telhadista"],
  "Reformas Gerais": ["pedreiro", "pintor", "eletricista", "encanador"],
  construcao: ["pedreiro"],
  eletrica: ["eletricista"],
  hidraulica: ["encanador"],
  acabamento: ["pintor", "gesseiro"],
  pisos: ["reparo-de-pisos", "azulejista"],
  serralheria: ["serralheiro"],
  marcenaria: ["marceneiro"],
  projeto: ["arquitetura"],
  engenharia: ["engenharia-civil"],
  tecnologia: ["criacao-de-sites", "desenvolvimento-de-sistemas-web"],
  climatizacao: ["manutencao-de-ar-condicionado"],
};

export const SERVICE_SUBCATEGORIES: ServiceSubcategory[] = SERVICE_TAXONOMY.flatMap(
  (category) => [...category.subcategories]
);

export const SERVICE_CATEGORIES = SERVICE_TAXONOMY.flatMap((category) =>
  category.subcategories.flatMap((subcategory) =>
    subcategory.services.map((service) => ({
      value: service.slug,
      label: service.name,
      categorySlug: category.slug,
      categoryLabel: category.name,
      subcategorySlug: subcategory.slug,
      subcategoryLabel: subcategory.name,
    }))
  )
) as Array<{
  value: string;
  label: string;
  categorySlug: string;
  categoryLabel: string;
  subcategorySlug: string;
  subcategoryLabel: string;
}>;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]["value"];

export function getServiceLabel(slugOrLabel: string): string {
  return SERVICE_CATEGORIES.find((service) => service.value === slugOrLabel)?.label ?? slugOrLabel;
}

export function getServiceBySlug(slug: string) {
  return SERVICE_CATEGORIES.find((service) => service.value === slug);
}

export function getServiceFilterValues(filter: string): string[] {
  const directService = getServiceBySlug(filter);
  if (directService) return [directService.value];

  const category = SERVICE_TAXONOMY.find((item) => item.slug === filter);
  if (category) {
    return category.subcategories.flatMap((subcategory) =>
      subcategory.services.map((service) => service.slug)
    );
  }

  const subcategory = SERVICE_SUBCATEGORIES.find((item) => item.slug === filter);
  if (subcategory) return subcategory.services.map((service) => service.slug);

  return SERVICE_CATEGORY_ALIASES[filter] ?? [filter];
}

export function serviceValueMatchesFilter(value: string, filter: string): boolean {
  const allowedValues = getServiceFilterValues(filter);
  if (allowedValues.includes(value)) return true;

  const legacyValues = getServiceFilterValues(value);
  if (legacyValues.some((legacyValue) => allowedValues.includes(legacyValue))) {
    return true;
  }

  return allowedValues.some((allowedValue) => getServiceLabel(allowedValue) === value);
}
