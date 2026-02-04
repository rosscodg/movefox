'use client';

import { useState } from 'react';
import { Save, ToggleLeft, ToggleRight, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CreditPack } from '@/types/database';

interface CreditPacksManagerProps {
  packs: CreditPack[];
}

interface EditablePack extends CreditPack {
  dirty: boolean;
}

export function CreditPacksManager({ packs }: CreditPacksManagerProps) {
  const [editablePacks, setEditablePacks] = useState<EditablePack[]>(
    packs.map((p) => ({ ...p, dirty: false }))
  );
  const [saving, setSaving] = useState(false);

  function updatePack(id: string, field: keyof CreditPack, value: unknown) {
    setEditablePacks((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value, dirty: true } : p
      )
    );
  }

  function toggleActive(id: string) {
    setEditablePacks((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_active: !p.is_active, dirty: true } : p
      )
    );
  }

  async function handleSaveAll() {
    setSaving(true);
    // In production:
    // for (const pack of editablePacks.filter(p => p.dirty)) {
    //   await supabase.from('credit_packs').update({
    //     name: pack.name,
    //     credits: pack.credits,
    //     price_gbp: pack.price_gbp,
    //     is_active: pack.is_active,
    //   }).eq('id', pack.id);
    // }
    // Log to admin_audit_log
    await new Promise((r) => setTimeout(r, 500));
    setEditablePacks((prev) => prev.map((p) => ({ ...p, dirty: false })));
    setSaving(false);
    alert('Credit packs saved — wire up server action');
  }

  const hasDirty = editablePacks.some((p) => p.dirty);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary-light" />
          Credit Packs
        </CardTitle>
        <p className="text-sm text-text-muted mt-1">
          Configure credit pack offerings for companies
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {editablePacks.map((pack) => (
          <div
            key={pack.id}
            className={`p-4 rounded-xl border transition-colors ${
              pack.dirty
                ? 'border-primary/50 bg-primary/5'
                : 'border-border bg-surface-alt'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={pack.name}
                  onChange={(e) => updatePack(pack.id, 'name', e.target.value)}
                  className="text-text-primary font-semibold bg-transparent border-none outline-none text-sm focus:border-b focus:border-primary"
                />
                {pack.dirty && (
                  <Badge variant="warning">Modified</Badge>
                )}
              </div>
              <button
                onClick={() => toggleActive(pack.id)}
                className={`transition-colors ${
                  pack.is_active ? 'text-accent' : 'text-text-muted'
                }`}
                aria-label={pack.is_active ? 'Deactivate pack' : 'Activate pack'}
              >
                {pack.is_active ? (
                  <ToggleRight className="h-6 w-6" />
                ) : (
                  <ToggleLeft className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs text-text-muted">Credits</label>
                <input
                  type="number"
                  min="1"
                  value={pack.credits}
                  onChange={(e) =>
                    updatePack(pack.id, 'credits', parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-text-muted">Price (GBP)</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted text-xs">£</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={pack.price_gbp}
                    onChange={(e) =>
                      updatePack(pack.id, 'price_gbp', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-6 pr-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="text-text-muted">
                £{(pack.price_gbp / (pack.credits || 1)).toFixed(2)} per credit
              </span>
              <Badge variant={pack.is_active ? 'success' : 'default'}>
                {pack.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        ))}

        {/* Save */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="primary"
            className="gap-2"
            onClick={handleSaveAll}
            loading={saving}
            disabled={!hasDirty}
          >
            <Save className="h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
