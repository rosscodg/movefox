'use client';

import { useState } from 'react';
import {
  Coins,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  Zap,
  Star,
  Crown,
  RefreshCw,
  ClipboardList,
  History,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CreditLedger, CreditReason } from '@/types/database';

interface CreditPackDisplay {
  name: string;
  credits: number;
  priceGbp: number;
  perCredit: string;
}

interface BillingClientProps {
  creditBalance: number;
  creditPacks: CreditPackDisplay[];
  ledger: CreditLedger[];
}

const PACK_ICONS: Record<string, React.ReactNode> = {
  Starter: <Zap className="w-6 h-6" />,
  Growth: <Star className="w-6 h-6" />,
  Pro: <Crown className="w-6 h-6" />,
};

const PACK_HIGHLIGHTS: Record<string, string> = {
  Starter: '',
  Growth: 'Most Popular',
  Pro: 'Best Value',
};

const REASON_CONFIG: Record<
  CreditReason,
  { label: string; icon: React.ReactNode; variant: 'success' | 'danger' | 'info' | 'warning' }
> = {
  purchase: {
    label: 'Purchase',
    icon: <CreditCard className="w-4 h-4" />,
    variant: 'success',
  },
  reveal: {
    label: 'Reveal',
    icon: <ArrowDownRight className="w-4 h-4" />,
    variant: 'danger',
  },
  refund: {
    label: 'Refund',
    icon: <RefreshCw className="w-4 h-4" />,
    variant: 'info',
  },
  adjustment: {
    label: 'Adjustment',
    icon: <ClipboardList className="w-4 h-4" />,
    variant: 'warning',
  },
};

export function BillingClient({
  creditBalance,
  creditPacks,
  ledger,
}: BillingClientProps) {
  const [purchasingPack, setPurchasingPack] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleBuyCredits(packName: string) {
    setPurchasingPack(packName);
    setError(null);

    try {
      const pack = creditPacks.find((p) => p.name === packName);
      if (!pack) throw new Error('Pack not found');

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credits: pack.credits,
          priceGbp: pack.priceGbp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('[billing] Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setPurchasingPack(null);
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Billing &amp; Credits
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your credits and view your transaction history.
        </p>
      </div>

      {/* Current balance */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Coins className="w-10 h-10 text-primary-light" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-text-muted uppercase tracking-wide">
              Current Balance
            </p>
            <p className="text-5xl font-bold text-text-primary mt-1">
              {creditBalance}
            </p>
            <p className="text-sm text-text-secondary mt-1">credits remaining</p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Credit packs */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-5">
          Buy Credits
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {creditPacks.map((pack) => {
            const highlight = PACK_HIGHLIGHTS[pack.name];
            const isPopular = highlight === 'Most Popular';
            const isBestValue = highlight === 'Best Value';

            return (
              <div
                key={pack.name}
                className={`relative bg-surface rounded-2xl p-6 border-2 transition-all duration-200 ${
                  isPopular
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-border/60 hover:border-border-light'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant={isPopular ? 'primary' : 'success'}>
                      {highlight}
                    </Badge>
                  </div>
                )}
                <div className="text-center pt-2">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                      isPopular
                        ? 'bg-primary/15 text-primary-light'
                        : isBestValue
                        ? 'bg-accent/15 text-accent'
                        : 'bg-surface-alt text-text-secondary'
                    }`}
                  >
                    {PACK_ICONS[pack.name]}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {pack.name}
                  </h3>
                  <p className="text-3xl font-bold text-text-primary mt-3">
                    {pack.credits}
                    <span className="text-sm font-normal text-text-muted ml-1">
                      credits
                    </span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-2xl font-bold text-primary-light">
                      £{pack.priceGbp}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      £{pack.perCredit} per credit
                    </p>
                  </div>
                  <Button
                    onClick={() => handleBuyCredits(pack.name)}
                    loading={purchasingPack === pack.name}
                    disabled={purchasingPack !== null}
                    variant={isPopular ? 'primary' : 'outline'}
                    className="w-full mt-5"
                  >
                    Buy {pack.name}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credit history */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Transaction History
        </h2>
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          {ledger.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary">No transactions yet</p>
              <p className="text-sm text-text-muted mt-1">
                Your purchase and credit history will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/50">
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wide px-6 py-3">
                      Date
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wide px-6 py-3">
                      Description
                    </th>
                    <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wide px-6 py-3">
                      Type
                    </th>
                    <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wide px-6 py-3">
                      Credits
                    </th>
                    <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wide px-6 py-3">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map((entry) => {
                    const config = REASON_CONFIG[entry.reason];
                    const isPositive = entry.delta > 0;

                    return (
                      <tr
                        key={entry.id}
                        className="border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="px-6 py-3 text-sm text-text-secondary whitespace-nowrap">
                          {formatDate(entry.created_at)}
                        </td>
                        <td className="px-6 py-3 text-sm text-text-primary">
                          {entry.description ?? '-'}
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={config.variant}>
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span
                            className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                              isPositive ? 'text-accent' : 'text-danger'
                            }`}
                          >
                            {isPositive ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            {isPositive ? '+' : ''}
                            {entry.delta}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-sm text-text-secondary font-medium">
                          {entry.balance_after}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
