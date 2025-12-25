import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Supported locales
 */
export const locales = ["en", "tr"] as const;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];

/**
 * Middleware for i18n routing
 * Handles locale detection and redirection
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, Next.js internals, and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico|json|xml|txt)$/i)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // If pathname already has a locale, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Get locale from Accept-Language header or default to 'en'
  const locale = getLocale(request) || defaultLocale;

  // Redirect to locale-prefixed path
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

/**
 * Get locale from request headers
 */
function getLocale(request: NextRequest): Locale | null {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) {
    return null;
  }

  // Check for Turkish language preference
  if (acceptLanguage.includes("tr")) {
    return "tr";
  }

  // Default to English
  return "en";
}

export const config = {
  // Match all pathnames - exclusions are handled in the middleware function
  matcher: [
    /*
     * Match all request paths.
     * Exclusions (api, _next, static files) are handled in the middleware function above.
     * Using a simple catch-all pattern that Next.js can parse without issues.
     */
    "/:path*",
  ],
};
