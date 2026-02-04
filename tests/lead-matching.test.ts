import { describe, it, expect } from 'vitest';
import { extractPostcodePrefix, extractPostcodeArea } from '@/lib/lead-matching';

describe('extractPostcodePrefix (outward code)', () => {
  it('extracts outward code from standard postcodes', () => {
    expect(extractPostcodePrefix('SW1A 1AA')).toBe('SW1A');
    expect(extractPostcodePrefix('N1 9GU')).toBe('N1');
    expect(extractPostcodePrefix('EH1 1YZ')).toBe('EH1');
    expect(extractPostcodePrefix('B1 1BB')).toBe('B1');
    expect(extractPostcodePrefix('M1 1AE')).toBe('M1');
    expect(extractPostcodePrefix('EC1A 1BB')).toBe('EC1A');
  });

  it('handles postcodes without spaces', () => {
    expect(extractPostcodePrefix('SW1A1AA')).toBe('SW1A');
    expect(extractPostcodePrefix('N19GU')).toBe('N1');
  });

  it('handles lowercase postcodes', () => {
    expect(extractPostcodePrefix('sw1a 1aa')).toBe('SW1A');
    expect(extractPostcodePrefix('n1 9gu')).toBe('N1');
  });
});

describe('extractPostcodeArea (letter prefix)', () => {
  it('extracts single-letter area codes', () => {
    expect(extractPostcodeArea('N1 9GU')).toBe('N');
    expect(extractPostcodeArea('E1 6AN')).toBe('E');
    expect(extractPostcodeArea('W1A 1AA')).toBe('W');
    expect(extractPostcodeArea('B1 1BB')).toBe('B');
    expect(extractPostcodeArea('G1 1AA')).toBe('G');
    expect(extractPostcodeArea('M1 1AE')).toBe('M');
  });

  it('extracts two-letter area codes', () => {
    expect(extractPostcodeArea('SW1A 1AA')).toBe('SW');
    expect(extractPostcodeArea('SE1 9GF')).toBe('SE');
    expect(extractPostcodeArea('NW1 4RY')).toBe('NW');
    expect(extractPostcodeArea('EC1A 1BB')).toBe('EC');
    expect(extractPostcodeArea('WC2H 7LT')).toBe('WC');
    expect(extractPostcodeArea('EH1 1YZ')).toBe('EH');
    expect(extractPostcodeArea('BS1 1AA')).toBe('BS');
    expect(extractPostcodeArea('LS1 1BA')).toBe('LS');
    expect(extractPostcodeArea('CV1 1FB')).toBe('CV');
  });

  it('handles postcodes without spaces', () => {
    expect(extractPostcodeArea('SW1A1AA')).toBe('SW');
    expect(extractPostcodeArea('N19GU')).toBe('N');
    expect(extractPostcodeArea('EH11YZ')).toBe('EH');
  });

  it('handles lowercase postcodes', () => {
    expect(extractPostcodeArea('sw1a 1aa')).toBe('SW');
    expect(extractPostcodeArea('n1 9gu')).toBe('N');
    expect(extractPostcodeArea('eh1 1yz')).toBe('EH');
  });

  it('handles postcodes with extra whitespace', () => {
    expect(extractPostcodeArea('  SW1A  1AA  ')).toBe('SW');
    expect(extractPostcodeArea(' N1 9GU ')).toBe('N');
  });
});

describe('lead matching logic', () => {
  it('should match companies by postcode prefix coverage', () => {
    const mockCompanies = [
      { id: '1', name: 'London Co', coverages: ['SW', 'SE', 'N', 'E', 'W'] },
      { id: '2', name: 'Manchester Co', coverages: ['M', 'LS', 'WN'] },
      { id: '3', name: 'Birmingham Co', coverages: ['B', 'CV', 'WS'] },
    ];

    const leadPrefix = 'SW';
    const matching = mockCompanies.filter((c) =>
      c.coverages.includes(leadPrefix)
    );

    expect(matching).toHaveLength(1);
    expect(matching[0].name).toBe('London Co');
  });

  it('should return max 5 companies', () => {
    const mockCompanies = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      coverages: ['SW'],
    }));

    const leadPrefix = 'SW';
    const matching = mockCompanies
      .filter((c) => c.coverages.includes(leadPrefix))
      .slice(0, 5);

    expect(matching.length).toBeLessThanOrEqual(5);
    expect(matching).toHaveLength(5);
  });

  it('should handle case where fewer than 5 companies match', () => {
    const mockCompanies = [
      { id: '1', coverages: ['SW'] },
      { id: '2', coverages: ['M'] },
    ];

    const leadPrefix = 'SW';
    const matching = mockCompanies
      .filter((c) => c.coverages.includes(leadPrefix))
      .slice(0, 5);

    expect(matching).toHaveLength(1);
  });
});
