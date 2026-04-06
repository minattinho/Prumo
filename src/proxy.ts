import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROFESSIONAL_ROUTES = ["/painel"];
const CONTRACTOR_ROUTES = ["/minha-conta"];

export async function proxy(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const { pathname } = request.nextUrl;

  // Dev: skip subdomain routing
  if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
    const isApp = host.startsWith("app.");

    if (isApp) {
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/painel", request.url));
      }
      const allowed = ["/painel", "/entrar", "/auth/callback", "/api"];
      if (!allowed.some((p) => pathname.startsWith(p))) {
        const mainUrl = request.nextUrl.clone();
        mainUrl.host = host.replace(/^app\./, "");
        return NextResponse.redirect(mainUrl);
      }
    } else {
      if (pathname.startsWith("/painel")) {
        const appUrl = request.nextUrl.clone();
        appUrl.host = `app.${host}`;
        return NextResponse.redirect(appUrl);
      }
    }
  }

  // Supabase session refresh
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProfessionalRoute = PROFESSIONAL_ROUTES.some((r) =>
    pathname.startsWith(r)
  );
  const isContractorRoute = CONTRACTOR_ROUTES.some((r) =>
    pathname.startsWith(r)
  );

  if ((isProfessionalRoute || isContractorRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
