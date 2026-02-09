import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CITY_BY_SLUG, REGIONS } from '@/data/cities';
import type { CityData } from '@/data/cities';

interface NearbyCitiesProps {
  city: CityData;
}

export function NearbyCities({ city }: NearbyCitiesProps) {
  const nearbyCities = city.nearbyCities
    .map((slug) => CITY_BY_SLUG.get(slug))
    .filter((c): c is CityData => c !== undefined);

  if (nearbyCities.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
          Removal Services Near {city.name}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyCities.map((nearby) => (
            <Link key={nearby.slug} href={`/removals/${nearby.slug}`}>
              <Card variant="bordered" className="h-full hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-text-primary">{nearby.name}</h3>
                    </div>
                    <Badge variant="default" className="text-xs">
                      {REGIONS[nearby.region].name}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">
                    Compare removal companies in {nearby.name}, {nearby.county}.
                  </p>
                  <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                    View removals <ArrowRight className="w-3 h-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
