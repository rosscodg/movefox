'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  Coins,
  Menu,
  X,
  ChevronDown,
  User,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';

interface PortalShellProps {
  companyName: string;
  creditBalance: number;
  lowCreditThreshold: number;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/profile', label: 'Profile', icon: Building2 },
  { href: '/portal/billing', label: 'Billing', icon: CreditCard },
  { href: '/portal/settings', label: 'Settings', icon: Settings },
];

export function PortalShell({
  companyName,
  creditBalance,
  lowCreditThreshold,
  children,
}: PortalShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLowCredit = creditBalance <= lowCreditThreshold;

  function isActive(href: string) {
    if (href === '/portal') return pathname === '/portal';
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Sidebar overlay (mobile) ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link href="/portal" className="flex items-center">
            <Logo height={32} />
          </Link>
          <button
            className="lg:hidden text-text-muted hover:text-text-primary"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Credit balance card */}
        <div className="p-4 border-t border-border">
          <div
            className={`rounded-xl p-3 ${
              isLowCredit
                ? 'bg-warning/10 border border-warning/30'
                : 'bg-surface-alt'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Coins
                className={`w-4 h-4 ${
                  isLowCredit ? 'text-warning' : 'text-primary-light'
                }`}
              />
              <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                Credits
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${
                isLowCredit ? 'text-warning' : 'text-text-primary'
              }`}
            >
              {creditBalance}
            </p>
            {isLowCredit && (
              <p className="text-xs text-warning mt-1">Running low</p>
            )}
            <Link
              href="/portal/billing"
              className="mt-2 block text-xs text-primary-light hover:text-primary transition-colors"
            >
              Buy more credits &rarr;
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Left side: mobile hamburger + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-text-muted hover:text-text-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-medium text-text-secondary truncate">
              {companyName}
            </h2>
          </div>

          {/* Right side: credits + user menu */}
          <div className="flex items-center gap-4">
            {/* Credit badge */}
            <Link href="/portal/billing">
              <Badge variant={isLowCredit ? 'warning' : 'primary'}>
                <Coins className="w-3 h-3 mr-1" />
                {creditBalance} credits
              </Badge>
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-light" />
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl shadow-black/30 py-1 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {companyName}
                      </p>
                    </div>
                    <Link
                      href="/portal/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Building2 className="w-4 h-4" />
                      Company Profile
                    </Link>
                    <Link
                      href="/portal/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <div className="border-t border-border mt-1 pt-1">
                      <form action="/api/auth/signout" method="POST">
                        <button
                          type="submit"
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-surface-alt transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </form>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
