import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';
import type { CityData } from '@/data/cities';
import { REGIONS } from '@/data/cities';

interface CityHeroProps {
  city: CityData;
}

export function CityHero({ city }: CityHeroProps) {
  const region = REGIONS[city.region];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <FadeIn delay={0}>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="primary">
                <MapPin className="w-3 h-3 mr-1" />
                {region.name}
              </Badge>
              <Badge variant="default">{city.county}</Badge>
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6 leading-tight">
              Removals in{' '}
              <span className="text-primary">{city.name}</span>
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p className="text-lg text-text-secondary leading-relaxed mb-4">
              Compare trusted removal companies in {city.name}, {city.county}.
              Get up to 5 free, no-obligation quotes for house removals, man and
              van, and packing services.
            </p>

            <p className="text-text-secondary leading-relaxed mb-8">
              {city.heroDescription}
            </p>
          </FadeIn>

          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/get-quotes?from=${encodeURIComponent(city.postcodeExample)}`}>
                <Button size="lg">
                  Get Free Quotes in {city.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg">
                  How It Works
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
