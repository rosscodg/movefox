import { z } from 'zod';

const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/** Accepts URLs with or without a protocol; auto-prepends https:// */
const websiteSchema = z
  .string()
  .transform((val) => {
    const trimmed = val.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  })
  .pipe(
    z.string().url('Please enter a valid website (e.g. example.com)').or(z.literal(''))
  );

export const quoteFormSchema = z.object({
  from_postcode: z
    .string()
    .min(1, 'From postcode is required')
    .regex(ukPostcodeRegex, 'Please enter a valid UK postcode'),
  to_postcode: z
    .string()
    .min(1, 'To postcode is required')
    .regex(ukPostcodeRegex, 'Please enter a valid UK postcode'),
  move_date: z.string().nullable(),
  move_date_flexible: z.boolean().default(false),
  property_size: z.enum(['studio', '1_bed', '2_bed', '3_bed', '4_bed', '5_plus_bed'], {
    message: 'Please select your property size',
  }),
  access_notes: z.string().max(500).nullable().default(null),
  packing_required: z.boolean().default(false),
  storage_required: z.boolean().default(false),
  dismantling_required: z.boolean().default(false),
  fragile_items: z.boolean().default(false),
  additional_notes: z.string().max(1000).nullable().default(null),
  full_name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15)
    .regex(/^[\d\s+()-]+$/, 'Please enter a valid phone number'),
  consent: z.literal(true, {
    message: 'You must agree to be contacted by removal companies',
  }),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

export const companyProfileSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().max(2000).nullable(),
  address_line1: z.string().max(200).nullable(),
  address_line2: z.string().max(200).nullable(),
  city: z.string().max(100).nullable(),
  postcode: z.string().regex(ukPostcodeRegex).nullable(),
  phone: z.string().max(20).nullable(),
  email: z.string().email().nullable(),
  website: websiteSchema.nullable(),
  services: z.array(z.string()),
  insurance_details: z.string().max(1000).nullable(),
  accreditations: z.array(z.string()),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(2, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const partnerRegistrationSchema = z.object({
  // Account
  full_name: z.string().min(2, 'Full name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  // Company
  company_name: z.string().min(2, 'Company name is required').max(200),
  company_phone: z.string().min(10, 'Please enter a valid phone number').max(20).regex(/^[\d\s+()-]+$/, 'Please enter a valid phone number'),
  company_email: z.string().email('Please enter a valid company email'),
  company_website: websiteSchema.optional(),
  address_line1: z.string().min(1, 'Address is required').max(200),
  address_line2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  postcode: z.string().min(1, 'Postcode is required').regex(ukPostcodeRegex, 'Please enter a valid UK postcode'),
  description: z.string().max(2000).optional(),
  // Services
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  accreditations: z.array(z.string()),
  insurance_details: z.string().max(1000).optional(),
  postcode_areas: z.array(z.string()).min(1, 'Please select at least one coverage area'),
  // Terms
  terms_accepted: z.literal(true, { message: 'You must accept the terms and conditions' }),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type PartnerRegistrationData = z.infer<typeof partnerRegistrationSchema>;

export const UK_POSTCODE_PREFIXES = [
  'E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC',
  'AL', 'B', 'BA', 'BB', 'BD', 'BH', 'BL', 'BN', 'BR', 'BS',
  'CA', 'CB', 'CF', 'CH', 'CM', 'CO', 'CR', 'CT', 'CV', 'CW',
  'DA', 'DE', 'DH', 'DL', 'DN', 'DT', 'DY',
  'EN', 'EX',
  'FY',
  'GL', 'GU',
  'HA', 'HD', 'HG', 'HP', 'HR', 'HU', 'HX',
  'IG', 'IP',
  'KT',
  'L', 'LA', 'LE', 'LL', 'LN', 'LS', 'LU',
  'M', 'ME', 'MK', 'ML',
  'NE', 'NG', 'NN', 'NP', 'NR',
  'OL', 'OX',
  'PE', 'PL', 'PO', 'PR',
  'RG', 'RH', 'RM',
  'S', 'SA', 'SG', 'SK', 'SL', 'SM', 'SN', 'SO', 'SP', 'SR', 'SS', 'ST', 'SY',
  'TA', 'TD', 'TF', 'TN', 'TQ', 'TR', 'TS', 'TW',
  'UB',
  'WA', 'WD', 'WF', 'WN', 'WR', 'WS', 'WV',
  'YO',
] as const;

export const pricingRuleSchema = z.object({
  name: z.string().min(1).max(100),
  base_price: z.number().min(0),
  property_size_modifiers: z.record(z.string(), z.number()),
  short_notice_days: z.number().int().min(0),
  short_notice_surcharge: z.number().min(0),
  distance_band_modifiers: z.record(z.string(), z.number()),
  is_active: z.boolean(),
});
