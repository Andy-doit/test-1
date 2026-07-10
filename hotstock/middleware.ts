import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Verify JWT structure and expiry without full cryptographic signature.
 * Signature is verified by the backend on every authenticated request.
 * Middleware uses this for fast unauthenticated access control decisions.
 */
function verifyJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payloadB64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payloadJson = atob(payloadB64);
    const parsed = JSON.parse(payloadJson);

    if (parsed.exp && Date.now() >= parsed.exp * 1000) {
      return null;
    }

    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = verifyJwtPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = payload.role ?? payload.roles;
    const roleStr = Array.isArray(userRole)
      ? userRole.map((r: unknown) => String(r).toUpperCase())
      : typeof userRole === "string"
        ? [userRole.toUpperCase()]
        : [];

    const isAdmin = roleStr.includes("ADMIN");
    const isEditor = roleStr.includes("EDITOR");

    if (!isAdmin && !isEditor) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isEditor && !isAdmin && !pathname.startsWith("/admin/articles")) {
      return NextResponse.redirect(new URL("/admin/articles", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
