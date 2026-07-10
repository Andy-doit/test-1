/**
 * Cookie management utilities.
 * Production-grade security attributes on auth tokens.
 */

/**
 * Sets auth_token and refresh_token in browser cookies.
 * Uses SameSite=Strict for maximum CSRF protection.
 * Tokens remain accessible to JS (required for the token refresh interceptor).
 */
export function setAuthCookies(accessToken: string, refreshToken: string): void {
  if (typeof document === "undefined") return;

  const isHttps = window.location.protocol === "https:";
  // PROD: tokens should ideally be httpOnly cookies set by the backend.
  // For now, we maximize cookie security attributes.
  const secureFlag = isHttps ? "; Secure" : "";
  const sameSite = "; SameSite=Strict";
  const maxAge = 60 * 60 * 24 * 7; // 7 days (reduced from 30)

  document.cookie = `auth_token=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}${sameSite}${secureFlag}`;
  document.cookie = `refresh_token=${encodeURIComponent(refreshToken)}; path=/; max-age=${maxAge}${sameSite}${secureFlag}`;
}

/**
 * Clears all authentication-related cookies across all possible domains.
 */
export function clearAuthCookies(): void {
  if (typeof document === "undefined") return;

  const isHttps = window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  const keys = ["auth_token", "refresh_token", "sidebar_state"];

  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // Clear from: empty domain (default), exact hostname, root domain
  const domains = ["" as string, hostname];
  if (parts.length >= 2) {
    domains.push("." + parts.slice(-2).join("."));
    domains.push("." + hostname);
  }

  keys.forEach((key) => {
    domains.forEach((domain) => {
      const domainAttr = domain ? `; domain=${domain}` : "";
      // Clear with SameSite=Strict
      document.cookie = `${key}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict${secureFlag}${domainAttr}`;
      // Fallback: SameSite=lax
      document.cookie = `${key}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax${secureFlag}${domainAttr}`;
      // Basic fallback
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${domainAttr}`;
    });
  });
}

/**
 * Reads a cookie value by name on the client side.
 */
export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
