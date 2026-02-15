'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { pricingRuleSchema } from '@/lib/validations';
import { sendPartnerApprovalEmail, sendPartnerRejectionEmail, isResendConfigured } from '@/lib/email';
import { WELCOME_CREDITS } from '@/lib/constants';
import type { CompanyStatus } from '@/types/database';

interface EmailOptions {
  sendEmail: boolean;
  companyEmail: string;
  companyName: string;
  emailMessage: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function verifyAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return { supabase, user };
}

async function insertAuditLog(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  actorUserId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  beforeData?: Record<string, unknown> | null,
  afterData?: Record<string, unknown> | null
) {
  const { error } = await supabase.from('admin_audit_log').insert({
    actor_user_id: actorUserId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_data: beforeData ?? null,
    after_data: afterData ?? null,
  });

  if (error) {
    console.error('[admin/actions] Failed to insert audit log:', error);
  }
}

// ─── Company status management ───────────────────────────────────────────────

async function updateCompanyStatus(
  companyId: string,
  newStatus: CompanyStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await verifyAdmin();
    const supabase = await createAdminClient();

    // Fetch current company state
    const { data: company, error: fetchError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (fetchError || !company) {
      return { success: false, error: 'Company not found' };
    }

    const previousStatus = company.status;

    // Update status
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    if (updateError) {
      console.error('[admin/actions] Failed to update company status:', updateError);
      return { success: false, error: 'Failed to update company status' };
    }

    // Audit log
    await insertAuditLog(
      supabase,
      user.id,
      `company_${newStatus}`,
      'company',
      companyId,
      { status: previousStatus },
      { status: newStatus }
    );

    revalidatePath('/admin');
    revalidatePath('/admin/companies');
    revalidatePath(`/admin/companies/${companyId}`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

export async function approveCompany(
  companyId: string,
  emailOptions?: EmailOptions
): Promise<{ success: boolean; error?: string; emailSent?: boolean; emailError?: string }> {
  const result = await updateCompanyStatus(companyId, 'approved');

  let emailSent = false;
  let emailError: string | undefined;

  // Grant welcome credits (idempotent — skips if already granted)
  if (result.success && WELCOME_CREDITS > 0) {
    try {
      const supabaseForCredits = await createAdminClient();

      // Idempotency: check if welcome credits were already granted
      const { data: existingWelcome } = await supabaseForCredits
        .from('credit_ledger')
        .select('id')
        .eq('company_id', companyId)
        .eq('reference_type', 'welcome_credits')
        .eq('reference_id', companyId)
        .limit(1)
        .maybeSingle();

      if (!existingWelcome) {
        // Get current balance
        const { data: latestLedger } = await supabaseForCredits
          .from('credit_ledger')
          .select('balance_after')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const currentBalance = Number(latestLedger?.balance_after ?? 0);
        const newBalance = currentBalance + WELCOME_CREDITS;

        const { error: ledgerError } = await supabaseForCredits.from('credit_ledger').insert({
          company_id: companyId,
          delta: WELCOME_CREDITS,
          balance_after: newBalance,
          reason: 'adjustment',
          reference_type: 'welcome_credits',
          reference_id: companyId,
          description: `Welcome credits for newly approved partner (${WELCOME_CREDITS} credits)`,
        });

        if (ledgerError) {
          console.error('[admin/actions] Failed to grant welcome credits:', ledgerError);
        } else {
          // Audit log for welcome credits — use the admin user from verifyAdmin via updateCompanyStatus
          // We need the actor ID; fetch it here since we're outside that scope
          const adminClient = await createClient();
          const { data: { user: adminUser } } = await adminClient.auth.getUser();
          if (adminUser) {
            await insertAuditLog(
              supabaseForCredits,
              adminUser.id,
              'welcome_credits_granted',
              'company',
              companyId,
              { balance: currentBalance },
              { balance: newBalance, delta: WELCOME_CREDITS }
            );
          }
        }
      }
    } catch (err) {
      // Non-fatal: company was already approved, credits are a bonus
      console.error('[admin/actions] Failed to process welcome credits:', err);
    }
  }

  if (result.success && emailOptions?.sendEmail) {
    try {
      const supabase = await createAdminClient();
      // Find the primary user for this company to get their auth email
      const { data: companyUser, error: cuError } = await supabase
        .from('company_users')
        .select('user_id')
        .eq('company_id', companyId)
        .eq('is_primary', true)
        .single();

      if (cuError) {
        console.error('[admin/actions] Failed to find primary company user:', cuError);
      }

      if (companyUser) {
        // Get the user's auth email
        const { data: userData, error: userLookupError } = await supabase.auth.admin.getUserById(
          companyUser.user_id
        );

        if (userLookupError) {
          console.error('[admin/actions] Failed to get user by ID:', userLookupError);
        }

        const userEmail = userData?.user?.email;

        if (userEmail) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://movecompare.co.uk';

          if (isResendConfigured()) {
            // Resend is configured — generate magic link and send branded email
            const { data: linkData, error: linkError } =
              await supabase.auth.admin.generateLink({
                type: 'magiclink',
                email: userEmail,
                options: {
                  redirectTo: `${appUrl}/auth/callback`,
                },
              });

            if (linkError) {
              console.error('[admin/actions] Failed to generate magic link:', linkError);
              emailError = 'Failed to generate magic link';
            } else if (linkData?.properties?.action_link) {
              await sendPartnerApprovalEmail(
                emailOptions.companyEmail,
                emailOptions.companyName,
                linkData.properties.action_link,
                emailOptions.emailMessage
              );
              emailSent = true;
            }
          } else {
            // Resend not configured — send magic link via Supabase's built-in mailer
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

            const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: anonKey,
              },
              body: JSON.stringify({
                email: userEmail,
                create_user: false,
                gotrue_meta_security: {},
              }),
            });

            if (!response.ok) {
              const errBody = await response.text();
              console.error('[admin/actions] Supabase magic link email failed:', response.status, errBody);

              try {
                const errJson = JSON.parse(errBody);
                if (response.status === 429 || errJson.error_code === 'over_email_send_rate_limit') {
                  emailError = 'Email rate limit exceeded. Supabase free tier allows ~3 emails/hour. Set up custom SMTP in the Supabase dashboard to remove this limit.';
                } else {
                  emailError = errJson.msg || 'Failed to send magic link email';
                }
              } catch {
                emailError = 'Failed to send magic link email';
              }
            } else {
              emailSent = true;
            }
          }
        } else {
          emailError = 'Could not find auth email for this user';
          console.warn('[admin/actions] No auth email found for user — cannot send magic link');
        }
      } else {
        emailError = 'No primary user linked to this company';
        console.warn('[admin/actions] No primary company user found for company:', companyId);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[admin/actions] Failed to send approval email:', msg);
      emailError = `Email sending failed: ${msg}`;
    }
  }

  return { ...result, emailSent, emailError };
}

