import type { SupabaseClient } from '@supabase/supabase-js';
import type { Lead } from '@/types/database';
import { LEAD_ASSIGNMENT_LIMIT } from '@/lib/constants';

/**
 * Extract the postcode prefix (outward code area) from a UK postcode.
 *
 * UK postcode format: A9 9AA, A99 9AA, A9A 9AA, AA9 9AA, AA99 9AA, AA9A 9AA
 * The "prefix" is the letter-only area portion:
 *   "SW1A 1AA" -> "SW"
 *   "SW1 1AA"  -> "SW"
 *   "B1 1AA"   -> "B"
 *   "EC1A 1BB" -> "EC"
 *   "M1 1AA"   -> "M"
 *   "CR0 1AA"  -> "CR"
 *
 * For more granular matching we also return the full outward code:
 *   "SW1A 1AA" -> "SW1A"
 *   "B1 1AA"   -> "B1"
 */
export function extractPostcodePrefix(postcode: string): string {
  const cleaned = postcode.trim().toUpperCase().replace(/\s+/g, '');
  // The outward code is everything except the last 3 characters (the inward code)
  if (cleaned.length < 4) return cleaned;
  const outward = cleaned.slice(0, -3).trim();
  return outward;
}

/**
 * Extract just the letter area from a postcode (for broader matching).
 *   "SW1A 1AA" -> "SW"
 *   "B1 1AA"   -> "B"
 */
export function extractPostcodeArea(postcode: string): string {
  const prefix = extractPostcodePrefix(postcode);
  // Strip trailing digits and letters that are part of the district
  const match = prefix.match(/^([A-Z]{1,2})/);
  return match ? match[1] : prefix;
}

/**
 * Match a lead to approved, active companies based on postcode coverage.
 *
 * Algorithm:
 * 1. Get all approved, non-paused companies
 * 2. Check postcode_coverage for exact outward code match
 * 3. Fall back to broader area match
 * 4. Return up to LEAD_ASSIGNMENT_LIMIT (5) company IDs
 * 5. Flag for admin if fewer than 5 matches
 */
export async function matchLeadToCompanies(
  supabase: SupabaseClient,
  lead: Lead
): Promise<string[]> {
  const exactPrefix = extractPostcodePrefix(lead.from_postcode);
  const areaPrefix = extractPostcodeArea(lead.from_postcode);

  // Get all coverage entries for the relevant prefixes from approved, non-paused companies
  const { data: coverages, error: coverageError } = await supabase
    .from('postcode_coverage')
    .select('company_id, postcode_prefix')
    .eq('enabled', true)
    .in('postcode_prefix', [exactPrefix, areaPrefix]);

  if (coverageError) {
    console.error('[lead-matching] Error fetching postcode coverage:', coverageError);
    throw new Error('Failed to fetch postcode coverage');
  }

  if (!coverages || coverages.length === 0) {
    // No coverage matches at all - flag for admin
    await insertAuditFlag(supabase, lead.id, 'No postcode coverage matches found', 0);
    return [];
  }

  // Collect unique company IDs from coverage
  const companyIdsFromCoverage = [...new Set(coverages.map((c) => c.company_id))];

  // Filter to only approved, non-paused companies
  const { data: eligibleCompanies, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .in('id', companyIdsFromCoverage)
    .eq('status', 'approved')
    .eq('paused', false);

  if (companyError) {
    console.error('[lead-matching] Error fetching eligible companies:', companyError);
    throw new Error('Failed to fetch eligible companies');
  }

  if (!eligibleCompanies || eligibleCompanies.length === 0) {
    await insertAuditFlag(supabase, lead.id, 'No approved/active companies with coverage', 0);
    return [];
  }

  const eligibleIds = new Set(eligibleCompanies.map((c) => c.id));

  // Rank: exact prefix match first, then broader area match
  const exactMatches: string[] = [];
  const areaMatches: string[] = [];

  for (const coverage of coverages) {
    if (!eligibleIds.has(coverage.company_id)) continue;

    if (coverage.postcode_prefix === exactPrefix) {
      if (!exactMatches.includes(coverage.company_id)) {
        exactMatches.push(coverage.company_id);
      }
    } else if (coverage.postcode_prefix === areaPrefix) {
      if (!areaMatches.includes(coverage.company_id) && !exactMatches.includes(coverage.company_id)) {
        areaMatches.push(coverage.company_id);
      }
    }
  }

  // Combine: exact matches first, then area matches
  const ranked = [...exactMatches, ...areaMatches];
  const selected = ranked.slice(0, LEAD_ASSIGNMENT_LIMIT);

  // Flag for admin if fewer than the limit
  if (selected.length < LEAD_ASSIGNMENT_LIMIT) {
    await insertAuditFlag(
      supabase,
      lead.id,
      `Only ${selected.length} of ${LEAD_ASSIGNMENT_LIMIT} companies matched`,
      selected.length
    );
  }

  return selected;
}

/**
 * Insert an audit log entry to flag under-matched leads for admin review.
 */
async function insertAuditFlag(
  supabase: SupabaseClient,
  leadId: string,
  message: string,
  matchCount: number
) {
  const { error } = await supabase.from('admin_audit_log').insert({
    actor_user_id: '00000000-0000-0000-0000-000000000000', // system
    action: 'lead_match_flag',
    entity_type: 'lead',
    entity_id: leadId,
    after_data: { message, match_count: matchCount },
  });

  if (error) {
    console.error('[lead-matching] Failed to insert audit flag:', error);
  }
}
