'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/removals', label: 'Locations' },
  { href: '/get-quotes', label: 'Get Quotes' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-bold text-text-primary">
              Move<span className="text-primary">Fox</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-surface-alt after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Partner Login
              </Button>
            </Link>
            <Link href="/get-quotes">
              <Button size="sm">
                Get Free Quotes →
              </Button>
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <Menu
                size={24}
                className={`absolute transition-all duration-300 ${
                  mobileOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                }`}
              />
              <X
                size={24}
                className={`absolute transition-all duration-300 ${
                  mobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu — always in DOM, animated with grid-rows */}
        <div
          className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="overflow-hidden min-h-0">
            <div className="pb-4 border-t border-border mt-2 pt-4">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-surface-alt rounded-lg transition-all duration-300 ${
                      mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                    }`}
                    style={{ transitionDelay: mobileOpen ? `${i * 50}ms` : '0ms' }}
                    tabIndex={mobileOpen ? 0 : -1}
                  >
                    {link.label}
                  </Link>
                ))}
                <div
                  className={`flex flex-col gap-2 mt-4 px-4 transition-all duration-300 ${
                    mobileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                  }`}
                  style={{ transitionDelay: mobileOpen ? `${navLinks.length * 50}ms` : '0ms' }}
                >
                  <Link href="/login" tabIndex={mobileOpen ? 0 : -1}>
                    <Button variant="outline" className="w-full">
                      Partner Login
                    </Button>
                  </Link>
                  <Link href="/get-quotes" tabIndex={mobileOpen ? 0 : -1}>
                    <Button className="w-full">
                      Get Free Quotes →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
