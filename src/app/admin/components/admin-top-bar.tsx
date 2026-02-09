'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Building2,
  FileText,
  PoundSterling,
  Newspaper,
  ClipboardList,
} from 'lucide-react';

interface AdminTopBarProps {
  user: {
    email: string;
    full_name: string;
  };
}

const mobileNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/leads', label: 'Leads', icon: FileText },
  { href: '/admin/pricing', label: 'Pricing', icon: PoundSterling },
  { href: '/admin/content', label: 'Content', icon: Newspaper },
  { href: '/admin/audit-log', label: 'Audit Log', icon: ClipboardList },
];

export function AdminTopBar({ user }: AdminTopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 bg-surface border-b border-border">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <h1 className="text-lg font-semibold text-text-primary">Admin Portal</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{user.full_name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary-light text-sm font-semibold">
              {user.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <button
            className="text-text-muted hover:text-danger transition-colors"
            aria-label="Log out"
            // onClick={() => { /* sign out logic */ }}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-64 h-full bg-surface border-r border-border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-6 px-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">MC</span>
              </div>
              <span className="text-text-primary font-semibold text-lg">MoveFox</span>
            </div>
            <nav className="space-y-1">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary/15 text-primary-light border border-primary/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
