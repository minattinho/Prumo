const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// 1. Load Environment Variables from .env
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

// Inicializa cliente admin para contornar RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const PASSWORD = "SenhaTesteForte123!";

// Dados dos Profissionais
const professionals = [
  {
    email: "manoel.silva@prumoteste.com",
    name: "Manoel da Silva (Mestre Manoel)",
    slug: "mestre-manoel-obras",
    city: "São Paulo",
    state: "SP",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&q=80",
    service_radius_km: 60,
    price_per_day: 350.00,
    personal_description: "Mestre de obras com mais de 25 anos de experiência em construção civil residencial e comercial. Especializado em fundações, alvenaria estrutural, concretagem, ferragens e leitura de projetos arquitetônicos complexos. Lidero equipe própria de pedreiros, serventes e carpinteiros para entregar sua obra do alicerce ao acabamento, sempre prezando pela segurança, normas técnicas e cumprimento rigoroso do cronograma.",
    specialties: ["Construção", "Alvenaria", "Reforma Geral", "Estruturas"],
    affinities: ["Leitura de Projetos", "Gestão de Equipes", "Fundação e Concreto", "Rapidez e Organização"],
    phone: "+55 11 99876-5432",
    badges: ["VERIFIED", "TRUSTWORTHY"],
    projects: [
      {
        title: "Reforma Estrutural e Ampliação Morumbi",
        category: "Construção",
        city_executed: "São Paulo",
        description: "Execução completa de reforço estrutural em pilares e vigas de concreto, demolição interna e ampliação de área de lazer de 150m² com piscina e churrasqueira gourmet."
      },
      {
        title: "Construção de Casa de Alto Padrão - Tamboré",
        category: "Construção",
        city_executed: "Barueri",
        description: "Construção do zero de residência unifamiliar com 380m² de área construída, englobando fundação (estacas), alvenaria estrutural, lajes protendidas e infraestrutura inicial."
      }
    ],
    reviews: [
      { rating: 5, comment: "Mestre Manoel é sensacional! Muito sério, organizado e com conhecimento técnico impecável. Entregou a fundação exatamente no prazo.", contractorIndex: 0 },
      { rating: 5, comment: "Fizemos a reforma da nossa casa e a equipe dele trabalhou muito bem. Sem desperdício de material.", contractorIndex: 1 }
    ]
  },
  {
    email: "contato@studioab.com.br",
    name: "Ana Beatriz Melo (Studio AB)",
    slug: "ana-beatriz-studio-ab",
    city: "Rio de Janeiro",
    state: "RJ",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80",
    service_radius_km: 30,
    price_per_hour: 150.00,
    personal_description: "Arquiteta e urbanista graduada pela UFRJ, fundadora do Studio AB. Especialista em design de interiores residencial com foco em estilo minimalista, industrial e contemporâneo. Trabalho integrando funcionalidade, iluminação natural e materiais sustentáveis. Ofereço assessoria completa: desde a conceituação em maquete 3D, escolha de revestimentos, até o acompanhamento técnico da execução da reforma.",
    specialties: ["Arquitetura", "Design de Interiores", "Iluminação", "Decoração"],
    affinities: ["Projetos 3D", "Consultoria de Cores", "Minimalismo", "Sustentabilidade"],
    phone: "+55 21 98877-6655",
    badges: ["VERIFIED", "CERTIFIED"],
    projects: [
      {
        title: "Apartamento Minimalista Copacabana",
        category: "Design de Interiores",
        city_executed: "Rio de Janeiro",
        description: "Projeto completo de interiores para apartamento de 75m² integrado. Uso de marcenaria inteligente, paleta neutra e iluminação cenográfica em LED."
      },
      {
        title: "Loft Industrial Ipanema",
        category: "Arquitetura",
        city_executed: "Rio de Janeiro",
        description: "Reforma de antigo estúdio comercial transformado em loft residencial com conceito aberto, tijolos aparentes, cimento queimado e tubulações elétricas expostas."
      }
    ],
    reviews: [
      { rating: 5, comment: "A Ana Beatriz transformou meu apartamento! O projeto 3D ficou idêntico ao resultado final. Muito bom gosto e atenção aos detalhes.", contractorIndex: 1 },
      { rating: 5, comment: "Excelente profissional. Nos ajudou a escolher todos os revestimentos e indicou ótimos fornecedores.", contractorIndex: 2 }
    ]
  },
  {
    email: "kaka.reparos@prumoteste.com",
    name: "Carlos Eduardo (Kaká Reparos)",
    slug: "kaka-reparos-rapidos",
    city: "Belo Horizonte",
    state: "MG",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80",
    service_radius_km: 40,
    price_per_service: 180.00,
    personal_description: "Eletricista credenciado pelo SENAI e encanador profissional para manutenções residenciais preventivas e emergenciais. Especializado em montagem e substituição de quadros de distribuição, cabeamento de rede, instalação de chuveiros, torneiras elétricas, luminárias, localização e reparo de vazamentos e desentupimentos em geral. Atendimento rápido, limpo e em conformidade com as normas NBR-5410.",
    specialties: ["Elétrica", "Encanamento", "Pequenos Reparos", "Instalações"],
    affinities: ["SENAI Certificado", "Atendimento Emergencial", "Ferramentas Modernas", "Preço Justo"],
    phone: "+55 31 99765-4321",
    badges: ["VERIFIED"],
    projects: [
      {
        title: "Instalação de Chuveiros e Quadro de Disjuntores",
        category: "Elétrica",
        city_executed: "Belo Horizonte",
        description: "Substituição de fiação antiga por novos cabos isolados, instalação de dois chuveiros de 7500W com circuitos independentes e novo quadro de disjuntores DIN com DR."
      }
    ],
    reviews: [
      { rating: 5, comment: "O Kaká salvou meu sábado! O disjuntor ficava caindo e ele veio em 1 hora, achou o curto-circuito e resolveu tudo com muita segurança.", contractorIndex: 0 },
      { rating: 4, comment: "Rápido e honesto. Explicou o problema direitinho e cobrou um valor justo pelo serviço.", contractorIndex: 2 }
    ]
  },
  {
    email: "ricardo.pinturas@prumoteste.com",
    name: "Ricardo Pereira (Ricardinho Pinturas)",
    slug: "ricardinho-pinturas-finas",
    city: "Curitiba",
    state: "PR",
    photo_url: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=400&h=400&fit=crop&q=80",
    service_radius_km: 25,
    price_per_day: 220.00,
    personal_description: "Pintor profissional com foco em acabamento de alto padrão. Especializado em aplicação de cimento queimado, efeitos decorativos (marmorato, linho, aço corten), instalação de papel de parede, pintura airless para grandes áreas, e restauração de fachadas residenciais. Trabalho com proteção total do seu ambiente, garantindo que móveis e pisos fiquem 100% livres de respingos.",
    specialties: ["Pintura", "Acabamento", "Texturas", "Papel de Parede"],
    affinities: ["Cimento Queimado", "Pintura Airless", "Organização e Limpeza", "Pontualidade"],
    phone: "+55 41 99111-2233",
    badges: ["VERIFIED", "TRUSTWORTHY"],
    projects: [
      {
        title: "Aplicação de Cimento Queimado em Sala e Corredor",
        category: "Acabamento",
        city_executed: "Curitiba",
        description: "Preparação de paredes com massa corrida, lixamento sem poeira e aplicação de três demãos de efeito cimento queimado cinza platina com seladora protetora."
      },
      {
        title: "Pintura Externa Completa de Sobrado",
        category: "Pintura",
        city_executed: "São José dos Pinhais",
        description: "Lavagem de paredes com alta pressão, tratamento de trincas estruturais com selante elástico, aplicação de fundo preparador e pintura com tinta emborrachada premium."
      }
    ],
    reviews: [
      { rating: 5, comment: "Trabalho impecável! O cimento queimado ficou lindo demais. O Ricardo é super caprichoso, cobriu absolutamente tudo com lona e fita crepe.", contractorIndex: 1 }
    ]
  },
  {
    email: "thiago.gesso@prumoteste.com",
    name: "Thiago Gesso & Drywall",
    slug: "thiago-gesso-drywall",
    city: "Porto Alegre",
    state: "RS",
    photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&q=80",
    service_radius_km: 50,
    price_per_service: 250.00,
    personal_description: "Especialista em gessaria decorativa, sancas de gesso, forro rebaixado, paredes e divisórias em drywall para otimização de espaços residenciais e comerciais. Integrando projetos de iluminação embutida e isolamento acústico em lã de vidro para maior conforto térmico e sonoro. Foco total em precisão milimétrica, alinhamento perfeito e superfícies prontas para pintura.",
    specialties: ["Gesso", "Drywall", "Isolamento Acústico", "Sancas e Forros"],
    affinities: ["Precisão", "Isolamento Acústico", "Projetos de Gesso", "Sujeira Mínima"],
    phone: "+55 51 98333-4455",
    badges: ["VERIFIED"],
    projects: [
      {
        title: "Rebaixamento de Teto com Iluminação Embutida",
        category: "Gesso",
        city_executed: "Porto Alegre",
        description: "Estruturação de forro aramado em gesso cartonado, criação de rasgos de luz e sancas invertidas para iluminação indireta de sala de TV e jantar."
      }
    ],
    reviews: [
      { rating: 5, comment: "Muito profissional. A parede de drywall com isolamento acústico que ele fez no meu escritório ficou excelente, reduziu 90% do barulho externo.", contractorIndex: 0 },
      { rating: 4, comment: "Trabalho muito limpo e alinhamento milimétrico. Super recomendado.", contractorIndex: 1 }
    ]
  },
  {
    email: "felipe.automacao@prumoteste.com",
    name: "Felipe Castro (Prumo Automação)",
    slug: "felipe-automacao-residencial",
    city: "Florianópolis",
    state: "SC",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&q=80",
    service_radius_km: 70,
    price_per_hour: 200.00,
    personal_description: "Integrador de sistemas e especialista em casa inteligente e automação residencial. Configuração e instalação de fechaduras digitais, sistemas de câmeras CFTV inteligentes com inteligência artificial, redes Wi-Fi mesh integradas, automação de iluminação e cortinas, som ambiente em múltiplas salas e integração completa com assistentes virtuais (Alexa, Google Home e Apple HomeKit).",
    specialties: ["Automação Residencial", "Segurança Eletrônica", "Redes e Wi-Fi", "Som e Vídeo"],
    affinities: ["Casa Inteligente", "Redes Mesh", "Câmeras IP", "Fechaduras Digitais"],
    phone: "+55 48 99444-5566",
    badges: ["VERIFIED", "CERTIFIED"],
    projects: [
      {
        title: "Integração Completa Smart Home - Jurerê",
        category: "Automação Residencial",
        city_executed: "Florianópolis",
        description: "Projeto de automação cabeada e sem fio integrando 24 circuitos de iluminação, 6 persianas, ar condicionados, fechadura biométrica e sistema de som JBL controlados por comandos de voz e tablet."
      }
    ],
    reviews: [
      { rating: 5, comment: "Trabalho incrível. A rede Wi-Fi da minha casa agora pega perfeitamente em todos os cômodos e quintal. Integração com a Alexa ficou ótima.", contractorIndex: 2 }
    ]
  }
];

