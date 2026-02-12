import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    // ── Parse request body ──────────────────────────────────────────
    let email: string;
    let password: string;

    try {
      const reqBody = await request.json();
      email = reqBody.email;
      password = reqBody.password;
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // ── Call Supabase REST API directly ─────────────────────────────
    const authRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const authBody = await authRes.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(authBody);
    } catch {
      console.error('[api/auth/login] Failed to parse auth response:', authBody);
      return NextResponse.json(
        { error: 'Authentication service error. Please try again.' },
        { status: 500 }
      );
    }

    if (!authRes.ok) {
      const msg =
        (data as { msg?: string }).msg ||
        (data as { error_description?: string }).error_description ||
        'Invalid login credentials';
      return NextResponse.json({ error: msg }, { status: authRes.status });
    }

    // ── Build response and set session cookies ──────────────────────
    const response = NextResponse.json({ success: true });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // setSession persists tokens into cookies via the setAll callback
    await supabase.auth.setSession({
      access_token: data.access_token as string,
      refresh_token: data.refresh_token as string,
    });

    // ── Determine redirect based on role ────────────────────────────
    const userId = (data.user as { id?: string })?.id;
    let redirectTo = '/portal';

    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profile?.role === 'admin') {
        redirectTo = '/admin';
      }
    }

    return NextResponse.json({ success: true, redirectTo }, {
      status: 200,
      headers: response.headers,
    });
  } catch (err) {
    console.error('[api/auth/login] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
