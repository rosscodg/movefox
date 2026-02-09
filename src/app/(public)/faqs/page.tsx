import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FAQItem } from './faq-accordion';

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Frequently asked questions about MoveFox. Learn about our free quote comparison service, data protection, and how we verify removal companies.',
};

const faqs = [
  {
    category: 'About the Service',
    questions: [
      {
        q: 'How does MoveFox work?',
        a: 'MoveFox is a free comparison service for UK home movers. You submit your move details through our short online form, and we match you with up to 5 verified removal companies in your area. They provide you with competitive quotes so you can compare prices, services, and reviews before choosing the right mover for you.',
      },
      {
        q: 'Is MoveFox really free to use?',
        a: 'Yes, MoveFox is completely free for homeowners. We never charge you any fees, and there is no obligation to accept any of the quotes you receive. Our service is funded by the removal companies who pay a small fee when they receive a lead.',
      },
      {
        q: 'How many quotes will I receive?',
        a: 'You can receive up to 5 quotes from verified removal companies. The exact number depends on how many companies are available in your area for your chosen dates. In most cases, you will receive multiple quotes within 24 to 48 hours.',
      },
      {
        q: 'Do I have to accept any of the quotes?',
        a: 'No, there is absolutely no obligation. You are free to compare the quotes and choose the one that best suits your needs, or not to proceed at all. We will never pressure you into booking.',
      },
    ],
  },
  {
    category: 'Removal Companies',
    questions: [
      {
        q: 'How are removal companies selected?',
        a: 'Every removal company on MoveFox goes through a verification process. We check their public liability insurance, goods in transit insurance, business registration, and customer reviews. Only companies that meet our quality standards are allowed to quote on the platform.',
      },
      {
        q: 'Are the removal companies insured?',
        a: 'Yes, all removal companies on our platform are required to hold valid public liability insurance and goods in transit insurance. We verify these documents as part of our onboarding process and require companies to keep them up to date.',
      },
      {
        q: 'Can I see reviews of the removal companies?',
        a: 'Yes, every company profile on MoveFox includes genuine reviews from previous customers who used the platform to book their move. This helps you make an informed decision based on real experiences.',
      },
      {
        q: 'What if I have a problem with the removal company I chose?',
        a: 'While MoveFox is a comparison service and you book directly with the removal company, we are here to help. If you experience any issues, please contact our support team and we will do our best to assist you in resolving the matter.',
      },
    ],
  },
  {
    category: 'Data & Privacy',
    questions: [
      {
        q: 'How is my data protected?',
        a: 'We take data protection very seriously. All personal information is processed in accordance with UK GDPR regulations. Your data is encrypted, stored securely, and only shared with the removal companies you are matched with for the purpose of providing you with quotes. We never sell your data to third parties.',
      },
      {
        q: 'Will I receive spam after submitting my details?',
        a: 'No. We have a strict no-spam policy. Your details are only shared with the verified removal companies matched to your move request. You will not receive unsolicited marketing emails or calls from us or any third parties.',
      },
      {
        q: 'Can I delete my data?',
        a: 'Yes, you have the right to request deletion of your personal data at any time under UK GDPR. Simply contact our support team or use the data deletion request option in your account settings, and we will process your request promptly.',
      },
    ],
  },
  {
    category: 'Your Move',
    questions: [
      {
        q: 'What types of moves do you cover?',
        a: 'We cover a wide range of moves including local moves within the same city, long-distance moves across the UK, flat and house moves of all sizes, office relocations, student moves, and single-item deliveries. If you have specific requirements, include them in your move request and we will match you with suitable companies.',
      },
      {
        q: 'Can I get quotes for packing services too?',
        a: 'Yes, many of the removal companies on our platform offer packing services, either as part of a full-service package or as an add-on. Simply indicate that you require packing services when completing the quote request form.',
      },
      {
        q: 'How far in advance should I request quotes?',
        a: 'We recommend requesting quotes at least 4 to 6 weeks before your move date, especially during peak periods such as summer and end-of-month dates. However, we can often find available movers at shorter notice too.',
      },
      {
        q: 'What if I need to change my moving date?',
        a: 'If you need to change your moving date after receiving quotes, you will need to contact the removal companies directly to discuss availability and any changes to the quoted price. If you have not yet received quotes, you can submit a new request with the updated date.',
      },
    ],
  },
];

export default function FAQsPage() {
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
              <HelpCircle className="w-3 h-3 mr-1" />
              Help Centre
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Find answers to common questions about MoveFox, our quote
              process, data protection, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-bold text-text-primary mb-4">
                {section.category}
              </h2>
              <div className="bg-surface border border-border rounded-2xl px-6">
                {section.questions.map((faq) => (
                  <FAQItem
                    key={faq.q}
                    question={faq.q}
                    answer={faq.a}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Still have questions?
          </h2>
          <p className="mt-4 text-text-secondary">
            Our friendly team is here to help. Get in touch and we will get back
            to you as soon as possible.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Contact Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/get-quotes">
              <Button variant="outline" size="lg">
                Get Free Quotes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
