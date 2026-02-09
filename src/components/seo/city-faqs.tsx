'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CityData } from '@/data/cities';
import { buildFaqs } from '@/lib/build-faqs';

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
      >
        <span className="font-medium text-text-primary pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-text-muted shrink-0 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-text-secondary leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export function CityFaqs({ city }: CityFaqsProps) {
  const faqs = buildFaqs(city);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
          FAQs About Removals in {city.name}
        </h2>

        <div className="max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Re-export for convenience
export { buildFaqs };
