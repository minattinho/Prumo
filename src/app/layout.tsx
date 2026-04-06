import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Meu Prumo",
    template: "%s | Prumo",
  },
  description:
    "Marketplace de profissionais — do encanador ao arquiteto. Encontre o profissional certo para seu trabalho.",
  keywords: ["pedreiro", "eletricista", "encanador", "reforma", "construção", "obra", "profissional"],
  authors: [{ name: "Prumo" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Prumo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
