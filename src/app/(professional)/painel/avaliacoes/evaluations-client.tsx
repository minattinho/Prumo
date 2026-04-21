"use client";

import { useState, useTransition } from "react";
import { Star, MessageSquare, Send, X } from "lucide-react";
import { respondToEvaluation } from "./actions";
import type { Evaluation } from "./page";

function StarDisplay({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sz} ${
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
    <div className="bg-white rounded-card shadow-card p-5">
      {/* Header do card */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-azul-claro flex items-center justify-center text-azul-principal text-sm font-bold shrink-0">
          {getInitials(evaluation.contractor_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-azul-noite">{evaluation.contractor_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StarDisplay rating={evaluation.rating} />
                <span className="text-xs font-medium text-amber-600">{evaluation.rating}.0</span>
              </div>
            </div>
            <p className="text-xs text-cinza-texto shrink-0 mt-0.5">
              {new Date(evaluation.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          {evaluation.comment && (
            <p className="text-sm text-cinza-texto mt-2.5 leading-relaxed">{evaluation.comment}</p>
          )}
        </div>
      </div>

      {/* Resposta existente */}
      {localResponse && (
        <div className="ml-13 mt-3 bg-azul-claro rounded-lg p-3.5 border-l-2 border-azul-principal">
          <p className="text-xs font-semibold text-azul-principal mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            Sua resposta
          </p>
          <p className="text-sm text-azul-noite leading-relaxed">{localResponse}</p>
        </div>
      )}

      {/* Botão responder */}
      {!localResponse && !responding && (
        <div className="ml-13 mt-3 pt-3 border-t border-gray-50">
          <button
            onClick={() => setResponding(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-azul-principal hover:text-azul-noite transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Responder publicamente
          </button>
        </div>
      )}

      {/* Formulário de resposta */}
      {!localResponse && responding && (
        <div className="ml-13 mt-3 pt-3 border-t border-gray-50 space-y-2.5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua resposta pública..."
            rows={3}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal resize-none"
          />
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2.5 py-1.5">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending || !text.trim()}
              className="flex items-center gap-1.5 text-sm bg-azul-principal hover:bg-azul-noite text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isPending ? "Publicando..." : "Publicar"}
            </button>
            <button
              onClick={() => { setResponding(false); setText(""); setError(null); }}
              disabled={isPending}
              className="flex items-center gap-1.5 text-sm text-cinza-texto hover:text-azul-noite border border-gray-200 px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
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
      <div className="bg-white rounded-card shadow-card p-16 flex flex-col items-center gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
          <Star className="w-7 h-7 text-amber-300" />
        </div>
        <p className="text-sm font-semibold text-azul-noite">Nenhuma avaliação ainda</p>
        <p className="text-xs text-cinza-texto max-w-xs leading-relaxed">
          Quando clientes avaliarem seus serviços, as avaliações aparecerão aqui.
        </p>
      </div>
    );
  }

  const avg = evaluations.reduce((acc, e) => acc + e.rating, 0) / evaluations.length;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: evaluations.filter((e) => e.rating === star).length,
    pct: Math.round((evaluations.filter((e) => e.rating === star).length / evaluations.length) * 100),
  }));

  return (
    <div className="space-y-4">
      {/* Stats hero */}
      <div className="bg-white rounded-card shadow-card p-5">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Average score */}
          <div className="text-center">
            <p className="text-5xl font-bold text-azul-noite leading-none">{avg.toFixed(1)}</p>
            <StarDisplay rating={Math.round(avg)} size="md" />
            <p className="text-xs text-cinza-texto mt-1">
              {evaluations.length} {evaluations.length === 1 ? "avaliação" : "avaliações"}
            </p>
          </div>

          {/* Divider */}
          <div className="w-px h-16 bg-gray-100 hidden sm:block" />

          {/* Distribution bars */}
          <div className="flex-1 min-w-48 space-y-1.5">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="text-cinza-texto w-4 text-right font-medium">{star}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-cinza-texto w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista */}
      {evaluations.map((ev) => (
        <EvaluationCard key={ev.id} evaluation={ev} />
      ))}
    </div>
  );
}
