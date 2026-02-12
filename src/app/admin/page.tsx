import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Building2,
  Eye,
  PoundSterling,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import type { Lead, Company } from '@/types/database';
import { formatDate } from '@/lib/dates';

export const metadata: Metadata = {
  title: 'Dashboard',
};

// --- Fallback mock data (shown when Supabase tables are empty) ---
const FALLBACK_KPIS = {
  totalLeads: 1_247,
  leadsThisWeek: 83,
  totalReveals: 4_891,
  revenue: 29_346,
  activeCompanies: 64,
  pendingApproval: 7,
};

const FALLBACK_LEADS: (Lead & { assignedCount: number; revealedCount: number })[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    from_postcode: 'SW1A 1AA',
    to_postcode: 'E1 6AN',
    move_date: '2025-02-15',
    move_date_flexible: false,
    property_size: '2_bed',
    access_notes: null,
    packing_required: true,
    storage_required: false,
    dismantling_required: false,
    fragile_items: true,
    additional_notes: null,
    created_at: '2025-01-28T10:30:00Z',
    assignedCount: 5,
    revealedCount: 3,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    from_postcode: 'M1 1AD',
    to_postcode: 'LS1 1UR',
    move_date: '2025-03-01',
    move_date_flexible: true,
    property_size: '3_bed',
    access_notes: 'Third floor, no lift',
    packing_required: false,
    storage_required: true,
    dismantling_required: true,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-28T09:15:00Z',
    assignedCount: 4,
    revealedCount: 2,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    from_postcode: 'BS1 4DJ',
    to_postcode: 'BA1 1SU',
    move_date: '2025-02-20',
    move_date_flexible: false,
    property_size: '1_bed',
    access_notes: null,
    packing_required: false,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-27T16:45:00Z',
    assignedCount: 5,
    revealedCount: 5,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    from_postcode: 'B1 1BB',
    to_postcode: 'CV1 1FL',
    move_date: '2025-02-10',
    move_date_flexible: true,
    property_size: '4_bed',
    access_notes: 'Narrow driveway',
    packing_required: true,
    storage_required: true,
    dismantling_required: true,
    fragile_items: true,
    additional_notes: 'Grand piano needs moving',
    created_at: '2025-01-27T14:20:00Z',
    assignedCount: 3,
    revealedCount: 1,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    from_postcode: 'EH1 1YZ',
    to_postcode: 'G1 1XQ',
    move_date: null,
    move_date_flexible: true,
    property_size: 'studio',
    access_notes: null,
    packing_required: false,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-27T11:00:00Z',
    assignedCount: 5,
    revealedCount: 4,
  },
];

const FALLBACK_COMPANIES: Pick<Company, 'id' | 'name' | 'city' | 'status' | 'created_at'>[] = [
  { id: '1', name: 'Swift Movers Ltd', city: 'London', status: 'pending', created_at: '2025-01-28T08:00:00Z' },
  { id: '2', name: 'Northern Relocations', city: 'Manchester', status: 'pending', created_at: '2025-01-27T15:30:00Z' },
  { id: '3', name: 'Careful Carriers', city: 'Bristol', status: 'approved', created_at: '2025-01-26T12:00:00Z' },
  { id: '4', name: 'Premier Moving Co', city: 'Edinburgh', status: 'approved', created_at: '2025-01-25T09:00:00Z' },
  { id: '5', name: 'QuickShift Removals', city: 'Birmingham', status: 'pending', created_at: '2025-01-24T11:30:00Z' },
];

