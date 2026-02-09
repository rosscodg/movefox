import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const redirectTo = searchParams.get('redirect');

  // Helper to determine the final redirect path based on user role
  async function getRedirectPath(
    supabase: Awaited<ReturnType<typeof createClient>>
  ): Promise<string> {
    // If a specific redirect was requested, honour it
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
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const path = await getRedirectPath(supabase);
      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  // Handle magic link / OTP token hash verification
  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'magiclink' | 'email',
    });

    if (!error) {
      const path = await getRedirectPath(supabase);
      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_error`
  );
}
