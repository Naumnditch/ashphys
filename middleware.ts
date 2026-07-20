/**
 * Next.js Middleware
 * Protects authenticated routes (dashboard, teacher panel)
 * Note: JWT verification happens in API routes (Node runtime).
 * Middleware only checks token presence (Edge-compatible).
 */

import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect these route prefixes
  const protectedPrefixes = ['/teacher', '/admin'];

  const needsAuth = protectedPrefixes.some((route) => pathname.startsWith(route));

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/teacher/:path*', '/admin/:path*'],
};
