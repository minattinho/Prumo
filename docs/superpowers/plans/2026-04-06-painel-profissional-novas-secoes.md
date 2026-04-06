# Painel Profissional — Novas Seções Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar 3 novas seções ao painel profissional: Avaliações Recebidas, Configurações de Conta e Gestão de Assinatura, além de atualizar o sidebar com os novos itens de navegação.

**Architecture:** Cada seção segue o padrão existente do projeto — `page.tsx` (Server Component para fetch + auth via layout) + `*-client.tsx` (Client Component para interatividade) + `actions.ts` (Server Actions para mutações). O Sidebar é um Client Component que apenas precisa de novos itens no array `navItems`.

**Tech Stack:** Next.js 15 App Router, Supabase SSR (`@/lib/supabase/server` + `@/lib/supabase/client`), Tailwind CSS v4, Radix UI (Dialog, Tabs), lucide-react, `useTransition` para loading states.

---

## File Map

| Arquivo | Ação |
|---------|------|
| `src/app/(professional)/painel/sidebar.tsx` | Modificar — adicionar 3 itens ao `navItems` |
| `src/app/(professional)/painel/avaliacoes/actions.ts` | Criar |
| `src/app/(professional)/painel/avaliacoes/page.tsx` | Criar |
| `src/app/(professional)/painel/avaliacoes/evaluations-client.tsx` | Criar |
| `src/app/(professional)/painel/configuracoes/actions.ts` | Criar |
| `src/app/(professional)/painel/configuracoes/page.tsx` | Criar |
| `src/app/(professional)/painel/configuracoes/settings-client.tsx` | Criar |
| `src/app/(professional)/painel/assinatura/page.tsx` | Criar |
| `src/app/(professional)/painel/assinatura/subscription-client.tsx` | Criar |

---

## Task 1: Atualizar Sidebar

**Files:**
- Modify: `src/app/(professional)/painel/sidebar.tsx`

- [ ] **Step 1: Adicionar imports e itens ao navItems**

Abrir `src/app/(professional)/painel/sidebar.tsx`. Modificar as duas partes:

**Linha de imports do lucide-react** — adicionar `Star`, `CreditCard`, `Settings`:
```tsx
import {
  LayoutDashboard,
  User,
  Images,
  Briefcase,
  MessageSquare,
  Star,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
```

**Array `navItems`** — adicionar 3 novos itens ao final:
```tsx
const navItems = [
  { label: "Dashboard",     href: "/painel",               icon: LayoutDashboard, exact: true  },
  { label: "Perfil",        href: "/painel/perfil",        icon: User,            exact: false },
  { label: "Portfólio",     href: "/painel/portfolio",     icon: Images,          exact: false },
  { label: "Serviços",      href: "/painel/servicos",      icon: Briefcase,       exact: false },
  { label: "Solicitações",  href: "/painel/solicitacoes",  icon: MessageSquare,   exact: false },
  { label: "Avaliações",    href: "/painel/avaliacoes",    icon: Star,            exact: false },
  { label: "Assinatura",    href: "/painel/assinatura",    icon: CreditCard,      exact: false },
  { label: "Configurações", href: "/painel/configuracoes", icon: Settings,        exact: false },
];
```

- [ ] **Step 2: Verificar visualmente**

Iniciar o dev server (`npm run dev`) e abrir `/painel`. Confirmar que os 3 novos itens aparecem no sidebar com ícones corretos e que o highlight ativo funciona ao navegar para cada rota (mesmo que a página ainda não exista — o Next.js vai mostrar 404, o que está ok por ora).

- [ ] **Step 3: Commit**

```bash
git add src/app/(professional)/painel/sidebar.tsx
git commit -m "feat(painel): adicionar Avaliações, Assinatura e Configurações ao sidebar"
```

---

## Task 2: Avaliações — Server Actions

**Files:**
- Create: `src/app/(professional)/painel/avaliacoes/actions.ts`

- [ ] **Step 1: Criar o arquivo de actions**

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getProfessionalId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", userId)
    .single();
  return data?.id ?? null;
}

