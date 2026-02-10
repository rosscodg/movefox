import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CREDIT_PACKS } from '@/lib/constants';
import type { CreditLedger } from '@/types/database';
import { BillingClient } from './billing-client';

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let creditBalance = 0;
  let ledger: CreditLedger[] = [];

  try {
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
  } catch (error) {
    console.error('[portal/billing] Failed to fetch billing data:', error);
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
