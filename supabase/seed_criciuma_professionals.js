const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load Environment Variables from .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        process.env[key] = value;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar no arquivo .env");
  process.exit(1);
}

// Inicializa cliente admin
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const PASSWORD = "SenhaTesteForte123!";

// Profissionais de Criciúma nos diferentes bairros
const criciumaProfessionals = [
  {
    email: "julio.acabamentos@prumoteste.com",
    name: "Júlio Cezar (Júlio Acabamentos)",
    slug: "julio-acabamentos-criciuma",
    city: "Centro, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=400&fit=crop&q=80",
    service_radius_km: 25,
    price_per_day: 280.00,
    personal_description: "Especialista em assentamento de revestimentos de grande formato, porcelanatos esmaltados, pastilhas e cerâmicas. Trabalho com niveladores de precisão milimétrica e juntas secas perfeitas. Atendo todo o Centro e bairros nobres de Criciúma.",
    specialties: ["Acabamento", "Alvenaria", "Reforma Geral"],
    affinities: ["Porcelanato Grande Formato", "Azulejista", "Nivelamento Perfeito"],
    phone: "+55 48 99888-1111",
    badges: ["VERIFIED", "TRUSTWORTHY"],
    projects: [
      {
        title: "Assentamento de Porcelanato 120x120 - Centro",
        category: "Acabamento",
        city_executed: "Criciúma",
        description: "Colocação de revestimento de grande formato em sala de estar integrada e cozinha com niveladores rápidos e junta de 1mm."
      }
    ],
    reviews: [
      { rating: 5, comment: "Trabalho impecável de azulejista. Os recortes nos cantos e ralos ficaram perfeitos. Muito caprichoso!", contractorIndex: 0 },
      { rating: 5, comment: "Excelente profissional. Além de excelente assentador, é muito limpo e pontual.", contractorIndex: 1 }
    ]
  },
  {
    email: "mariana.design@prumoteste.com",
    name: "Mariana Silveira (Interiores)",
    slug: "mariana-interiores-criciuma",
    city: "Pio Corrêa, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&q=80",
    service_radius_km: 20,
    price_per_hour: 120.00,
    personal_description: "Designer de interiores apaixonada por criar espaços acolhedores, funcionais e sofisticados. Foco no aproveitamento inteligente de espaços através de marcenaria sob medida e projetos luminotécnicos aconchegantes. Atendimento personalizado no Pio Corrêa.",
    specialties: ["Design de Interiores", "Decoração"],
    affinities: ["Marcenaria Sob Medida", "Cozinhas Planejadas", "Estilo Escandinavo"],
    phone: "+55 48 99666-2222",
    badges: ["VERIFIED", "CERTIFIED"],
    projects: [
      {
        title: "Cozinha Integrada e Funcional - Bairro Pio Corrêa",
        category: "Design de Interiores",
        city_executed: "Criciúma",
        description: "Projeto de interiores focado em otimização de espaço para apartamento compacto. Combinação de marcenaria freijó e iluminação indireta."
      }
    ],
    reviews: [
      { rating: 5, comment: "Fiquei encantada com o projeto da Mariana! Ela captou perfeitamente o nosso estilo escandinavo e aproveitou cada centímetro.", contractorIndex: 1 }
    ]
  },
  {
    email: "alexandre.eletrica@prumoteste.com",
    name: "Alexandre Souza (Clima & Luz)",
    slug: "alexandre-eletrica-criciuma",
    city: "Próspera, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&q=80",
    service_radius_km: 30,
    price_per_service: 220.00,
    personal_description: "Instalação e manutenção de ar-condicionado split, recarga de gás, higienização completa e elétrica residencial. Dimensionamento de redes para novos aparelhos sem sobrecarregar sua fiação. Localizado no bairro Próspera.",
    specialties: ["Elétrica", "Instalações"],
    affinities: ["Instalação de Ar Condicionado", "Limpeza Química", "Quadros de Luz"],
    phone: "+55 48 99111-3333",
    badges: ["VERIFIED"],
    projects: [
      {
        title: "Instalação Multi-Split e Infraestrutura Técnica",
        category: "Instalações",
        city_executed: "Criciúma",
        description: "Execução de infraestrutura para 3 aparelhos de ar condicionado em sobrado novo, incluindo fiação blindada e isolamento térmico."
      }
    ],
    reviews: [
      { rating: 5, comment: "Instalação super limpa e rápida. O Alexandre explicou tudo sobre a carga de gás e limpou toda a poeira depois de furar a parede.", contractorIndex: 2 },
      { rating: 4, comment: "Muito atencioso, resolveu a fiação do ar antigo e instalou o novo no mesmo dia.", contractorIndex: 0 }
    ]
  },
  {
    email: "vitor.gesso@prumoteste.com",
    name: "Vitor Hugo (Gesso Criciúma)",
    slug: "vitor-gesso-criciuma",
    city: "Michel, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
    service_radius_km: 15,
    price_per_day: 200.00,
    personal_description: "Execução de tetos decorativos em gesso, sancas abertas e fechadas, colocação de molduras e divisórias em drywall para novos ambientes comerciais ou residenciais. Trabalho focado na limpeza e entrega rápida.",
    specialties: ["Gesso", "Drywall", "Pintura"],
    affinities: ["Forro Rebaixado", "Paredes 3D Gesso", "Pintura de Gesso"],
    phone: "+55 48 99555-4444",
    badges: ["VERIFIED"],
    projects: [
      {
        title: "Forro de Drywall Acartonado com Sanca Invertida",
        category: "Gesso",
        city_executed: "Criciúma",
        description: "Execução rápida de forro rebaixado com nicho decorativo para cortina de LED na suíte e sala de estar."
      }
    ],
    reviews: [
      { rating: 5, comment: "Excelente profissional. O gesso em drywall ficou 100% retinho e o acabamento das juntas com fita foi excelente.", contractorIndex: 1 }
    ]
  },
  {
    email: "bruno.hidraulica@prumoteste.com",
    name: "Bruno Mezenga (Hidráulica)",
    slug: "bruno-hidraulica-criciuma",
    city: "Pinheirinho, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&q=80",
    service_radius_km: 30,
    price_per_service: 150.00,
    personal_description: "Serviço especializado em caça-vazamentos com geofone digital eletrônico (sem quebra-quebra desnecessário), reparos de válvulas Hydra, torneiras, caixas acopladas, sifões e tubulação de água quente/fria.",
    specialties: ["Encanamento", "Pequenos Reparos"],
    affinities: ["Desentupimento", "Vazamento com Geofone", "Troca de Tubulação"],
    phone: "+55 48 99777-5555",
    badges: ["VERIFIED"],
    projects: [
      {
        title: "Caça-Vazamentos com Geofone e Reparo de Infiltração",
        category: "Encanamento",
        city_executed: "Criciúma",
        description: "Localização precisa de vazamento oculto sob o piso da área de serviço e substituição de conexão de PVC danificada com quebra mínima de azulejo."
      }
    ],
    reviews: [
      { rating: 5, comment: "Excelente! Achou o vazamento em 10 minutos usando o aparelho de som eletrônico e trocou o cano quebrado sem precisar quebrar todo o banheiro.", contractorIndex: 2 }
    ]
  },
  {
    email: "roberto.pinturas@prumoteste.com",
    name: "Roberto Antunes (Pinturas)",
    slug: "roberto-pinturas-criciuma",
    city: "Comerciário, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80",
    service_radius_km: 25,
    price_per_day: 240.00,
    personal_description: "Pintor profissional especializado em pintura mecanizada (Airless) para alta produtividade, pintura predial externa e interna, e impermeabilização contra umidade em paredes externas. Localizado no bairro Comerciário.",
    specialties: ["Pintura", "Acabamento"],
    affinities: ["Pintura Predial", "Pintura Airless", "Impermeabilização"],
    phone: "+55 48 99123-6666",
    badges: ["VERIFIED", "TRUSTWORTHY"],
    projects: [
      {
        title: "Pintura Comercial Interna com Airless",
        category: "Pintura",
        city_executed: "Criciúma",
        description: "Pintura rápida de galpão comercial de 600m² em 2 dias usando pulverização airless com excelente rendimento e cobertura homogênea."
      }
    ],
    reviews: [
      { rating: 5, comment: "Muito rápido! A pintura airless economizou muito tempo e tinta. O acabamento ficou perfeito, sem marcas de rolo nas paredes gigantes.", contractorIndex: 0 }
    ]
  },
  {
    email: "diego.pisos@prumoteste.com",
    name: "Diego Souza (Pisos Vinílicos)",
    slug: "diego-pisos-criciuma",
    city: "São Luiz, Criciúma",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&q=80",
    service_radius_km: 40,
    price_per_service: 300.00,
    personal_description: "Especialista em assentamento técnico de piso laminado e vinílico (colado ou clicado), preparação de contrapiso com argamassa autonivelante e instalação de rodapés em poliestireno.",
    specialties: ["Acabamento", "Instalações"],
    affinities: ["Piso Vinílico", "Piso Laminado", "Rodapé Poliestireno"],
    phone: "+55 48 99345-7777",
    badges: ["VERIFIED"],
    projects: [
      {
        title: "Instalação de Piso Vinílico Clicado em Apartamento",
        category: "Acabamento",
        city_executed: "Criciúma",
        description: "Preparação autonivelante de 80m² de contrapiso e assentamento de réguas vinílicas amadeiradas com rodapé branco Santa Luzia de 10cm."
      }
    ],
    reviews: [
      { rating: 5, comment: "Piso colocado perfeitamente. Alinhamento dos rodapés ficou excelente e ele fez os acabamentos nos batentes das portas muito bem.", contractorIndex: 1 }
    ]
  }
];

