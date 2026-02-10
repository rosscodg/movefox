import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Intercept auth codes/tokens that land on the root URL
  // (Supabase PKCE flow sends ?code= to the Site URL configured in the dashboard)
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === '/') {
    const code = searchParams.get('code');
    const tokenHash = searchParams.get('token_hash');

    if (code || tokenHash) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/callback';
      // Preserve all search params (code, token_hash, type, redirect, etc.)
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: ['/', '/portal/:path*', '/admin/:path*'],
};
