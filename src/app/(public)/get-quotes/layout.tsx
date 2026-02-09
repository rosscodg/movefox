import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Get Free Removal Quotes',
  description:
    'Compare up to 5 trusted UK removal companies. Fill in a quick form and receive free, no-obligation quotes for your home move.',
};

export default function GetQuotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
