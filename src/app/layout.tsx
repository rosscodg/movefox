import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { JsonLd } from '@/components/seo/json-ld';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'MoveFox — Compare UK Removal Companies',
    template: '%s | MoveFox',
  },
  description:
    'Compare trusted UK removal companies and get up to 5 free quotes for your home move. Verified movers, transparent pricing.',
};

// Inline script to prevent flash of wrong theme (FOUC)
const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var resolved = theme;
    if (!theme || theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();
`;

// Organization / LocalBusiness schema — rendered on every page
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'MoveFox',
  url: 'https://movefox.co.uk',
  logo: 'https://movefox.co.uk/logo-dark.svg',
  description:
    'Compare trusted UK removal companies and get up to 5 free, no-obligation quotes for your home move.',
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom',
  },
  serviceType: 'Moving Services Comparison',
  priceRange: 'Free',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://movefox.co.uk/contact',
    availableLanguage: 'English',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={organizationSchema} />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
