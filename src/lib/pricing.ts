import type { SupabaseClient } from '@supabase/supabase-js';
import type { PricingRule } from '@/types/database';
import { DEFAULT_PRICING } from '@/lib/constants';
import { extractPostcodeArea } from '@/lib/lead-matching';

/**
 * Distance band heuristic based on postcode area comparison.
 *
 * - "local":  same postcode area (e.g. SW -> SW)
 * - "medium": both in the same broad region (e.g. London postcodes)
 * - "long":   different regions
 */

const LONDON_AREAS = new Set([
  'E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC',
]);

const MIDLANDS_AREAS = new Set([
  'B', 'CV', 'DE', 'DY', 'LE', 'NG', 'NN', 'ST', 'WS', 'WV',
]);

const NORTH_WEST_AREAS = new Set([
  'BB', 'BL', 'CA', 'CH', 'CW', 'FY', 'L', 'LA', 'M', 'OL', 'PR', 'SK', 'WA', 'WN',
]);

const NORTH_EAST_AREAS = new Set([
  'DH', 'DL', 'HG', 'HU', 'LN', 'NE', 'SR', 'TS', 'YO',
]);

const SOUTH_EAST_AREAS = new Set([
  'BN', 'BR', 'CM', 'CO', 'CR', 'CT', 'DA', 'EN', 'GU', 'HA',
  'HP', 'IG', 'KT', 'LU', 'ME', 'MK', 'OX', 'RG', 'RH', 'RM',
  'SG', 'SL', 'SM', 'SS', 'TN', 'TW', 'UB', 'WD',
]);

const SOUTH_WEST_AREAS = new Set([
  'BA', 'BH', 'BS', 'DT', 'EX', 'GL', 'PL', 'PO', 'SN', 'SO', 'SP', 'TA', 'TQ', 'TR',
]);

const REGIONS: Set<string>[] = [
  LONDON_AREAS,
  MIDLANDS_AREAS,
  NORTH_WEST_AREAS,
  NORTH_EAST_AREAS,
  SOUTH_EAST_AREAS,
  SOUTH_WEST_AREAS,
];

function getRegion(area: string): number {
  for (let i = 0; i < REGIONS.length; i++) {
    if (REGIONS[i].has(area)) return i;
  }
  return -1;
}

export function estimateDistanceBand(fromPostcode: string, toPostcode: string): string {
  const fromArea = extractPostcodeArea(fromPostcode);
  const toArea = extractPostcodeArea(toPostcode);

  if (fromArea === toArea) {
    return 'local';
  }

  const fromRegion = getRegion(fromArea);
  const toRegion = getRegion(toArea);

  if (fromRegion !== -1 && fromRegion === toRegion) {
    return 'medium';
  }

  return 'long';
}

/**
 * Check if a move date is considered short notice.
 */
export function isShortNotice(moveDate: string | null, thresholdDays: number): boolean {
  if (!moveDate) return false;
  const move = new Date(moveDate);
  const now = new Date();
  const diffMs = move.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays < thresholdDays;
}

interface PricingRuleConfig {
  base_price: number;
  property_size_modifiers: Record<string, number>;
  short_notice_days: number;
  short_notice_surcharge: number;
  distance_band_modifiers: Record<string, number>;
}

/**
 * Calculate the price for a lead reveal based on pricing rules.
 * Pure function — can be used in tests without Supabase.
 */
export function calculatePrice(
  rule: PricingRuleConfig,
  propertySize: string,
  shortNotice: boolean,
  distanceBand: string
): number {
  let price = rule.base_price;

  const sizeMod = rule.property_size_modifiers[propertySize];
  if (typeof sizeMod === 'number') {
    price += sizeMod;
  }

  if (shortNotice) {
    price += rule.short_notice_surcharge;
  }

  const distMod = rule.distance_band_modifiers[distanceBand];
  if (typeof distMod === 'number') {
    price += distMod;
  }

  return Math.round(price * 100) / 100;
}

/**
 * Calculate the reveal price for a lead based on active pricing rules.
 *
 * Formula: base_price + property_size_modifier + short_notice_surcharge + distance_band_modifier
 */
export async function calculateRevealPrice(
  supabase: SupabaseClient,
  leadId: string
): Promise<number> {
  // Fetch the active pricing rule
  const { data: pricingRule, error: pricingError } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (pricingError && pricingError.code !== 'PGRST116') {
    console.error('[pricing] Error fetching pricing rule:', pricingError);
  }

  // Fall back to defaults if no active rule
  const rule: Pick<PricingRule, 'base_price' | 'property_size_modifiers' | 'short_notice_days' | 'short_notice_surcharge' | 'distance_band_modifiers'> =
    pricingRule ?? {
      base_price: DEFAULT_PRICING.base_price,
      property_size_modifiers: DEFAULT_PRICING.property_size_modifiers,
      short_notice_days: DEFAULT_PRICING.short_notice_days,
      short_notice_surcharge: DEFAULT_PRICING.short_notice_surcharge,
      distance_band_modifiers: DEFAULT_PRICING.distance_band_modifiers,
    };

  // Fetch lead details
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', leadId)
    .single();

  if (leadError || !lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  // Base price
  let price = rule.base_price;

  // Property size modifier
  const sizeModifier = rule.property_size_modifiers[lead.property_size] ?? 0;
  price += sizeModifier;

  // Short notice surcharge
  if (lead.move_date) {
    const moveDate = new Date(lead.move_date);
    const now = new Date();
    const daysUntilMove = Math.ceil(
      (moveDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilMove >= 0 && daysUntilMove <= rule.short_notice_days) {
      price += rule.short_notice_surcharge;
    }
  }

  // Distance band modifier
  const distanceBand = estimateDistanceBand(lead.from_postcode, lead.to_postcode);
  const distanceModifier = rule.distance_band_modifiers[distanceBand] ?? 0;
  price += distanceModifier;

  // Round to 2 decimal places
  return Math.round(price * 100) / 100;
}
