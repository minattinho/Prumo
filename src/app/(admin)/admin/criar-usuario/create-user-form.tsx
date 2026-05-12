"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { SERVICE_TAXONOMY } from "@/types/services";

type Role = "professional" | "contractor";

export function CreateUserForm() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("professional");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/admin/criar-usuario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
        city: city || undefined,
        state: state || undefined,
        specialty: specialty || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Erro ao criar usuário.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <p className="text-lg font-semibold text-azul-noite">Usuário criado com sucesso!</p>
        <p className="text-sm text-cinza-texto">
          O usuário já pode acessar a plataforma com o e-mail e senha informados.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => {
              setSuccess(false);
              setName("");
              setEmail("");
              setPassword("");
              setCity("");
              setState("");
              setSpecialty("");
            }}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
          >
            Criar outro
          </button>
          <button
            onClick={() => router.push("/admin/usuarios")}
            className="px-4 py-2 rounded-xl bg-azul-principal text-white text-sm font-medium hover:bg-azul-noite transition-colors"
          >
            Ver usuários
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Role selection */}
      <div>
        <label className="block text-sm font-medium text-azul-noite mb-2">Tipo de usuário</label>
        <div className="flex gap-3">
          {(["professional", "contractor"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                role === r
                  ? "border-azul-principal bg-azul-claro text-azul-principal"
                  : "border-gray-200 text-cinza-texto hover:border-azul-principal"
              }`}
            >
              {r === "professional" ? "Profissional" : "Contratante"}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-azul-noite mb-1.5">Nome completo</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="João da Silva"
          className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-azul-noite mb-1.5">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@email.com"
          className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-azul-noite mb-1.5">Senha</label>
        <PasswordInput
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all"
        />
      </div>

      {/* Professional-only fields */}
      {role === "professional" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-azul-noite mb-1.5">Cidade (opcional)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Florianópolis"
                className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-azul-noite mb-1.5">Estado (opcional)</label>
              <input
                type="text"
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                placeholder="SC"
                className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-azul-noite mb-1.5">
              Especialidade (opcional)
            </label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-3 text-sm text-azul-noite focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent focus:bg-white transition-all"
            >
              <option value="">Selecione</option>
              {SERVICE_TAXONOMY.map((category) => (
                <optgroup key={category.slug} label={category.name}>
                  {category.subcategories.flatMap((subcategory) =>
                    subcategory.services.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {subcategory.name} - {service.name}
                      </option>
                    ))
                  )}
                </optgroup>
              ))}
            </select>
          </div>
        </>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-azul-principal hover:bg-azul-noite text-white font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-60"
      >
        {loading ? "Criando usuário..." : "Criar usuário"}
      </button>
    </form>
  );
}
