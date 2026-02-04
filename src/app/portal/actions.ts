'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { companyProfileSchema } from '@/lib/validations';
import type { LeadAssignmentStatus } from '@/types/database';

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getAuthenticatedCompany() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data: companyUser } = await supabase
    .from('company_users')
    .select('company_id')
    .eq('user_id', user.id)
    .single();

  if (!companyUser) {
    throw new Error('You are not associated with a company');
  }

  return { supabase, user, companyId: companyUser.company_id };
}

async function verifyAssignmentOwnership(
  supabase: Awaited<ReturnType<typeof createClient>>,
  assignmentId: string,
  companyId: string
) {
  const { data: assignment, error } = await supabase
    .from('lead_assignments')
    .select('*')
    .eq('id', assignmentId)
    .eq('company_id', companyId)
    .single();

  if (error || !assignment) {
    throw new Error('Lead assignment not found or not owned by your company');
  }

  return assignment;
}

// ─── Update lead assignment status ───────────────────────────────────────────

const VALID_STATUSES: LeadAssignmentStatus[] = [
  'assigned',
  'revealed',
  'contacted',
  'quoted',
  'won',
  'lost',
];

export async function updateLeadStatus(
  assignmentId: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!VALID_STATUSES.includes(status as LeadAssignmentStatus)) {
      return { success: false, error: 'Invalid status value' };
    }

    const { supabase, companyId } = await getAuthenticatedCompany();
    await verifyAssignmentOwnership(supabase, assignmentId, companyId);

    const { error } = await supabase
      .from('lead_assignments')
      .update({ status })
      .eq('id', assignmentId)
      .eq('company_id', companyId);

    if (error) {
      console.error('[portal/actions] Failed to update lead status:', error);
      return { success: false, error: 'Failed to update lead status' };
    }

    revalidatePath('/portal');
    revalidatePath('/portal/leads');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── Add note to a lead assignment ───────────────────────────────────────────

export async function addLeadNote(
  assignmentId: string,
  note: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!note || note.trim().length === 0) {
      return { success: false, error: 'Note cannot be empty' };
    }

    if (note.length > 2000) {
      return { success: false, error: 'Note must be 2000 characters or fewer' };
    }

    const { supabase, companyId } = await getAuthenticatedCompany();
    await verifyAssignmentOwnership(supabase, assignmentId, companyId);

    const { error } = await supabase
      .from('lead_assignments')
      .update({ notes: note.trim() })
      .eq('id', assignmentId)
      .eq('company_id', companyId);

    if (error) {
      console.error('[portal/actions] Failed to add lead note:', error);
      return { success: false, error: 'Failed to add note' };
    }

    revalidatePath('/portal');
    revalidatePath('/portal/leads');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── Update company profile ──────────────────────────────────────────────────

export async function updateCompanyProfile(
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, companyId } = await getAuthenticatedCompany();

    // Validate the profile data
    const result = companyProfileSchema.safeParse(data);
    if (!result.success) {
      return {
        success: false,
        error: `Validation failed: ${result.error.issues.map((i) => i.message).join(', ')}`,
      };
    }

    const { error } = await supabase
      .from('companies')
      .update({
        ...result.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    if (error) {
      console.error('[portal/actions] Failed to update company profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }

    revalidatePath('/portal');
    revalidatePath('/portal/profile');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── Update postcode coverage ────────────────────────────────────────────────

interface PostcodeCoverageInput {
  prefix: string;
  enabled: boolean;
}

export async function updatePostcodeCoverage(
  coverages: PostcodeCoverageInput[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!Array.isArray(coverages) || coverages.length === 0) {
      return { success: false, error: 'At least one postcode coverage entry is required' };
    }

    const { supabase, companyId } = await getAuthenticatedCompany();

    // Validate prefix formats
    for (const coverage of coverages) {
      if (!coverage.prefix || !/^[A-Z]{1,2}\d?[A-Z]?$/i.test(coverage.prefix.trim())) {
        return {
          success: false,
          error: `Invalid postcode prefix: ${coverage.prefix}`,
        };
      }
    }

    // Upsert each coverage entry
    const upsertData = coverages.map((c) => ({
      company_id: companyId,
      postcode_prefix: c.prefix.toUpperCase().trim(),
      enabled: c.enabled,
    }));

    const { error } = await supabase
      .from('postcode_coverage')
      .upsert(upsertData, {
        onConflict: 'company_id,postcode_prefix',
      });

    if (error) {
      console.error('[portal/actions] Failed to update postcode coverage:', error);
      return { success: false, error: 'Failed to update postcode coverage' };
    }

    revalidatePath('/portal');
    revalidatePath('/portal/coverage');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

// ─── Toggle paused state ─────────────────────────────────────────────────────

export async function togglePausedState(
  paused: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase, companyId } = await getAuthenticatedCompany();

    const { error } = await supabase
      .from('companies')
      .update({
        paused,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId);

    if (error) {
      console.error('[portal/actions] Failed to toggle paused state:', error);
      return { success: false, error: 'Failed to update paused state' };
    }

    revalidatePath('/portal');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}
