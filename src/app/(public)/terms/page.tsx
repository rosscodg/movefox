import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'MoveFox terms of service. Read our terms and conditions for using the MoveFox platform.',
};

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <FileText className="w-3 h-3 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Terms of Service
            </h1>
            <p className="mt-6 text-text-secondary">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              By accessing or using the MoveFox website and services
              (&quot;Service&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, you must not use
              our Service.
            </p>
            <p className="text-text-secondary leading-relaxed">
              MoveFox reserves the right to update or modify these Terms at
              any time. Continued use of the Service after any changes
              constitutes your acceptance of the revised Terms.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              2. Description of Service
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              MoveFox is a free online comparison platform that connects
              homeowners and individuals planning a move (&quot;Users&quot;) with
              verified removal companies (&quot;Partners&quot;). We facilitate the
              process of obtaining quotes but do not ourselves provide removal
              services.
            </p>
            <p className="text-text-secondary leading-relaxed">
              We act as an intermediary and are not a party to any contract
              between Users and Partners. Any agreement for removal services is
              made directly between the User and the Partner they choose.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              3. User Responsibilities
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              When using our Service, you agree to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Provide accurate and truthful information about your move
                  requirements
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Not submit false, misleading, or fraudulent requests
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Not use the Service for any unlawful purpose or in violation
                  of any applicable laws
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Not attempt to interfere with the proper functioning of the
                  Service
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Communicate respectfully with removal companies and our
                  support team
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              4. Partner Responsibilities
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Removal companies using our platform as Partners agree to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Maintain valid insurance, licences, and accreditations as
                  required
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Provide accurate and competitive quotes in good faith</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Respond to quote requests in a timely manner
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Deliver services as quoted and agreed with the User
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Handle User data in accordance with UK GDPR and our data
                  sharing agreements
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              5. Quotes and Pricing
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Quotes provided through MoveFox are estimates provided by the
              removal companies themselves. MoveFox does not set, control,
              or guarantee the pricing of any removal services.
            </p>
            <p className="text-text-secondary leading-relaxed">
              Final pricing may vary from the initial quote based on factors
              such as the actual volume of goods, access difficulties, or
              additional services requested. Any changes to pricing are a matter
              between the User and the Partner.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              MoveFox acts solely as an intermediary platform. We do not
              provide removal services and are not liable for:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  The quality, safety, or legality of services provided by
                  Partners
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Any loss, damage, or injury arising from the removal services
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Disputes between Users and Partners
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  The accuracy of quotes or information provided by Partners
                </span>
              </li>
            </ul>
            <p className="mt-4 text-text-secondary leading-relaxed">
              To the maximum extent permitted by law, MoveFox&apos;s total
              liability for any claims arising from or related to the Service
              shall not exceed the amount paid by you (if any) to use the
              Service.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-text-secondary leading-relaxed">
              All content, trademarks, logos, and intellectual property
              displayed on the MoveFox website are the property of
              MoveFox or their respective owners. You may not reproduce,
              distribute, or create derivative works from any content on our
              website without our prior written consent.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              8. Termination
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We reserve the right to suspend or terminate your access to the
              Service at any time and for any reason, including breach of these
              Terms. Upon termination, your right to use the Service will
              immediately cease. Any provisions of these Terms that by their
              nature should survive termination will continue to apply.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              9. Governing Law
            </h2>
            <p className="text-text-secondary leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of England and Wales. Any disputes arising from or
              relating to these Terms or the Service shall be subject to the
              exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              10. Contact Us
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="mt-4 p-4 bg-surface-alt rounded-xl">
              <p className="text-sm text-text-primary font-medium">
                MoveFox Legal
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Email:{' '}
                <a
                  href="mailto:legal@movefox.co.uk"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  legal@movefox.co.uk
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
