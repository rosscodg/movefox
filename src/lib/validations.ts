import { z } from 'zod';

const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

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
  website: z.string().url().nullable(),
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

export const pricingRuleSchema = z.object({
  name: z.string().min(1).max(100),
  base_price: z.number().min(0),
  property_size_modifiers: z.record(z.string(), z.number()),
  short_notice_days: z.number().int().min(0),
  short_notice_surcharge: z.number().min(0),
  distance_band_modifiers: z.record(z.string(), z.number()),
  is_active: z.boolean(),
});
