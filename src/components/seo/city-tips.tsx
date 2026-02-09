import { FadeIn } from '@/components/ui/fade-in';
import type { CityData } from '@/data/cities';

interface CityTipsProps {
  city: CityData;
}

export function CityTips({ city }: CityTipsProps) {
  if (city.movingTips.length === 0) return null;

  return (
    <section className="py-16 bg-surface-alt/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
            Tips for Moving in {city.name}
          </h2>
        </FadeIn>

        <div className="space-y-6">
          {city.movingTips.map((tip, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">{i + 1}</span>
                </div>
                <p className="text-text-secondary leading-relaxed pt-1">{tip}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
