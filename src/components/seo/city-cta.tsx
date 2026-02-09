import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CityData } from '@/data/cities';

interface CityCtaProps {
  city: CityData;
}

export function CityCta({ city }: CityCtaProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-primary/5 border border-primary/20 p-8 sm:p-12 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-10" />

          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">
            Ready to compare removal quotes in {city.name}?
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            Get up to 5 free, no-obligation quotes from trusted removal companies
            in {city.name}. It takes less than 2 minutes.
          </p>
          <Link href={`/get-quotes?from=${encodeURIComponent(city.postcodeExample)}`}>
            <Button size="lg">
              Get Your Free Quotes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
