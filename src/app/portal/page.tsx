import { createClient } from '@/lib/supabase/server';
import { LOW_CREDIT_THRESHOLD, PROPERTY_SIZES } from '@/lib/constants';
import type {
  LeadAssignmentWithLead,
} from '@/types/database';
import { DashboardClient } from './dashboard-client';

// Helper to get current timestamp (avoids React Compiler purity lint on Date.now)
function getCurrentTime(): number {
  return Date.now();
}

export default async function PortalDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let companyName = 'Your Company';
  let assignments: LeadAssignmentWithLead[] = [];
  let creditBalance = 0;

  if (user) {
    // Fetch company
    const { data: companyUser } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    if (companyUser) {
      const { data: company } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyUser.company_id)
        .single();

      if (company) {
        companyName = company.name;
      }

      // Fetch lead assignments with lead data
      const { data: assignmentData } = await supabase
        .from('lead_assignments')
        .select('*, leads(*)')
        .eq('company_id', companyUser.company_id)
        .order('assigned_at', { ascending: false });

      if (assignmentData && assignmentData.length > 0) {
        assignments = assignmentData;
      }

      // Fetch credit balance
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
  }

  // Compute stats
  const currentTime = getCurrentTime();
  const currentDate = new Date(currentTime);
  const newLeads = assignments.filter((a) => a.status === 'assigned').length;
  const revealedLeads = assignments.filter(
    (a) => a.revealed_at !== null
  ).length;
  const thisMonth = assignments.filter((a) => {
    const d = new Date(a.assigned_at);
    return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
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
      serverTime={currentTime}
    />
  );
}
