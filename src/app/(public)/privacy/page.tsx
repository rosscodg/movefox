import type { Metadata } from 'next';
import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'MoveCompare privacy policy. Learn how we collect, use, and protect your personal data in compliance with UK GDPR.',
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <Shield className="w-3 h-3 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Privacy Policy
            </h1>
            <p className="mt-6 text-text-secondary">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-invert max-w-none space-y-8">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              1. Introduction
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              MoveCompare (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting
              your privacy and personal data. This Privacy Policy explains how
              we collect, use, store, and share your personal information when
              you use our website and services.
            </p>
            <p className="text-text-secondary leading-relaxed">
              This policy is compliant with the UK General Data Protection
              Regulation (UK GDPR) and the Data Protection Act 2018. By using
              our services, you acknowledge that you have read and understood
              this policy.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              2. Data Controller
            </h2>
            <p className="text-text-secondary leading-relaxed">
              MoveCompare is the data controller responsible for your personal
              data. If you have any questions about this policy or how we handle
              your data, please contact us at{' '}
              <a
                href="mailto:privacy@movecompare.co.uk"
                className="text-primary hover:text-primary-light transition-colors"
              >
                privacy@movecompare.co.uk
              </a>
              .
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              3. Information We Collect
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We may collect the following categories of personal data:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">Identity Data:</strong>{' '}
                  Full name, title
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">Contact Data:</strong>{' '}
                  Email address, telephone number, postal address
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">Move Data:</strong>{' '}
                  Details about your move including postcodes, property size,
                  moving dates, and special requirements
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">Technical Data:</strong>{' '}
                  IP address, browser type, device information, and usage
                  patterns
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    Communications Data:
                  </strong>{' '}
                  Messages sent through our contact form or support channels
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              4. How We Use Your Data
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We process your personal data for the following purposes and legal
              bases:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    To provide our service:
                  </strong>{' '}
                  Matching you with removal companies and facilitating the quote
                  process (legal basis: contract performance)
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    To communicate with you:
                  </strong>{' '}
                  Responding to enquiries and providing service updates (legal
                  basis: legitimate interest)
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    To improve our service:
                  </strong>{' '}
                  Analysing usage patterns and feedback (legal basis: legitimate
                  interest)
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    To comply with legal obligations:
                  </strong>{' '}
                  Meeting regulatory and legal requirements (legal basis: legal
                  obligation)
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              5. Data Sharing
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              We share your personal data only with the verified removal
              companies matched to your move request, and only for the purpose
              of providing you with quotes. We do not sell your data to third
              parties.
            </p>
            <p className="text-text-secondary leading-relaxed">
              We may also share data with service providers who assist us in
              operating our platform (such as hosting providers and analytics
              services), but only under strict data processing agreements and
              solely for the purposes set out in this policy.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              6. Data Retention
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your personal data only for as long as is necessary to
              fulfil the purposes for which it was collected. Move request data
              is typically retained for up to 12 months after your move date.
              Account data is retained for the duration of your account and for
              a reasonable period thereafter. You may request deletion of your
              data at any time.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              7. Your Rights
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Under UK GDPR, you have the following rights regarding your
              personal data:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Right of access to your personal data</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Right to rectification of inaccurate data</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Right to erasure (right to be forgotten)</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Right to restrict processing</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Right to data portability</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>Right to object to processing</span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  Right to lodge a complaint with the Information
                  Commissioner&apos;s Office (ICO)
                </span>
              </li>
            </ul>
            <p className="mt-4 text-text-secondary leading-relaxed">
              To exercise any of these rights, please contact us at{' '}
              <a
                href="mailto:privacy@movecompare.co.uk"
                className="text-primary hover:text-primary-light transition-colors"
              >
                privacy@movecompare.co.uk
              </a>
              .
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              8. Security
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We implement appropriate technical and organisational measures to
              protect your personal data against unauthorised access, loss,
              destruction, or alteration. This includes encryption of data in
              transit and at rest, regular security assessments, and access
              controls to limit who can view personal data.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. Any significant
              changes will be communicated via our website. We encourage you to
              review this page periodically for the latest information.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              10. Contact Us
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about this Privacy Policy or wish to
              exercise your data rights, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-surface-alt rounded-xl">
              <p className="text-sm text-text-primary font-medium">
                MoveCompare Data Protection
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Email:{' '}
                <a
                  href="mailto:privacy@movecompare.co.uk"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  privacy@movecompare.co.uk
                </a>
              </p>
              <p className="text-sm text-text-secondary mt-1">
                You also have the right to complain to the ICO at{' '}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  ico.org.uk
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
