import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/server';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
  });
}

// ─── POST /api/stripe/webhook ────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // Read raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    try {
      event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('[stripe/webhook] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[stripe/webhook] Error reading request:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    default: {
      // Unhandled event type - acknowledge receipt
      console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// ─── Handle checkout.session.completed ───────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.company_id || !metadata?.credits) {
    console.error('[stripe/webhook] Missing metadata on session:', session.id);
    return;
  }

  const companyId = metadata.company_id;
  const credits = parseInt(metadata.credits, 10);

  if (isNaN(credits) || credits <= 0) {
    console.error('[stripe/webhook] Invalid credits value in metadata:', metadata.credits);
    return;
  }

  const supabase = await createAdminClient();

  // Idempotency check: ensure we haven't already processed this session
  const { data: existingEntry } = await supabase
    .from('credit_ledger')
    .select('id')
    .eq('reference_type', 'stripe_session')
    .eq('reference_id', session.id)
    .limit(1)
    .single();

  if (existingEntry) {
    console.log(
      `[stripe/webhook] Session ${session.id} already processed (idempotency check)`
    );
    return;
  }

  // Get current balance from latest ledger entry
  const { data: latestLedger } = await supabase
    .from('credit_ledger')
    .select('balance_after')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const currentBalance = latestLedger?.balance_after ?? 0;
  const newBalance = currentBalance + credits;

  // Insert credit ledger entry
  const { error: ledgerError } = await supabase.from('credit_ledger').insert({
    company_id: companyId,
    delta: credits,
    balance_after: newBalance,
    reason: 'purchase',
    reference_type: 'stripe_session',
    reference_id: session.id,
    description: `Purchased ${credits} credits (${metadata.pack_id ? `Pack: ${metadata.pack_id}` : 'Custom'})`,
  });

  if (ledgerError) {
    console.error('[stripe/webhook] Failed to insert ledger entry:', ledgerError);
    return;
  }

  console.log(
    `[stripe/webhook] Credited ${credits} to company ${companyId}. New balance: ${newBalance}`
  );
}
