import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // For protected routes, let the client-side handle authentication
  // This prevents middleware from blocking before localStorage is checked
  // The ClientInit component and ProfileGuard will handle redirects
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};
