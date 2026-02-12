import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckSquare, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { JsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  title: 'Moving Checklist — Your Complete UK Moving Guide',
  description:
    'A step-by-step moving checklist to help you organise your UK house move. From 8 weeks before to moving day and beyond.',
};

const checklistSections = [
  {
    timeline: '8 Weeks Before',
    items: [
      'Research removal companies and read reviews',
      'Declutter your home and donate unwanted items',
      'Start a moving folder for important documents',
      'Notify your landlord or begin exchange of contracts',
    ],
  },
  {
    timeline: '6 Weeks Before',
    items: [
      'Compare removal quotes on MoveFox',
      'Begin packing non-essential items',
      'Arrange school transfers if applicable',
      'Notify your GP and dentist of your move',
    ],
  },
  {
    timeline: '4 Weeks Before',
    items: [
      'Confirm your removal booking',
      'Arrange mail redirection with Royal Mail',
      'Notify utility providers (gas, electric, water, broadband)',
      'Update your address with banks, insurers, and subscriptions',
    ],
  },
  {
    timeline: '2 Weeks Before',
    items: [
      'Start packing room by room',
      'Label all boxes clearly with contents and destination room',
      'Confirm parking arrangements for the removal van',
      'Prepare an essentials box (kettle, mugs, toiletries, chargers)',
    ],
  },
  {
    timeline: '1 Week Before',
    items: [
      'Defrost the freezer and use up perishable food',
      'Confirm times and details with your removal company',
      'Pack a suitcase with everything you need for the first night',
      'Take meter readings at your current property',
    ],
  },
  {
    timeline: 'Moving Day',
    items: [
      'Do a final walkthrough of every room',
      'Be available to direct the removal team',
      'Check all rooms, cupboards, and the loft before leaving',
      'Hand over keys to the estate agent or new owner',
      'Take meter readings at your new property',
    ],
  },
  {
    timeline: 'First Week After',
    items: [
      'Unpack essentials and set up key rooms first',
      'Register with a new GP and dentist',
      'Update your details on the electoral roll',
      'Introduce yourself to the neighbours',
    ],
  },
];

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Organise a House Move in the UK',
  description:
    'A complete step-by-step checklist for organising your UK house move, from 8 weeks before to your first week in your new home.',
  totalTime: 'P56D',
  step: [
    {
      '@type': 'HowToStep',
      name: '8 Weeks Before Moving',
      text: 'Research removal companies, declutter your home, start a moving folder for important documents, and notify your landlord or begin the exchange of contracts.',
      position: 1,
    },
    {
      '@type': 'HowToStep',
      name: '6 Weeks Before Moving',
      text: 'Compare removal quotes on MoveFox, begin packing non-essential items, arrange school transfers if applicable, and notify your GP and dentist of your move.',
      position: 2,
    },
    {
      '@type': 'HowToStep',
      name: '4 Weeks Before Moving',
      text: 'Confirm your removal booking, arrange mail redirection with Royal Mail, notify utility providers, and update your address with banks, insurers, and subscriptions.',
      position: 3,
    },
    {
      '@type': 'HowToStep',
      name: '2 Weeks Before Moving',
      text: 'Start packing room by room, label all boxes clearly, confirm parking arrangements for the removal van, and prepare an essentials box.',
      position: 4,
    },
    {
      '@type': 'HowToStep',
      name: '1 Week Before Moving',
      text: 'Defrost the freezer, confirm times with your removal company, pack a suitcase for the first night, and take meter readings at your current property.',
      position: 5,
    },
    {
      '@type': 'HowToStep',
      name: 'Moving Day',
      text: 'Do a final walkthrough, be available for the removal team, check all rooms and cupboards, hand over keys, and take meter readings at your new property.',
      position: 6,
    },
    {
      '@type': 'HowToStep',
      name: 'First Week in Your New Home',
      text: 'Unpack essentials first, register with a new GP and dentist, update the electoral roll, and introduce yourself to the neighbours.',
      position: 7,
    },
  ],
};

export default function MovingChecklistPage() {
  return (
    <>
      <JsonLd data={howToSchema} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,58,237,0.08) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <ClipboardList className="w-3 h-3 mr-1" />
              Moving Guide
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Your Complete UK Moving Checklist
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Moving house is one of life&apos;s biggest tasks. Use our
              step-by-step checklist to stay organised from eight weeks before
              your move right through to settling into your new home.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="space-y-8">
          {checklistSections.map((section, sectionIndex) => (
            <FadeIn key={section.timeline} delay={sectionIndex * 80}>
              <Card variant="bordered">
                <CardContent>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                      <Calendar className="w-5 h-5 text-primary" />
                    </span>
                    <h2 className="text-xl font-bold text-text-primary">
                      {section.timeline}
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-text-secondary leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Ready to find your removal company?
          </h2>
          <p className="mt-4 text-text-secondary">
            Compare quotes from verified UK movers in minutes. It&apos;s free,
            fast, and there&apos;s no obligation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-quotes">
              <Button size="lg">
                Get Free Quotes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/removals">
              <Button variant="outline" size="lg">
                View Locations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
