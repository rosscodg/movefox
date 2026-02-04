'use client';

import { Check, X, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CompanyStatus } from '@/types/database';

interface CompanyActionsProps {
  companyId: string;
  currentStatus: CompanyStatus;
}

export function CompanyActions({ companyId, currentStatus }: CompanyActionsProps) {
  function handleApprove() {
    // In production:
    // Server action: update company status to 'approved', log to audit
    // await supabase.from('companies').update({ status: 'approved' }).eq('id', companyId);
    alert(`Approve company ${companyId} — wire up server action`);
  }

  function handleReject() {
    // In production:
    // Server action: update company status to 'rejected', log to audit
    // await supabase.from('companies').update({ status: 'rejected' }).eq('id', companyId);
    alert(`Reject company ${companyId} — wire up server action`);
  }

  function handleSuspend() {
    // In production:
    // Server action: update company status to 'suspended', log to audit
    // await supabase.from('companies').update({ status: 'suspended', paused: true }).eq('id', companyId);
    alert(`Suspend company ${companyId} — wire up server action`);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currentStatus === 'pending' && (
        <>
          <Button variant="primary" className="gap-1.5" onClick={handleApprove}>
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button variant="danger" className="gap-1.5" onClick={handleReject}>
            <X className="h-4 w-4" />
            Reject
          </Button>
        </>
      )}
      {currentStatus === 'approved' && (
        <Button variant="danger" className="gap-1.5" onClick={handleSuspend}>
          <Pause className="h-4 w-4" />
          Suspend
        </Button>
      )}
      {currentStatus === 'suspended' && (
        <Button variant="primary" className="gap-1.5" onClick={handleApprove}>
          <Check className="h-4 w-4" />
          Reinstate
        </Button>
      )}
      {currentStatus === 'rejected' && (
        <Button variant="primary" className="gap-1.5" onClick={handleApprove}>
          <Check className="h-4 w-4" />
          Approve
        </Button>
      )}
    </div>
  );
}
