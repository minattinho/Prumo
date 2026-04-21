-- Corrige o trigger handle_new_user para preservar o role do user_metadata.
-- Antes desta correção, o trigger sempre criava profiles com role = 'contractor' (DEFAULT),
-- ignorando o campo role passado no signUp. Agora lê raw_user_meta_data->>'role'.
--
-- Execute este SQL no Supabase SQL Editor para aplicar a correção em produção.

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
