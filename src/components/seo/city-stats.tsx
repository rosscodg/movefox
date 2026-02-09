import { Users, MapPin, Coins, ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import type { CityData } from '@/data/cities';

interface CityStatsProps {
  city: CityData;
}

export function CityStats({ city }: CityStatsProps) {
  const stats = [
    { icon: Users, value: city.population, label: 'Population' },
    { icon: MapPin, value: `${city.postcodeAreas.length} area${city.postcodeAreas.length > 1 ? 's' : ''}`, label: 'Postcode Coverage' },
    { icon: Coins, value: city.averageCostRange, label: 'Typical Cost' },
    { icon: ShieldCheck, value: 'Free', label: 'No Obligation' },
  ];

  return (
    <section className="py-8 border-y border-border bg-surface-alt/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={i * 100} direction="up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
