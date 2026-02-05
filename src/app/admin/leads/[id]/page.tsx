import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Home,
  Package,
  Warehouse,
  Wrench,
  AlertTriangle,
  User,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import type {
  Lead,
  LeadContactDetails,
  LeadAssignment,
  LeadAssignmentStatus,
} from '@/types/database';
import { PROPERTY_SIZES } from '@/lib/constants';
import { LeadAssignmentActions } from './lead-assignment-actions';

export const metadata: Metadata = {
  title: 'Lead Detail',
};

// --- Fallback Data (used when Supabase tables are empty or query errors) ---

function getFallbackLead(id: string): Lead {
  return {
    id,
    from_postcode: 'SW1A 1AA',
    to_postcode: 'E1 6AN',
    move_date: '2025-02-15',
    move_date_flexible: false,
    property_size: '2_bed',
    access_notes: 'Basement flat, narrow staircase. Parking available on street.',
    packing_required: true,
    storage_required: false,
    dismantling_required: true,
    fragile_items: true,
    additional_notes: 'Need to be out by 4pm. Several large bookshelves and a king-size bed frame to dismantle.',
    created_at: '2025-01-28T10:30:00Z',
  };
}

function getFallbackContact(leadId: string): LeadContactDetails {
  return {
    id: 'lc1',
    lead_id: leadId,
    full_name: 'Sarah Thompson',
    email: 'sarah.thompson@gmail.com',
    phone: '07700 900123',
    consent_given: true,
    created_at: '2025-01-28T10:30:00Z',
  };
}

const FALLBACK_ASSIGNMENTS: (LeadAssignment & { companyName: string })[] = [
  {
    id: 'la1',
    lead_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    company_id: '3',
    assigned_at: '2025-01-28T10:35:00Z',
    revealed_at: '2025-01-28T11:00:00Z',
    status: 'contacted',
    price_at_reveal: 7.0,
    notes: null,
    companyName: 'Careful Carriers',
  },
  {
    id: 'la2',
    lead_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    company_id: '4',
    assigned_at: '2025-01-28T10:35:00Z',
    revealed_at: '2025-01-28T14:20:00Z',
    status: 'quoted',
    price_at_reveal: 7.0,
    notes: 'Quoted £450 for 2-bed move',
    companyName: 'Premier Moving Co',
  },
  {
    id: 'la3',
    lead_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    company_id: '7',
    assigned_at: '2025-01-28T10:35:00Z',
    revealed_at: '2025-01-29T09:00:00Z',
    status: 'revealed',
    price_at_reveal: 7.0,
    notes: null,
    companyName: 'London Movers Express',
  },
  {
    id: 'la4',
    lead_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    company_id: '8',
    assigned_at: '2025-01-28T10:35:00Z',
    revealed_at: null,
    status: 'assigned',
    price_at_reveal: null,
    notes: null,
    companyName: 'City Relocations',
  },
  {
    id: 'la5',
    lead_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    company_id: '9',
    assigned_at: '2025-01-28T10:35:00Z',
    revealed_at: null,
    status: 'assigned',
    price_at_reveal: null,
    notes: null,
    companyName: 'Thames Valley Removals',
  },
];

