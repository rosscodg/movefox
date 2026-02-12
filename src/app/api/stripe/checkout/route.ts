import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { CREDIT_PACKS } from '@/lib/constants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://movefox.co.uk';

const checkoutRequestSchema = z.union([
  z.object({
    packId: z.string(),
  }),
  z.object({
    credits: z.number().int().positive(),
    priceGbp: z.number().positive(),
  }),
]);

// ─── POST /api/stripe/checkout ───────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const result = checkoutRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify user belongs to a company
    const { data: companyUser } = await supabase
      .from('company_users')
      .select('company_id')
      .eq('user_id', user.id)
      .single();

    if (!companyUser) {
      return NextResponse.json(
        { error: 'You are not associated with a company' },
        { status: 403 }
      );
    }

    const companyId = companyUser.company_id;

    // Determine pack details
    let credits: number;
    let priceGbp: number;
    let packName: string;
    let packId: string | undefined;

    const data = result.data;

    if ('packId' in data) {
      // Look up from predefined packs
      const packIndex = parseInt(data.packId, 10);
      const pack = CREDIT_PACKS[packIndex];

      if (!pack) {
        // Also check database for custom packs
        const { data: dbPack } = await supabase
          .from('credit_packs')
          .select('*')
          .eq('id', data.packId)
          .eq('is_active', true)
          .single();

        if (!dbPack) {
          return NextResponse.json(
            { error: 'Invalid credit pack' },
            { status: 400 }
          );
        }

        credits = dbPack.credits;
        priceGbp = dbPack.price_gbp;
        packName = dbPack.name;
        packId = dbPack.id;
      } else {
        credits = pack.credits;
        priceGbp = pack.price_gbp;
        packName = pack.name;
        packId = data.packId;
      }
    } else {
      credits = data.credits;
      priceGbp = data.priceGbp;
      packName = `${credits} Credits`;
      packId = undefined;
    }

    // Fetch company name for checkout display
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            unit_amount: Math.round(priceGbp * 100), // Stripe uses pence
            product_data: {
              name: `${packName} - Lead Credits`,
              description: `${credits} lead reveal credits for ${company?.name || 'your company'}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        company_id: companyId,
        pack_id: packId ?? '',
        credits: String(credits),
        user_id: user.id,
      },
      success_url: `${APP_URL}/portal/billing?success=true`,
      cancel_url: `${APP_URL}/portal/billing?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[stripe/checkout] Unexpected error:', error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again.' },
      { status: 500 }
    );
  }
}
