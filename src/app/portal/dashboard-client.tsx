'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Eye,
  Coins,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Calendar,
  MapPin,
  Home,
  Lock,
  Filter,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LeadAssignmentWithLead, LeadAssignmentStatus } from '@/types/database';
import { formatDate, timeAgo } from '@/lib/dates';

interface DashboardClientProps {
  companyName: string;
  assignments: LeadAssignmentWithLead[];
  stats: {
    newLeads: number;
    revealedLeads: number;
    creditBalance: number;
    leadsThisMonth: number;
  };
  lowCreditThreshold: number;
  propertySizes: { value: string; label: string }[];
}

const STATUS_CONFIG: Record<
  LeadAssignmentStatus,
  { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  assigned: { label: 'New', variant: 'primary' },
  revealed: { label: 'Revealed', variant: 'info' },
  contacted: { label: 'Contacted', variant: 'info' },
  quoted: { label: 'Quoted', variant: 'warning' },
  won: { label: 'Won', variant: 'success' },
  lost: { label: 'Lost', variant: 'danger' },
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Leads' },
  { value: 'assigned', label: 'New' },
  { value: 'revealed', label: 'Revealed' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export function DashboardClient({
  companyName,
  assignments,
  stats,
  lowCreditThreshold,
  propertySizes,
}: DashboardClientProps) {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAssignments =
    statusFilter === 'all'
      ? assignments
      : assignments.filter((a) => a.status === statusFilter);

  function getPropertyLabel(value: string): string {
    return propertySizes.find((p) => p.value === value)?.label ?? value;
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {companyName}
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your leads and grow your business.
        </p>
      </div>

      {/* Low credit warning */}
      {stats.creditBalance <= lowCreditThreshold && (
        <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-warning">
              Low credit balance
            </p>
            <p className="text-xs text-text-secondary mt-0.5">
              You have {stats.creditBalance} credits remaining. Top up to
              keep receiving leads.
            </p>
          </div>
          <Link href="/portal/billing">
            <Button size="sm" variant="secondary">
              Buy Credits
            </Button>
          </Link>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  New Leads
                </p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                  {stats.newLeads}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Inbox className="w-5 h-5 text-primary-light" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Revealed
                </p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                  {stats.revealedLeads}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-info/15 flex items-center justify-center">
                <Eye className="w-5 h-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  Credits
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    stats.creditBalance <= lowCreditThreshold
                      ? 'text-warning'
                      : 'text-text-primary'
                  }`}
                >
                  {stats.creditBalance}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <Coins className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  This Month
                </p>
                <p className="text-3xl font-bold text-text-primary mt-1">
                  {stats.leadsThisMonth}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Your Leads</h2>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredAssignments.length === 0 ? (
          <Card>
            <CardContent>
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary font-medium">
                  No leads found
                </p>
                <p className="text-sm text-text-muted mt-1">
                  {statusFilter === 'all'
                    ? 'New leads will appear here as they come in.'
                    : 'No leads match this filter.'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAssignments.map((assignment) => {
              const lead = assignment.leads;
              const statusConf = STATUS_CONFIG[assignment.status];
              const isRevealed = assignment.revealed_at !== null;

              return (
                <Link
                  key={assignment.id}
                  href={`/portal/leads/${assignment.lead_id}`}
                >
                  <Card className="hover:border-border-light transition-colors cursor-pointer group">
                    <CardContent>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Route info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={statusConf.variant}>
                              {statusConf.label}
                            </Badge>
                            {!isRevealed && (
                              <Badge variant="default">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                            <span className="text-xs text-text-muted">
                              {timeAgo(assignment.assigned_at)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-text-primary font-medium">
                            <MapPin className="w-4 h-4 text-text-muted shrink-0" />
                            <span className="truncate">
                              {lead.from_postcode}
                            </span>
                            <ArrowRight className="w-4 h-4 text-text-muted shrink-0" />
                            <span className="truncate">
                              {lead.to_postcode}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-1.5 text-xs text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Home className="w-3.5 h-3.5" />
                              {getPropertyLabel(lead.property_size)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(lead.move_date)}
                            </span>
                            {lead.packing_required && (
                              <span className="text-primary-light">
                                + Packing
                              </span>
                            )}
                            {lead.storage_required && (
                              <span className="text-primary-light">
                                + Storage
                              </span>
                            )}
                          </div>
                        </div>

                        {/* View button */}
                        <div className="flex items-center">
                          <span className="text-sm text-primary-light group-hover:text-primary transition-colors flex items-center gap-1">
                            View
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/portal/profile">
          <Button variant="outline" size="sm">
            Update Profile
          </Button>
        </Link>
        <Link href="/portal/billing">
          <Button variant="outline" size="sm">
            Buy Credits
          </Button>
        </Link>
        <Link href="/portal/settings">
          <Button variant="outline" size="sm">
            Manage Coverage
          </Button>
        </Link>
      </div>
    </div>
  );
}
