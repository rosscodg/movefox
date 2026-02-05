import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Company } from '@/types/database';
import { CompaniesTable } from './companies-table';

export const metadata: Metadata = {
  title: 'Companies',
};

// --- Fallback Data ---
// Kept as dummy data so the page is still useful when the database is empty.
const FALLBACK_COMPANIES: (Company & {
  leadsAssigned: number;
  reveals: number;
  creditsBalance: number;
})[] = [
  {
    id: '1',
    name: 'Swift Movers Ltd',
    slug: 'swift-movers',
    description: 'Professional removal services across London and the South East.',
    address_line1: '42 High Street',
    address_line2: null,
    city: 'London',
    postcode: 'SW1A 1AA',
    phone: '020 7123 4567',
    email: 'info@swiftmovers.co.uk',
    website: 'https://swiftmovers.co.uk',
    logo_url: null,
    status: 'pending',
    paused: false,
    services: ['House Removals', 'Packing Services'],
    insurance_details: '£50,000 Public Liability',
    accreditations: ['BAR Member'],
    photos: [],
    created_at: '2025-01-28T08:00:00Z',
    updated_at: '2025-01-28T08:00:00Z',
    leadsAssigned: 0,
    reveals: 0,
    creditsBalance: 0,
  },
  {
    id: '2',
    name: 'Northern Relocations',
    slug: 'northern-relocations',
    description: 'Trusted removals in the North of England.',
    address_line1: '15 Market Street',
    address_line2: 'Unit 3B',
    city: 'Manchester',
    postcode: 'M1 1AD',
    phone: '0161 234 5678',
    email: 'hello@northernrelo.co.uk',
    website: null,
    logo_url: null,
    status: 'pending',
    paused: false,
    services: ['House Removals', 'Office Removals', 'Storage'],
    insurance_details: '£100,000 Public Liability',
    accreditations: ['Checkatrade', 'Trading Standards Approved'],
    photos: [],
    created_at: '2025-01-27T15:30:00Z',
    updated_at: '2025-01-27T15:30:00Z',
    leadsAssigned: 0,
    reveals: 0,
    creditsBalance: 0,
  },
  {
    id: '3',
    name: 'Careful Carriers',
    slug: 'careful-carriers',
    description: 'Specialist antique and piano movers based in Bristol.',
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
    services: ['House Removals', 'Antique Moving', 'Piano Moving'],
    insurance_details: '£200,000 Public Liability',
    accreditations: ['BAR Member', 'Which? Trusted Trader'],
    photos: [],
    created_at: '2025-01-20T12:00:00Z',
    updated_at: '2025-01-26T09:00:00Z',
    leadsAssigned: 48,
    reveals: 22,
    creditsBalance: 34,
  },
  {
    id: '4',
    name: 'Premier Moving Co',
    slug: 'premier-moving',
    description: 'Edinburgh premium home moving service.',
    address_line1: '120 George Street',
    address_line2: null,
    city: 'Edinburgh',
    postcode: 'EH2 4JN',
    phone: '0131 456 7890',
    email: 'contact@premiermoving.co.uk',
    website: 'https://premiermoving.co.uk',
    logo_url: null,
    status: 'approved',
    paused: false,
    services: ['House Removals', 'Packing Services', 'Storage'],
    insurance_details: '£150,000 Public Liability',
    accreditations: ['BAR Member'],
    photos: [],
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-01-25T14:00:00Z',
    leadsAssigned: 72,
    reveals: 45,
    creditsBalance: 12,
  },
  {
    id: '5',
    name: 'QuickShift Removals',
    slug: 'quickshift-removals',
    description: 'Fast and affordable man and van services.',
    address_line1: '5 New Street',
    address_line2: null,
    city: 'Birmingham',
    postcode: 'B2 4QA',
    phone: '0121 345 6789',
    email: 'book@quickshift.co.uk',
    website: null,
    logo_url: null,
    status: 'rejected',
    paused: false,
    services: ['Man and Van'],
    insurance_details: null,
    accreditations: [],
    photos: [],
    created_at: '2025-01-24T11:30:00Z',
    updated_at: '2025-01-25T10:00:00Z',
    leadsAssigned: 0,
    reveals: 0,
    creditsBalance: 0,
  },
  {
    id: '6',
    name: 'SafeHands Moving',
    slug: 'safehands-moving',
    description: 'Comprehensive moving solutions in the North West.',
    address_line1: '77 Bold Street',
    address_line2: null,
    city: 'Liverpool',
    postcode: 'L1 4HR',
    phone: '0151 222 3344',
    email: 'info@safehands.co.uk',
    website: 'https://safehands.co.uk',
    logo_url: null,
    status: 'suspended',
    paused: true,
    services: ['House Removals', 'Office Removals'],
    insurance_details: '£75,000 Public Liability',
    accreditations: ['Checkatrade'],
    photos: [],
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2025-01-20T16:00:00Z',
    leadsAssigned: 31,
    reveals: 18,
    creditsBalance: 5,
  },
];

export default async function CompaniesPage() {
  let companies: (Company & {
    leadsAssigned: number;
    reveals: number;
    creditsBalance: number;
  })[] = [];

  try {
    const supabase = await createClient();

    const { data: rawCompanies, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && rawCompanies && rawCompanies.length > 0) {
      // For each company, fetch aggregated stats
      companies = await Promise.all(
        rawCompanies.map(async (c) => {
          // Count of lead_assignments
          const { count: leadsAssigned } = await supabase
            .from('lead_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', c.id);

          // Count of revealed assignments (where revealed_at is not null)
          const { count: reveals } = await supabase
            .from('lead_assignments')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', c.id)
            .not('revealed_at', 'is', null);

          // Credit balance: latest ledger entry's balance_after
          const { data: latestLedger } = await supabase
            .from('credit_ledger')
            .select('balance_after')
            .eq('company_id', c.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...c,
            leadsAssigned: leadsAssigned ?? 0,
            reveals: reveals ?? 0,
            creditsBalance: latestLedger?.balance_after ?? 0,
          };
        })
      );
    }
  } catch {
    // Supabase unavailable or query failed — fall through to fallback
  }

  // Fall back to dummy data when the database is empty or errored
  if (companies.length === 0) {
    companies = FALLBACK_COMPANIES;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Companies</h2>
        <p className="text-text-secondary mt-1">Manage removal companies on the platform</p>
      </div>

      <CompaniesTable companies={companies} />
    </div>
  );
}
