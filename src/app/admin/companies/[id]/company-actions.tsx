'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Pause,
  Loader2,
  PartyPopper,
  Mail,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CompanyStatus } from '@/types/database';
import { approveCompany, rejectCompany, suspendCompany } from '@/app/admin/actions';

interface CompanyActionsProps {
  companyId: string;
  companyName: string;
  companyEmail: string;
  currentStatus: CompanyStatus;
}

const DEFAULT_APPROVAL_MESSAGE = `Congratulations. Your application to join MoveCompare has been approved.

You can now log in to your partner portal to manage your company profile, set your coverage areas, and start receiving removal leads from customers in your area.

Click the button below to securely sign in to your account — no password needed.`;

const DEFAULT_REJECTION_MESSAGE = `Thank you for your interest in joining MoveCompare.

After reviewing your application, we're unable to approve your company at this time. If you believe this was made in error or would like to discuss further, please don't hesitate to contact us.`;

type DialogType = 'approve' | 'reject' | null;

export function CompanyActions({
  companyId,
  companyName,
  companyEmail,
  currentStatus,
}: CompanyActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogType>(null);
  const [emailMessage, setEmailMessage] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap and escape key
  useEffect(() => {
    if (!dialog) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) setDialog(null);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [dialog, loading]);

  function openApproveDialog() {
    setEmailMessage(DEFAULT_APPROVAL_MESSAGE);
    setError(null);
    setSuccess(null);
    setDialog('approve');
  }

  function openRejectDialog() {
    setEmailMessage(DEFAULT_REJECTION_MESSAGE);
    setError(null);
    setSuccess(null);
    setDialog('reject');
  }

  async function handleAction(action: 'approve' | 'reject' | 'suspend') {
    if (action === 'suspend') {
      if (!confirm('Suspend this company? They will lose access to the portal.')) return;
    }

    setLoading(action);
    setError(null);
    setSuccess(null);

    try {
      let result: { success: boolean; error?: string };

      switch (action) {
        case 'approve':
          result = await approveCompany(companyId, {
            sendEmail: true,
            companyEmail,
            companyName,
            emailMessage,
          });
          break;
        case 'reject':
          result = await rejectCompany(companyId, {
            sendEmail: true,
            companyEmail,
            companyName,
            emailMessage,
          });
          break;
        case 'suspend':
          result = await suspendCompany(companyId);
          break;
      }

      if (result.success) {
        setDialog(null);

        if (action === 'approve') {
          const approveResult = result as { success: boolean; emailSent?: boolean; emailError?: string };
          if (approveResult.emailSent) {
            setSuccess(`${companyName} has been approved! A welcome email with magic link has been sent to ${companyEmail}.`);
          } else if (approveResult.emailError) {
            setSuccess(`${companyName} has been approved, but the email could not be sent: ${approveResult.emailError}`);
          } else {
            setSuccess(`${companyName} has been approved! The partner can use the login page to request a magic link.`);
          }
        } else if (action === 'reject') {
          setSuccess(`${companyName} has been rejected. A notification email has been sent.`);
        } else {
          setSuccess('Company suspended');
        }

        router.refresh();
      } else {
        setError(result.error || 'Action failed');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {currentStatus === 'pending' && (
            <>
              <Button
                variant="primary"
                className="gap-1.5"
                onClick={openApproveDialog}
                disabled={loading !== null}
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="danger"
                className="gap-1.5"
                onClick={openRejectDialog}
                disabled={loading !== null}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          {currentStatus === 'approved' && (
            <Button
              variant="danger"
              className="gap-1.5"
              onClick={() => handleAction('suspend')}
              disabled={loading !== null}
            >
              {loading === 'suspend' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
              Suspend
            </Button>
          )}
          {currentStatus === 'suspended' && (
            <Button
              variant="primary"
              className="gap-1.5"
              onClick={openApproveDialog}
              disabled={loading !== null}
            >
              <Check className="h-4 w-4" />
              Reinstate
            </Button>
          )}
          {currentStatus === 'rejected' && (
            <Button
              variant="primary"
              className="gap-1.5"
              onClick={openApproveDialog}
              disabled={loading !== null}
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
          )}
        </div>

        {error && !dialog && (
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-sm text-accent flex items-start gap-3">
            <PartyPopper className="h-5 w-5 shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}
      </div>

      {/* ── Approval / Rejection dialog overlay ────────────────────── */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !loading && setDialog(null)}
          />

          {/* Dialog */}
          <div
            ref={dialogRef}
            className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header banner */}
            {dialog === 'approve' ? (
              <div className="bg-gradient-to-r from-accent/90 to-primary/90 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <PartyPopper className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Approve {companyName}
                    </h3>
                    <p className="text-sm text-white/80">
                      A welcome email with magic link will be sent
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-danger/90 to-danger/70 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Reject {companyName}
                    </h3>
                    <p className="text-sm text-white/80">
                      A rejection notice will be sent
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Recipient */}
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-text-muted" />
                <span className="text-text-secondary">
                  Email will be sent to{' '}
                  <span className="font-medium text-text-primary">
                    {companyEmail}
                  </span>
                </span>
              </div>

              {/* Editable email body */}
              <div>
                <label
                  htmlFor="email-message"
                  className="block text-sm font-medium text-text-primary mb-1.5"
                >
                  Email message
                </label>
                <textarea
                  id="email-message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={7}
                  className="w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none leading-relaxed"
                />
                <p className="text-xs text-text-muted mt-1">
                  {dialog === 'approve'
                    ? 'A magic sign-in link will be appended automatically below this message.'
                    : 'You can customise the message before sending.'}
                </p>
              </div>

              {/* Error within dialog */}
              {error && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
                  {error}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3 bg-surface-alt/50">
              <Button
                variant="ghost"
                onClick={() => setDialog(null)}
                disabled={loading !== null}
              >
                Cancel
              </Button>
              <Button
                variant={dialog === 'approve' ? 'primary' : 'danger'}
                className="gap-2"
                onClick={() => handleAction(dialog)}
                disabled={loading !== null}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {dialog === 'approve' ? 'Approving...' : 'Rejecting...'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {dialog === 'approve'
                      ? 'Approve & Send Welcome Email'
                      : 'Reject & Send Notice'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
