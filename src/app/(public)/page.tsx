import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ClipboardList,
  Users,
  BarChart3,
  CalendarCheck,
  ShieldCheck,
  BadgeCheck,
  Clock,
  MapPin,
  Lock,
  CheckCircle2,
  HeartHandshake,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';
import { CITIES } from '@/data/cities';

export const metadata: Metadata = {
  title: 'Compare UK Removal Companies — Get Free Quotes',
  description:
    'Compare trusted UK removal companies and get up to 5 free, no-obligation quotes for your home move. Verified movers, transparent pricing, UK-wide coverage.',
};

const stats = [
  { value: '5,000+', label: 'Moves Compared' },
  { value: '200+', label: 'Verified Companies' },
  { value: 'Free', label: 'No Obligation' },
  { value: 'UK-Wide', label: 'Coverage' },
];

const trustBadges = [
  { icon: Lock, label: 'GDPR Compliant' },
  { icon: BadgeCheck, label: 'Verified Companies' },
  { icon: ShieldCheck, label: 'No Spam Guarantee' },
  { icon: HeartHandshake, label: 'UK Based Support' },
];

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Tell Us About Your Move',
    description:
      'Fill in a few details about your move — where you are, where you are going, and what you need moved.',
  },
  {
    number: '02',
    icon: Users,
    title: 'We Match You With Movers',
    description:
      'Our system matches your requirements to verified removal companies in your area who are available for your dates.',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Compare Your Quotes',
    description:
      'Receive up to 5 detailed quotes so you can compare prices, services, and reviews side by side.',
  },
  {
    number: '04',
    icon: CalendarCheck,
    title: 'Choose & Book',
    description:
      'Pick the company that best fits your needs and budget, then book directly with them. Simple.',
  },
];

const features = [
  {
    icon: CheckCircle2,
    title: 'Completely Free',
    description:
      'Our service is 100% free for homeowners. No hidden fees, no credit card required, no obligation whatsoever.',
  },
  {
    icon: BadgeCheck,
    title: 'Verified Companies',
    description:
      'Every removal company on our platform is vetted, insured, and reviewed. We only work with professionals you can trust.',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description:
      'Instead of ringing round for quotes, get up to 5 competitive quotes delivered straight to your dashboard in hours.',
  },
  {
    icon: MapPin,
    title: 'UK-Wide Coverage',
    description:
      'Whether you are moving from London to Edinburgh or across town, we have verified movers covering the whole of the UK.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient effects */}
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(124,58,237,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 0% 100%, rgba(16,185,129,0.04) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn delay={0}>
              <Badge variant="primary" className="mb-6">
                <Star className="w-3 h-3 mr-1" />
                Trusted by thousands of UK movers
              </Badge>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary leading-tight tracking-tight">
                Compare UK{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">
                  Removal Companies
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Get up to 5 free, no-obligation quotes from verified removal
                companies. Compare prices, read reviews, and book your move with
                confidence.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-quotes">
                  <Button size="lg" className="w-full sm:w-auto text-base">
                    Get Free Quotes
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-base"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 100} direction="up">
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trustBadges.map((badge, i) => (
            <FadeIn key={badge.label} delay={i * 75} direction="up">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {badge.label}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="primary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Get quotes in 4 simple steps
            </h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              Our streamlined process makes it easy to find the right removal
              company for your move.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 100}>
              <Card variant="bordered" className="relative group hover:border-primary/50 transition-colors h-full">
                <CardContent>
                  <span className="text-5xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {step.number}
                  </span>
                  <div className="mt-4 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Why Choose MoveFox */}
      <section className="bg-surface/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <Badge variant="primary" className="mb-4">Why MoveFox</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
                The smarter way to find your mover
              </h2>
              <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
                We take the stress out of finding a reliable removal company so you
                can focus on your move.
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 100}>
                <Card variant="elevated" className="group hover:border-primary/30 transition-colors h-full">
                  <CardContent className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <FadeIn>
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="primary" className="mb-4">UK Coverage</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Popular locations
            </h2>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              We cover the whole of the UK. Browse removal companies in these
              popular cities or search for your area.
            </p>
          </div>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CITIES.filter((c) =>
            ['london', 'manchester', 'birmingham', 'edinburgh', 'bristol', 'leeds', 'glasgow', 'liverpool'].includes(c.slug),
          ).map((city, i) => (
            <FadeIn key={city.slug} delay={i * 75}>
              <Link href={`/removals/${city.slug}`}>
                <Card
                  variant="bordered"
                  className="h-full hover:border-primary/50 transition-colors group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-text-primary">
                        Removals in {city.name}
                      </h3>
                    </div>
                    <p className="text-sm text-text-muted mb-3">{city.county}</p>
                    <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Compare quotes <ArrowRight className="w-3 h-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/removals">
            <Button variant="outline" size="lg">
              View All Locations
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
                Ready to compare removal quotes?
              </h2>
              <p className="mt-4 text-lg text-text-secondary">
                It only takes 2 minutes. Get up to 5 free quotes from verified UK
                removal companies today.
              </p>
              <div className="mt-8">
                <Link href="/get-quotes">
                  <Button size="lg" className="text-base">
                    Get Your Free Quotes
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-sm text-text-muted">
                Free, no-obligation, takes under 2 minutes
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
