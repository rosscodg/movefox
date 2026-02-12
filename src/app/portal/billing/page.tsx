import { createClient } from '@/lib/supabase/server';
import { CREDIT_PACKS } from '@/lib/constants';
import type { CreditLedger } from '@/types/database';
import { BillingClient } from './billing-client';

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_BALANCE = 12;

const MOCK_LEDGER: CreditLedger[] = [
  {
    id: 'ledger_001',
    company_id: 'comp_001',
    delta: -5,
    balance_after: 12,
    reason: 'reveal',
    reference_type: 'lead_assignment',
    reference_id: 'asgn_002',
    description: 'Revealed contact: N1 to SE15 (3 Bed)',
    created_at: '2025-01-27T15:30:00Z',
  },
  {
    id: 'ledger_002',
    company_id: 'comp_001',
    delta: -5,
    balance_after: 17,
    reason: 'reveal',
    reference_type: 'lead_assignment',
    reference_id: 'asgn_003',
    description: 'Revealed contact: E1 to W1D (1 Bed)',
    created_at: '2025-01-26T11:00:00Z',
  },
  {
    id: 'ledger_003',
    company_id: 'comp_001',
    delta: -7,
    balance_after: 22,
    reason: 'reveal',
    reference_type: 'lead_assignment',
    reference_id: 'asgn_004',
    description: 'Revealed contact: SW6 to TW9 (4 Bed)',
    created_at: '2025-01-25T16:30:00Z',
  },
  {
    id: 'ledger_004',
    company_id: 'comp_001',
    delta: -5,
    balance_after: 29,
    reason: 'reveal',
    reference_type: 'lead_assignment',
    reference_id: 'asgn_005',
    description: 'Revealed contact: SE1 to BR1 (Studio)',
    created_at: '2025-01-20T13:00:00Z',
  },
  {
    id: 'ledger_005',
    company_id: 'comp_001',
    delta: 5,
    balance_after: 34,
    reason: 'refund',
    reference_type: 'lead_assignment',
    reference_id: 'asgn_006',
    description: 'Refund: Invalid lead (duplicate)',
    created_at: '2025-01-18T10:00:00Z',
  },
  {
    id: 'ledger_006',
    company_id: 'comp_001',
    delta: 50,
    balance_after: 29,
    reason: 'purchase',
    reference_type: 'stripe_payment',
    reference_id: 'pi_mock_001',
    description: 'Purchased Growth Pack (50 credits)',
    created_at: '2025-01-15T09:00:00Z',
  },
  {
    id: 'ledger_007',
    company_id: 'comp_001',
    delta: -5,
    balance_after: -21,
    reason: 'reveal',
    reference_type: 'lead_assignment',
    reference_id: 'asgn_007',
    description: 'Revealed contact: WC2 to NW3 (2 Bed)',
    created_at: '2025-01-10T14:00:00Z',
  },
  {
    id: 'ledger_008',
    company_id: 'comp_001',
    delta: 20,
    balance_after: -16,
    reason: 'purchase',
    reference_type: 'stripe_payment',
    reference_id: 'pi_mock_002',
    description: 'Purchased Starter Pack (20 credits)',
    created_at: '2025-01-02T11:00:00Z',
  },
];

export default async function BillingPage() {
  let creditBalance = MOCK_BALANCE;
  let ledger: CreditLedger[] = MOCK_LEDGER;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch company
      const { data: companyUser } = await supabase
        .from('company_users')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (companyUser) {
        // Fetch credit balance
        const { data: balanceData } = await supabase
          .from('credit_ledger')
          .select('balance_after')
          .eq('company_id', companyUser.company_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (balanceData) {
          creditBalance = balanceData.balance_after;
        }

        // Fetch ledger history
        const { data: ledgerData } = await supabase
          .from('credit_ledger')
          .select('*')
          .eq('company_id', companyUser.company_id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (ledgerData && ledgerData.length > 0) {
          ledger = ledgerData;
        }
      }
    }
  } catch {
    // Fall through to mock data
  }

  const creditPacks = CREDIT_PACKS.map((pack) => ({
    name: pack.name,
    credits: pack.credits,
    priceGbp: pack.price_gbp,
    perCredit: (pack.price_gbp / pack.credits).toFixed(2),
  }));

  return (
    <BillingClient
      creditBalance={creditBalance}
      creditPacks={creditPacks}
      ledger={ledger}
    />
  );
}
