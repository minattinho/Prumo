import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-azul-noite text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo variant="white" />
            <p className="mt-3 text-sm text-blue-200 leading-relaxed">
              Marketplace de profissionais para seu imóvel — do encanador ao arquiteto.
            </p>
          </div>

          {/* Para contratantes */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
              Para contratantes
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/profissionais" className="hover:text-white transition-colors">
                  Encontrar profissional
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="hover:text-white transition-colors">
                  Criar conta grátis
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="hover:text-white transition-colors">
                  Como funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Para profissionais */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
              Para profissionais
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/seja-profissional" className="hover:text-white transition-colors">
                  Anunciar serviço
                </Link>
              </li>
              <li>
                <Link href="/painel" className="hover:text-white transition-colors">
                  Painel do profissional
                </Link>
              </li>
              <li>
                <Link href="/planos" className="hover:text-white transition-colors">
                  Planos e preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-4">
              Empresa
            </h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre o Prumo
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="hover:text-white transition-colors">
                  Política de privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-white transition-colors">
                  Termos de uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-400">
          <p>© {new Date().getFullYear()} Prumo. Todos os direitos reservados.</p>
          <p>Sua obra no prumo.</p>
        </div>
      </div>
    </footer>
  );
}
