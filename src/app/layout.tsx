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

// URL Base unificada do projeto
const mainUrl = process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br";

export const metadata: Metadata = {
  title: {
    default: "Prumo | Encontre Profissionais para Obras, Reformas e Serviços",
    template: "%s | Prumo",
  },
  description:
    "Marketplace de profissionais — do encanador ao arquiteto. Encontre o profissional certo para seu trabalho de obra ou reforma de forma rápida e segura.",
  authors: [{ name: "Prumo" }],
  metadataBase: new URL(mainUrl),
  alternates: {
    canonical: "/",
  },
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
  // Objeto JSON-LD para busca e reconhecimento semântico avançado em formato de Grafo de Entidades
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${mainUrl}/#website`,
        "url": mainUrl,
        "name": "Prumo",
        "description": metadata.description,
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${mainUrl}/busca?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": `${mainUrl}/#organization`,
        "name": "Prumo",
        "url": mainUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${mainUrl}/og-image.png`
        },
        "sameAs": [
          "https://www.instagram.com/meuprumo"
        ]
      }
    ]
  };

  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", bricolage.variable, barlow.variable, "font-sans")}>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <TooltipProvider>{children}</TooltipProvider>
        {/* Injeção de Dados Estruturados Schema.org globais */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
