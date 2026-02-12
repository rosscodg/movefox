'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

type AuthResult = {
  error?: string;
  redirectTo?: string;
};

export async function loginWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  // Call Supabase auth REST API directly to avoid client JSON parsing bugs
  const res = await fetch(
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

  const body = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(body);
  } catch {
    console.error('[login] Failed to parse auth response:', body);
    return { error: 'Authentication service error. Please try again.' };
  }

  if (!res.ok) {
    const msg =
      (data as { msg?: string }).msg ||
      (data as { error_description?: string }).error_description ||
      'Invalid login credentials';
    return { error: msg };
  }

  // We have a valid session — set cookies so middleware recognises the user
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );

  // Setting the session persists the tokens into cookies
  await supabase.auth.setSession({
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string,
  });

  // Determine redirect based on role
  const userId = (data.user as { id?: string })?.id;
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (profile?.role === 'admin') {
      return { redirectTo: '/admin' };
    }
  }

  return { redirectTo: '/portal' };
}

export async function loginWithMagicLink(
  email: string,
  callbackUrl: string
): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
