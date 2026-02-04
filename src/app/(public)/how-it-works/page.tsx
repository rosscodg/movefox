import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ClipboardList,
  Users,
  BarChart3,
  CalendarCheck,
  Home,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Star,
  TrendingUp,
  UserPlus,
  FileText,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'Learn how MoveCompare helps you find and compare trusted UK removal companies. Simple, free, and no obligation.',
};

const stepsForHomemovers = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Submit Your Move Details',
    description:
      'Tell us about your move by completing our short online form. We need to know your current and destination postcodes, your preferred moving date, the size of your property, and any special requirements such as piano moving or packing services.',
    details: [
      'Takes less than 2 minutes to complete',
      'Include details about access, parking, and floors',
      'Mention any fragile or high-value items',
      'Let us know if you need packing or storage',
    ],
  },
  {
    number: '02',
    icon: Users,
    title: 'We Match You With Movers',
    description:
      'Once we receive your details, our matching system identifies verified removal companies in your area that cover your route and are available on your preferred dates. We prioritise companies with strong reviews and proven track records.',
    details: [
      'Only verified, insured companies are included',
      'Matched based on your location and move type',
      'Companies are checked for availability',
      'We prioritise highly rated movers',
    ],
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Compare Your Quotes',
    description:
      'Receive up to 5 detailed quotes delivered to your dashboard. Each quote includes a breakdown of costs so you can compare like for like. You can also view company profiles, read verified reviews, and check their credentials.',
    details: [
      'Receive up to 5 competitive quotes',
      'See transparent pricing breakdowns',
      'Read genuine customer reviews',
      'Check insurance and accreditations',
    ],
  },
  {
    number: '04',
    icon: CalendarCheck,
    title: 'Choose & Book',
    description:
      'Once you have reviewed the quotes and found the right fit, book directly with your chosen removal company. There is no middleman — you deal with the company directly, giving you full control over your move.',
    details: [
      'Book directly with your chosen company',
      'No commission fees added to your quote',
      'Full control over your booking',
      'Support available if you need help deciding',
    ],
  },
];

const stepsForCompanies = [
  {
    icon: UserPlus,
    title: 'Register Your Company',
    description:
      'Create a partner account and complete your company profile with your service areas, capabilities, insurance details, and accreditations.',
  },
  {
    icon: FileText,
    title: 'Get Verified',
    description:
      'We verify your insurance, credentials, and business details to ensure you meet our quality standards. Only verified companies receive leads.',
  },
  {
    icon: Bell,
    title: 'Receive Move Requests',
    description:
      'When a homeowner submits a move request that matches your service area and capabilities, you will receive a notification with the move details.',
  },
  {
    icon: TrendingUp,
    title: 'Quote & Grow',
    description:
      'Submit your competitive quote directly through the platform. Win jobs, build your reputation with reviews, and grow your business.',
  },
];

export default function HowItWorksPage() {
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
              Simple Process
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              How{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                MoveCompare
              </span>{' '}
              Works
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Whether you are a homeowner looking for movers or a removal
              company looking for customers, MoveCompare makes the process
              simple and transparent.
            </p>
          </div>
        </div>
      </section>

      {/* For Homeowners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              For Homeowners
            </h2>
            <p className="text-text-secondary">
              Find the right mover in 4 simple steps
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {stepsForHomemovers.map((step) => (
            <Card key={step.number} variant="bordered" className="group hover:border-primary/40 transition-colors">
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-shrink-0 flex items-start gap-4">
                    <span className="text-5xl font-extrabold text-primary/15 group-hover:text-primary/25 transition-colors leading-none">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mt-1">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {step.description}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <ShieldCheck className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* For Removal Companies */}
      <section className="bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Truck className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                For Removal Companies
              </h2>
              <p className="text-text-secondary">
                Grow your business with qualified leads
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsForCompanies.map((step) => (
              <Card key={step.title} variant="elevated" className="group hover:border-accent/30 transition-colors">
                <CardContent>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-text-secondary mb-6">
              Interested in becoming a MoveCompare partner?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Become a Partner
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Partner Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Why trust MoveCompare?
          </h2>
          <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
            We are committed to making your moving experience as smooth and
            stress-free as possible.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card variant="bordered">
            <CardContent className="text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                Verified Companies Only
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Every company on our platform is vetted for insurance, proper
                licensing, and quality of service before they can quote.
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <BadgeCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                Genuine Reviews
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                All reviews on MoveCompare come from real customers who have used
                the service, so you can trust the feedback.
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardContent className="text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Star className="w-7 h-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">
                No Hidden Costs
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                Our service is completely free for homeowners. We never add fees
                or commissions to the quotes you receive.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Get up to 5 free quotes from verified UK removal companies. It
              takes less than 2 minutes and there is absolutely no obligation.
            </p>
            <div className="mt-8">
              <Link href="/get-quotes">
                <Button size="lg" className="text-base">
                  Get Your Free Quotes
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