async function getLeadData(id: string) {
  try {
    const supabase = await createClient();

    const [leadResult, contactResult, assignmentsResult] = await Promise.all([
      supabase.from('leads').select('*').eq('id', id).single(),
      supabase.from('lead_contact_details').select('*').eq('lead_id', id).single(),
      supabase.from('lead_assignments').select('*, companies(name)').eq('lead_id', id),
    ]);

    const lead: Lead = leadResult.data ?? getFallbackLead(id);
    const contact: LeadContactDetails = contactResult.data ?? getFallbackContact(id);

    let assignments: (LeadAssignment & { companyName: string })[];
    if (assignmentsResult.error || !assignmentsResult.data || assignmentsResult.data.length === 0) {
      assignments = FALLBACK_ASSIGNMENTS;
    } else {
      assignments = assignmentsResult.data.map((a: LeadAssignment & { companies?: { name: string } | null }) => ({
        ...a,
        companyName: a.companies?.name ?? 'Unknown Company',
        companies: undefined,
      }));
    }

    return { lead, contact, assignments };
  } catch {
    return {
      lead: getFallbackLead(id),
      contact: getFallbackContact(id),
      assignments: FALLBACK_ASSIGNMENTS,
    };
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function propertySizeLabel(value: string) {
  return PROPERTY_SIZES.find((p) => p.value === value)?.label ?? value;
}

function assignmentStatusBadge(status: LeadAssignmentStatus) {
  switch (status) {
    case 'assigned': return 'default' as const;
    case 'revealed': return 'info' as const;
    case 'contacted': return 'primary' as const;
    case 'quoted': return 'warning' as const;
    case 'won': return 'success' as const;
    case 'lost': return 'danger' as const;
    default: return 'default' as const;
  }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { lead, contact, assignments } = await getLeadData(id);

  const requirementsList = [
    { label: 'Packing', icon: Package, value: lead.packing_required },
    { label: 'Storage', icon: Warehouse, value: lead.storage_required },
    { label: 'Dismantling', icon: Wrench, value: lead.dismantling_required },
    { label: 'Fragile Items', icon: AlertTriangle, value: lead.fragile_items },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/leads"
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Lead Detail</h2>
          <p className="text-text-secondary mt-0.5 font-mono text-sm">{lead.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content — 2 cols */}
        <div className="xl:col-span-2 space-y-6">
          {/* Lead Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary-light" />
                Move Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Route</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-light" />
                      <span className="text-text-primary font-medium">
                        {lead.from_postcode} → {lead.to_postcode}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Move Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-text-muted" />
                      <span className="text-text-primary">
                        {lead.move_date ? formatDate(lead.move_date) : 'Not specified'}
                        {lead.move_date_flexible && (
                          <Badge variant="info" className="ml-2">Flexible</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Property Size</p>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-text-muted" />
                      <span className="text-text-primary">{propertySizeLabel(lead.property_size)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Created</p>
                    <span className="text-text-secondary text-sm">{formatDateTime(lead.created_at)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Requirements</p>
                    <div className="grid grid-cols-2 gap-2">
                      {requirementsList.map((req) => {
                        const Icon = req.icon;
                        return (
                          <div
                            key={req.label}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              req.value
                                ? 'bg-primary/10 text-primary-light'
                                : 'bg-surface-alt text-text-muted'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {req.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {lead.access_notes && (
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Access Notes</p>
                      <p className="text-sm text-text-secondary">{lead.access_notes}</p>
                    </div>
                  )}
                  {lead.additional_notes && (
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Additional Notes</p>
                      <p className="text-sm text-text-secondary">{lead.additional_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>
                Assignments ({assignments.length}/5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-text-muted font-medium px-6 py-3">Company</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Assigned</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Revealed</th>
                      <th className="text-left text-text-muted font-medium px-4 py-3">Status</th>
                      <th className="text-right text-text-muted font-medium px-4 py-3">Price</th>
                      <th className="text-right text-text-muted font-medium px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment) => (
                      <tr
                        key={assignment.id}
                        className="border-b border-border/50 hover:bg-surface-alt/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/companies/${assignment.company_id}`}
                            className="text-text-primary font-medium hover:text-primary-light transition-colors"
                          >
                            {assignment.companyName}
                          </Link>
                          {assignment.notes && (
                            <p className="text-xs text-text-muted mt-0.5">{assignment.notes}</p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-text-secondary text-xs">
                          {formatDateTime(assignment.assigned_at)}
                        </td>
                        <td className="px-4 py-4 text-text-secondary text-xs">
                          {assignment.revealed_at ? formatDateTime(assignment.revealed_at) : '-'}
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={assignmentStatusBadge(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 text-right text-text-primary font-medium">
                          {assignment.price_at_reveal != null
                            ? `£${assignment.price_at_reveal.toFixed(2)}`
                            : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {assignment.revealed_at && (
                            <LeadAssignmentActions assignmentId={assignment.id} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — Contact details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary-light" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-text-primary font-medium">{contact.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-muted" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary-light hover:underline text-sm"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-text-muted" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-light hover:underline text-sm"
                  >
                    {contact.phone}
                  </a>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <Badge variant={contact.consent_given ? 'success' : 'danger'}>
                  {contact.consent_given ? 'Consent Given' : 'No Consent'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Summary stats */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-xl bg-surface-alt">
                  <p className="text-2xl font-bold text-text-primary">
                    {assignments.length}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Assigned</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-alt">
                  <p className="text-2xl font-bold text-text-primary">
                    {assignments.filter((a) => a.revealed_at).length}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Revealed</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-alt">
                  <p className="text-2xl font-bold text-text-primary">
                    £{assignments
                      .filter((a) => a.price_at_reveal)
                      .reduce((sum, a) => sum + (a.price_at_reveal ?? 0), 0)
                      .toFixed(2)}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Revenue</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-surface-alt">
                  <p className="text-2xl font-bold text-text-primary">
                    {assignments.filter((a) => a.status === 'quoted' || a.status === 'won').length}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Quoted/Won</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
