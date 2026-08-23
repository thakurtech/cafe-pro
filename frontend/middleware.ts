import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * DOMAIN ROUTING MIDDLEWARE
 *
 * Controls how the customer storefront is accessed:
 *
 * MODE: path (default - for local development)
 *   localhost:3000/shop/mukulscafe   → works as-is
 *
 * MODE: subdomain (for production with a custom domain)
 *   mukulscafe.yourdomain.com        → internally rewrites to /shop/mukulscafe
 *
 * TO SWITCH: change NEXT_PUBLIC_STOREFRONT_MODE in .env
 *   NEXT_PUBLIC_STOREFRONT_MODE=path      (local dev)
 *   NEXT_PUBLIC_STOREFRONT_MODE=subdomain (production)
 *   NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
 *
 * ZERO code changes needed to switch — just the env var.
 */

const STOREFRONT_MODE = process.env.NEXT_PUBLIC_STOREFRONT_MODE || 'path';
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Only apply subdomain logic when in subdomain mode
  if (STOREFRONT_MODE === 'subdomain') {
    // Strip port if present
    const hostWithoutPort = hostname.split(':')[0];
    const rootWithoutPort = ROOT_DOMAIN.split(':')[0];

    // Check if this is a subdomain request (not www, not root domain itself)
    const isSubdomain =
      hostWithoutPort !== rootWithoutPort &&
      hostWithoutPort !== `www.${rootWithoutPort}` &&
      hostWithoutPort.endsWith(`.${rootWithoutPort}`);

    if (isSubdomain) {
      // Extract the subdomain (cafe slug)
      const slug = hostWithoutPort.replace(`.${rootWithoutPort}`, '');

      // Rewrite to /shop/[slug] internally
      // The user sees mukulscafe.yourdomain.com, browser stays there
      // But Next.js serves /shop/mukulscafe
      const rewriteUrl = new URL(
        `/shop/${slug}${pathname}${search}`,
        request.url
      );

      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // In path mode (local dev), no rewriting needed — /shop/[slug] works natively
  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except:
  // - Next.js internals (_next/static, _next/image)
  // - favicon, manifest, robots
  // - API routes (those go to NestJS backend)
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt).*)',
  ],
};
