"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_MAIN_URL ?? "https://prumo-five.vercel.app";

export function CanonicalLink() {
  const pathname = usePathname();

  useEffect(() => {
    const canonical = new URL(pathname || "/", SITE_URL).toString();
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }

    link.href = canonical;
  }, [pathname]);

  return null;
}
