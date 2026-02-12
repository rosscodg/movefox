'use server';

import { createClient } from '@/lib/supabase/server';

type AuthResult = {
  error?: string;
  redirectTo?: string;
};

export async function loginWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Determine redirect based on role
  const userId = data.user?.id;
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
  const supabase = await createClient();

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
