import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const redirectTo = searchParams.get('redirect');

  // Create a Supabase client that can read/write cookies on the response
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

  // Helper: copy session cookies from supabaseResponse onto a redirect response
  function createRedirect(path: string): NextResponse {
    const response = NextResponse.redirect(new URL(path, origin));
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

  // Helper: determine the final redirect path based on user role
  async function getRedirectPath(): Promise<string> {
    if (redirectTo) return redirectTo;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profile?.role === 'admin') return '/admin';
    }

    return '/portal';
  }

  // Handle PKCE flow (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const path = await getRedirectPath();
      return createRedirect(path);
    }

    console.error('[auth/callback] Code exchange failed:', error.message);
  }

  // Handle magic link / OTP token hash verification
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'magiclink' | 'email',
    });

    if (!error) {
      const path = await getRedirectPath();
      return createRedirect(path);
    }

    console.error('[auth/callback] OTP verification failed:', error.message);
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(
    new URL('/login?error=auth_callback_error', origin)
  );
}
