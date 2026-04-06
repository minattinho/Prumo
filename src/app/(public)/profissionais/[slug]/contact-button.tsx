"use client";

import { MessageCircle, Phone, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ICONS = {
  WHATSAPP: MessageCircle,
  PHONE: Phone,
  EMAIL: Mail,
};

interface ContactButtonProps {
  type: "WHATSAPP" | "PHONE" | "EMAIL";
  link: string;
  label: string;
  primary: boolean;
}

export function ContactButton({ type, link, label, primary }: ContactButtonProps) {
  const Icon = ICONS[type];
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      e.preventDefault();
      router.push(`/entrar?next=${encodeURIComponent(window.location.pathname)}`);
    }
    // se logado, o <a> segue normalmente
  }

  if (primary) {
    return (
      <a
        href={link}
        target={type === "EMAIL" ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center justify-center gap-2 w-full bg-azul-principal hover:bg-azul-noite text-white font-medium rounded-lg py-3 text-sm transition-colors"
      >
        <Icon size={16} />
        {label}
      </a>
    );
  }

  return (
    <a
      href={link}
      target={type === "EMAIL" ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={handleClick}
      className="flex items-center gap-2 w-full border border-gray-200 hover:border-azul-principal hover:bg-azul-claro text-azul-noite font-medium rounded-lg py-2.5 px-3 text-sm transition-colors"
    >
      <Icon size={15} className="text-azul-medio shrink-0" />
      {label}
    </a>
  );
}
