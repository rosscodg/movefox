import { describe, it, expect } from 'vitest';
import { quoteFormSchema, contactFormSchema } from '@/lib/validations';

describe('quoteFormSchema', () => {
  const validData = {
    from_postcode: 'SW1A 1AA',
    to_postcode: 'N1 9GU',
    move_date: '2026-03-15',
    move_date_flexible: false,
    property_size: '2_bed' as const,
    access_notes: null,
    packing_required: true,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    full_name: 'John Smith',
    email: 'john@example.com',
    phone: '07700 900123',
    consent: true as const,
  };

  it('validates correct data', () => {
    const result = quoteFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects missing from_postcode', () => {
    const result = quoteFormSchema.safeParse({ ...validData, from_postcode: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UK postcode', () => {
    const result = quoteFormSchema.safeParse({ ...validData, from_postcode: '12345' });
    expect(result.success).toBe(false);
  });

  it('accepts postcodes without space', () => {
    const result = quoteFormSchema.safeParse({ ...validData, from_postcode: 'SW1A1AA' });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = quoteFormSchema.safeParse({ ...validData, full_name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = quoteFormSchema.safeParse({ ...validData, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid phone', () => {
    const result = quoteFormSchema.safeParse({ ...validData, phone: 'abc' });
    expect(result.success).toBe(false);
  });

  it('rejects consent=false', () => {
    const data = { ...validData, consent: false };
    const result = quoteFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('accepts all property sizes', () => {
    const sizes = ['studio', '1_bed', '2_bed', '3_bed', '4_bed', '5_plus_bed'] as const;
    for (const size of sizes) {
      const result = quoteFormSchema.safeParse({ ...validData, property_size: size });
      expect(result.success).toBe(true);
    }
  });

  it('rejects invalid property size', () => {
    const result = quoteFormSchema.safeParse({ ...validData, property_size: 'mansion' });
    expect(result.success).toBe(false);
  });
});

describe('contactFormSchema', () => {
  const validContact = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'General enquiry',
    message: 'I have a question about your service and would like to know more.',
  };

  it('validates correct contact data', () => {
    const result = contactFormSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = contactFormSchema.safeParse({ ...validContact, name: 'J' });
    expect(result.success).toBe(false);
  });

  it('rejects short message', () => {
    const result = contactFormSchema.safeParse({ ...validContact, message: 'Hi' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = contactFormSchema.safeParse({ ...validContact, email: 'invalid' });
    expect(result.success).toBe(false);
  });
});
