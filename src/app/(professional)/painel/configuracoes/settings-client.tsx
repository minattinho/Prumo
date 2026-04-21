"use client";

import { useState, useTransition } from "react";
import { User, Lock, CheckCircle2, AlertCircle, Mail, Phone, Send } from "lucide-react";
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
    <div className="space-y-5">

      {/* Dados pessoais */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {/* Section header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-azul-claro flex items-center justify-center">
            <User className="w-4 h-4 text-azul-principal" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-azul-noite">Dados pessoais</h2>
            <p className="text-xs text-cinza-texto">Atualize seu nome e telefone de contato</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-azul-noite" htmlFor="full_name">
              <User className="w-3.5 h-3.5 text-cinza-texto" />
              Nome completo
            </label>
            <input
              id="full_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-azul-noite" htmlFor="phone">
              <Phone className="w-3.5 h-3.5 text-cinza-texto" />
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              value={phoneVal}
              onChange={(e) => setPhoneVal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-azul-principal/20 focus:border-azul-principal transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-cinza-texto">
              <Mail className="w-3.5 h-3.5" />
              E-mail
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-gray-100 rounded-lg px-3.5 py-2.5 text-sm bg-gray-50 text-cinza-texto cursor-not-allowed"
            />
            <p className="text-xs text-cinza-texto">O e-mail não pode ser alterado por aqui.</p>
          </div>

          {saveMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3.5 py-2.5 ${
              saveMsg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {saveMsg.type === "success"
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />
              }
              {saveMsg.text}
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-azul-principal hover:bg-azul-noite text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {/* Section header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-azul-noite">Segurança</h2>
            <p className="text-xs text-cinza-texto">Gerencie o acesso à sua conta</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-azul-noite mb-1">Redefinir senha</p>
            <p className="text-sm text-cinza-texto leading-relaxed">
              Enviaremos um link de redefinição para{" "}
              <span className="font-semibold text-azul-noite">{email}</span>.
            </p>
          </div>

          {resetMsg && (
            <div className={`flex items-center gap-2 text-sm rounded-lg px-3.5 py-2.5 ${
              resetMsg.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {resetMsg.type === "success"
                ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />
              }
              {resetMsg.text}
            </div>
          )}

          <button
            onClick={handlePasswordReset}
            disabled={isResetting}
            className="flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-azul-noite text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isResetting ? (
              <>
                <span className="w-4 h-4 border-2 border-azul-noite/30 border-t-azul-noite rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar link de redefinição
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
