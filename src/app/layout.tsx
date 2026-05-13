import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prumo — Marketplace de Profissionais",
    template: "%s | Prumo",
  },
  description:
    "Marketplace de profissionais — do encanador ao arquiteto. Encontre o profissional certo para seu trabalho.",
  keywords: ["pedreiro", "eletricista", "encanador", "reforma", "construção", "obra", "profissional"],
  authors: [{ name: "Prumo" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_MAIN_URL ?? "https://prumo-five.vercel.app"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Prumo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prumo - marketplace de profissionais para obras e serviços",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
