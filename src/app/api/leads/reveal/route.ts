import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { calculateRevealPrice } from '@/lib/pricing';
import { sendLowCreditWarning } from '@/lib/email';
import { LOW_CREDIT_THRESHOLD } from '@/lib/constants';

const revealRequestSchema = z.object({
  leadId: z.string().uuid(),
  assignmentId: z.string().uuid(),
});

// ─── POST /api/leads/reveal ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = revealRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { leadId, assignmentId } = result.data;
    const supabase = await createClient();

    // 1. Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 2. Verify user belongs to a company
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    if (companyUserError || !companyUser) {
      return NextResponse.json(
        { error: 'You are not associated with a company' },
        { status: 403 }
      );
    }

    const companyId = companyUser.company_id;

    // 3. Verify company has an assignment for this lead
    const { data: assignment, error: assignmentError } = await supabase
      .from('lead_assignments')
      .select('*')
      .eq('id', assignmentId)
      .eq('lead_id', leadId)
      .eq('company_id', companyId)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Lead assignment not found' },
        { status: 404 }
      );
    }

    // 4. Check assignment is not already revealed
    if (assignment.revealed_at) {
      // Already revealed - just return the contact details
      const { data: contactDetails } = await supabase
        .from('lead_contact_details')
        .select('*')
        .eq('lead_id', leadId)
        .single();

      return NextResponse.json({
        success: true,
        alreadyRevealed: true,
        contactDetails,
      });
    }

    // 5. Calculate reveal price
    const price = await calculateRevealPrice(supabase, leadId);

    // 6. Check company credit balance
    const { data: latestLedger } = await supabase
      .from('credit_ledger')
      .select('balance_after')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const currentBalance = latestLedger?.balance_after ?? 0;

    if (currentBalance < price) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          required: price,
          balance: currentBalance,
        },
        { status: 402 }
      );
    }

    // 7. All checks passed - perform the reveal transaction

    // 7a. Insert debit into credit_ledger
    const newBalance = currentBalance - price;

    const { error: ledgerError } = await supabase.from('credit_ledger').insert({
      company_id: companyId,
      delta: -price,
      balance_after: newBalance,
      reason: 'reveal',
      reference_type: 'lead_assignment',
      reference_id: assignmentId,
      description: `Reveal contact details for lead ${leadId}`,
    });

    if (ledgerError) {
      console.error('[leads/reveal] Failed to insert ledger entry:', ledgerError);
      return NextResponse.json(
        { error: 'Failed to process payment. Please try again.' },
        { status: 500 }
      );
    }

    // 7b. Update lead_assignments
    const { error: updateError } = await supabase
      .from('lead_assignments')
      .update({
        revealed_at: new Date().toISOString(),
        price_at_reveal: price,
        status: 'revealed',
      })
      .eq('id', assignmentId);

    if (updateError) {
      console.error('[leads/reveal] Failed to update assignment:', updateError);
      // Attempt to reverse the ledger entry
      await supabase.from('credit_ledger').insert({
        company_id: companyId,
        delta: price,
        balance_after: currentBalance,
        reason: 'refund',
        reference_type: 'lead_assignment',
        reference_id: assignmentId,
        description: `Auto-reversal: failed to update assignment for lead ${leadId}`,
      });

      return NextResponse.json(
        { error: 'Failed to reveal lead. Credits have been refunded.' },
        { status: 500 }
      );
    }

    // 7c. Fetch and return lead contact details
    const { data: contactDetails, error: contactError } = await supabase
      .from('lead_contact_details')
      .select('*')
      .eq('lead_id', leadId)
      .single();

    if (contactError || !contactDetails) {
      console.error('[leads/reveal] Failed to fetch contact details:', contactError);
      return NextResponse.json(
        { error: 'Reveal succeeded but failed to fetch contact details. Please refresh.' },
        { status: 500 }
      );
    }

    // 8. Send low credit warning if balance dropped below threshold (non-blocking)
    if (newBalance <= LOW_CREDIT_THRESHOLD && currentBalance > LOW_CREDIT_THRESHOLD) {
      const { data: company } = await supabase
        .from('companies')
        .select('name, email')
        .eq('id', companyId)
        .single();

      if (company?.email) {
        sendLowCreditWarning(company.email, company.name, newBalance).catch((err) => {
          console.error('[leads/reveal] Failed to send low credit warning:', err);
        });
      }
    }

    return NextResponse.json({
      success: true,
      alreadyRevealed: false,
      contactDetails,
      price,
      newBalance,
    });
  } catch (error) {
    console.error('[leads/reveal] Unexpected error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
