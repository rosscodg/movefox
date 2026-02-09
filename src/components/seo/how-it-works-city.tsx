import { ClipboardList, Users, BarChart3, CalendarCheck } from 'lucide-react';
import type { CityData } from '@/data/cities';

interface HowItWorksCityProps {
  city: CityData;
}

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Tell Us About Your Move',
    getDescription: (name: string) =>
      `Fill in a few details about your move from ${name} — where you're going, your move date, and what needs moving.`,
  },
  {
    number: '02',
    icon: Users,
    title: 'We Match You With Movers',
    getDescription: (name: string) =>
      `We instantly match you with up to 5 verified removal companies covering ${name} and your destination area.`,
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'Compare Quotes',
    getDescription: () =>
      `Receive competitive quotes from trusted movers. Compare prices, services, and reviews side by side.`,
  },
  {
    number: '04',
    icon: CalendarCheck,
    title: 'Book Your Move',
    getDescription: () =>
      `Choose the removal company that's right for you and book directly. No middleman fees, no obligation.`,
  },
];

export function HowItWorksCity({ city }: HowItWorksCityProps) {
  return (
    <section className="py-16 bg-surface-alt/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
          How to Get Removal Quotes in {city.name}
        </h2>
        <p className="text-text-secondary mb-10">
          Getting quotes from trusted {city.name} removal companies takes less than 2 minutes.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold text-text-muted">STEP {step.number}</span>
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.getDescription(city.name)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
