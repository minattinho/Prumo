export const PASSWORD_RESET_PATH = "/redefinir-senha";

export function buildPasswordResetRedirectUrl(origin: string) {
  const normalizedOrigin = /^https?:\/\//.test(origin)
    ? origin
    : `https://${origin}`;
  const url = new URL("/auth/callback", normalizedOrigin);
  url.searchParams.set("next", PASSWORD_RESET_PATH);
  return url.toString();
}

export function getDefaultAuthOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_MAIN_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}