// Dados dos Clientes (Contratantes) para criar avaliações autênticas
const contractors = [
  { email: "gabriel.contractor@prumoteste.com", name: "Gabriel Silva" },
  { email: "juliana.contractor@prumoteste.com", name: "Juliana Costa" },
  { email: "roberto.contractor@prumoteste.com", name: "Roberto Almeida" }
];

async function seed() {
  console.log("=== INICIANDO CADASTRO DE PROFISSIONAIS E CLIENTES DE TESTE ===");

  const contractorIds = [];

  // 1. Cadastrar Clientes (Contratantes)
  for (const client of contractors) {
    console.log(`Cadastrando Cliente: ${client.name} (${client.email})...`);
    
    // Deleta se já existir
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", client.email)
      .maybeSingle();

    let userId;
    if (existingUser) {
      userId = existingUser.id;
      console.log(`  > Cliente já existe com ID: ${userId}.`);
    } else {
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: client.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: client.name, role: "contractor" },
      });

      if (authError) {
        console.error(`  > Erro ao criar auth user para cliente: ${authError.message}`);
        continue;
      }
      userId = authUser.user.id;
      console.log(`  > Criado auth user com ID: ${userId}`);
    }

    // Garante perfil do contratante
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      name: client.name,
      email: client.email,
      role: "contractor",
    });

    if (profileError) {
      console.error(`  > Erro ao criar perfil do cliente no DB: ${profileError.message}`);
    }

    const { error: contrError } = await supabaseAdmin.from("contractor_profiles").upsert({
      user_id: userId,
    });

    if (contrError) {
      console.error(`  > Erro ao criar contractor_profile no DB: ${contrError.message}`);
    }

    contractorIds.push(userId);
  }

  // 2. Cadastrar Profissionais
  for (const pro of professionals) {
    console.log(`\nCadastrando Profissional: ${pro.name} (${pro.email})...`);

    // Deleta se já existir para permitir rodar o script de novo limpo
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", pro.email)
      .maybeSingle();

    let proUserId;
    if (existingUser) {
      proUserId = existingUser.id;
      console.log(`  > Profissional já existe com ID: ${proUserId}. Limpando dados antigos...`);
      
      // Deletar da tabela de professional_profiles causa cascade na maioria, mas garantimos
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

    // Upsert Profile para garantir papel correto
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
      status: "ACTIVE", // Ativo para aparecer nas buscas imediatamente
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
      } else {
        console.log(`  > Cadastradas ${pro.specialties.length} especialidades.`);
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
      } else {
        console.log(`  > Cadastradas ${pro.affinities.length} afinidades.`);
      }
    }

    // Inserir Canal de Contato Principal
    if (pro.phone) {
      const { error: contactError } = await supabaseAdmin.from("professional_contact_channels").insert({
        professional_id: proProfileId,
        type: "WHATSAPP",
        value: pro.phone,
        is_primary: true,
        link_formatted: `https://wa.me/${pro.phone.replace(/[^0-9]/g, "")}`
      });

      if (contactError) {
        console.error(`  > Erro ao cadastrar canal de contato: ${contactError.message}`);
      } else {
        console.log(`  > Cadastrado canal de contato WhatsApp primário.`);
      }
    }

    // Inserir Selos/Badges
    if (pro.badges && pro.badges.length > 0) {
      const badgeRows = pro.badges.map(type => ({
        professional_id: proProfileId,
        type: type,
        awarded_date: new Date().toISOString().split("T")[0]
      }));

      const { error: badgeError } = await supabaseAdmin.from("verification_badges").insert(badgeRows);
      if (badgeError) {
        console.error(`  > Erro ao cadastrar selos: ${badgeError.message}`);
      } else {
        console.log(`  > Cadastrados selos: ${pro.badges.join(", ")}`);
      }
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
          is_featured: i === 0 // Apenas o primeiro é destaque devido ao índice único idx_max_featured_projects
        }).select("id").single();

        if (projError) {
          console.error(`  > Erro ao cadastrar projeto "${project.title}": ${projError.message}`);
        } else {
          console.log(`  > Cadastrado projeto de portfólio: "${project.title}"`);
          // Adiciona imagem mock no projeto de portfólio
          const { error: imgError } = await supabaseAdmin.from("portfolio_images").insert({
            project_id: dbProj.id,
            cloudinary_url: pro.photo_url, // Usando a própria foto do profissional como mock de projeto
            cloudinary_id: `mock_portfolio_${Date.now()}`,
            order_in_project: 0,
            status: "APPROVED"
          });
          if (imgError) {
            console.error(`    > Erro ao adicionar imagem mock ao projeto: ${imgError.message}`);
          }
        }
      }
    }

    // Inserir Avaliações (Reviews) e gerar logs de contato para torná-las autênticas
    if (pro.reviews && pro.reviews.length > 0) {
      let sumRating = 0;
      for (const review of pro.reviews) {
        const contractorId = contractorIds[review.contractorIndex];
        if (!contractorId) continue;

        // Criar log de contato primeiro
        await supabaseAdmin.from("contact_logs").insert({
          contractor_id: contractorId,
          professional_id: proProfileId,
          contact_type: "VIEWED_WHATSAPP"
        });

        // Inserir avaliação
        const { error: reviewError } = await supabaseAdmin.from("evaluations").insert({
          contractor_id: contractorId,
          professional_id: proProfileId,
          rating: review.rating,
          comment: review.comment
        });

        if (reviewError) {
          console.error(`  > Erro ao inserir avaliação: ${reviewError.message}`);
        } else {
          console.log(`  > Cadastrada avaliação: ${review.rating} estrelas por cliente ${review.contractorIndex + 1}`);
          sumRating += review.rating;
        }
      }

      // Atualizar Métricas
      const averageRating = sumRating / pro.reviews.length;
      const { error: metricError } = await supabaseAdmin.from("professional_metrics").upsert({
        professional_id: proProfileId,
        average_rating: parseFloat(averageRating.toFixed(2)),
        total_evaluations: pro.reviews.length,
        total_completed_services_via_prumo: pro.reviews.length + 2,
        profile_views: 45 + Math.floor(Math.random() * 50),
        contacts_received: pro.reviews.length + Math.floor(Math.random() * 10),
        updated_at: new Date().toISOString()
      }, { onConflict: "professional_id" });

      if (metricError) {
        console.error(`  > Erro ao atualizar métricas: ${metricError.message}`);
      } else {
        console.log(`  > Métricas atualizadas com média de ${averageRating.toFixed(2)}.`);
      }
    }
  }

  console.log("\n=== CADASTRO CONCLUÍDO COM SUCESSO! ===");
}

seed().catch(err => {
  console.error("Erro geral de execução do seed:", err);
});
