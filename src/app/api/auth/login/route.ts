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

    // ── Verify env vars are set ─────────────────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[api/auth/login] Missing env vars:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
      });
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // ── Call Supabase REST API directly ─────────────────────────────
    let authRes: Response;
    try {
      authRes = await fetch(
        `${supabaseUrl}/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
          },
          body: JSON.stringify({ email, password }),
        }
      );
    } catch (fetchErr) {
      console.error('[api/auth/login] Fetch to Supabase failed:', fetchErr);
      return NextResponse.json(
        { error: 'Unable to reach authentication service. Please try again.' },
        { status: 502 }
      );
    }

    const authBody = await authRes.text();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(authBody);
    } catch {
      console.error('[api/auth/login] Failed to parse auth response. Status:', authRes.status, 'Body:', authBody.substring(0, 500));
      return NextResponse.json(
        {
          error: 'Authentication service error. Please try again.',
          _debug: {
            status: authRes.status,
            bodyPreview: authBody.substring(0, 200),
            url: supabaseUrl?.substring(0, 30) + '...',
          },
        },
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
      supabaseUrl,
      supabaseKey,
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
      {
        error: 'An unexpected error occurred. Please try again.',
        _debug: { message: String(err) },
      },
      { status: 500 }
    );
  }
}
