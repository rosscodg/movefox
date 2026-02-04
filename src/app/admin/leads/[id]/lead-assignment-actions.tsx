'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeadAssignmentActionsProps {
  assignmentId: string;
}

export function LeadAssignmentActions({ assignmentId }: LeadAssignmentActionsProps) {
  function handleRefund() {
    // In production:
    // Server action: credit back to company ledger, update assignment, log to audit
    // 1. Get the assignment to find company_id and price_at_reveal
    // 2. Insert credit_ledger entry with delta = +price_at_reveal, reason = 'refund'
    // 3. Update the lead_assignment status or add a refund flag
    // 4. Log to admin_audit_log
    alert(`Refund reveal for assignment ${assignmentId} — wire up server action`);
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="gap-1 text-warning hover:text-warning"
      onClick={handleRefund}
    >
      <RotateCcw className="h-3.5 w-3.5" />
      Refund
    </Button>
  );
}
