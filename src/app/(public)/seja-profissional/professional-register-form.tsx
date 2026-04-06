"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CATEGORIES = [
  "Construção",
  "Elétrica",
  "Hidráulica",
  "Acabamento",
  "Pisos",
  "Serralheria",
  "Marcenaria",
  "Jardinagem",
  "Limpeza",
  "Projeto",
  "Engenharia",
  "Tecnologia",
  "Climatização",
  "Pintura",
  "Gesso e Drywall",
  "Impermeabilização",
  "Telhados e Coberturas",
  "Reformas Gerais",
  "Instalações de Gás",
  "Demolição",
];

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
];

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatCPF(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCNPJ(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

type Step = 1 | 2 | 3;

type FormData = {
  // Etapa 1
  name: string;
  email: string;
  phone: string;
  password: string;
  // Etapa 2
  city: string;
  state: string;
  whatsapp: string;
  specialty: string;
  // Etapa 3
  personType: "PF" | "PJ";
  cpf: string;
  birthDate: string;
  cnpj: string;
};

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Conta" },
    { n: 2, label: "Perfil" },
    { n: 3, label: "Documentos" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map(({ n, label }, i) => {
        const done = step > n;
        const active = step === n;
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors ${
                  done
                    ? "bg-azul-principal border-azul-principal text-white"
                    : active
                    ? "border-azul-principal text-azul-principal bg-white"
                    : "border-gray-200 text-cinza-texto bg-white"
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  n
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  active ? "text-azul-principal" : done ? "text-azul-principal" : "text-cinza-texto"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 mx-1 mb-4 transition-colors ${
                  step > n ? "bg-azul-principal" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProfessionalRegisterFormInner() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    state: "",
    whatsapp: "",
    specialty: "",
    personType: "PF",
    cpf: "",
    birthDate: "",
    cnpj: "",
  });

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/painel&new_professional=true`,
        queryParams: { prompt: "select_account" },
      },
    });
  }

  function validateStep1(): string | null {
    if (!form.name.trim()) return "Informe seu nome completo.";
    if (!form.email.trim()) return "Informe seu e-mail.";
    if (!form.phone.trim()) return "Informe seu telefone.";
    if (form.password.length < 8) return "A senha precisa ter pelo menos 8 caracteres.";
    return null;
  }

  function validateStep2(): string | null {
    if (!form.city.trim()) return "Informe sua cidade.";
    if (!form.state) return "Selecione seu estado.";
    if (!form.whatsapp.trim()) return "Informe seu WhatsApp.";
    if (!form.specialty) return "Selecione sua especialidade principal.";
    return null;
  }

  function validateStep3(): string | null {
    if (form.personType === "PF") {
      const cpfDigits = form.cpf.replace(/\D/g, "");
      if (cpfDigits.length !== 11) return "Informe um CPF válido (11 dígitos).";
      if (!form.birthDate) return "Informe sua data de nascimento.";
    } else {
      const cnpjDigits = form.cnpj.replace(/\D/g, "");
      if (cnpjDigits.length !== 14) return "Informe um CNPJ válido (14 dígitos).";
    }
    return null;
  }

  function handleNextStep() {
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => (s + 1) as Step);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          role: "professional",
          phone: form.phone,
          city: form.city,
          state: form.state,
          whatsapp: form.whatsapp.replace(/\D/g, ""),
          specialty: form.specialty,
          person_type: form.personType,
          cpf: form.personType === "PF" ? form.cpf.replace(/\D/g, "") : null,
          birth_date: form.personType === "PF" ? form.birthDate : null,
          cnpj: form.personType === "PJ" ? form.cnpj.replace(/\D/g, "") : null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/painel&new_professional=true`,
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setError("Esse e-mail já está cadastrado. Tenta entrar.");
        setStep(1);
      } else {
        setError("Algo deu errado. Tenta de novo?");
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-azul-noite mb-2">Pronto! Confirma o e-mail</h2>
        <p className="text-sm text-cinza-texto">
          Enviamos um link de confirmação para{" "}
          <strong className="text-azul-noite">{form.email}</strong>. Abre lá e clica no link para
          ativar sua conta.
        </p>
        <p className="mt-3 text-xs text-cinza-texto">
          Você será redirecionado ao seu painel após confirmar.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-azul-noite placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-principal focus:border-transparent bg-white";

  return (
    <div className="space-y-5">
      <StepIndicator step={step} />

      {/* Etapa 1 */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 px-4 text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <GoogleIcon />
            {googleLoading ? "Redirecionando..." : "Cadastrar com Google"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-cinza-texto">ou preencha os dados</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-azul-noite mb-1">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
              placeholder="João Silva"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-azul-noite mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputClass}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-azul-noite mb-1">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => set("phone", formatPhone(e.target.value))}
              className={inputClass}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-azul-noite mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              className={inputClass}
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="button"
            onClick={handleNextStep}
            className="w-full flex items-center justify-center gap-2 bg-azul-principal hover:bg-azul-noite text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            Próximo passo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Etapa 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-azul-noite mb-1">
                Cidade
              </label>
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={inputClass}
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-azul-noite mb-1">
                Estado
              </label>
              <select
                id="state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                className={inputClass}
              >
                <option value="">UF</option>
                {ESTADOS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-azul-noite mb-1">
              WhatsApp{" "}
              <span className="text-cinza-texto font-normal text-xs">(canal de contato principal)</span>
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={(e) => set("whatsapp", formatPhone(e.target.value))}
              className={inputClass}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-azul-noite mb-1">
              Especialidade principal
            </label>
            <select
              id="specialty"
              value={form.specialty}
              onChange={(e) => set("specialty", e.target.value)}
              className={inputClass}
            >
              <option value="">Selecione uma especialidade</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 flex items-center justify-center gap-2 bg-azul-principal hover:bg-azul-noite text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
            >
              Próximo passo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Etapa 3 */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de pessoa */}
          <div>
            <label className="block text-sm font-medium text-azul-noite mb-2">
              Tipo de cadastro
            </label>
            <div className="flex gap-2">
              {(["PF", "PJ"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { set("personType", type); setError(null); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    form.personType === type
                      ? "border-azul-principal bg-azul-claro text-azul-principal"
                      : "border-gray-200 text-cinza-texto hover:border-azul-principal/40"
                  }`}
                >
                  {type === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}
                </button>
              ))}
            </div>
          </div>

          {/* Pessoa Física */}
          {form.personType === "PF" && (
            <>
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-azul-noite mb-1">
                  CPF
                </label>
                <input
                  id="cpf"
                  type="text"
                  inputMode="numeric"
                  value={form.cpf}
                  onChange={(e) => set("cpf", formatCPF(e.target.value))}
                  className={inputClass}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-azul-noite mb-1">
                  Data de nascimento
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => set("birthDate", e.target.value)}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  className={inputClass}
                />
              </div>
            </>
          )}

          {/* Pessoa Jurídica */}
          {form.personType === "PJ" && (
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-azul-noite mb-1">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                inputMode="numeric"
                value={form.cnpj}
                onChange={(e) => set("cnpj", formatCNPJ(e.target.value))}
                className={inputClass}
                placeholder="00.000.000/0000-00"
              />
            </div>
          )}

          <p className="text-xs text-cinza-texto bg-gray-50 rounded-lg px-3 py-2.5 leading-relaxed">
            Seus dados serão usados exclusivamente para verificação de identidade. O CPF/CNPJ não é exibido
            publicamente no seu perfil.
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setStep(2); setError(null); }}
              className="flex items-center gap-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-azul-noite hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-laranja-obra hover:opacity-90 text-white font-medium rounded-lg py-2.5 text-sm transition-opacity disabled:opacity-60"
            >
              {loading ? "Criando conta..." : "Criar conta grátis — 30 dias trial"}
            </button>
          </div>

          <p className="text-xs text-cinza-texto text-center">
            Ao criar sua conta, você concorda com nossos{" "}
            <a href="/termos" className="underline hover:text-azul-principal">Termos de Uso</a>{" "}
            e{" "}
            <a href="/privacidade" className="underline hover:text-azul-principal">Política de Privacidade</a>.
          </p>
        </form>
      )}
    </div>
  );
}

export function ProfessionalRegisterForm() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100 rounded-lg" />}>
      <ProfessionalRegisterFormInner />
    </Suspense>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
