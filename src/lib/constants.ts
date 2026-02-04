export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MoveCompare';

export const PROPERTY_SIZES = [
  { value: 'studio', label: 'Studio / 1 room' },
  { value: '1_bed', label: '1 Bedroom' },
  { value: '2_bed', label: '2 Bedrooms' },
  { value: '3_bed', label: '3 Bedrooms' },
  { value: '4_bed', label: '4 Bedrooms' },
  { value: '5_plus_bed', label: '5+ Bedrooms' },
] as const;

export const SERVICES = [
  'House Removals',
  'Office Removals',
  'Packing Services',
  'Storage',
  'Piano Moving',
  'Antique Moving',
  'International Removals',
  'Man and Van',
  'Furniture Assembly',
  'Cleaning Services',
] as const;

export const ACCREDITATIONS = [
  'BAR Member',
  'Trading Standards Approved',
  'Which? Trusted Trader',
  'Checkatrade',
  'ISO 9001',
  'FIDI Affiliated',
] as const;

export const LEAD_ASSIGNMENT_LIMIT = 5;

export const DEFAULT_PRICING = {
  base_price: 5.0,
  property_size_modifiers: {
    studio: 0,
    '1_bed': 0,
    '2_bed': 0,
    '3_bed': 1.0,
    '4_bed': 2.0,
    '5_plus_bed': 3.0,
  },
  short_notice_days: 7,
  short_notice_surcharge: 2.0,
  distance_band_modifiers: {
    local: 0,
    medium: 1.0,
    long: 2.0,
  },
};

export const CREDIT_PACKS = [
  { name: 'Starter', credits: 20, price_gbp: 90 },
  { name: 'Growth', credits: 50, price_gbp: 200 },
  { name: 'Pro', credits: 100, price_gbp: 350 },
] as const;

export const LOW_CREDIT_THRESHOLD = 5;
