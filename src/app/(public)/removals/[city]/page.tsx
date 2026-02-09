import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CITY_BY_SLUG, ALL_CITY_SLUGS } from '@/data/cities';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { CityHero } from '@/components/seo/city-hero';
import { CityStats } from '@/components/seo/city-stats';
import { CityInsights } from '@/components/seo/city-insights';
import { CityAreas } from '@/components/seo/city-areas';
import { CityTips } from '@/components/seo/city-tips';
import { HowItWorksCity } from '@/components/seo/how-it-works-city';
import { NearbyCities } from '@/components/seo/nearby-cities';
import { CityFaqs } from '@/components/seo/city-faqs';
import { buildFaqs } from '@/lib/build-faqs';
import { CityCta } from '@/components/seo/city-cta';

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return ALL_CITY_SLUGS.map((slug) => ({ city: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: slug } = await params;
  const city = CITY_BY_SLUG.get(slug);
  if (!city) return {};

  const title = `Removals in ${city.name} — Compare Trusted Removal Companies`;
  const description = `Compare verified removal companies in ${city.name}, ${city.county}. Get up to 5 free, no-obligation quotes for house removals, man and van, and packing services in ${city.name}.`;
  const url = `https://movefox.co.uk/removals/${city.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'MoveFox',
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city: slug } = await params;
  const city = CITY_BY_SLUG.get(slug);
  if (!city) notFound();

  const faqs = buildFaqs(city);

  // JSON-LD: Service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Removal Services in ${city.name}`,
    description: `Compare trusted removal companies in ${city.name}, ${city.county}. Get up to 5 free quotes for house removals, man and van, and packing services.`,
    serviceType: 'Moving Services',
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: city.county,
      },
    },
    provider: {
      '@type': 'Organization',
      name: 'MoveFox',
      url: 'https://movefox.co.uk',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GBP',
      description: 'Free, no-obligation comparison of removal quotes',
    },
  };

  // JSON-LD: FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Removals', href: '/removals' },
            { label: city.name },
          ]}
        />
      </div>

      <CityHero city={city} />
      <CityStats city={city} />
      <CityInsights city={city} />
      <CityAreas city={city} />
      <CityTips city={city} />
      <HowItWorksCity city={city} />
      <NearbyCities city={city} />
      <CityFaqs city={city} />
      <CityCta city={city} />
    </>
  );
}
