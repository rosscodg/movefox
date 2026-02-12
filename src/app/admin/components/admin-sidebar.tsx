'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileText,
  PoundSterling,
  Newspaper,
  ClipboardList,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/leads', label: 'Leads', icon: FileText },
  { href: '/admin/pricing', label: 'Pricing', icon: PoundSterling },
  { href: '/admin/content', label: 'Content', icon: Newspaper },
  { href: '/admin/audit-log', label: 'Audit Log', icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-surface border-r border-border">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Logo height={32} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
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

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-muted text-center">Admin Portal v0.1</p>
      </div>
    </aside>
  );
}
