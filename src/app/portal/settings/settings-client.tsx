'use client';

import { useState } from 'react';
import {
  MapPin,
  Plus,
  Trash2,
  Pause,
  Play,
  Shield,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Save,
  Mail,
  Key,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Company, PostcodeCoverage } from '@/types/database';

interface SettingsClientProps {
  company: Company;
  postcodes: PostcodeCoverage[];
}

export function SettingsClient({
  company,
  postcodes: initialPostcodes,
}: SettingsClientProps) {
  const [postcodes, setPostcodes] = useState(initialPostcodes);
  const [newPrefix, setNewPrefix] = useState('');
  const [paused, setPaused] = useState(company.paused);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPauseToggling, setIsPauseToggling] = useState(false);

  function togglePostcode(id: string) {
    setPostcodes((prev) =>
      prev.map((pc) =>
        pc.id === id ? { ...pc, enabled: !pc.enabled } : pc
      )
    );
    setSaved(false);
  }

  function removePostcode(id: string) {
    setPostcodes((prev) => prev.filter((pc) => pc.id !== id));
    setSaved(false);
  }

  function addPostcode() {
    const prefix = newPrefix.toUpperCase().trim();
    if (!prefix) return;

    // Check for duplicates
    if (postcodes.some((pc) => pc.postcode_prefix === prefix)) {
      alert('This postcode prefix is already in your list.');
      return;
    }

    const newPostcode: PostcodeCoverage = {
      id: `pc_new_${Date.now()}`,
      company_id: company.id,
      postcode_prefix: prefix,
      enabled: true,
      created_at: new Date().toISOString(),
    };

    setPostcodes((prev) => [...prev, newPostcode]);
    setNewPrefix('');
    setSaved(false);
  }

  async function handleSave() {
    setIsSaving(true);

    // TODO: Call server action to save postcode coverage
    // await updatePostcodeCoverage(company.id, postcodes);

    // Mock save
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    setSaved(true);
  }

  async function handlePauseToggle() {
    setIsPauseToggling(true);

    // TODO: Call server action to toggle pause status
    // await toggleCompanyPause(company.id, !paused);

    // Mock toggle
    await new Promise((r) => setTimeout(r, 1000));
    setPaused(!paused);
    setIsPauseToggling(false);
  }

  const activeCount = postcodes.filter((pc) => pc.enabled).length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage your coverage area, lead delivery, and account settings.
        </p>
      </div>

      {/* Lead delivery toggle */}
      <Card
        className={
          paused
            ? 'border-warning/30 bg-warning/5'
            : 'border-accent/30 bg-accent/5'
        }
      >
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                paused ? 'bg-warning/15' : 'bg-accent/15'
              }`}
            >
              {paused ? (
                <Pause className="w-6 h-6 text-warning" />
              ) : (
                <Play className="w-6 h-6 text-accent" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-text-primary">
                Lead Delivery
              </h3>
              <p className="text-sm text-text-secondary">
                {paused
                  ? 'Lead delivery is paused. You will not receive new leads.'
                  : 'Lead delivery is active. You are receiving new leads.'}
              </p>
            </div>
            <Button
              variant={paused ? 'primary' : 'outline'}
              onClick={handlePauseToggle}
              loading={isPauseToggling}
              className="gap-2"
            >
              {paused ? (
                <>
                  <Play className="w-4 h-4" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              )}
            </Button>
          </div>
          {paused && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-warning/20">
              <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
              <p className="text-xs text-warning">
                While paused, you will not be matched with any new leads. Your
                existing leads are unaffected.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Postcode coverage */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-light" />
              Postcode Coverage
            </CardTitle>
            <Badge variant="primary">
              {activeCount} active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Manage the postcode areas you serve. You will only receive leads
            where the pick-up postcode matches your coverage area.
          </p>

          {/* Add new postcode */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <Input
                id="new-prefix"
                placeholder="Enter postcode prefix (e.g. SW, N, EC)"
                value={newPrefix}
                onChange={(e) => setNewPrefix(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPostcode();
                  }
                }}
              />
            </div>
            <Button onClick={addPostcode} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          {/* Postcode list */}
          {postcodes.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-secondary font-medium">
                No postcode areas configured
              </p>
              <p className="text-sm text-text-muted mt-1">
                Add postcode prefixes to start receiving leads.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {postcodes
                .sort((a, b) =>
                  a.postcode_prefix.localeCompare(b.postcode_prefix)
                )
                .map((pc) => (
                  <div
                    key={pc.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      pc.enabled
                        ? 'bg-surface border-border'
                        : 'bg-surface-alt/50 border-border/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                          pc.enabled
                            ? 'bg-primary/15 text-primary-light'
                            : 'bg-surface-alt text-text-muted'
                        }`}
                      >
                        {pc.postcode_prefix}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            pc.enabled
                              ? 'text-text-primary'
                              : 'text-text-muted'
                          }`}
                        >
                          {pc.postcode_prefix} area
                        </p>
                        <p className="text-xs text-text-muted">
                          {pc.enabled ? 'Receiving leads' : 'Paused'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle switch */}
                      <button
                        onClick={() => togglePostcode(pc.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          pc.enabled ? 'bg-primary' : 'bg-surface-alt'
                        }`}
                        title={
                          pc.enabled
                            ? 'Disable this area'
                            : 'Enable this area'
                        }
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            pc.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>

                      {/* Remove button */}
                      <button
                        onClick={() => removePostcode(pc.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                        title="Remove this area"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 flex items-center justify-between">
            {saved && (
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Saved</span>
              </div>
            )}
            <div className="ml-auto">
              <Button
                onClick={handleSave}
                loading={isSaving}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                Save Coverage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-light" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Email notifications */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Email Notifications
                  </p>
                  <p className="text-xs text-text-muted">
                    Receive email alerts for new leads
                  </p>
                </div>
              </div>
              <button
                className="relative w-11 h-6 rounded-full bg-primary transition-colors"
                title="Toggle notifications"
              >
                <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white translate-x-5 transition-transform" />
              </button>
            </div>

            {/* Change email */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Login Email
                  </p>
                  <p className="text-xs text-text-muted">
                    Manage your account email address
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </div>

            {/* Change password */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Password
                  </p>
                  <p className="text-xs text-text-muted">
                    Update your account password
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-danger/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Deactivate Account
              </p>
              <p className="text-xs text-text-muted">
                Permanently deactivate your company account and remove your
                listing.
              </p>
            </div>
            <Button variant="danger" size="sm">
              Deactivate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
