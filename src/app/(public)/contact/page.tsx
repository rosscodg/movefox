import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ContactFormSection } from './contact-form';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the MoveFox team. We are here to help with any questions about our removal company comparison service.',
};

export default function ContactPage() {
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
              <Mail className="w-3 h-3 mr-1" />
              Get in Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Have a question about our service? Want to become a partner? We
              would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <ContactFormSection />
      </section>
    </>
  );
}
