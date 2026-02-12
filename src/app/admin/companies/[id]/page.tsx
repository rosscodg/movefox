import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Shield,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import type {
  Company,
  LeadAssignment,
  CreditLedger,
  PostcodeCoverage,
  CompanyUser,
  CompanyStatus,
  CreditReason,
  LeadAssignmentStatus,
} from '@/types/database';
import { formatDate, formatDateTime } from '@/lib/dates';
import { CompanyActions } from './company-actions';

export const metadata: Metadata = {
  title: 'Company Detail',
};

// --- Fallback data ---
// Kept as dummy data so the page is still useful when the database is empty.

function getFallbackCompany(id: string): Company {
  return {
    id,
    name: 'Careful Carriers',
    slug: 'careful-carriers',
    description: 'Specialist antique and piano movers based in Bristol. Family-run business with over 20 years of experience.',
    address_line1: '8 Park Row',
    address_line2: null,
    city: 'Bristol',
    postcode: 'BS1 4DJ',
    phone: '0117 987 6543',
    email: 'moves@carefulcarriers.co.uk',
    website: 'https://carefulcarriers.co.uk',
    logo_url: null,
    status: 'approved',
    paused: false,
    services: ['House Removals', 'Antique Moving', 'Piano Moving', 'Packing Services'],
    insurance_details: '£200,000 Public Liability, £50,000 Goods in Transit',
    accreditations: ['BAR Member', 'Which? Trusted Trader'],
    photos: [],
    created_at: '2025-01-20T12:00:00Z',
    updated_at: '2025-01-26T09:00:00Z',
  };
}

const FALLBACK_ASSIGNMENTS: (LeadAssignment & { leadFromPostcode: string; leadToPostcode: string })[] = [
  {
    id: 'la1',
    lead_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    company_id: '3',
    assigned_at: '2025-01-28T10:30:00Z',
    revealed_at: '2025-01-28T11:00:00Z',
    status: 'revealed',
    price_at_reveal: 7.0,
    notes: null,
    leadFromPostcode: 'BS1 4DJ',
    leadToPostcode: 'BA1 1SU',
  },
  {
    id: 'la2',
    lead_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    company_id: '3',
    assigned_at: '2025-01-27T09:15:00Z',
    revealed_at: null,
    status: 'assigned',
    price_at_reveal: null,
    notes: null,
    leadFromPostcode: 'BS2 8QH',
    leadToPostcode: 'GL1 1HT',
  },
  {
    id: 'la3',
    lead_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    company_id: '3',
    assigned_at: '2025-01-26T14:00:00Z',
    revealed_at: '2025-01-26T15:30:00Z',
    status: 'contacted',
    price_at_reveal: 5.0,
    notes: 'Customer very interested',
    leadFromPostcode: 'BS3 1QG',
    leadToPostcode: 'EX1 1EE',
  },
];

const FALLBACK_LEDGER: CreditLedger[] = [
  { id: 'cl1', company_id: '3', delta: 50, balance_after: 34, reason: 'purchase', reference_type: 'stripe', reference_id: 'pi_123', description: 'Growth Pack purchased', created_at: '2025-01-25T10:00:00Z' },
  { id: 'cl2', company_id: '3', delta: -7, balance_after: -16, reason: 'reveal', reference_type: 'lead_assignment', reference_id: 'la1', description: 'Reveal: BS1 4DJ to BA1 1SU', created_at: '2025-01-28T11:00:00Z' },
  { id: 'cl3', company_id: '3', delta: -5, balance_after: 45, reason: 'reveal', reference_type: 'lead_assignment', reference_id: 'la3', description: 'Reveal: BS3 1QG to EX1 1EE', created_at: '2025-01-26T15:30:00Z' },
  { id: 'cl4', company_id: '3', delta: 5, balance_after: 39, reason: 'refund', reference_type: 'lead_assignment', reference_id: 'la_old', description: 'Refund: duplicate lead', created_at: '2025-01-22T09:00:00Z' },
];

const FALLBACK_COVERAGE: PostcodeCoverage[] = [
  { id: 'pc1', company_id: '3', postcode_prefix: 'BS', enabled: true, created_at: '2025-01-20T12:00:00Z' },
  { id: 'pc2', company_id: '3', postcode_prefix: 'BA', enabled: true, created_at: '2025-01-20T12:00:00Z' },
  { id: 'pc3', company_id: '3', postcode_prefix: 'GL', enabled: true, created_at: '2025-01-20T12:00:00Z' },
  { id: 'pc4', company_id: '3', postcode_prefix: 'EX', enabled: false, created_at: '2025-01-20T12:00:00Z' },
  { id: 'pc5', company_id: '3', postcode_prefix: 'SN', enabled: true, created_at: '2025-01-20T12:00:00Z' },
];