export async function rejectCompany(
  companyId: string,
  emailOptions?: EmailOptions
): Promise<{ success: boolean; error?: string }> {
  const result = await updateCompanyStatus(companyId, 'rejected');

  if (result.success && emailOptions?.sendEmail) {
    try {
      await sendPartnerRejectionEmail(
        emailOptions.companyEmail,
        emailOptions.companyName,
        emailOptions.emailMessage
      );
    } catch (emailError) {
      console.error('[admin/actions] Failed to send rejection email:', emailError);
      // Non-fatal: company status was already updated
    }
  }

  return result;
}

export async function suspendCompany(
  companyId: string
): Promise<{ success: boolean; error?: string }> {
  return updateCompanyStatus(companyId, 'suspended');
}

// ─── Adjust credits ─────────────────────────────────────────────────────────

export async function adjustCredits(
  companyId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!amount || amount === 0) {
      return { success: false, error: 'Amount must be non-zero' };
    }

    if (!reason || reason.trim().length === 0) {
      return { success: false, error: 'Reason is required' };
    }

    const { user } = await verifyAdmin();
    const supabase = await createAdminClient();

    // Get current balance
    const { data: latestLedger } = await supabase
      .from('credit_ledger')
      .select('balance_after')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const currentBalance = latestLedger?.balance_after ?? 0;
    const newBalance = currentBalance + amount;

    if (newBalance < 0) {
      return {
        success: false,
        error: `Adjustment would result in negative balance (current: ${currentBalance}, adjustment: ${amount})`,
      };
    }

    // Insert ledger entry
    const { error: ledgerError } = await supabase.from('credit_ledger').insert({
      company_id: companyId,
      delta: amount,
      balance_after: newBalance,
      reason: 'adjustment',
      reference_type: 'admin_adjustment',
      reference_id: null,
      description: `Admin adjustment: ${reason.trim()}`,
    });

    if (ledgerError) {
      console.error('[admin/actions] Failed to insert ledger entry:', ledgerError);
      return { success: false, error: 'Failed to adjust credits' };
    }

    // Audit log
    await insertAuditLog(
      supabase,
      user.id,
      'credit_adjustment',
      'company',
      companyId,
      { balance: currentBalance },
      { balance: newBalance, delta: amount, reason: reason.trim() }
    );

    revalidatePath('/admin');
    revalidatePath(`/admin/companies/${companyId}`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── Refund reveal ───────────────────────────────────────────────────────────

export async function refundReveal(
  assignmentId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await verifyAdmin();
    const supabase = await createAdminClient();

    // Fetch the assignment
    const { data: assignment, error: fetchError } = await supabase
      .from('lead_assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();

    if (fetchError || !assignment) {
      return { success: false, error: 'Lead assignment not found' };
    }

    if (!assignment.revealed_at || !assignment.price_at_reveal) {
      return { success: false, error: 'This assignment has not been revealed or has no price recorded' };
    }

    const refundAmount = assignment.price_at_reveal;
    const companyId = assignment.company_id;

    // Get current balance
    const { data: latestLedger } = await supabase
      .from('credit_ledger')
      .select('balance_after')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const currentBalance = latestLedger?.balance_after ?? 0;
    const newBalance = currentBalance + refundAmount;

    // Insert refund ledger entry
    const { error: ledgerError } = await supabase.from('credit_ledger').insert({
      company_id: companyId,
      delta: refundAmount,
      balance_after: newBalance,
      reason: 'refund',
      reference_type: 'lead_assignment',
      reference_id: assignmentId,
      description: `Refund for lead reveal (assignment: ${assignmentId})`,
    });

    if (ledgerError) {
      console.error('[admin/actions] Failed to insert refund ledger entry:', ledgerError);
      return { success: false, error: 'Failed to process refund' };
    }

    // Update assignment status
    const { error: updateError } = await supabase
      .from('lead_assignments')
      .update({ status: 'assigned' })
      .eq('id', assignmentId);

    if (updateError) {
      console.error('[admin/actions] Failed to update assignment after refund:', updateError);
    }

    // Audit log
    await insertAuditLog(
      supabase,
      user.id,
      'reveal_refund',
      'lead_assignment',
      assignmentId,
      {
        status: assignment.status,
        price_at_reveal: assignment.price_at_reveal,
        balance: currentBalance,
      },
      {
        status: 'assigned',
        refund_amount: refundAmount,
        balance: newBalance,
      }
    );

    revalidatePath('/admin');
    revalidatePath('/admin/leads');
    revalidatePath(`/admin/leads/${assignment.lead_id}`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── Update pricing rule ────────────────────────────────────────────────────

export async function updatePricingRule(
  ruleId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await verifyAdmin();
    const supabase = await createAdminClient();

    // Validate pricing data
    const result = pricingRuleSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: `Validation failed: ${result.error.issues.map((i) => i.message).join(', ')}`,
      };
    }

    // Fetch current state for audit log
    const { data: currentRule } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('id', ruleId)
      .single();

    if (!currentRule) {
      return { success: false, error: 'Pricing rule not found' };
    }

    // If setting this rule to active, deactivate all others
    if (result.data.is_active && !currentRule.is_active) {
      await supabase
        .from('pricing_rules')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .neq('id', ruleId);
    }

    // Update the rule
    const { error: updateError } = await supabase
      .from('pricing_rules')
      .update({
        ...result.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ruleId);

    if (updateError) {
      console.error('[admin/actions] Failed to update pricing rule:', updateError);
      return { success: false, error: 'Failed to update pricing rule' };
    }

    // Audit log
    await insertAuditLog(
      supabase,
      user.id,
      'pricing_rule_update',
      'pricing_rule',
      ruleId,
      currentRule as unknown as Record<string, unknown>,
      result.data as unknown as Record<string, unknown>
    );

    revalidatePath('/admin');
    revalidatePath('/admin/pricing');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── CMS Content: Update ────────────────────────────────────────────────────

export async function updateContent(
  contentId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await verifyAdmin();
    const supabase = await createAdminClient();

    // Fetch current state
    const { data: currentContent } = await supabase
      .from('cms_content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (!currentContent) {
      return { success: false, error: 'Content not found' };
    }

    // Build update payload (only allow specific fields)
    const allowedFields = ['title', 'body', 'meta_description', 'published', 'sort_order', 'slug', 'content_type'];
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    for (const field of allowedFields) {
      if (field in data) {
        updateData[field] = data[field];
      }
    }

    const { error: updateError } = await supabase
      .from('cms_content')
      .update(updateData)
      .eq('id', contentId);

    if (updateError) {
      console.error('[admin/actions] Failed to update content:', updateError);
      return { success: false, error: 'Failed to update content' };
    }

    // Audit log
    await insertAuditLog(
      supabase,
      user.id,
      'content_update',
      'cms_content',
      contentId,
      currentContent as unknown as Record<string, unknown>,
      updateData
    );

    revalidatePath('/admin');
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── CMS Content: Create ────────────────────────────────────────────────────

export async function createContent(
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string; contentId?: string }> {
  try {
    const { user } = await verifyAdmin();
    const supabase = await createAdminClient();

    // Validate required fields
    if (!data.slug || !data.title || !data.body || !data.content_type) {
      return {
        success: false,
        error: 'Required fields: slug, title, body, content_type',
      };
    }

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from('cms_content')
      .select('id')
      .eq('slug', data.slug)
      .limit(1)
      .single();

    if (existing) {
      return { success: false, error: 'A content entry with this slug already exists' };
    }

    const insertData = {
      slug: data.slug as string,
      title: data.title as string,
      body: data.body as string,
      content_type: data.content_type as string,
      meta_description: (data.meta_description as string) ?? null,
      published: (data.published as boolean) ?? false,
      sort_order: (data.sort_order as number) ?? 0,
    };

    const { data: created, error: insertError } = await supabase
      .from('cms_content')
      .insert(insertData)
      .select('id')
      .single();

    if (insertError || !created) {
      console.error('[admin/actions] Failed to create content:', insertError);
      return { success: false, error: 'Failed to create content' };
    }

    // Audit log
    await insertAuditLog(
      supabase,
      user.id,
      'content_create',
      'cms_content',
      created.id,
      null,
      insertData as unknown as Record<string, unknown>
    );

    revalidatePath('/admin');
    revalidatePath('/admin/content');
    return { success: true, contentId: created.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}
