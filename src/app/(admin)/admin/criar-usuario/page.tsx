import { CreateUserForm } from "./create-user-form";

export default function CriarUsuarioPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-azul-noite">Criar usuário</h1>
        <p className="text-sm text-cinza-texto mt-1">
          Crie profissionais ou contratantes sem necessidade de pagamento.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg">
        <CreateUserForm />
      </div>
    </div>
  );
}
