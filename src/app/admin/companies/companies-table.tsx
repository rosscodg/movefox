'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Company, CompanyStatus } from '@/types/database';

type CompanyRow = Company & {
  leadsAssigned: number;
  reveals: number;
  creditsBalance: number;
};

interface CompaniesTableProps {
  companies: CompanyRow[];
}

const statusFilters: { label: string; value: CompanyStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Suspended', value: 'suspended' },
];

function statusBadgeVariant(status: CompanyStatus) {
  switch (status) {
    case 'approved': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'rejected': return 'danger' as const;
    case 'suspended': return 'danger' as const;
    default: return 'default' as const;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
  const [statusFilter, setStatusFilter] = useState<CompanyStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [companies, statusFilter, searchQuery]);

  // Approve/reject now handled on the detail page with the full
  // email dialog experience. The inline buttons link there directly.

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status filter tabs */}
        <div className="flex gap-1 bg-surface rounded-xl p-1 border border-border">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                statusFilter === filter.value
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left text-text-muted font-medium px-6 py-3">Company</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Status</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">City</th>
                <th className="text-center text-text-muted font-medium px-4 py-3">Leads</th>
                <th className="text-center text-text-muted font-medium px-4 py-3">Reveals</th>
                <th className="text-center text-text-muted font-medium px-4 py-3">Credits</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Joined</th>
                <th className="text-right text-text-muted font-medium px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-text-muted">
                    No companies found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="text-text-primary font-medium hover:text-primary-light transition-colors"
                      >
                        {company.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={statusBadgeVariant(company.status)}>
                        {company.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">{company.city || '-'}</td>
                    <td className="px-4 py-4 text-center text-text-secondary">{company.leadsAssigned}</td>
                    <td className="px-4 py-4 text-center text-text-secondary">{company.reveals}</td>
                    <td className="px-4 py-4 text-center text-text-secondary">{company.creditsBalance}</td>
                    <td className="px-4 py-4 text-text-muted text-xs">{formatDate(company.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {company.status === 'pending' && (
                          <Link href={`/admin/companies/${company.id}`}>
                            <Button size="sm" variant="primary" className="gap-1">
                              <Check className="h-3.5 w-3.5" />
                              Review
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/companies/${company.id}`}>
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