// --- Fetch real data from Supabase (falls back to mock if empty) ---
async function getDashboardData() {
  try {
    const supabase = await createClient();

    // Fetch KPIs
    const [
      { count: totalLeads },
      { count: activeCompanies },
      { count: pendingApproval },
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('companies').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    // Leads this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const { count: leadsThisWeek } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    // Total reveals & revenue
    const { data: revealData } = await supabase
      .from('lead_assignments')
      .select('price_at_reveal')
      .not('revealed_at', 'is', null);

    const totalReveals = revealData?.length ?? 0;
    const revenue = revealData?.reduce((sum, r) => sum + (Number(r.price_at_reveal) || 0), 0) ?? 0;

    const hasRealData = (totalLeads ?? 0) > 0;

    const kpis = hasRealData
      ? {
          totalLeads: totalLeads ?? 0,
          leadsThisWeek: leadsThisWeek ?? 0,
          totalReveals,
          revenue,
          activeCompanies: activeCompanies ?? 0,
          pendingApproval: pendingApproval ?? 0,
        }
      : FALLBACK_KPIS;

    // Recent leads with assignment counts
    const { data: dbLeads } = await supabase
      .from('leads')
      .select('*, lead_assignments(id, revealed_at)')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentLeads = dbLeads && dbLeads.length > 0
      ? dbLeads.map((l) => {
          const { lead_assignments, ...rest } = l as Lead & { lead_assignments: { id: string; revealed_at: string | null }[] };
          return {
            ...(rest as Lead),
            assignedCount: lead_assignments?.length ?? 0,
            revealedCount: lead_assignments?.filter(
              (a) => a.revealed_at !== null
            ).length ?? 0,
          };
        })
      : FALLBACK_LEADS;

    // Recent companies
    const { data: dbCompanies } = await supabase
      .from('companies')
      .select('id, name, city, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentCompanies = dbCompanies && dbCompanies.length > 0
      ? dbCompanies
      : FALLBACK_COMPANIES;

    return { kpis, recentLeads, recentCompanies };
  } catch {
    return {
      kpis: FALLBACK_KPIS,
      recentLeads: FALLBACK_LEADS,
      recentCompanies: FALLBACK_COMPANIES,
    };
  }
}

function statusBadgeVariant(status: string) {
  switch (status) {
    case 'approved': return 'success' as const;
    case 'pending': return 'warning' as const;
    case 'rejected': return 'danger' as const;
    case 'suspended': return 'danger' as const;
    default: return 'default' as const;
  }
}

export default async function AdminDashboardPage() {
  const { kpis, recentLeads, recentCompanies } = await getDashboardData();

  const kpiCards = [
    { label: 'Total Leads', value: kpis.totalLeads.toLocaleString(), icon: FileText, color: 'text-primary-light' },
    { label: 'Leads This Week', value: kpis.leadsThisWeek.toLocaleString(), icon: TrendingUp, color: 'text-accent' },
    { label: 'Total Reveals', value: kpis.totalReveals.toLocaleString(), icon: Eye, color: 'text-info' },
    { label: 'Revenue', value: `£${kpis.revenue.toLocaleString()}`, icon: PoundSterling, color: 'text-accent' },
    { label: 'Active Companies', value: kpis.activeCompanies.toLocaleString(), icon: Building2, color: 'text-primary-light' },
    { label: 'Pending Approval', value: kpis.pendingApproval.toLocaleString(), icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
        <p className="text-text-secondary mt-1">Overview of your platform activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{kpi.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-surface-alt ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Leads — spans 2 cols */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Link
                href="/admin/leads"
                className="text-sm text-primary-light hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-text-muted font-medium px-6 py-3">ID</th>
                    <th className="text-left text-text-muted font-medium px-4 py-3">Route</th>
                    <th className="text-left text-text-muted font-medium px-4 py-3">Date</th>
                    <th className="text-center text-text-muted font-medium px-4 py-3">Assigned</th>
                    <th className="text-center text-text-muted font-medium px-4 py-3">Revealed</th>
                    <th className="text-left text-text-muted font-medium px-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="text-primary-light hover:underline font-mono text-xs"
                        >
                          {lead.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        {lead.from_postcode} → {lead.to_postcode}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {lead.move_date ? formatDate(lead.move_date) : 'Flexible'}
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary">
                        {lead.assignedCount}
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary">
                        {lead.revealedCount}
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Company Signups */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Signups</CardTitle>
                <Link
                  href="/admin/companies"
                  className="text-sm text-primary-light hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCompanies.map((company) => (
                  <Link
                    key={company.id}
                    href={`/admin/companies/${company.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-alt transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">{company.name}</p>
                      <p className="text-xs text-text-muted">{company.city} &middot; {formatDate(company.created_at)}</p>
                    </div>
                    <Badge variant={statusBadgeVariant(company.status)}>
                      {company.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/leads" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  View All Leads
                </Button>
              </Link>
              <Link href="/admin/companies" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Building2 className="h-4 w-4" />
                  Manage Companies
                </Button>
              </Link>
              <Link href="/admin/pricing" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <PoundSterling className="h-4 w-4" />
                  Pricing Rules
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
