'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Lead } from '@/types/database';
import { PROPERTY_SIZES } from '@/lib/constants';
import { formatDate } from '@/lib/dates';

type LeadRow = Lead & { assignedCount: number; revealedCount: number };

interface LeadsTableProps {
  leads: LeadRow[];
}

function propertySizeLabel(value: string) {
  return PROPERTY_SIZES.find((p) => p.value === value)?.label ?? value;
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      // Search by postcode
      const matchesSearch =
        searchQuery === '' ||
        lead.from_postcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.to_postcode.toLowerCase().includes(searchQuery.toLowerCase());

      // Date range filter
      let matchesDate = true;
      if (dateFrom) {
        matchesDate = matchesDate && new Date(lead.created_at) >= new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(lead.created_at) <= toDate;
      }

      return matchesSearch && matchesDate;
    });
  }, [leads, searchQuery, dateFrom, dateTo]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by postcode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-text-muted flex-shrink-0" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          <span className="text-text-muted text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-muted">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="text-left text-text-muted font-medium px-6 py-3">Lead ID</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Route</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Property</th>
                <th className="text-left text-text-muted font-medium px-4 py-3">Move Date</th>
                <th className="text-center text-text-muted font-medium px-4 py-3">Assigned</th>
                <th className="text-center text-text-muted font-medium px-4 py-3">Revealed</th>
                <th className="text-left text-text-muted font-medium px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                    No leads found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-primary-light hover:underline font-mono text-xs"
                      >
                        {lead.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-text-primary">
                      {lead.from_postcode} → {lead.to_postcode}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="default">{propertySizeLabel(lead.property_size)}</Badge>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {lead.move_date ? (
                        <span>
                          {formatDate(lead.move_date)}
                          {lead.move_date_flexible && (
                            <span className="text-text-muted ml-1">(flex)</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-text-muted">Flexible</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center text-text-secondary">{lead.assignedCount}</td>
                    <td className="px-4 py-4 text-center text-text-secondary">{lead.revealedCount}</td>
                    <td className="px-6 py-4 text-text-muted text-xs">{formatDate(lead.created_at)}</td>
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
