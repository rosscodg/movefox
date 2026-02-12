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

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  // Show error from callback redirect (e.g. /login?error=auth_failed)
  const urlError = searchParams.get('error');
  const initialError = urlError === 'auth_failed'
    ? 'Sign-in link has expired or already been used. Please request a new one.'
    : urlError === 'missing_code'
      ? 'Invalid sign-in link. Please request a new one.'
      : null;

  const [mode, setMode] = useState<AuthMode>(urlError ? 'magic' : 'password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [magicSent, setMagicSent] = useState(false);

  // ------------------------------------------------------------------
  // Handlers
  // ------------------------------------------------------------------

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('[login] Response status:', res.status, 'type:', res.type, 'ok:', res.ok);
      console.log('[login] Response headers:', Object.fromEntries(res.headers.entries()));

      // Read body as text first so we can debug empty responses
      const text = await res.text();
      console.log('[login] Response body length:', text.length, 'body:', text.substring(0, 500));

      if (!text) {
        setError('Server returned an empty response. Please try again.');
        setLoading(false);
        return;
      }

      let result: Record<string, unknown>;
      try {
        result = JSON.parse(text);
      } catch (parseErr) {
        console.error('[login] JSON parse error:', parseErr, 'raw text:', text);
        setError('Unexpected response from server. Please try again.');
        setLoading(false);
        return;
      }

      if (!res.ok || result.error) {
        setError((result.error as string) || 'Invalid login credentials');
        setLoading(false);
        return;
      }

      // Honour redirect param from middleware, otherwise use role-based redirect
      router.push(redirectTo ?? (result.redirectTo as string) ?? '/portal');
    } catch (err) {
      console.error('[login] Password sign-in failed:', err);
      setError(
        'Unable to connect to the authentication service. Please check your connection and try again.'
      );
      setLoading(false);
    }
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Magic link must be sent from the browser client so the PKCE
      // code verifier is stored in localStorage for the callback.
      const supabase = createClient();

      const callbackUrl = new URL('/api/auth/callback', window.location.origin);
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
    } catch (err) {
      console.error('[login] Magic link request failed:', err);
      setError(
        'Unable to connect to the authentication service. Please check your connection and try again.'
      );
      setLoading(false);
    }
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