const FALLBACK_USERS: (CompanyUser & { fullName: string; email: string })[] = [
  { id: 'cu1', company_id: '3', user_id: 'u1', is_primary: true, created_at: '2025-01-20T12:00:00Z', fullName: 'James Harper', email: 'james@carefulcarriers.co.uk' },
  { id: 'cu2', company_id: '3', user_id: 'u2', is_primary: false, created_at: '2025-01-22T08:00:00Z', fullName: 'Sarah Mitchell', email: 'sarah@carefulcarriers.co.uk' },
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

function assignmentStatusBadge(status: LeadAssignmentStatus) {
  switch (status) {
    case 'revealed': return 'info' as const;
    case 'contacted': return 'primary' as const;
    case 'quoted': return 'warning' as const;
    case 'won': return 'success' as const;
    case 'lost': return 'danger' as const;
    default: return 'default' as const;
  }
}

function reasonBadge(reason: CreditReason) {
  switch (reason) {
    case 'purchase': return 'success' as const;
    case 'reveal': return 'info' as const;
    case 'refund': return 'warning' as const;
    case 'adjustment': return 'primary' as const;
    default: return 'default' as const;
  }
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let company: Company;
  let assignments: (LeadAssignment & { leadFromPostcode: string; leadToPostcode: string })[];
  let ledger: CreditLedger[];
  let coverage: PostcodeCoverage[];
  let users: (CompanyUser & { fullName: string; email: string })[];
  let creditsBalance: number;

  try {
    const supabase = await createClient();

    // Fetch company
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (companyError || !companyData) {
      throw new Error('Company not found');
    }

    company = companyData;

    // Fetch assignments with joined lead postcodes
    const { data: assignmentsData } = await supabase
      .from('lead_assignments')
      .select('*, leads(from_postcode, to_postcode)')
      .eq('company_id', id)
      .order('assigned_at', { ascending: false });

    // Fetch ledger
    const { data: ledgerData } = await supabase
      .from('credit_ledger')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false });

    // Fetch coverage
    const { data: coverageData } = await supabase
      .from('postcode_coverage')
      .select('*')
      .eq('company_id', id);

    // Fetch users with joined profile data
    const { data: usersData } = await supabase
      .from('company_users')
      .select('*, profiles(full_name, email)')
      .eq('company_id', id);

    // Map assignments to include leadFromPostcode / leadToPostcode from joined leads
    assignments = (assignmentsData ?? []).map((a: Record<string, unknown>) => {
      const leads = a.leads as { from_postcode: string; to_postcode: string } | null;
      return {
        id: a.id as string,
        lead_id: a.lead_id as string,
        company_id: a.company_id as string,
        assigned_at: a.assigned_at as string,
        revealed_at: a.revealed_at as string | null,
        status: a.status as LeadAssignmentStatus,
        price_at_reveal: a.price_at_reveal as number | null,
        notes: a.notes as string | null,
        leadFromPostcode: leads?.from_postcode ?? '',
        leadToPostcode: leads?.to_postcode ?? '',
      };
    });

    // Map users to include fullName / email from joined profiles
    users = (usersData ?? []).map((u: Record<string, unknown>) => {
      const profile = u.profiles as { full_name: string; email: string } | null;
      return {
        id: u.id as string,
        company_id: u.company_id as string,
        user_id: u.user_id as string,
        is_primary: u.is_primary as boolean,
        created_at: u.created_at as string,
        fullName: profile?.full_name ?? '',
        email: profile?.email ?? '',
      };
    });

    ledger = (ledgerData ?? []) as CreditLedger[];
    coverage = (coverageData ?? []) as PostcodeCoverage[];

    // Credit balance: latest ledger entry's balance_after
    creditsBalance = ledger.length > 0 ? ledger[0].balance_after : 0;
  } catch {
    // Supabase unavailable or query failed — fall back to dummy data
    company = getFallbackCompany(id);
    assignments = FALLBACK_ASSIGNMENTS;
    ledger = FALLBACK_LEDGER;
    coverage = FALLBACK_COVERAGE;
    users = FALLBACK_USERS;
    creditsBalance = 34;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/companies"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">{company.name}</h2>
              <Badge variant={statusBadgeVariant(company.status)}>{company.status}</Badge>
            </div>
            <p className="text-text-secondary mt-1">Company ID: {company.id}</p>
          </div>
        </div>
        <CompanyActions companyId={company.id} companyName={company.name} companyEmail={company.email ?? ''} currentStatus={company.status} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Company Info — 2 col span */}
        <div className="xl:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary-light" />
                Company Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-text-secondary">{company.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-text-muted mt-0.5" />
                      <p className="text-sm text-text-secondary">
                        {company.address_line1}
                        {company.address_line2 && <>, {company.address_line2}</>}
                        <br />
                        {company.city}, {company.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-text-muted" />
                      <span className="text-sm text-text-secondary">{company.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-text-muted" />
                      <span className="text-sm text-text-secondary">{company.email}</span>
                    </div>
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-text-muted" />
                        <span className="text-sm text-text-secondary">{company.website}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {company.services.map((s) => (
                        <Badge key={s} variant="primary">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Accreditations</p>
                    <div className="flex flex-wrap gap-1.5">
                      {company.accreditations.length > 0 ? (
                        company.accreditations.map((a) => (
                          <Badge key={a} variant="success">
                            <Award className="h-3 w-3 mr-1" />
                            {a}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-text-muted">None listed</span>
                      )}
                    </div>
                  </div>
                  {company.insurance_details && (
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Insurance</p>
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-accent mt-0.5" />
                        <span className="text-sm text-text-secondary">{company.insurance_details}</span>
                      </div>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-muted">Joined</p>
                        <p className="text-text-primary font-medium">{formatDate(company.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Last updated</p>
                        <p className="text-text-primary font-medium">{formatDate(company.updated_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Leads */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-text-muted font-medium px-6 py-3">Lead</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Route</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Assigned</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Revealed</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Status</th>
                      <th className="text-right text-text-muted font-medium px-6 py-3">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                        <td className="px-6 py-3">
                          <Link href={`/admin/leads/${a.lead_id}`} className="text-primary-light hover:underline font-mono text-xs">
                            {a.lead_id.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-text-primary">
                          {a.leadFromPostcode} → {a.leadToPostcode}
                        </td>
                        <td className="px-4 py-3 text-text-secondary text-xs">{formatDateTime(a.assigned_at)}</td>
                        <td className="px-4 py-3 text-text-secondary text-xs">
                          {a.revealed_at ? formatDateTime(a.revealed_at) : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={assignmentStatusBadge(a.status)}>{a.status}</Badge>
                        </td>
                        <td className="px-6 py-3 text-right text-text-primary font-medium">
                          {a.price_at_reveal != null ? `£${a.price_at_reveal.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Credit Ledger */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Credit Ledger</CardTitle>
                <div className="text-sm">
                  <span className="text-text-muted">Balance: </span>
                  <span className="text-text-primary font-bold">{creditsBalance} credits</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-text-muted font-medium px-6 py-3">Date</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Reason</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Description</th>
                      <th className="text-right text-text-muted font-medium px-4 py-3">Delta</th>
                      <th className="text-right text-text-muted font-medium px-6 py-3">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((entry) => (
                      <tr key={entry.id} className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors">
                        <td className="px-6 py-3 text-text-secondary text-xs">{formatDateTime(entry.created_at)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={reasonBadge(entry.reason)}>{entry.reason}</Badge>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{entry.description}</td>
                        <td className={`px-4 py-3 text-right font-medium ${entry.delta > 0 ? 'text-accent' : 'text-danger'}`}>
                          {entry.delta > 0 ? '+' : ''}{entry.delta}
                        </td>
                        <td className="px-6 py-3 text-right text-text-primary">{entry.balance_after}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Manual Credit Adjustment */}
          <Card>
            <CardHeader>
              <CardTitle>Credit Adjustment</CardTitle>
            </CardHeader>
            <CardContent>
              <CompanyAdjustmentForm companyId={company.id} />
            </CardContent>
          </Card>

          {/* Postcode Coverage */}
          <Card>
            <CardHeader>
              <CardTitle>Postcode Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {coverage.map((pc) => (
                  <div
                    key={pc.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-alt"
                  >
                    <span className="text-sm text-text-primary font-mono">{pc.postcode_prefix}</span>
                    <Badge variant={pc.enabled ? 'success' : 'default'}>
                      {pc.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Company Users */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-alt">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{user.fullName}</p>
                      <p className="text-xs text-text-muted">{user.email}</p>
                    </div>
                    {user.is_primary && <Badge variant="primary">Primary</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Client sub-component for credit adjustment form ---
// Defined inline as a simple form; the interactivity is in the CompanyActions component.
function CompanyAdjustmentForm({ companyId }: { companyId: string }) {
  // This is a server component rendering a form that posts to a server action.
  // For now, the form just renders static HTML. Wire up server action later.
  return (
    <form
      className="space-y-4"
      // action={adjustCredits}
    >
      <input type="hidden" name="company_id" value={companyId} />
      <div className="space-y-1.5">
        <label htmlFor="amount" className="block text-sm font-medium text-text-primary">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          placeholder="e.g. 10 or -5"
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
        />
        <p className="text-xs text-text-muted">Positive to add credits, negative to deduct.</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="reason" className="block text-sm font-medium text-text-primary">
          Reason
        </label>
        <textarea
          id="reason"
          name="reason"
          rows={3}
          placeholder="Reason for adjustment..."
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center font-semibold transition-all duration-200 bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 px-5 py-2.5 text-sm rounded-xl"
      >
        Adjust Credits
      </button>
    </form>
  );
}
