import Link from 'next/link';

const footerLinks = {
  company: [
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/removals', label: 'Locations' },
    { href: '/faqs', label: 'FAQs' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
  partners: [
    { href: '/login', label: 'Partner Login' },
    { href: '/join', label: 'Become a Partner' },
  ],
  locations: [
    { href: '/removals/london', label: 'London' },
    { href: '/removals/manchester', label: 'Manchester' },
    { href: '/removals/birmingham', label: 'Birmingham' },
    { href: '/removals/leeds', label: 'Leeds' },
    { href: '/removals/bristol', label: 'Bristol' },
    { href: '/removals/edinburgh', label: 'Edinburgh' },
    { href: '/removals/liverpool', label: 'Liverpool' },
    { href: '/removals', label: 'All Locations →' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-lg font-bold text-text-primary">
                Move<span className="text-primary">Fox</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed">
              Compare trusted UK removal companies and get up to 5 free quotes for your home move.
            </p>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">For Partners</h4>
            <ul className="space-y-2">
              {footerLinks.partners.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Popular Locations</h4>
            <ul className="space-y-2">
              {footerLinks.locations.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} MoveFox. All rights reserved.
          </p>
          <p className="text-sm text-text-muted">
            Made in the UK
          </p>
        </div>
      </div>
    </footer>
  );
}
