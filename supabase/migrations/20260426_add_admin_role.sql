-- =============================================
-- Migration: Adicionar role 'admin' ao sistema
-- =============================================

-- 1. Ampliar constraint da coluna role em profiles
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('contractor', 'professional', 'admin'));

-- 2. Atualizar trigger handle_new_user para reconhecer role 'admin'
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
      WHEN NEW.raw_user_meta_data->>'role' = 'admin'        THEN 'admin'
      ELSE 'contractor'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Função helper: retorna true se o usuário autenticado é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 4. Políticas RLS para admin

-- Admin lê todos os profiles
CREATE POLICY "profiles_admin_read" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Admin tem acesso total em professional_profiles (incluindo PENDING/SUSPENDED)
CREATE POLICY "professional_profiles_admin_all" ON public.professional_profiles
  FOR ALL USING (public.is_admin());

-- Admin lê todos os contractor_profiles
CREATE POLICY "contractor_profiles_admin_all" ON public.contractor_profiles
  FOR ALL USING (public.is_admin());

-- Admin lê todas as assinaturas
CREATE POLICY "subscriptions_admin_read" ON public.professional_subscriptions
  FOR SELECT USING (public.is_admin());
