import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PROPERTY_SIZES } from '@/lib/constants';
import type {
  Lead,
  LeadAssignment,
  LeadContactDetails,
} from '@/types/database';
import { LeadDetailClient } from './lead-detail-client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let lead: Lead | null = null;
  let assignment: LeadAssignment | null = null;
  let contactDetails: LeadContactDetails | null = null;
  const creditCost = 5; // default reveal cost

  // Fetch lead
  const { data: leadData } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  if (leadData) lead = leadData;

  // Fetch assignment for this company
  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single();

  if (companyUser) {
    const { data: assignmentData } = await supabase
      .from('lead_assignments')
      .select('*')
      .eq('lead_id', id)
      .eq('company_id', companyUser.company_id)
      .single();
    if (assignmentData) assignment = assignmentData;
  }

  // If revealed, fetch contact details
  if (assignment?.revealed_at) {
    const { data: contactData } = await supabase
      .from('lead_contact_details')
      .select('*')
      .eq('lead_id', id)
      .single();
    if (contactData) contactDetails = contactData;
  }

  if (!lead || !assignment) {
    notFound();
  }

  return (
    <LeadDetailClient
      lead={lead}
      assignment={assignment}
      contactDetails={contactDetails}
      creditCost={creditCost}
      propertySizes={PROPERTY_SIZES as unknown as { value: string; label: string }[]}
    />
  );
}
