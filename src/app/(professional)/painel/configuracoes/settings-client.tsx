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

        <p className="text-sm text-cinza-texto">
          Para alterar sua senha, enviaremos um link de redefinição para{" "}
          <span className="font-medium text-azul-noite">{email}</span>.
        </p>

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
