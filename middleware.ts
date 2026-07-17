/**
 * Next.js Middleware
 * Protects routes based on authentication & role
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '@/lib/auth/jwt';

// Public routes that don't require auth
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/about',
  '/contact',
];

// Teacher-only routes
const teacherRoutes = ['/teacher'];

// Admin-only routes
const adminRoutes = ['/admin'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookies
  const authHeader = req.headers.get('authorization');
  const token = getTokenFromHeader(authHeader) || req.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    // Redirect to login if token is invalid
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Check role-based access
  if (teacherRoutes.some(route => pathname.startsWith(route))) {
    if (payload.role !== 'teacher' && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Allow request
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