export async function respondToEvaluation(
  evaluationId: string,
  responseText: string
): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const proId = await getProfessionalId(supabase, user.id);
  if (!proId) return { error: "Perfil não encontrado" };

  // Garante que a avaliação pertence a este profissional
  const { data: evaluation } = await supabase
    .from("evaluations")
    .select("id")
    .eq("id", evaluationId)
    .eq("professional_id", proId)
    .single();

  if (!evaluation) return { error: "Avaliação não encontrada" };

  const { error } = await supabase
    .from("evaluation_responses")
    .upsert(
      {
        evaluation_id: evaluationId,
        professional_id: proId,
        response_text: responseText.trim(),
      },
      { onConflict: "evaluation_id" }
    );

  if (error) return { error: "Erro ao salvar resposta" };

  revalidatePath("/painel/avaliacoes");
  return { success: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(professional)/painel/avaliacoes/actions.ts
git commit -m "feat(avaliacoes): server action respondToEvaluation"
```

---

## Task 3: Avaliações — Page + Client

**Files:**
- Create: `src/app/(professional)/painel/avaliacoes/page.tsx`
- Create: `src/app/(professional)/painel/avaliacoes/evaluations-client.tsx`

- [ ] **Step 1: Criar `page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { EvaluationsClient } from "./evaluations-client";

export const metadata = { title: "Avaliações Recebidas" };

export type Evaluation = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  contractor_name: string;
  response_text: string | null;
};

