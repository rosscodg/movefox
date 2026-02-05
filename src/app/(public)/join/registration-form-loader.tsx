'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const RegistrationForm = dynamic(
  () => import('./registration-form').then((mod) => mod.RegistrationForm),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    ),
  }
);

export function RegistrationFormLoader() {
  return <RegistrationForm />;
}
