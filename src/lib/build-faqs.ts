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
    {
      q: `What size removal van do I need for my move in ${city.name}?`,
      a: `The van size you need depends on your property size. For a 1-bedroom flat in ${city.name}, a Transit-sized van is usually sufficient. For a 2–3 bedroom house, a Luton van (3.5t) is the standard choice. Larger 4+ bedroom properties typically require a 7.5-tonne lorry or multiple trips. We recommend requesting a pre-move survey — either in-person or via video call — so your removal company can assess the volume accurately and provide a fixed quote.`,
    },
    {
      q: `Can I get packing services with my removal in ${city.name}?`,
      a: `Yes, most removal companies in ${city.name} offer professional packing services. You can choose a full packing service where the team packs everything for you, or a partial service covering fragile and high-value items such as glassware, artwork, and electronics. Professional packing reduces the risk of damage during transit and can save you significant time in the lead-up to your move.`,
    },
    {
      q: `What should I look for when choosing a removal company in ${city.name}?`,
      a: `When choosing a removal company in ${city.name}, check that they hold adequate insurance — both public liability and goods-in-transit cover. Look for verified customer reviews, membership of the British Association of Removers (BAR), and transparent pricing with no hidden fees. Local knowledge of ${city.name} is also valuable, as experienced movers will understand parking restrictions, access challenges, and the most efficient routes in the area.`,
    },
    {
      q: `Is it cheaper to move during the week in ${city.name}?`,
      a: `Generally, yes. Removal companies in ${city.name} tend to charge less for midweek moves (Tuesday to Thursday) compared to weekends. You can also save by moving mid-month rather than at the end of the month, when demand peaks due to tenancy and completion dates. Winter months (November to February) are typically quieter and more affordable than the busy summer period. Comparing quotes through MoveFox helps you find the best price for your preferred date.`,
    },
    {
      q: `Do removal companies in ${city.name} offer storage solutions?`,
      a: `Many removal companies in ${city.name} provide storage options for customers who need them. Short-term storage is ideal if there's a gap between your move-out and move-in dates, while long-term storage suits those downsizing or renovating. Options typically include secure container storage at the removal company's warehouse or partnerships with local self-storage facilities. Ask your chosen company about storage availability and costs when requesting your quote.`,
    },
  ];

  if (city.propertyTypes) {
    const types = Object.entries(city.propertyTypes)
      .map(([type, description]) => `${type} (${description})`)
      .join(', ');
    faqs.push({
      q: `What types of properties do removal companies handle in ${city.name}?`,
      a: `Removal companies in ${city.name} are experienced with a wide range of property types, including ${types}. Whether you're moving from a compact city-centre flat or a large detached home, local movers will have the equipment and expertise to handle your move efficiently.`,
    });
  }

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
