import { redirect } from "next/navigation";

export const metadata = {
  title: "Acesso Contratante - Prumo",
};

interface Props {
  searchParams: Promise<{ modo?: string; next?: string }>;
}

export default async function ContratantePage({ searchParams }: Props) {
  const { modo, next } = await searchParams;
  
  const params = new URLSearchParams();
  // Map modes appropriately: 'cadastro' triggers register flow
  params.set("auth", modo === "cadastro" ? "cadastro" : "login");
  if (modo) {
    params.set("modo", modo);
  }
  if (next) {
    params.set("next", next);
  }

  redirect(`/?${params.toString()}`);
}
