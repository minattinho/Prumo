import Link from "next/link";
import { Logo } from "./logo";
import { createClient } from "@/lib/supabase/server";
import { HeaderUserMenu } from "./header-user-menu";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).single()
    : { data: null };

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Nav central */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/profissionais"
              className="text-sm font-medium text-cinza-texto hover:text-azul-principal transition-colors"
            >
              Encontrar profissional
            </Link>
            <Link
              href="/seja-profissional"
              className="text-sm font-medium text-cinza-texto hover:text-azul-principal transition-colors"
            >
              Sou profissional
            </Link>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {user ? (
              <HeaderUserMenu user={user} role={profile?.role ?? "contractor"} />
            ) : (
              <>
                <Link
                  href="/?auth=login"
                  className="text-sm font-medium text-azul-noite hover:text-azul-principal transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/seja-profissional"
                  className="text-sm font-medium bg-laranja-obra hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Anunciar serviço
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
