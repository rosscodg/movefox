import { createClient } from '@/lib/supabase/server';
import { LOW_CREDIT_THRESHOLD, PROPERTY_SIZES } from '@/lib/constants';
import type {
  Company,
  Lead,
  LeadAssignment,
  LeadAssignmentWithLead,
} from '@/types/database';
import { DashboardClient } from './dashboard-client';

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_COMPANY: Company = {
  id: 'comp_001',
  name: 'Swift Removals Ltd',
  slug: 'swift-removals',
  description: null,
  address_line1: null,
  address_line2: null,
  city: null,
  postcode: null,
  phone: null,
  email: null,
  website: null,
  logo_url: null,
  status: 'approved',
  paused: false,
  services: [],
  insurance_details: null,
  accreditations: [],
  photos: [],
  created_at: '2024-06-01T10:00:00Z',
  updated_at: '2024-12-01T10:00:00Z',
};

const MOCK_ASSIGNMENTS: LeadAssignmentWithLead[] = [
  {
    id: 'asgn_001',
    lead_id: 'lead_001',
    company_id: 'comp_001',
    assigned_at: '2025-01-28T09:00:00Z',
    revealed_at: null,
    status: 'assigned',
    price_at_reveal: null,
    notes: null,
    leads: {
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
      additional_notes: null,
      created_at: '2025-01-28T08:30:00Z',
    },
  },
  {
    id: 'asgn_002',
    lead_id: 'lead_002',
    company_id: 'comp_001',
    assigned_at: '2025-01-27T14:00:00Z',
    revealed_at: '2025-01-27T15:30:00Z',
    status: 'contacted',
    price_at_reveal: 5,
    notes: 'Called, left voicemail',
    leads: {
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
  },
  {
    id: 'asgn_003',
    lead_id: 'lead_003',
    company_id: 'comp_001',
    assigned_at: '2025-01-26T10:00:00Z',
    revealed_at: '2025-01-26T11:00:00Z',
    status: 'quoted',
    price_at_reveal: 5,
    notes: 'Quoted £850 for full service',
    leads: {
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
  },
  {
    id: 'asgn_004',
    lead_id: 'lead_004',
    company_id: 'comp_001',
    assigned_at: '2025-01-25T16:00:00Z',
    revealed_at: '2025-01-25T16:30:00Z',
    status: 'won',
    price_at_reveal: 7,
    notes: 'Booked for £1,200',
    leads: {
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
  },
  {
    id: 'asgn_005',
    lead_id: 'lead_005',
    company_id: 'comp_001',
    assigned_at: '2025-01-20T12:00:00Z',
    revealed_at: '2025-01-20T13:00:00Z',
    status: 'lost',
    price_at_reveal: 5,
    notes: 'Customer went with another company',
    leads: {
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
  },
];

export default async function PortalDashboard() {
  let companyName = 'Swift Removals Ltd';
  let assignments: LeadAssignmentWithLead[] = MOCK_ASSIGNMENTS;
  let creditBalance = 12;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch company
      // const { data: companyUser } = await supabase
      //   .from('company_users')
      //   .select('company_id')
      //   .eq('user_id', user.id)
      //   .single();

      // const { data: company } = await supabase
      //   .from('companies')
      //   .select('*')
      //   .eq('id', companyUser.company_id)
      //   .single();

      // if (company) {
      //   companyName = company.name;
      // }

      // Fetch lead assignments with lead data
      // const { data: assignmentData } = await supabase
      //   .from('lead_assignments')
      //   .select('*, leads(*)')
      //   .eq('company_id', companyUser.company_id)
      //   .order('assigned_at', { ascending: false });

      // if (assignmentData) {
      //   assignments = assignmentData;
      // }

      // Fetch credit balance
      // const { data: ledger } = await supabase
      //   .from('credit_ledger')
      //   .select('balance_after')
      //   .eq('company_id', companyUser.company_id)
      //   .order('created_at', { ascending: false })
      //   .limit(1)
      //   .single();

      // if (ledger) {
      //   creditBalance = ledger.balance_after;
      // }
    }
  } catch {
    // Fall through to mock data
  }

  // Compute stats
  const newLeads = assignments.filter((a) => a.status === 'assigned').length;
  const revealedLeads = assignments.filter(
    (a) => a.revealed_at !== null
  ).length;
  const thisMonth = assignments.filter((a) => {
    const d = new Date(a.assigned_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <DashboardClient
      companyName={companyName}
      assignments={assignments}
      stats={{
        newLeads,
        revealedLeads,
        creditBalance,
        leadsThisMonth: thisMonth,
      }}
      lowCreditThreshold={LOW_CREDIT_THRESHOLD}
      propertySizes={PROPERTY_SIZES as unknown as { value: string; label: string }[]}
    />
  );
}
