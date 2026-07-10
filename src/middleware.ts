import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "nexus-orbit-fallback-secret"
);

const COOKIE_NAME = "nexus_token";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const ADMIN_PREFIXES = ["/admin"];
const AUTH_PAGES = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const needsAuth = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const needsAdmin = ADMIN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  const token = request.cookies.get(COOKIE_NAME)?.value;

  let payload: { userId?: string; role?: string } | null = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, JWT_SECRET);
      payload = p as { userId?: string; role?: string };
    } catch {
      payload = null;
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Block unauthenticated access to protected routes
  if (needsAuth && !payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Block non-admin access to admin routes
  if (needsAdmin && payload?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo.png|logos|images|fonts).*)",
  ],
};
