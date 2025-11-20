import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if accessing auth pages with token
  if (isPublicPath && token && pathname !== '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
