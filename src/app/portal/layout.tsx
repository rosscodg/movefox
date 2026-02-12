import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Company } from '@/types/database';
import { LOW_CREDIT_THRESHOLD } from '@/lib/constants';
import { PortalShell } from './portal-shell';

// ─── Mock data (replace with Supabase queries when connected) ───────────────
const MOCK_COMPANY: Company = {
  id: 'comp_001',
  name: 'Swift Removals Ltd',
  slug: 'swift-removals',
  description: 'Professional removal services across London and the South East.',
  address_line1: '14 Warehouse Lane',
  address_line2: null,
  city: 'London',
  postcode: 'SE1 9PQ',
  phone: '020 7946 0958',
  email: 'info@swiftremovals.co.uk',
  website: 'https://swiftremovals.co.uk',
  logo_url: null,
  status: 'approved',
  paused: false,
  services: ['House Removals', 'Office Removals', 'Packing Services', 'Storage'],
  insurance_details: 'Goods in transit cover up to £50,000. Public liability £5M.',
  accreditations: ['BAR Member', 'Which? Trusted Trader'],
  photos: [],
  created_at: '2024-06-01T10:00:00Z',
  updated_at: '2024-12-01T10:00:00Z',
};

const MOCK_CREDIT_BALANCE = 12;

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ─── Auth check ─────────────────────────────────────────────────────────────
  let company: Company = MOCK_COMPANY;
  let creditBalance: number = MOCK_CREDIT_BALANCE;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    // Fetch company for this user
    const { data: companyUser } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    if (companyUser) {
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyUser.company_id)
        .single();

      if (companyData) {
        company = companyData;
      }

      // Fetch credit balance (latest ledger entry)
      const { data: ledger } = await supabase
        .from('credit_ledger')
        .select('balance_after')
        .eq('company_id', companyUser.company_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (ledger) {
        creditBalance = ledger.balance_after;
      }
    }
  } catch {
    // In development without Supabase, fall through to mock data
  }

  return (
    <PortalShell
      companyName={company.name}
      creditBalance={creditBalance}
      lowCreditThreshold={LOW_CREDIT_THRESHOLD}
    >
      {children}
    </PortalShell>
  );
}