export default async function AvaliacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .single() as { data: { id: string } | null };

  let evaluations: Evaluation[] = [];

  if (pro?.id) {
    const { data: rawEvals } = await supabase
      .from("evaluations")
      .select("id, rating, comment, created_at, contractor_id, evaluation_responses(response_text)")
      .eq("professional_id", pro.id)
      .order("created_at", { ascending: false }) as {
        data: {
          id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          contractor_id: string;
          evaluation_responses: { response_text: string }[];
        }[] | null;
      };

    const evals = rawEvals ?? [];

    // Batch-fetch nomes dos contratantes
    const contractorIds = [...new Set(evals.map((e) => e.contractor_id).filter(Boolean))];
    const contractorNames: Record<string, string> = {};

    if (contractorIds.length > 0) {
      const { data: contractors } = await supabase
        .from("contractor_profiles")
        .select("id, user_id")
        .in("id", contractorIds) as { data: { id: string; user_id: string }[] | null };

      if (contractors) {
        const userIds = contractors.map((c) => c.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds) as { data: { id: string; full_name: string | null }[] | null };

        const profileMap: Record<string, string> = {};
        for (const p of profiles ?? []) {
          profileMap[p.id] = p.full_name ?? "Contratante";
        }
        for (const c of contractors) {
          contractorNames[c.id] = profileMap[c.user_id] ?? "Contratante";
        }
      }
    }

    evaluations = evals.map((e) => ({
      id: e.id,
      rating: e.rating,
      comment: e.comment,
      created_at: e.created_at,
      contractor_name: contractorNames[e.contractor_id] ?? "Contratante",
      response_text: e.evaluation_responses?.[0]?.response_text ?? null,
    }));
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Avaliações recebidas</h1>
        <p className="text-sm text-cinza-texto mt-0.5">
          Veja o que seus clientes dizem e responda publicamente.
        </p>
      </div>
      <EvaluationsClient evaluations={evaluations} />
    </div>
  );
}
```

- [ ] **Step 2: Criar `evaluations-client.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import { Star, MessageSquare } from "lucide-react";
import { respondToEvaluation } from "./actions";
import type { Evaluation } from "./page";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  const [responding, setResponding] = useState(false);
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [localResponse, setLocalResponse] = useState(evaluation.response_text);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!text.trim()) return;
    startTransition(async () => {
      const result = await respondToEvaluation(evaluation.id, text);
      if (result.error) {
        setError(result.error);
      } else {
        setLocalResponse(text);
        setResponding(false);
        setText("");
        setError(null);
      }
    });
  }

  return (
    <div className="bg-white rounded-card shadow-card p-5 space-y-3">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-azul-claro flex items-center justify-center text-azul-principal text-sm font-semibold shrink-0">
          {getInitials(evaluation.contractor_name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-azul-noite">{evaluation.contractor_name}</p>
            <p className="text-xs text-cinza-texto shrink-0">
              {new Date(evaluation.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <StarDisplay rating={evaluation.rating} />
          {evaluation.comment && (
            <p className="text-sm text-cinza-texto mt-2">{evaluation.comment}</p>
          )}
        </div>
      </div>

      {/* Resposta existente */}
      {localResponse && (
        <div className="ml-12 bg-gray-50 rounded-lg p-3 border-l-2 border-azul-principal">
          <p className="text-xs font-semibold text-azul-noite mb-1">Sua resposta</p>
          <p className="text-sm text-cinza-texto">{localResponse}</p>
        </div>
      )}

      {/* Formulário de resposta */}
      {!localResponse && !responding && (
        <div className="ml-12">
          <button
            onClick={() => setResponding(true)}
            className="text-xs text-azul-principal hover:underline font-medium flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Responder publicamente
          </button>
        </div>
      )}

      {!localResponse && responding && (
        <div className="ml-12 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua resposta..."
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal resize-none"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending || !text.trim()}
              className="text-sm bg-azul-principal hover:bg-azul-noite text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isPending ? "Salvando..." : "Publicar resposta"}
            </button>
            <button
              onClick={() => { setResponding(false); setText(""); setError(null); }}
              disabled={isPending}
              className="text-sm text-cinza-texto hover:text-azul-noite px-3 py-1.5 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function EvaluationsClient({ evaluations }: { evaluations: Evaluation[] }) {
  if (evaluations.length === 0) {
    return (
      <div className="bg-white rounded-card shadow-card p-12 flex flex-col items-center gap-3 text-center">
        <Star className="w-10 h-10 text-gray-200" />
        <p className="text-sm font-medium text-azul-noite">Nenhuma avaliação ainda</p>
        <p className="text-xs text-cinza-texto max-w-xs">
          Quando clientes avaliarem você, as avaliações aparecerão aqui.
        </p>
      </div>
    );
  }

  const avg = evaluations.reduce((acc, e) => acc + e.rating, 0) / evaluations.length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-4 bg-white rounded-card shadow-card px-5 py-4">
        <div className="flex items-center gap-1.5">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span className="text-2xl font-bold text-azul-noite">{avg.toFixed(1)}</span>
        </div>
        <div className="w-px h-8 bg-gray-100" />
        <p className="text-sm text-cinza-texto">
          <span className="font-semibold text-azul-noite">{evaluations.length}</span>{" "}
          {evaluations.length === 1 ? "avaliação" : "avaliações"}
        </p>
      </div>

      {/* Lista */}
      {evaluations.map((ev) => (
        <EvaluationCard key={ev.id} evaluation={ev} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verificar**

Navegar para `/painel/avaliacoes`. Deve carregar sem erro. Se não houver avaliações, mostrar empty state. Se houver, confirmar que cards aparecem com estrelas, nome, data. Testar responder uma avaliação (se existir).

- [ ] **Step 4: Commit**

```bash
git add src/app/(professional)/painel/avaliacoes/
git commit -m "feat(avaliacoes): página de avaliações recebidas com resposta inline"
```

---

## Task 4: Configurações — Server Actions

**Files:**
- Create: `src/app/(professional)/painel/configuracoes/actions.ts`

- [ ] **Step 1: Criar o arquivo de actions**

```ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAccountSettings(data: {
  full_name: string;
  phone: string;
}): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: data.full_name, phone: data.phone })
    .eq("id", user.id);

  if (error) return { error: "Erro ao salvar configurações" };
  revalidatePath("/painel/configuracoes");
  return { success: true };
}

export async function sendPasswordReset(): Promise<{ success?: true; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: "Não autenticado" };

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/painel`,
  });

  if (error) return { error: "Erro ao enviar e-mail" };
  return { success: true };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(professional)/painel/configuracoes/actions.ts
git commit -m "feat(configuracoes): server actions updateAccountSettings e sendPasswordReset"
```

---

## Task 5: Configurações — Page + Client

**Files:**
- Create: `src/app/(professional)/painel/configuracoes/page.tsx`
- Create: `src/app/(professional)/painel/configuracoes/settings-client.tsx`

- [ ] **Step 1: Criar `page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, email")
    .eq("id", user!.id)
    .single() as {
      data: { full_name: string | null; phone: string | null; email: string | null } | null;
    };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Configurações</h1>
        <p className="text-sm text-cinza-texto mt-0.5">Gerencie sua conta e segurança.</p>
      </div>
      <SettingsClient
        fullName={profile?.full_name ?? ""}
        phone={profile?.phone ?? ""}
        email={profile?.email ?? user?.email ?? ""}
      />
    </div>
  );
}
```

- [ ] **Step 2: Criar `settings-client.tsx`**

```tsx
"use client";

import { useState, useTransition } from "react";
import { updateAccountSettings, sendPasswordReset } from "./actions";

type Props = {
  fullName: string;
  phone: string;
  email: string;
};

export function SettingsClient({ fullName, phone, email }: Props) {
  const [name, setName] = useState(fullName);
  const [phoneVal, setPhoneVal] = useState(phone);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [resetMsg, setResetMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSaving, startSave] = useTransition();
  const [isResetting, startReset] = useTransition();

  function handleSave() {
    setSaveMsg(null);
    startSave(async () => {
      const result = await updateAccountSettings({ full_name: name.trim(), phone: phoneVal.trim() });
      if (result.error) {
        setSaveMsg({ type: "error", text: result.error });
      } else {
        setSaveMsg({ type: "success", text: "Configurações salvas com sucesso." });
      }
    });
  }

  function handlePasswordReset() {
    setResetMsg(null);
    startReset(async () => {
      const result = await sendPasswordReset();
      if (result.error) {
        setResetMsg({ type: "error", text: result.error });
      } else {
        setResetMsg({ type: "success", text: "Link enviado! Verifique seu e-mail." });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Bloco 1: Dados pessoais */}
      <div className="bg-white rounded-card shadow-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-azul-noite">Dados pessoais</h2>

        <div className="space-y-1">
          <label className="text-xs font-medium text-cinza-texto" htmlFor="full_name">
            Nome completo
          </label>
          <input
            id="full_name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-cinza-texto" htmlFor="phone">
            Telefone
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneVal}
            onChange={(e) => setPhoneVal(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-cinza-texto">E-mail</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-gray-100 rounded-lg px-3 py-2 text-sm bg-gray-50 text-cinza-texto cursor-not-allowed"
          />
          <p className="text-xs text-cinza-texto">O e-mail não pode ser alterado.</p>
        </div>

        {saveMsg && (
          <p className={`text-xs font-medium ${saveMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {saveMsg.text}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-azul-principal hover:bg-azul-noite text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>

      {/* Bloco 2: Segurança */}
      <div className="bg-white rounded-card shadow-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-azul-noite">Segurança</h2>

        <div>
          <p className="text-sm text-cinza-texto">
            Para alterar sua senha, enviaremos um link de redefinição para <span className="font-medium text-azul-noite">{email}</span>.
          </p>
        </div>

        {resetMsg && (
          <p className={`text-xs font-medium ${resetMsg.type === "success" ? "text-green-600" : "text-red-600"}`}>
            {resetMsg.text}
          </p>
        )}

        <button
          onClick={handlePasswordReset}
          disabled={isResetting}
          className="border border-gray-200 hover:bg-gray-50 text-azul-noite text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {isResetting ? "Enviando..." : "Enviar link de redefinição de senha"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar**

Navegar para `/painel/configuracoes`. Campos nome e telefone devem estar pré-preenchidos com dados do usuário logado. E-mail deve aparecer desabilitado. Testar salvar — ao recarregar a página, o novo nome deve estar no campo. Testar "Enviar link" — deve mostrar mensagem de confirmação.

- [ ] **Step 4: Commit**

```bash
git add src/app/(professional)/painel/configuracoes/
git commit -m "feat(configuracoes): página de configurações de conta e segurança"
```

---

## Task 6: Assinatura — Page + Client

**Files:**
- Create: `src/app/(professional)/painel/assinatura/page.tsx`
- Create: `src/app/(professional)/painel/assinatura/subscription-client.tsx`

- [ ] **Step 1: Criar `page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { SubscriptionClient } from "./subscription-client";

export const metadata = { title: "Assinatura" };

export type SubData = {
  plan: string | null;
  status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
} | null;

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
};

export default async function AssinaturaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pro } = await supabase
    .from("professional_profiles")
    .select("id, subscription_status, trial_ends_at, subscription_paid_until")
    .eq("user_id", user!.id)
    .single() as {
      data: {
        id: string;
        subscription_status: string | null;
        trial_ends_at: string | null;
        subscription_paid_until: string | null;
      } | null;
    };

  let sub: SubData = null;
  let transactions: Transaction[] = [];

  if (pro?.id) {
    const [{ data: subData }, { data: txData }] = await Promise.all([
      supabase
        .from("professional_subscriptions")
        .select("plan, status, trial_ends_at, current_period_end, stripe_subscription_id")
        .eq("professional_id", pro.id)
        .maybeSingle() as Promise<{ data: SubData }>,
      supabase
        .from("payment_transactions")
        .select("id, amount, currency, status, created_at")
        .eq("professional_id", pro.id)
        .order("created_at", { ascending: false })
        .limit(20) as Promise<{ data: Transaction[] | null }>,
    ]);

    sub = subData;
    transactions = txData ?? [];
  }

  // Fallback: usar dados do professional_profiles caso não haja row em professional_subscriptions
  const effectiveStatus = sub?.status ?? pro?.subscription_status ?? "TRIAL";
  const effectiveTrialEnd = sub?.trial_ends_at ?? pro?.trial_ends_at ?? null;
  const effectivePeriodEnd = sub?.current_period_end ?? pro?.subscription_paid_until ?? null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-azul-noite">Assinatura</h1>
        <p className="text-sm text-cinza-texto mt-0.5">Gerencie seu plano e histórico de pagamentos.</p>
      </div>
      <SubscriptionClient
        status={effectiveStatus}
        trialEndsAt={effectiveTrialEnd}
        periodEnd={effectivePeriodEnd}
        transactions={transactions}
      />
    </div>
  );
}
```

- [ ] **Step 2: Criar `subscription-client.tsx`**

```tsx
"use client";

import Link from "next/link";
import { CreditCard, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import type { Transaction } from "./page";

type Props = {
  status: string;
  trialEndsAt: string | null;
  periodEnd: string | null;
  transactions: Transaction[];
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  TRIAL: {
    label: "Trial gratuito",
    className: "bg-amber-100 text-amber-700",
    icon: <Clock className="w-4 h-4 text-amber-500" />,
  },
  ACTIVE: {
    label: "Ativo",
    className: "bg-green-100 text-green-700",
    icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700",
    icon: <XCircle className="w-4 h-4 text-red-500" />,
  },
  SUSPENDED: {
    label: "Suspenso",
    className: "bg-gray-100 text-gray-600",
    icon: <AlertTriangle className="w-4 h-4 text-gray-500" />,
  },
};

const TX_STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  COMPLETED: { label: "Pago",       className: "bg-green-100 text-green-700" },
  PENDING:   { label: "Pendente",   className: "bg-amber-100 text-amber-700" },
  FAILED:    { label: "Falhou",     className: "bg-red-100 text-red-600"     },
  REFUNDED:  { label: "Reembolsado", className: "bg-gray-100 text-gray-600"  },
};

function formatCurrency(amount: number, currency: string): string {
  // amount stored as decimal (ex: 79.00), not in cents
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function SubscriptionClient({ status, trialEndsAt, periodEnd, transactions }: Props) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.TRIAL;

  let trialDaysLeft: number | null = null;
  if (status === "TRIAL" && trialEndsAt) {
    const diff = new Date(trialEndsAt).getTime() - Date.now();
    trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-6">
      {/* Card do plano */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-azul-claro flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-azul-principal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-azul-noite">Plano Prumo Pro</p>
              <p className="text-xs text-cinza-texto">R$79/mês</p>
            </div>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.className}`}>
            {cfg.icon}
            {cfg.label}
          </span>
        </div>

        {/* Linha informativa contextual */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-cinza-texto">
          {status === "TRIAL" && trialDaysLeft !== null && (
            <p>
              <span className="font-semibold text-azul-noite">{trialDaysLeft}</span>{" "}
              {trialDaysLeft === 1 ? "dia restante" : "dias restantes"} no período gratuito.
            </p>
          )}
          {status === "ACTIVE" && periodEnd && (
            <p>
              Próxima cobrança em{" "}
              <span className="font-medium text-azul-noite">
                {new Date(periodEnd).toLocaleDateString("pt-BR")}
              </span>
              .
            </p>
          )}
          {(status === "CANCELLED" || status === "SUSPENDED") && (
            <p className="text-amber-700">
              Seu perfil ficará oculto até a reativação da assinatura.
            </p>
          )}
        </div>

        {/* CTA contextual */}
        <div className="mt-4">
          {status === "TRIAL" && (
            <Link
              href="/planos"
              className="inline-block bg-laranja-obra hover:opacity-90 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-opacity"
            >
              Assinar agora — R$79/mês
            </Link>
          )}
          {status === "ACTIVE" && (
            <div className="relative inline-block group">
              <button
                disabled
                className="border border-gray-200 text-cinza-texto text-sm font-medium px-5 py-2.5 rounded-lg cursor-not-allowed opacity-60"
              >
                Gerenciar assinatura
              </button>
              <span className="absolute left-0 -top-8 text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Disponível em breve
              </span>
            </div>
          )}
          {(status === "CANCELLED" || status === "SUSPENDED") && (
            <Link
              href="/planos"
              className="inline-block bg-azul-principal hover:bg-azul-noite text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Reativar assinatura
            </Link>
          )}
        </div>
      </div>

      {/* Histórico de pagamentos */}
      <div className="bg-white rounded-card shadow-card p-6">
        <h2 className="text-sm font-semibold text-azul-noite mb-4">Histórico de pagamentos</h2>

        {transactions.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <CreditCard className="w-8 h-8 text-gray-200" />
            <p className="text-sm text-cinza-texto">Nenhuma transação encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-cinza-texto">
                  <th className="text-left pb-2 font-medium">Data</th>
                  <th className="text-left pb-2 font-medium">Descrição</th>
                  <th className="text-right pb-2 font-medium">Valor</th>
                  <th className="text-right pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx) => {
                  const txCfg = TX_STATUS_CONFIG[tx.status] ?? TX_STATUS_CONFIG.PENDING;
                  return (
                    <tr key={tx.id}>
                      <td className="py-3 text-cinza-texto">
                        {new Date(tx.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 text-azul-noite">Plano Prumo Pro — mensal</td>
                      <td className="py-3 text-right font-medium text-azul-noite">
                        {formatCurrency(tx.amount, tx.currency)}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${txCfg.className}`}>
                          {txCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar**

Navegar para `/painel/assinatura`. Card do plano deve mostrar status atual (Trial/Ativo/etc.) com a informação contextual correta. Se status = TRIAL, botão "Assinar agora" deve estar clicável. Histórico de pagamentos deve mostrar empty state se não há transações, ou a tabela com os dados. Confirmar que o sidebar destaca "Assinatura" como ativo nessa rota.

- [ ] **Step 4: Commit final**

```bash
git add src/app/(professional)/painel/assinatura/
git commit -m "feat(assinatura): página de gestão de assinatura e histórico de pagamentos"
```

---

## Verificação End-to-End

Após todas as tasks, testar o fluxo completo logado como profissional:

1. `/painel` → sidebar mostra 8 itens, incluindo Avaliações, Assinatura, Configurações
2. `/painel/avaliacoes` → carrega (empty state ou lista de avaliações); responder se houver
3. `/painel/configuracoes` → campos pré-preenchidos; salvar nome; enviar link de senha
4. `/painel/assinatura` → card de plano reflete status real; histórico correto
5. Navegar entre todas as rotas e confirmar que o highlight ativo no sidebar funciona corretamente
