import { describe, it, expect } from 'vitest';
import { calculatePrice, isShortNotice } from '@/lib/pricing';

describe('calculatePrice', () => {
  const defaultRule = {
    base_price: 5.0,
    property_size_modifiers: {
      studio: 0,
      '1_bed': 0,
      '2_bed': 0,
      '3_bed': 1.0,
      '4_bed': 2.0,
      '5_plus_bed': 3.0,
    } as Record<string, number>,
    short_notice_days: 7,
    short_notice_surcharge: 2.0,
    distance_band_modifiers: {
      local: 0,
      medium: 1.0,
      long: 2.0,
    } as Record<string, number>,
  };

  it('calculates base price for small property', () => {
    const price = calculatePrice(defaultRule, '1_bed', false, 'local');
    expect(price).toBe(5.0);
  });

  it('adds property size modifier for larger homes', () => {
    const price = calculatePrice(defaultRule, '3_bed', false, 'local');
    expect(price).toBe(6.0); // 5 + 1

    const price4bed = calculatePrice(defaultRule, '4_bed', false, 'local');
    expect(price4bed).toBe(7.0); // 5 + 2

    const price5bed = calculatePrice(defaultRule, '5_plus_bed', false, 'local');
    expect(price5bed).toBe(8.0); // 5 + 3
  });

  it('adds short notice surcharge', () => {
    const price = calculatePrice(defaultRule, '2_bed', true, 'local');
    expect(price).toBe(7.0); // 5 + 0 + 2
  });

  it('adds distance band modifier', () => {
    const price = calculatePrice(defaultRule, '2_bed', false, 'medium');
    expect(price).toBe(6.0); // 5 + 0 + 1

    const priceLong = calculatePrice(defaultRule, '2_bed', false, 'long');
    expect(priceLong).toBe(7.0); // 5 + 0 + 2
  });

  it('stacks all modifiers correctly', () => {
    const price = calculatePrice(defaultRule, '5_plus_bed', true, 'long');
    expect(price).toBe(12.0); // 5 + 3 + 2 + 2
  });

  it('handles unknown property size gracefully', () => {
    const price = calculatePrice(defaultRule, 'unknown', false, 'local');
    expect(price).toBe(5.0); // base only
  });

  it('handles unknown distance band gracefully', () => {
    const price = calculatePrice(defaultRule, '2_bed', false, 'unknown');
    expect(price).toBe(5.0); // base only
  });
});

describe('isShortNotice', () => {
  it('returns true when move date is within threshold', () => {
    const moveDate = new Date();
    moveDate.setDate(moveDate.getDate() + 3); // 3 days from now
    expect(isShortNotice(moveDate.toISOString(), 7)).toBe(true);
  });

  it('returns false when move date is beyond threshold', () => {
    const moveDate = new Date();
    moveDate.setDate(moveDate.getDate() + 14); // 14 days from now
    expect(isShortNotice(moveDate.toISOString(), 7)).toBe(false);
  });

  it('returns false when move date is null', () => {
    expect(isShortNotice(null, 7)).toBe(false);
  });

  it('returns true when move date is today', () => {
    const today = new Date().toISOString();
    expect(isShortNotice(today, 7)).toBe(true);
  });

  it('returns false when move date is exactly on threshold', () => {
    const moveDate = new Date();
    moveDate.setDate(moveDate.getDate() + 7);
    // On the threshold day itself, not short notice
    expect(isShortNotice(moveDate.toISOString(), 7)).toBe(false);
  });
});
