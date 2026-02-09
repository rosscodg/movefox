import { CheckCircle2, AlertTriangle, Car, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/fade-in';
import type { CityData } from '@/data/cities';

interface CityInsightsProps {
  city: CityData;
}

export function CityInsights({ city }: CityInsightsProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
            Moving in {city.name} — What You Need to Know
          </h2>
        </FadeIn>

        <div className="space-y-4 mb-8">
          {city.localInsights.map((insight, i) => (
            <FadeIn key={i} delay={i * 75}>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <p className="text-text-secondary leading-relaxed">{insight}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Optional detail cards */}
        {(city.parkingNotes || city.congestionNotes || city.propertyTypes) && (
          <FadeIn delay={city.localInsights.length * 75}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {city.parkingNotes && (
                <Card variant="bordered">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Car className="w-4 h-4 text-warning" />
                      <h3 className="font-semibold text-text-primary text-sm">Parking</h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {city.parkingNotes}
                    </p>
                  </CardContent>
                </Card>
              )}
              {city.congestionNotes && (
                <Card variant="bordered">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <h3 className="font-semibold text-text-primary text-sm">Congestion & Emissions</h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {city.congestionNotes}
                    </p>
                  </CardContent>
                </Card>
              )}
              {city.propertyTypes && (
                <Card variant="bordered">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Home className="w-4 h-4 text-info" />
                      <h3 className="font-semibold text-text-primary text-sm">Property Types</h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {city.propertyTypes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
