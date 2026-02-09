import type { CityData } from '@/data/cities';

export interface FaqItem {
  q: string;
  a: string;
}

export function buildFaqs(city: CityData): FaqItem[] {
  const faqs: FaqItem[] = [
    {
      q: `How much do removals in ${city.name} cost?`,
      a: `The cost of a local house removal in ${city.name} typically ranges from ${city.averageCostRange}, depending on property size, distance, and services required. Factors like packing, storage, and access difficulties can affect the final price. The best way to get an accurate quote is to compare prices from multiple verified removal companies through MoveFox.`,
    },
    {
      q: `How do I find trusted removal companies in ${city.name}?`,
      a: `MoveFox makes it easy — simply enter your move details and we'll match you with up to 5 verified removal companies serving ${city.name}. Every company on our platform has been checked for insurance, accreditations, and customer reviews, so you can compare with confidence.`,
    },
    {
      q: `How far in advance should I book removals in ${city.name}?`,
      a: `We recommend booking your removal company at least 4–6 weeks before your move date, especially during peak periods (summer months and end of month). In ${city.name}, demand can be particularly high during these times, so early booking gives you the best choice and prices.`,
    },
  ];

  if (city.parkingNotes) {
    faqs.push({
      q: `Do I need a parking permit for removal vans in ${city.name}?`,
      a: `${city.parkingNotes} It's important to arrange this in advance so your removal team has guaranteed access on the day. Your removal company may be able to help with this process.`,
    });
  }

  if (city.congestionNotes) {
    faqs.push({
      q: `Are there congestion or emission charges for removals in ${city.name}?`,
      a: `${city.congestionNotes} Always check that your removal company's vehicles are compliant to avoid unexpected charges being passed on to you.`,
    });
  }

  return faqs;
}
