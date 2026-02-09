'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

type AuthMode = 'password' | 'magic';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_callback_error: 'Sign-in failed. Please try again.',
  auth_failed: 'Authentication failed. Please try again.',
  missing_code: 'Invalid sign-in link. Please request a new one.',
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const redirectTo = searchParams.get('redirect');
  const urlError = searchParams.get('error');

  const [mode, setMode] = useState<AuthMode>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError
      ? (AUTH_ERROR_MESSAGES[urlError] ?? 'An error occurred. Please try again.')
      : null
  );
  const [magicSent, setMagicSent] = useState(false);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Determine redirect based on user role (or use redirect param)
    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (profile?.role === 'admin') {
        router.push(redirectTo ?? '/admin');
      } else {
        router.push(redirectTo ?? '/portal');
      }
    } else {
      router.push(redirectTo ?? '/portal');
    }
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (redirectTo) {
      callbackUrl.searchParams.set('redirect', redirectTo);
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl.toString(),
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setMagicSent(true);
    setLoading(false);
  }

  // ------------------------------------------------------------------
  // Magic link sent confirmation
  // ------------------------------------------------------------------

  if (magicSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
        <Card variant="elevated" className="w-full max-w-md p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail size={28} className="text-primary" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-text-primary mb-2">
            Check your email
          </h1>
          <p className="text-sm text-text-secondary mb-6 leading-relaxed">
            We&apos;ve sent a magic link to{' '}
            <span className="font-medium text-text-primary">{email}</span>.
            Click the link in the email to sign in.
          </p>

          <Button
            variant="ghost"
            onClick={() => {
              setMagicSent(false);
              setEmail('');
            }}
            className="gap-2"
          >
            Use a different email
          </Button>
        </Card>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Main login form
  // ------------------------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-base">M</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              Move<span className="text-primary">Fox</span>
            </span>
          </Link>
        </div>

        <Card variant="elevated" className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary">
              Sign in to your partner portal
            </p>
          </div>

          {/* Auth mode tabs */}
          <div className="flex bg-surface-alt rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('password');
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === 'password'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <LogIn size={16} />
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('magic');
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === 'magic'
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <Sparkles size={16} />
              Magic Link
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}
            noValidate
          >
            <div className="space-y-4">
              <Input
                id="email"
                label="Email address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                autoComplete="email"
                required
              />

              {mode === 'password' && (
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="current-password"
                  required
                />
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full mt-6 gap-2"
            >
              {loading
                ? 'Signing in...'
                : mode === 'password'
                  ? 'Sign in'
                  : 'Send magic link'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        </Card>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-text-muted">
            Are you a removal company?{' '}
            <Link
              href="/join"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              Become a partner
            </Link>
          </p>
          <p className="text-sm text-text-muted">
            <Link
              href="/"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
