import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PROPERTY_SIZES } from '@/lib/constants';
import type {
  Lead,
  LeadAssignment,
  LeadContactDetails,
} from '@/types/database';
import { LeadDetailClient } from './lead-detail-client';

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_LEADS: Record<string, Lead> = {
  lead_001: {
    id: 'lead_001',
    from_postcode: 'SW1A 1AA',
    to_postcode: 'EC2R 8AH',
    move_date: '2025-02-15',
    move_date_flexible: false,
    property_size: '2_bed',
    access_notes: 'Third floor, no lift',
    packing_required: true,
    storage_required: false,
    dismantling_required: false,
    fragile_items: true,
    additional_notes: 'Need everything packed carefully, lots of books',
    created_at: '2025-01-28T08:30:00Z',
  },
  lead_002: {
    id: 'lead_002',
    from_postcode: 'N1 9GU',
    to_postcode: 'SE15 5DQ',
    move_date: '2025-02-20',
    move_date_flexible: true,
    property_size: '3_bed',
    access_notes: null,
    packing_required: false,
    storage_required: true,
    dismantling_required: true,
    fragile_items: false,
    additional_notes: 'Need to move a piano',
    created_at: '2025-01-27T13:00:00Z',
  },
  lead_003: {
    id: 'lead_003',
    from_postcode: 'E1 6AN',
    to_postcode: 'W1D 3AF',
    move_date: '2025-03-01',
    move_date_flexible: false,
    property_size: '1_bed',
    access_notes: 'Ground floor flat, easy access',
    packing_required: true,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-26T09:00:00Z',
  },
  lead_004: {
    id: 'lead_004',
    from_postcode: 'SW6 1HS',
    to_postcode: 'TW9 1DN',
    move_date: '2025-02-10',
    move_date_flexible: false,
    property_size: '4_bed',
    access_notes: 'Parking available on driveway',
    packing_required: true,
    storage_required: false,
    dismantling_required: true,
    fragile_items: true,
    additional_notes: 'Large antique wardrobe needs careful handling',
    created_at: '2025-01-25T15:00:00Z',
  },
  lead_005: {
    id: 'lead_005',
    from_postcode: 'SE1 9PQ',
    to_postcode: 'BR1 1LU',
    move_date: '2025-02-05',
    move_date_flexible: true,
    property_size: 'studio',
    access_notes: null,
    packing_required: false,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-20T11:00:00Z',
  },
};

const MOCK_ASSIGNMENTS: Record<string, LeadAssignment> = {
  lead_001: {
    id: 'asgn_001',
    lead_id: 'lead_001',
    company_id: 'comp_001',
    assigned_at: '2025-01-28T09:00:00Z',
    revealed_at: null,
    status: 'assigned',
    price_at_reveal: null,
    notes: null,
  },
  lead_002: {
    id: 'asgn_002',
    lead_id: 'lead_002',
    company_id: 'comp_001',
    assigned_at: '2025-01-27T14:00:00Z',
    revealed_at: '2025-01-27T15:30:00Z',
    status: 'contacted',
    price_at_reveal: 5,
    notes: 'Called, left voicemail',
  },
  lead_003: {
    id: 'asgn_003',
    lead_id: 'lead_003',
    company_id: 'comp_001',
    assigned_at: '2025-01-26T10:00:00Z',
    revealed_at: '2025-01-26T11:00:00Z',
    status: 'quoted',
    price_at_reveal: 5,
    notes: 'Quoted £850 for full service',
  },
  lead_004: {
    id: 'asgn_004',
    lead_id: 'lead_004',
    company_id: 'comp_001',
    assigned_at: '2025-01-25T16:00:00Z',
    revealed_at: '2025-01-25T16:30:00Z',
    status: 'won',
    price_at_reveal: 7,
    notes: 'Booked for £1,200',
  },
  lead_005: {
    id: 'asgn_005',
    lead_id: 'lead_005',
    company_id: 'comp_001',
    assigned_at: '2025-01-20T12:00:00Z',
    revealed_at: '2025-01-20T13:00:00Z',
    status: 'lost',
    price_at_reveal: 5,
    notes: 'Customer went with another company',
  },
};

const MOCK_CONTACTS: Record<string, LeadContactDetails> = {
  lead_002: {
    id: 'contact_002',
    lead_id: 'lead_002',
    full_name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '07700 900123',
    consent_given: true,
    created_at: '2025-01-27T13:00:00Z',
  },
  lead_003: {
    id: 'contact_003',
    lead_id: 'lead_003',
    full_name: 'James Patel',
    email: 'j.patel@example.com',
    phone: '07700 900456',
    consent_given: true,
    created_at: '2025-01-26T09:00:00Z',
  },
  lead_004: {
    id: 'contact_004',
    lead_id: 'lead_004',
    full_name: 'Emma Williams',
    email: 'emma.w@gmail.com',
    phone: '07700 900789',
    consent_given: true,
    created_at: '2025-01-25T15:00:00Z',
  },
  lead_005: {
    id: 'contact_005',
    lead_id: 'lead_005',
    full_name: 'Tom Chen',
    email: 'tom.chen@outlook.com',
    phone: '07700 900012',
    consent_given: true,
    created_at: '2025-01-20T11:00:00Z',
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;

  let lead: Lead | null = null;
  let assignment: LeadAssignment | null = null;
  let contactDetails: LeadContactDetails | null = null;
  let creditCost = 5; // default reveal cost

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch lead
      // const { data: leadData } = await supabase
      //   .from('leads')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      // lead = leadData;

      // Fetch assignment for this company
      // const { data: companyUser } = await supabase
      //   .from('company_users')
      //   .select('company_id')
      //   .eq('user_id', user.id)
      //   .single();

      // const { data: assignmentData } = await supabase
      //   .from('lead_assignments')
      //   .select('*')
      //   .eq('lead_id', id)
      //   .eq('company_id', companyUser.company_id)
      //   .single();
      // assignment = assignmentData;

      // If revealed, fetch contact details
      // if (assignment?.revealed_at) {
      //   const { data: contactData } = await supabase
      //     .from('lead_contact_details')
      //     .select('*')
      //     .eq('lead_id', id)
      //     .single();
      //   contactDetails = contactData;
      // }
    }
  } catch {
    // Fall through to mock data
  }

  // Use mock data if no real data was fetched
  if (!lead) {
    lead = MOCK_LEADS[id] ?? null;
  }
  if (!assignment) {
    assignment = MOCK_ASSIGNMENTS[id] ?? null;
  }
  if (!contactDetails && assignment?.revealed_at) {
    contactDetails = MOCK_CONTACTS[id] ?? null;
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
