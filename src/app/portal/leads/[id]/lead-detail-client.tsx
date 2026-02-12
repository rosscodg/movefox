'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Home,
  Package,
  Warehouse,
  Wrench,
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Coins,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  MessageSquare,
  Save,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type {
  Lead,
  LeadAssignment,
  LeadContactDetails,
  LeadAssignmentStatus,
} from '@/types/database';
import { formatDate, formatDateTime } from '@/lib/dates';

interface LeadDetailClientProps {
  lead: Lead;
  assignment: LeadAssignment;
  contactDetails: LeadContactDetails | null;
  creditCost: number;
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

const UPDATE_STATUSES: { value: LeadAssignmentStatus; label: string }[] = [
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export function LeadDetailClient({
  lead,
  assignment,
  contactDetails,
  creditCost,
  propertySizes,
}: LeadDetailClientProps) {
  const [status, setStatus] = useState<LeadAssignmentStatus>(assignment.status);
  const [notes, setNotes] = useState(assignment.notes ?? '');
  const [isRevealing, setIsRevealing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [revealed, setRevealed] = useState(assignment.revealed_at !== null);
  const [contact, setContact] = useState<LeadContactDetails | null>(
    contactDetails
  );

  const isRevealed = revealed;
  const statusConf = STATUS_CONFIG[status];

  function getPropertyLabel(value: string): string {
    return propertySizes.find((p) => p.value === value)?.label ?? value;
  }

  async function handleReveal() {
    setIsRevealing(true);

    // TODO: Call server action to reveal contact details
    // This would:
    // 1. Deduct credits from company balance
    // 2. Update lead_assignment.revealed_at
    // 3. Return contact details
    // await revealLeadContact(assignment.id);

    // Mock reveal for now
    await new Promise((r) => setTimeout(r, 1500));
    setRevealed(true);
    setContact({
      id: 'contact_mock',
      lead_id: lead.id,
      full_name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '07700 900999',
      consent_given: true,
      created_at: new Date().toISOString(),
    });
    setStatus('revealed');
    setIsRevealing(false);
  }

  async function handleSaveNotes() {
    setIsSaving(true);

    // TODO: Call server action to update assignment notes and status
    // await updateLeadAssignment(assignment.id, { status, notes });

    // Mock save
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link + header */}
      <div>
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to leads
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-text-primary">Lead Details</h1>
              <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
            </div>
            <p className="text-sm text-text-secondary">
              Received {formatDateTime(assignment.assigned_at)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main content (2 cols) ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-light" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Route */}
                <div className="flex items-center gap-3 p-3 bg-surface-alt rounded-xl">
                  <MapPin className="w-5 h-5 text-primary-light shrink-0" />
                  <div className="flex items-center gap-2 text-text-primary font-medium">
                    <span>{lead.from_postcode}</span>
                    <ArrowRight className="w-4 h-4 text-text-muted" />
                    <span>{lead.to_postcode}</span>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Move Date
                      </p>
                      <p className="text-sm text-text-primary font-medium">
                        {formatDate(lead.move_date)}
                      </p>
                      {lead.move_date_flexible && (
                        <p className="text-xs text-primary-light mt-0.5">
                          Dates are flexible
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Home className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wide">
                        Property Size
                      </p>
                      <p className="text-sm text-text-primary font-medium">
                        {getPropertyLabel(lead.property_size)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services required */}
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-2">
                    Services Required
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lead.packing_required && (
                      <Badge variant="primary">
                        <Package className="w-3 h-3 mr-1" />
                        Packing
                      </Badge>
                    )}
                    {lead.storage_required && (
                      <Badge variant="primary">
                        <Warehouse className="w-3 h-3 mr-1" />
                        Storage
                      </Badge>
                    )}
                    {lead.dismantling_required && (
                      <Badge variant="primary">
                        <Wrench className="w-3 h-3 mr-1" />
                        Dismantling
                      </Badge>
                    )}
                    {lead.fragile_items && (
                      <Badge variant="warning">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Fragile Items
                      </Badge>
                    )}
                    {!lead.packing_required &&
                      !lead.storage_required &&
                      !lead.dismantling_required &&
                      !lead.fragile_items && (
                        <span className="text-sm text-text-muted">
                          Standard removal only
                        </span>
                      )}
                  </div>
                </div>

                {/* Access notes */}
                {lead.access_notes && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                      Access Notes
                    </p>
                    <p className="text-sm text-text-secondary bg-surface-alt p-3 rounded-lg">
                      {lead.access_notes}
                    </p>
                  </div>
                )}

                {/* Additional notes */}
                {lead.additional_notes && (
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide mb-1">
                      Additional Notes
                    </p>
                    <p className="text-sm text-text-secondary bg-surface-alt p-3 rounded-lg">
                      {lead.additional_notes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-light" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isRevealed && contact ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/30 rounded-xl mb-4">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-sm text-accent">
                      Contact details revealed
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wide">
                          Name
                        </p>
                        <p className="text-sm text-text-primary font-medium">
                          {contact.full_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wide">
                          Phone
                        </p>
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-sm text-primary-light hover:text-primary font-medium transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2">
                      <Mail className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-text-muted uppercase tracking-wide">
                          Email
                        </p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-primary-light hover:text-primary font-medium transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-2xl bg-surface-alt flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-1">
                    Contact details are hidden
                  </h3>
                  <p className="text-sm text-text-secondary mb-4 max-w-sm mx-auto">
                    Reveal this customer&apos;s contact information to get in
                    touch and provide a quote.
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins className="w-4 h-4 text-primary-light" />
                    <span className="text-sm text-text-secondary">
                      Cost:{' '}
                      <span className="font-bold text-text-primary">
                        {creditCost} credits
                      </span>
                    </span>
                  </div>
                  <Button
                    onClick={handleReveal}
                    loading={isRevealing}
                    className="gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    Reveal Contact Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar (1 col) ────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Status update */}
          {isRevealed && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="w-4 h-4 text-primary-light" />
                  Update Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as LeadAssignmentStatus)
                    }
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {UPDATE_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internal notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="w-4 h-4 text-primary-light" />
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes about this lead..."
                rows={4}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
              <Button
                onClick={handleSaveNotes}
                loading={isSaving}
                size="sm"
                className="mt-3 w-full gap-2"
              >
                <Save className="w-4 h-4" />
                Save Notes
              </Button>
            </CardContent>
          </Card>

          {/* Assignment info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-primary-light" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Lead Created</p>
                    <p className="text-sm text-text-secondary">
                      {formatDateTime(lead.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-info mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Assigned to You</p>
                    <p className="text-sm text-text-secondary">
                      {formatDateTime(assignment.assigned_at)}
                    </p>
                  </div>
                </div>

                {assignment.revealed_at && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs text-text-muted">
                        Contact Revealed
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatDateTime(assignment.revealed_at)}
                      </p>
                      {assignment.price_at_reveal && (
                        <p className="text-xs text-text-muted mt-0.5">
                          {assignment.price_at_reveal} credits used
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
