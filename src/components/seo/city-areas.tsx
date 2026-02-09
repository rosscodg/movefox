import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';
import type { CityData } from '@/data/cities';

interface CityAreasProps {
  city: CityData;
}

export function CityAreas({ city }: CityAreasProps) {
  if (city.popularAreas.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
            Popular Areas in {city.name}
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="flex flex-wrap gap-3">
            {city.popularAreas.map((area) => (
              <Link
                key={area}
                href={`/get-quotes?from=${encodeURIComponent(city.postcodeExample)}`}
              >
                <Badge
                  variant="default"
                  className="text-sm px-4 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {area}
                </Badge>
              </Link>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
