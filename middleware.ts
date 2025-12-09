/**
 * Next.js Middleware
 * Protects admin routes and handles authentication
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected route patterns
 */
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

/**
 * Check if the path matches admin routes
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if the path is an auth route
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route);
}

/**
 * Verify JWT token (basic check - full validation happens on backend)
 */
function verifyToken(token: string): { valid: boolean; role?: string } {
  try {
    // Decode JWT payload (basic decode without verification)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false };
    }

    return { valid: true, role: payload.role };
  } catch (error) {
    return { valid: false };
  }
}

/**
 * Middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // For admin routes
  if (isAdminRoute(pathname)) {
    // Check if user has access token
    if (!accessToken) {
      console.log(
        `[Middleware] No access token - redirecting to login from ${pathname}`
      );
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token and check role
    const tokenVerification = verifyToken(accessToken);

    if (!tokenVerification.valid) {
      console.log(
        `[Middleware] Invalid token - redirecting to login from ${pathname}`
      );
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has admin role
    if (tokenVerification.role !== "admin") {
      console.log(
        `[Middleware] Non-admin user attempting to access ${pathname}`
      );
      const homeUrl = new URL("/", request.url);
      return NextResponse.redirect(homeUrl);
    }

    // User is authenticated and has admin role
    console.log(`[Middleware] Admin access granted for ${pathname}`);
  }

  // For auth routes - redirect if already logged in
  if (isAuthRoute(pathname) && accessToken) {
    const tokenVerification = verifyToken(accessToken);

    if (tokenVerification.valid) {
      console.log(
        `[Middleware] Already logged in - redirecting from ${pathname}`
      );

      // Redirect admin users to admin panel, regular users to home
      const redirectUrl = tokenVerification.role === "admin" ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // Allow request to continue
  return NextResponse.next();
}

/**
 * Middleware configuration
 * Specify which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
