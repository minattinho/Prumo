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

      {/* Botão para abrir formulário */}
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

      {/* Formulário de resposta */}
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
