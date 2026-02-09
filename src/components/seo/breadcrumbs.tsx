import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from './json-ld';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://movefox.co.uk${item.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <nav aria-label="Breadcrumb" className="text-sm text-text-muted">
        <ol className="flex items-center gap-1.5 flex-wrap">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-primary font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
