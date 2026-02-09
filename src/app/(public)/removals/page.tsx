import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { CITIES, REGIONS, type CityRegion } from '@/data/cities';

export const metadata: Metadata = {
  title: 'Removals Across the UK — Compare Local Removal Companies',
  description:
    'Find and compare trusted removal companies in cities across the UK. Get free, no-obligation quotes for house removals, man and van, and packing services in your area.',
  alternates: {
    canonical: 'https://movefox.co.uk/removals',
  },
  openGraph: {
    title: 'Removals Across the UK — Compare Local Removal Companies',
    description:
      'Find and compare trusted removal companies in cities across the UK. Get free, no-obligation quotes.',
    url: 'https://movefox.co.uk/removals',
    siteName: 'MoveFox',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RemovalsIndexPage() {
  // Group cities by region
  const citiesByRegion = new Map<CityRegion, typeof CITIES>();
  for (const city of CITIES) {
    const existing = citiesByRegion.get(city.region) ?? [];
    existing.push(city);
    citiesByRegion.set(city.region, existing);
  }

  // Order regions for display
  const regionOrder: CityRegion[] = [
    'london',
    'south-east',
    'south-west',
    'midlands',
    'north-west',
    'north-east',
    'scotland',
    'wales',
  ];

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'UK Removal Company Comparison',
    description:
      'Compare trusted removal companies across the UK. Free, no-obligation quotes for house removals.',
    serviceType: 'Moving Services',
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    provider: {
      '@type': 'Organization',
      name: 'MoveFox',
      url: 'https://movefox.co.uk',
    },
  };

  return (
    <>
      <JsonLd data={serviceSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Removals' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Removals Across the{' '}
            <span className="text-primary">UK</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Find and compare trusted removal companies in your city. Select your
            location below to get free, no-obligation quotes from verified movers.
          </p>
          <Link href="/get-quotes">
            <Button size="lg">
              Get Free Quotes Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Cities by region */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regionOrder.map((regionKey) => {
            const cities = citiesByRegion.get(regionKey);
            if (!cities || cities.length === 0) return null;
            const region = REGIONS[regionKey];

            return (
              <div key={regionKey} className="mb-12 last:mb-0">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-text-primary">
                    {region.name}
                  </h2>
                  <span className="text-sm text-text-muted">
                    {region.description}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {cities.map((city) => (
                    <Link key={city.slug} href={`/removals/${city.slug}`}>
                      <Card
                        variant="bordered"
                        className="h-full hover:border-primary/50 transition-colors"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <h3 className="font-semibold text-text-primary">
                              {city.name}
                            </h3>
                          </div>
                          <p className="text-sm text-text-muted mb-3">
                            {city.county}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="default" className="text-xs">
                              {city.averageCostRange}
                            </Badge>
                            <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                              View <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
