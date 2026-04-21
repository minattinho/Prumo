-- =============================================
-- PRUMO — Schema do Banco de Dados
-- Execute no Supabase SQL Editor
-- =============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca por texto

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE professional_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED');
CREATE TYPE subscription_status AS ENUM ('TRIAL', 'ACTIVE', 'CANCELLED', 'SUSPENDED');
CREATE TYPE contact_channel_type AS ENUM ('WHATSAPP', 'PHONE', 'EMAIL', 'INSTAGRAM', 'FACEBOOK', 'SITE', 'OTHER');
CREATE TYPE social_network_type AS ENUM ('INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'LINKEDIN', 'YOUTUBE');
CREATE TYPE budget_request_status AS ENUM ('NEW', 'REPLIED', 'IN_NEGOTIATION', 'REFUSED');
CREATE TYPE media_moderation_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE service_origin AS ENUM ('PRUMO', 'REFERRAL', 'OTHER');
CREATE TYPE service_status AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE badge_type AS ENUM ('VERIFIED', 'TRUSTWORTHY', 'CERTIFIED');
CREATE TYPE contact_log_type AS ENUM ('VIEWED_WHATSAPP', 'VIEWED_PHONE', 'VIEWED_EMAIL');
CREATE TYPE verification_status AS ENUM ('APPROVED', 'REJECTED');
CREATE TYPE infraction_consequence AS ENUM ('MANUAL_REVIEW_REQUIRED', 'SUSPENDED', 'BANNED');

-- =============================================
-- 1. PROFILES PÚBLICOS (espelho do auth.users)
-- =============================================

CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  name        TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'contractor' CHECK (role IN ('contractor', 'professional')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: criar profile automaticamente ao criar usuário no auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE
      WHEN NEW.raw_user_meta_data->>'role' = 'professional' THEN 'professional'
      ELSE 'contractor'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. CONTRACTOR PROFILES
-- =============================================

CREATE TABLE public.contractor_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_service_date   DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. PROFESSIONAL PROFILES
-- =============================================

CREATE TABLE public.professional_profiles (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug                    TEXT UNIQUE NOT NULL,
  cpf                     TEXT UNIQUE,
  cnpj                    TEXT UNIQUE,
  photo_url               TEXT,
  personal_description    TEXT,
  city                    TEXT,
  state                   TEXT,
  service_radius_km       INTEGER DEFAULT 50,
  status                  professional_status NOT NULL DEFAULT 'PENDING',
  subscription_status     subscription_status NOT NULL DEFAULT 'TRIAL',
  trial_ends_at           TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  subscription_paid_until TIMESTAMPTZ,
  stripe_customer_id      TEXT,
  onboarding_completed_at TIMESTAMPTZ DEFAULT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_professional_profiles_slug ON public.professional_profiles(slug);
CREATE INDEX idx_professional_profiles_status ON public.professional_profiles(status);
CREATE INDEX idx_professional_profiles_city ON public.professional_profiles(city);

-- =============================================
-- 4. PROFESSIONAL SPECIALTIES
-- =============================================

CREATE TABLE public.professional_specialties (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  category         TEXT NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(professional_id, category)
);

CREATE INDEX idx_professional_specialties_category ON public.professional_specialties(category);

-- =============================================
-- 5. PROFESSIONAL AFFINITIES (tags livres)
-- =============================================

CREATE TABLE public.professional_affinities (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  tag              TEXT NOT NULL,
  UNIQUE(professional_id, tag)
);

-- =============================================
-- 6. PROFESSIONAL CONTACT CHANNELS
-- =============================================

CREATE TABLE public.professional_contact_channels (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  type             contact_channel_type NOT NULL,
  value            TEXT NOT NULL,
  is_primary       BOOLEAN NOT NULL DEFAULT FALSE,
  link_formatted   TEXT, -- ex: https://wa.me/5548999999999
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apenas 1 canal primário por profissional
CREATE UNIQUE INDEX idx_one_primary_channel
  ON public.professional_contact_channels(professional_id)
  WHERE is_primary = TRUE;

-- =============================================
-- 7. PROFESSIONAL SOCIAL NETWORKS
-- =============================================

CREATE TABLE public.professional_social_networks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  platform         social_network_type NOT NULL,
  handle_or_url    TEXT NOT NULL,
  UNIQUE(professional_id, platform)
);

-- =============================================
-- 8. PORTFOLIO PROJECTS
-- =============================================

CREATE TABLE public.portfolio_projects (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,
  city_executed    TEXT,
  description      TEXT,
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  display_order    INTEGER NOT NULL DEFAULT 0,
  view_count       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Max 3 projetos em destaque por profissional
CREATE UNIQUE INDEX idx_max_featured_projects
  ON public.portfolio_projects(professional_id, is_featured)
  WHERE is_featured = TRUE;
  -- Nota: o limite de 3 deve ser validado na aplicação

CREATE INDEX idx_portfolio_projects_professional ON public.portfolio_projects(professional_id);

-- =============================================
-- 9. PORTFOLIO IMAGES
-- =============================================

CREATE TABLE public.portfolio_images (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id        UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  cloudinary_url    TEXT NOT NULL,
  cloudinary_id     TEXT NOT NULL,
  order_in_project  INTEGER NOT NULL DEFAULT 0,
  status            media_moderation_status NOT NULL DEFAULT 'APPROVED',
  moderation_notes  TEXT,
  uploaded_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 10. PORTFOLIO VIDEOS
-- =============================================

CREATE TABLE public.portfolio_videos (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id          UUID NOT NULL REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
  cloudinary_url      TEXT NOT NULL,
  cloudinary_id       TEXT NOT NULL,
  duration_seconds    INTEGER,
  order_in_project    INTEGER NOT NULL DEFAULT 0,
  status              media_moderation_status NOT NULL DEFAULT 'PENDING',
  moderation_notes    TEXT,
  manual_review_date  TIMESTAMPTZ,
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 11. CONTACT LOGS
-- =============================================

CREATE TABLE public.contact_logs (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  contact_type     contact_log_type NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contact_logs_contractor ON public.contact_logs(contractor_id);
CREATE INDEX idx_contact_logs_professional ON public.contact_logs(professional_id);

-- =============================================
-- 12. BUDGET REQUESTS
-- =============================================

CREATE TABLE public.budget_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  message          TEXT NOT NULL,
  status           budget_request_status NOT NULL DEFAULT 'NEW',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_requests_professional ON public.budget_requests(professional_id, status);

-- =============================================
-- 13. PROPOSALS
-- =============================================

CREATE TABLE public.proposals (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_request_id    UUID NOT NULL REFERENCES public.budget_requests(id) ON DELETE CASCADE,
  professional_id      UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  total_value          NUMERIC(12, 2) NOT NULL,
  deadline_days        INTEGER NOT NULL,
  approach_description TEXT NOT NULL,
  payment_stages       SMALLINT NOT NULL DEFAULT 1 CHECK (payment_stages IN (1, 2, 3)),
  status               TEXT NOT NULL DEFAULT 'SENT' CHECK (status IN ('SENT', 'ACCEPTED', 'REJECTED')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 14. COMPLETED SERVICES
-- =============================================

CREATE TABLE public.completed_services (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id   UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  client_name       TEXT,
  service_type      TEXT NOT NULL,
  value             NUMERIC(12, 2),
  execution_date    DATE NOT NULL,
  status            service_status NOT NULL DEFAULT 'COMPLETED',
  photos_added      BOOLEAN NOT NULL DEFAULT FALSE,
  origin            service_origin NOT NULL DEFAULT 'PRUMO',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_completed_services_professional ON public.completed_services(professional_id);

-- =============================================
-- 15. SERVICE PHOTOS
-- =============================================

CREATE TABLE public.service_photos (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id          UUID NOT NULL REFERENCES public.completed_services(id) ON DELETE CASCADE,
  cloudinary_url      TEXT NOT NULL,
  cloudinary_id       TEXT NOT NULL,
  added_to_portfolio  BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 16. EVALUATIONS
-- =============================================

CREATE TABLE public.evaluations (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contractor_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  rating           SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT CHECK (char_length(comment) <= 500),
  is_disputed      BOOLEAN NOT NULL DEFAULT FALSE,
  dispute_status   TEXT CHECK (dispute_status IN ('OPEN', 'RESOLVED', NULL)),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Contratante só pode avaliar 1x por profissional
  UNIQUE(contractor_id, professional_id)
);

CREATE INDEX idx_evaluations_professional ON public.evaluations(professional_id);

-- =============================================
-- 17. EVALUATION PHOTOS
-- =============================================

CREATE TABLE public.evaluation_photos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id   UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
  cloudinary_url  TEXT NOT NULL,
  cloudinary_id   TEXT NOT NULL,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 18. EVALUATION RESPONSES
-- =============================================

CREATE TABLE public.evaluation_responses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id   UUID NOT NULL UNIQUE REFERENCES public.evaluations(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  response_text   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 19. PROFESSIONAL METRICS (cache calculado)
-- =============================================

CREATE TABLE public.professional_metrics (
  id                                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id                     UUID NOT NULL UNIQUE REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  average_rating                      NUMERIC(3, 2) NOT NULL DEFAULT 0,
  total_evaluations                   INTEGER NOT NULL DEFAULT 0,
  total_completed_services_via_prumo  INTEGER NOT NULL DEFAULT 0,
  profile_views                       INTEGER NOT NULL DEFAULT 0,
  contacts_received                   INTEGER NOT NULL DEFAULT 0,
  updated_at                          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 20. VERIFICATION BADGES
-- =============================================

CREATE TABLE public.verification_badges (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  type             badge_type NOT NULL,
  awarded_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(professional_id, type)
);

-- =============================================
-- 21. PROFESSIONAL SUBSCRIPTIONS
-- =============================================

CREATE TABLE public.professional_subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id         UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL DEFAULT 'MVP_79',
  stripe_subscription_id  TEXT UNIQUE,
  stripe_price_id         TEXT,
  status                  subscription_status NOT NULL DEFAULT 'TRIAL',
  trial_ends_at           TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  current_period_end      TIMESTAMPTZ,
  cancelled_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 22. PAYMENT TRANSACTIONS
-- =============================================

CREATE TABLE public.payment_transactions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id       UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  amount                NUMERIC(12, 2) NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'BRL',
  status                TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
  stripe_payment_id     TEXT UNIQUE,
  stripe_invoice_id     TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 23. CPF VALIDATIONS
-- =============================================

CREATE TABLE public.cpf_validations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id     UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  validation_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status              verification_status NOT NULL,
  serpro_response     JSONB,
  jusbrasil_response  JSONB,
  reason_if_rejected  TEXT
);

-- =============================================
-- 24. CONTENT REPORTS
-- =============================================

CREATE TABLE public.content_reports (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_item_type     TEXT NOT NULL CHECK (reported_item_type IN ('IMAGE', 'VIDEO', 'PROFILE')),
  reported_item_id       UUID NOT NULL,
  reported_by_user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason                 TEXT NOT NULL,
  status                 TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'INVESTIGATING', 'RESOLVED')),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 25. PROFESSIONAL INFRACTIONS
-- =============================================

CREATE TABLE public.professional_infractions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  professional_id  UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  infraction_type  TEXT NOT NULL CHECK (infraction_type IN ('CONTENT_REJECTION', 'PLAGIARISM', 'FRAUD')),
  count_total      INTEGER NOT NULL DEFAULT 1,
  consequence      infraction_consequence,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_affinities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_contact_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_social_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cpf_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_infractions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS
-- =============================================

-- profiles: público pode ler, usuário edita o próprio
CREATE POLICY "profiles_public_read" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_owner_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- professional_profiles: público lê ACTIVE, dono edita o próprio
CREATE POLICY "professional_profiles_public_read" ON public.professional_profiles
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "professional_profiles_owner_read" ON public.professional_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "professional_profiles_owner_update" ON public.professional_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "professional_profiles_owner_insert" ON public.professional_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- portfolio_projects: público lê projetos de profissionais ACTIVE, dono faz tudo
CREATE POLICY "portfolio_projects_public_read" ON public.portfolio_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = portfolio_projects.professional_id
      AND pp.status = 'ACTIVE'
    )
  );

CREATE POLICY "portfolio_projects_owner_all" ON public.portfolio_projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = portfolio_projects.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- portfolio_images: mesmo padrão do projeto
CREATE POLICY "portfolio_images_public_read" ON public.portfolio_images
  FOR SELECT USING (
    status = 'APPROVED' AND
    EXISTS (
      SELECT 1 FROM public.portfolio_projects proj
      JOIN public.professional_profiles pp ON pp.id = proj.professional_id
      WHERE proj.id = portfolio_images.project_id
      AND pp.status = 'ACTIVE'
    )
  );

CREATE POLICY "portfolio_images_owner_all" ON public.portfolio_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_projects proj
      JOIN public.professional_profiles pp ON pp.id = proj.professional_id
      WHERE proj.id = portfolio_images.project_id
      AND pp.user_id = auth.uid()
    )
  );

-- contact_channels: autenticados podem ver de ACTIVE, dono edita
CREATE POLICY "contact_channels_authenticated_read" ON public.professional_contact_channels
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = professional_contact_channels.professional_id
      AND pp.status = 'ACTIVE'
    )
  );

CREATE POLICY "contact_channels_owner_all" ON public.professional_contact_channels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = professional_contact_channels.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- evaluations: públicas para leitura, contratante que já teve contato pode criar
CREATE POLICY "evaluations_public_read" ON public.evaluations
  FOR SELECT USING (true);

CREATE POLICY "evaluations_contractor_insert" ON public.evaluations
  FOR INSERT WITH CHECK (
    auth.uid() = contractor_id AND
    EXISTS (
      SELECT 1 FROM public.contact_logs cl
      WHERE cl.contractor_id = auth.uid()
      AND cl.professional_id = evaluations.professional_id
    )
  );

-- contact_logs: usuário vê os próprios
CREATE POLICY "contact_logs_owner_read" ON public.contact_logs
  FOR SELECT USING (auth.uid() = contractor_id);

CREATE POLICY "contact_logs_authenticated_insert" ON public.contact_logs
  FOR INSERT WITH CHECK (auth.uid() = contractor_id);

-- budget_requests: contratante vê os seus, profissional vê os seus
CREATE POLICY "budget_requests_contractor_read" ON public.budget_requests
  FOR SELECT USING (auth.uid() = contractor_id);

CREATE POLICY "budget_requests_professional_read" ON public.budget_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = budget_requests.professional_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "budget_requests_contractor_insert" ON public.budget_requests
  FOR INSERT WITH CHECK (auth.uid() = contractor_id);

-- completed_services: somente o dono
CREATE POLICY "completed_services_owner_all" ON public.completed_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = completed_services.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- subscriptions: somente o dono
CREATE POLICY "subscriptions_owner_read" ON public.professional_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = professional_subscriptions.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- metrics: públicas
CREATE POLICY "metrics_public_read" ON public.professional_metrics
  FOR SELECT USING (true);

-- badges: públicas
CREATE POLICY "badges_public_read" ON public.verification_badges
  FOR SELECT USING (true);

-- specialties: públicas
CREATE POLICY "specialties_public_read" ON public.professional_specialties
  FOR SELECT USING (true);

CREATE POLICY "specialties_owner_all" ON public.professional_specialties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = professional_specialties.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- affinities: públicas
CREATE POLICY "affinities_public_read" ON public.professional_affinities
  FOR SELECT USING (true);

CREATE POLICY "affinities_owner_all" ON public.professional_affinities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = professional_affinities.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- social_networks: públicas
CREATE POLICY "social_networks_public_read" ON public.professional_social_networks
  FOR SELECT USING (true);

CREATE POLICY "social_networks_owner_all" ON public.professional_social_networks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = professional_social_networks.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- evaluation_responses: públicas para leitura
CREATE POLICY "evaluation_responses_public_read" ON public.evaluation_responses
  FOR SELECT USING (true);

CREATE POLICY "evaluation_responses_owner_insert" ON public.evaluation_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = evaluation_responses.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- =============================================
-- PROFILE ACTIVITY LOGS
-- =============================================

CREATE TABLE IF NOT EXISTS public.profile_activity_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  contractor_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL CHECK (event_type IN ('PROFILE_VIEWED', 'CONTACT_VIEWED')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profile_activity_logs_professional_created
  ON public.profile_activity_logs (professional_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profile_activity_logs_contractor
  ON public.profile_activity_logs (contractor_id);

ALTER TABLE public.profile_activity_logs ENABLE ROW LEVEL SECURITY;

-- Profissional lê apenas logs do próprio perfil
CREATE POLICY "activity_logs_professional_read" ON public.profile_activity_logs
  FOR SELECT USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- cpf_validations: dono insere e lê o próprio
CREATE POLICY "cpf_validations_owner_insert" ON public.cpf_validations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = cpf_validations.professional_id
      AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "cpf_validations_owner_read" ON public.cpf_validations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = cpf_validations.professional_id
      AND pp.user_id = auth.uid()
    )
  );

-- Contratante insere apenas com seu próprio contractor_id
CREATE POLICY "activity_logs_contractor_insert" ON public.profile_activity_logs
  FOR INSERT WITH CHECK (contractor_id = auth.uid());

-- =============================================
-- STORAGE
-- =============================================

-- Buckets públicos para uploads de mídia
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;

-- Profiles: leitura pública, escrita/deleção apenas do próprio usuário
CREATE POLICY "Profile photos public read"
  ON storage.objects FOR SELECT TO public USING (bucket_id = 'profiles');
CREATE POLICY "Profile photos owner insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Profile photos owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Profile photos owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Portfolio: mesma estrutura
CREATE POLICY "Portfolio images public read"
  ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio');
CREATE POLICY "Portfolio images owner insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Portfolio images owner update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Portfolio images owner delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = auth.uid()::text);

