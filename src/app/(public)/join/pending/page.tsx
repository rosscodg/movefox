import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Mail, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Application Submitted',
  description: 'Your partner application is being reviewed.',
};

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-lg">
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

        <Card variant="elevated" className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </div>

          <Badge variant="info" className="mb-4">Application Submitted</Badge>

          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Thank you for applying.
          </h1>

          <p className="text-text-secondary leading-relaxed mb-6">
            Your partner application has been submitted successfully. Our team
            will review your company details and verify your information. You
            will receive an email notification once your account has been
            approved.
          </p>

          <div className="bg-surface-alt rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-left">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  What happens next?
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  We typically review applications within 1-2 business days.
                  Once approved, you can log in and start receiving move
                  requests in your area.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login">
              <Button variant="primary" className="gap-2 w-full sm:w-auto">
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to Homepage
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
