import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_MAIN_URL ?? "https://meuprumo.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/painel/", "/minha-conta/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
