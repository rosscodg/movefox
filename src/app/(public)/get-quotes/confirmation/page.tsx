import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Clock, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Quote Request Submitted',
  description:
    'Your removal quote request has been submitted successfully. You will be contacted by up to 5 removal companies shortly.',
};

export default function ConfirmationPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <Card variant="elevated" className="p-8 sm:p-10 text-center">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
              <CheckCircle size={40} className="text-accent" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            Quote request submitted!
          </h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Thank you for using MoveCompare. Your details have been securely
            received and we&apos;re now matching you with trusted removal
            companies in your area.
          </p>

          {/* What happens next */}
          <div className="text-left space-y-5 mb-8">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              What happens next
            </h2>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                <Users size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Matched with up to 5 companies
                </p>
                <p className="text-sm text-text-secondary">
                  We select verified removal companies that cover your route
                  and meet your requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                <Phone size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Companies get in touch
                </p>
                <p className="text-sm text-text-secondary">
                  Matched companies will contact you directly by phone or email
                  to discuss your move and provide a tailored quote.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                <Clock size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Compare and choose
                </p>
                <p className="text-sm text-text-secondary">
                  Review the quotes you receive and pick the company that suits
                  you best. There&apos;s no obligation to accept any offer.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link href="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Back to homepage
              <ArrowRight size={16} />
            </Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}
