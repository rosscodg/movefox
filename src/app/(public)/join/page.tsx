import type { Metadata } from 'next';
import { Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RegistrationFormLoader } from './registration-form-loader';

export const metadata: Metadata = {
  title: 'Become a Partner | MoveCompare',
  description:
    'Register your removal company with MoveCompare and start receiving quality move requests in your area.',
};

export default function JoinPage() {
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
              <Building2 className="w-3 h-3 mr-1" />
              Partner Registration
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Grow Your Removal Business
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Join MoveCompare and receive quality move requests from
              customers in your area. Register your company in just a few
              minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <RegistrationFormLoader />
      </section>
    </>
  );
}
