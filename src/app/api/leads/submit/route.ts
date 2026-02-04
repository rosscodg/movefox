import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { quoteFormSchema } from '@/lib/validations';
import { matchLeadToCompanies } from '@/lib/lead-matching';
import { sendLeadConfirmation, sendNewLeadNotification } from '@/lib/email';

// ─── In-memory rate limiter ──────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // 5 requests per hour per IP

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Periodically clean up stale entries (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now >= entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

// ─── POST /api/leads/submit ──────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '3600',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = quoteFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    const supabase = await createAdminClient();

    // 1. Insert into leads table (job details only)
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        from_postcode: data.from_postcode.toUpperCase().trim(),
        to_postcode: data.to_postcode.toUpperCase().trim(),
        move_date: data.move_date,
        move_date_flexible: data.move_date_flexible,
        property_size: data.property_size,
        access_notes: data.access_notes,
        packing_required: data.packing_required,
        storage_required: data.storage_required,
        dismantling_required: data.dismantling_required,
        fragile_items: data.fragile_items,
        additional_notes: data.additional_notes,
      })
      .select('*')
      .single();

    if (leadError || !lead) {
      console.error('[leads/submit] Failed to insert lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to submit your quote request. Please try again.' },
        { status: 500 }
      );
    }

    // 2. Insert into lead_contact_details table
    const { error: contactError } = await supabase
      .from('lead_contact_details')
      .insert({
        lead_id: lead.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        consent_given: data.consent,
      });

    if (contactError) {
      console.error('[leads/submit] Failed to insert contact details:', contactError);
      // Clean up the lead since contact details failed
      await supabase.from('leads').delete().eq('id', lead.id);
      return NextResponse.json(
        { error: 'Failed to submit your quote request. Please try again.' },
        { status: 500 }
      );
    }

    // 3. Match lead to companies
    let matchedCompanyIds: string[] = [];
    try {
      matchedCompanyIds = await matchLeadToCompanies(supabase, lead);
    } catch (matchError) {
      console.error('[leads/submit] Lead matching failed:', matchError);
      // Continue - the lead is saved, admin can manually assign
    }

    // 4. Create lead assignments
    if (matchedCompanyIds.length > 0) {
      const assignments = matchedCompanyIds.map((companyId) => ({
        lead_id: lead.id,
        company_id: companyId,
        status: 'assigned' as const,
      }));

      const { error: assignError } = await supabase
        .from('lead_assignments')
        .insert(assignments);

      if (assignError) {
        console.error('[leads/submit] Failed to create assignments:', assignError);
      }
    }

    // 5. Send confirmation email to the mover (non-blocking)
    sendLeadConfirmation(data.email, lead.id).catch((err) => {
      console.error('[leads/submit] Failed to send confirmation email:', err);
    });

    // 6. Send notification emails to matched companies (non-blocking)
    if (matchedCompanyIds.length > 0) {
      const { data: companies } = await supabase
        .from('companies')
        .select('id, name, email')
        .in('id', matchedCompanyIds);

      if (companies) {
        const leadSummary = {
          from_postcode: lead.from_postcode,
          to_postcode: lead.to_postcode,
          property_size: lead.property_size,
          move_date: lead.move_date,
          packing_required: lead.packing_required,
          storage_required: lead.storage_required,
        };

        for (const company of companies) {
          if (company.email) {
            sendNewLeadNotification(company.email, company.name, leadSummary).catch(
              (err) => {
                console.error(
                  `[leads/submit] Failed to notify company ${company.id}:`,
                  err
                );
              }
            );
          }
        }
      }
    }

    return NextResponse.json(
      { success: true, leadId: lead.id },
      {
        status: 201,
        headers: { 'X-RateLimit-Remaining': String(remaining) },
      }
    );
  } catch (error) {
    console.error('[leads/submit] Unexpected error:', error);

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
