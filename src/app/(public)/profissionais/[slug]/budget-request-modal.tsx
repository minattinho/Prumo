"use client";

import { useState, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MessageSquare, Send, X, CheckCircle2 } from "lucide-react";
import { createBudgetRequest } from "./actions";
import { toast } from "sonner";

type Props = {
  professionalId: string;
  professionalName: string;
};

export function BudgetRequestModal({ professionalId, professionalName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    startTransition(async () => {
      const res = await createBudgetRequest({
        professional_id: professionalId,
        message: message.trim(),
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Solicitação de orçamento enviada com sucesso!");
        setSuccess(true);
      }
    });
  }

  function handleClose() {
    setIsOpen(false);
    // Pequeno timeout para resetar estados pós-animação de fechamento
    setTimeout(() => {
      setMessage("");
      setSuccess(false);
    }, 200);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}>
      {/* Botão de Trigger Principal (Ação de Conversão Laranja) */}
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 bg-laranja-obra hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-laranja-obra/20 cursor-pointer group mb-3"
        >
          <MessageSquare className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
          Solicitar Orçamento Grátis
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          onInteractOutside={(e) => isPending && e.preventDefault()}
          onEscapeKeyDown={(e) => isPending && e.preventDefault()}
        >
          <div className="h-1.5 w-full bg-linear-to-r from-laranja-obra to-orange-500" />
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-lg font-bold text-azul-noite">
                Solicitar Orçamento
              </Dialog.Title>
              <Dialog.Close className="text-cinza-texto hover:text-azul-noite transition-colors cursor-pointer" disabled={isPending}>
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {success ? (
              <div className="flex flex-col items-center text-center py-6 gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-azul-noite text-base">Solicitação Enviada!</h3>
                  <p className="text-sm text-cinza-texto mt-1.5 leading-relaxed">
                    Sua mensagem foi enviada para <strong>{professionalName}</strong>. Ele(a) irá analisar os detalhes e responderá com uma proposta em breve.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full mt-2 bg-azul-principal hover:bg-azul-noite text-white font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <p className="text-xs text-cinza-texto leading-relaxed mb-3">
                    Você está solicitando um orçamento para <strong>{professionalName}</strong>. Descreva o serviço de forma clara para receber uma proposta precisa.
                  </p>
                  
                  <label htmlFor="budget-message" className="block text-xs font-semibold uppercase tracking-wider text-azul-noite mb-1.5">
                    Detalhes do Serviço
                  </label>
                  <textarea
                    id="budget-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ex: Preciso da reforma de um banheiro de 4m². Troca de revestimento cerâmico, substituição de pia e vaso sanitário, e nova pintura de teto. Tenho preferência para início em duas semanas."
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal resize-none bg-gray-50/50 hover:bg-white focus:bg-white placeholder-gray-400 leading-relaxed transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Dialog.Close asChild disabled={isPending}>
                    <button
                      type="button"
                      className="flex-1 border border-gray-200 hover:bg-gray-50 text-azul-noite text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    type="submit"
                    disabled={isPending || !message.trim()}
                    className="flex-1 bg-azul-principal hover:bg-azul-noite disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    {isPending ? "Enviando..." : "Enviar Pedido"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
