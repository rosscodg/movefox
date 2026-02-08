import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ─── GET /api/auth/callback ──────────────────────────────────────────────────
//
// Handles OAuth and magic link redirects from Supabase Auth.
// Exchanges the auth code for a session, then redirects the user
// to the appropriate page based on their role.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? searchParams.get('redirect');

  if (!code) {
    // No code provided - redirect to login with error
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'missing_code');
    return NextResponse.redirect(url);
  }

  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Exchange code for session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[auth/callback] Failed to exchange code for session:', error);
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('error', 'auth_failed');
    return NextResponse.redirect(url);
  }

  // If a specific redirect path was provided, use it
  if (next) {
    const redirectUrl = new URL(next, origin);
    const response = NextResponse.redirect(redirectUrl);
    // Copy session cookies to the redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    });
    return response;
  }

  // Determine redirect based on user role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let redirectPath = '/portal';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role === 'admin') {
      redirectPath = '/admin';
    }
  }

  const redirectUrl = new URL(redirectPath, origin);
  const response = NextResponse.redirect(redirectUrl);

  // Copy session cookies to the redirect response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

  return response;
}
