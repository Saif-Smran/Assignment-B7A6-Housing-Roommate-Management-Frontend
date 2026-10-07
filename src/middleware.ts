import { type NextRequest, NextResponse } from "next/server";

function decodeJwtRole(token?: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const parsed = JSON.parse(jsonPayload);
    return parsed.role || parsed.user?.role || null;
  } catch {
    return null;
  }
}

function getRoleDashboardPath(role?: string | null): string {
  switch (role?.toUpperCase()) {
    case "ADMIN":
      return "/dashboard/admin";
    case "OWNER":
      return "/dashboard/owner";
    case "TENANT":
      return "/dashboard/tenant";
    default:
      return "/dashboard/tenant";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value ||
    request.cookies.get("authToken")?.value;

  const cookieRole = request.cookies.get("role")?.value;
  const role = cookieRole || decodeJwtRole(token);
  const isAuthenticated = Boolean(token && token.trim() !== "");

  // Public auth pages: redirect already authenticated users to their dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      const destination = getRoleDashboardPath(role);
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // Dashboard routes protection
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Direct /dashboard hit: redirect to specific role dashboard
    if (pathname === "/dashboard" || pathname === "/dashboard/") {
      const destination = getRoleDashboardPath(role);
      return NextResponse.redirect(new URL(destination, request.url));
    }

    const normalizedRole = role?.toUpperCase();

    // Role-specific route boundaries
    if (pathname.startsWith("/dashboard/admin") && normalizedRole !== "ADMIN") {
      const destination = getRoleDashboardPath(role);
      return NextResponse.redirect(new URL(destination, request.url));
    }

    if (pathname.startsWith("/dashboard/owner") && normalizedRole !== "OWNER") {
      const destination = getRoleDashboardPath(role);
      return NextResponse.redirect(new URL(destination, request.url));
    }

    if (
      pathname.startsWith("/dashboard/tenant") &&
      normalizedRole !== "TENANT"
    ) {
      const destination = getRoleDashboardPath(role);
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
