import type { Metadata } from "next";
import { Barlow, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Prumo",
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
    <html lang="pt-BR" className={cn("h-full", "antialiased", bricolage.variable, barlow.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
