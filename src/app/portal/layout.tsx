import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LOW_CREDIT_THRESHOLD } from '@/lib/constants';
import { PortalShell } from './portal-shell';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Defaults for when the user has no company yet (e.g. pending registration)
  let companyName = 'Your Company';
  let creditBalance = 0;

  // Fetch company for this user
  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single();

  if (companyUser) {
    const { data: companyData } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyUser.company_id)
      .single();

    if (companyData) {
      companyName = companyData.name;
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

  return (
    <PortalShell
      companyName={companyName}
      creditBalance={creditBalance}
      lowCreditThreshold={LOW_CREDIT_THRESHOLD}
    >
      {children}
    </PortalShell>
  );
}
