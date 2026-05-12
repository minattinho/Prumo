import Link from "next/link";
import { ResetPasswordForm } from "../reset-password-form";

export const metadata = {
  title: "Redefinir senha",
};

export default function RedefinirSenhaPage() {
  return (
    <div className="h-full overflow-y-auto bg-white px-6 py-8">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-laranja-obra">
              <span className="text-2xl font-black leading-none text-white">
                P
              </span>
            </span>
            <span className="text-3xl font-black leading-none text-azul-principal">
              Prumo
            </span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-azul-noite">
            Redefinir senha
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-cinza-texto">
            Crie uma nova senha para voltar a acessar sua conta.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
