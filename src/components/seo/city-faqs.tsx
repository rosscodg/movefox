'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CityData } from '@/data/cities';
import { buildFaqs } from '@/lib/build-faqs';
import { FadeIn } from '@/components/ui/fade-in';

interface CityFaqsProps {
  city: CityData;
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-alt/50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-medium text-text-primary pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`px-5 pb-5 transition-opacity duration-300 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <p className="text-text-secondary leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CityFaqs({ city }: CityFaqsProps) {
  const faqs = buildFaqs(city);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
            FAQs About Removals in {city.name}
          </h2>
        </FadeIn>

        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 75}>
              <FaqItem question={faq.q} answer={faq.a} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// Re-export for convenience
export { buildFaqs };
