export function getCookieDomain(): string | undefined {
  if (process.env.NEXT_PUBLIC_COOKIE_DOMAIN) {
    return process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  }
  const mainUrl = process.env.NEXT_PUBLIC_MAIN_URL;
  if (mainUrl) {
    try {
      const url = new URL(mainUrl);
      // For localhost or IP addresses, we shouldn't use a wildcard domain
      if (
        url.hostname.includes("localhost") ||
        url.hostname.includes("127.0.0.1")
      ) {
        return undefined;
      }
      return `.${url.hostname}`;
    } catch {
      return undefined;
    }
  }
  return undefined;
}