async function seed() {
  console.log("=== INICIANDO CADASTRO DE PROFISSIONAIS EM CRICIÚMA ===");

  // Pegar ids dos contratantes que criamos na primeira rodada
  const { data: contrData, error: contrErr } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("role", "contractor")
    .limit(3);

  if (contrErr || !contrData || contrData.length < 3) {
    console.error("Erro: Não foi possível carregar os clientes para assinar as avaliações. Certifique-se de ter rodado o seed_professionals.js primeiro.");
    process.exit(1);
  }

  const contractorIds = contrData.map(c => c.id);

  for (const pro of criciumaProfessionals) {
    console.log(`\nCadastrando Profissional em ${pro.city}: ${pro.name} (${pro.email})...`);

    // Deleta se já existir
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", pro.email)
      .maybeSingle();

    let proUserId;
    if (existingUser) {
      proUserId = existingUser.id;
      console.log(`  > Profissional já existe com ID: ${proUserId}. Limpando dados antigos...`);
      await supabaseAdmin.from("professional_profiles").delete().eq("user_id", proUserId);
      await supabaseAdmin.from("profiles").delete().eq("id", proUserId);
      await supabaseAdmin.auth.admin.deleteUser(proUserId);
    }

    // Criar Usuário no Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: pro.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: pro.name, role: "professional" },
    });

    if (authError) {
      console.error(`  > Erro ao criar auth user para profissional: ${authError.message}`);
      continue;
    }

    proUserId = authUser.user.id;
    console.log(`  > Criado auth user com ID: ${proUserId}`);

    // Upsert Profile
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: proUserId,
      name: pro.name,
      email: pro.email,
      role: "professional",
      phone: pro.phone,
    });

    if (profileError) {
      console.error(`  > Erro ao sincronizar profiles no DB: ${profileError.message}`);
      continue;
    }

    // Criar Perfil Profissional
    const { data: proProfile, error: proProfileError } = await supabaseAdmin.from("professional_profiles").insert({
      user_id: proUserId,
      slug: pro.slug,
      photo_url: pro.photo_url,
      personal_description: pro.personal_description,
      city: pro.city,
      state: pro.state,
      service_radius_km: pro.service_radius_km,
      price_per_hour: pro.price_per_hour || null,
      price_per_day: pro.price_per_day || null,
      price_per_month: null,
      price_per_service: pro.price_per_service || null,
      price_currency: "BRL",
      status: "ACTIVE",
      subscription_status: "ACTIVE",
      onboarding_completed_at: new Date().toISOString(),
    }).select("id").single();

    if (proProfileError) {
      console.error(`  > Erro ao criar professional_profile no DB: ${proProfileError.message}`);
      continue;
    }

    const proProfileId = proProfile.id;
    console.log(`  > Criado professional_profile com ID: ${proProfileId}`);

    // Inserir Especialidades
    if (pro.specialties && pro.specialties.length > 0) {
      const specialtyRows = pro.specialties.map(spec => ({
        professional_id: proProfileId,
        category: spec
      }));

      const { error: specError } = await supabaseAdmin.from("professional_specialties").insert(specialtyRows);
      if (specError) {
        console.error(`  > Erro ao cadastrar especialidades: ${specError.message}`);
      }
    }

    // Inserir Afinidades/Tags
    if (pro.affinities && pro.affinities.length > 0) {
      const affinityRows = pro.affinities.map(tag => ({
        professional_id: proProfileId,
        tag: tag
      }));

      const { error: affError } = await supabaseAdmin.from("professional_affinities").insert(affinityRows);
      if (affError) {
        console.error(`  > Erro ao cadastrar afinidades: ${affError.message}`);
      }
    }

    // Inserir Canal de Contato Principal
    if (pro.phone) {
      await supabaseAdmin.from("professional_contact_channels").insert({
        professional_id: proProfileId,
        type: "WHATSAPP",
        value: pro.phone,
        is_primary: true,
        link_formatted: `https://wa.me/${pro.phone.replace(/[^0-9]/g, "")}`
      });
    }

    // Inserir Selos/Badges
    if (pro.badges && pro.badges.length > 0) {
      const badgeRows = pro.badges.map(type => ({
        professional_id: proProfileId,
        type: type,
        awarded_date: new Date().toISOString().split("T")[0]
      }));

      await supabaseAdmin.from("verification_badges").insert(badgeRows);
    }

    // Inserir Projetos do Portfólio
    if (pro.projects && pro.projects.length > 0) {
      for (let i = 0; i < pro.projects.length; i++) {
        const project = pro.projects[i];
        const { data: dbProj, error: projError } = await supabaseAdmin.from("portfolio_projects").insert({
          professional_id: proProfileId,
          title: project.title,
          category: project.category,
          city_executed: project.city_executed,
          description: project.description,
          is_featured: i === 0
        }).select("id").single();

        if (projError) {
          console.error(`  > Erro ao cadastrar projeto "${project.title}": ${projError.message}`);
        } else {
          // Adiciona imagem mock no projeto de portfólio
          await supabaseAdmin.from("portfolio_images").insert({
            project_id: dbProj.id,
            cloudinary_url: pro.photo_url,
            cloudinary_id: `mock_portfolio_${Date.now()}`,
            order_in_project: 0,
            status: "APPROVED"
          });
        }
      }
    }

    // Inserir Avaliações (Reviews) e gerar logs de contato
    if (pro.reviews && pro.reviews.length > 0) {
      let sumRating = 0;
      for (const review of pro.reviews) {
        const contractorId = contractorIds[review.contractorIndex];
        if (!contractorId) continue;

        await supabaseAdmin.from("contact_logs").insert({
          contractor_id: contractorId,
          professional_id: proProfileId,
          contact_type: "VIEWED_WHATSAPP"
        });

        const { error: reviewError } = await supabaseAdmin.from("evaluations").insert({
          contractor_id: contractorId,
          professional_id: proProfileId,
          rating: review.rating,
          comment: review.comment
        });

        if (reviewError) {
          console.error(`  > Erro ao inserir avaliação: ${reviewError.message}`);
        } else {
          sumRating += review.rating;
        }
      }

      // Atualizar Métricas
      const averageRating = sumRating / pro.reviews.length;
      await supabaseAdmin.from("professional_metrics").upsert({
        professional_id: proProfileId,
        average_rating: parseFloat(averageRating.toFixed(2)),
        total_evaluations: pro.reviews.length,
        total_completed_services_via_prumo: pro.reviews.length + 2,
        profile_views: 35 + Math.floor(Math.random() * 40),
        contacts_received: pro.reviews.length + Math.floor(Math.random() * 5),
        updated_at: new Date().toISOString()
      }, { onConflict: "professional_id" });
      
      console.log(`  > Avaliações e Métricas configuradas com média ${averageRating.toFixed(2)}.`);
    }
  }

  console.log("\n=== CADASTRO EM CRICIÚMA CONCLUÍDO COM SUCESSO! ===");
}

seed().catch(err => {
  console.error("Erro geral de execução do seed:", err);
});
