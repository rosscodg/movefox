import type { Metadata } from 'next';
// import { createClient } from '@/lib/supabase/server';
import type { PricingRule, CreditPack } from '@/types/database';
import { PricingForm } from './pricing-form';
import { CreditPacksManager } from './credit-packs-manager';

export const metadata: Metadata = {
  title: 'Pricing',
};

// --- Mock Data ---
// In production:
// const supabase = await createClient();
// const { data: activeRule } = await supabase.from('pricing_rules').select('*').eq('is_active', true).single();
// const { data: creditPacks } = await supabase.from('credit_packs').select('*').order('credits', { ascending: true });

const mockActiveRule: PricingRule = {
  id: 'pr1',
  name: 'Standard Pricing',
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
  is_active: true,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-20T10:00:00Z',
};

const mockCreditPacks: CreditPack[] = [
  {
    id: 'cp1',
    name: 'Starter',
    credits: 20,
    price_gbp: 90,
    stripe_price_id: 'price_starter_123',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cp2',
    name: 'Growth',
    credits: 50,
    price_gbp: 200,
    stripe_price_id: 'price_growth_456',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cp3',
    name: 'Pro',
    credits: 100,
    price_gbp: 350,
    stripe_price_id: 'price_pro_789',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cp4',
    name: 'Enterprise',
    credits: 250,
    price_gbp: 750,
    stripe_price_id: null,
    is_active: false,
    created_at: '2025-01-15T00:00:00Z',
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Pricing Rules</h2>
        <p className="text-text-secondary mt-1">Manage lead reveal pricing and credit packs</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PricingForm rule={mockActiveRule} />
        <CreditPacksManager packs={mockCreditPacks} />
      </div>
    </div>
  );
}
