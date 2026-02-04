'use client';

import { useState } from 'react';
import { Save, PoundSterling } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PricingRule } from '@/types/database';
import { PROPERTY_SIZES } from '@/lib/constants';

interface PricingFormProps {
  rule: PricingRule;
}

export function PricingForm({ rule }: PricingFormProps) {
  const [basePrice, setBasePrice] = useState(rule.base_price);
  const [sizeModifiers, setSizeModifiers] = useState(rule.property_size_modifiers);
  const [shortNoticeDays, setShortNoticeDays] = useState(rule.short_notice_days);
  const [shortNoticeSurcharge, setShortNoticeSurcharge] = useState(rule.short_notice_surcharge);
  const [distanceModifiers, setDistanceModifiers] = useState(rule.distance_band_modifiers);
  const [saving, setSaving] = useState(false);

  function handleSizeModifierChange(key: string, value: string) {
    setSizeModifiers((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  }

  function handleDistanceModifierChange(key: string, value: string) {
    setDistanceModifiers((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  }

  async function handleSave() {
    setSaving(true);
    // In production:
    // Server action:
    // await supabase.from('pricing_rules').update({
    //   base_price: basePrice,
    //   property_size_modifiers: sizeModifiers,
    //   short_notice_days: shortNoticeDays,
    //   short_notice_surcharge: shortNoticeSurcharge,
    //   distance_band_modifiers: distanceModifiers,
    //   updated_at: new Date().toISOString(),
    // }).eq('id', rule.id);
    // Log to admin_audit_log
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    alert('Pricing rule saved — wire up server action');
  }

  const distanceBands = [
    { key: 'local', label: 'Local (0-20 miles)' },
    { key: 'medium', label: 'Medium (20-100 miles)' },
    { key: 'long', label: 'Long (100+ miles)' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PoundSterling className="h-5 w-5 text-primary-light" />
            Active Pricing Rule
          </CardTitle>
          <Badge variant="success">Active</Badge>
        </div>
        <p className="text-sm text-text-muted mt-1">{rule.name} &middot; Last updated {new Date(rule.updated_at).toLocaleDateString('en-GB')}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Price */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-primary">Base Price per Reveal</label>
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">£</span>
            <input
              type="number"
              step="0.50"
              min="0"
              value={basePrice}
              onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>
        </div>

        {/* Property Size Modifiers */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">Property Size Modifiers</label>
          <p className="text-xs text-text-muted">Additional charge on top of base price</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROPERTY_SIZES.map((size) => (
              <div key={size.value} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-alt">
                <span className="text-sm text-text-secondary">{size.label}</span>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-xs">+£</span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={sizeModifiers[size.value] ?? 0}
                    onChange={(e) => handleSizeModifierChange(size.value, e.target.value)}
                    className="w-full pl-7 pr-2 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Short Notice */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">Short Notice Surcharge</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs text-text-muted">Days threshold</label>
              <input
                type="number"
                min="1"
                value={shortNoticeDays}
                onChange={(e) => setShortNoticeDays(parseInt(e.target.value) || 7)}
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-text-muted">Moves within this many days incur surcharge</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs text-text-muted">Surcharge amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">+£</span>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={shortNoticeSurcharge}
                  onChange={(e) => setShortNoticeSurcharge(parseFloat(e.target.value) || 0)}
                  className="w-full pl-9 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Distance Bands */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">Distance Band Modifiers</label>
          <div className="space-y-2">
            {distanceBands.map((band) => (
              <div key={band.key} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-alt">
                <span className="text-sm text-text-secondary">{band.label}</span>
                <div className="relative w-24">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-xs">+£</span>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    value={distanceModifiers[band.key] ?? 0}
                    onChange={(e) => handleDistanceModifierChange(band.key, e.target.value)}
                    className="w-full pl-7 pr-2 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="primary"
            className="gap-2"
            onClick={handleSave}
            loading={saving}
          >
            <Save className="h-4 w-4" />
            Save Pricing Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
