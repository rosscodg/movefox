'use client';

import { useState } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Shield,
  Award,
  Briefcase,
  ImagePlus,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Company } from '@/types/database';

interface ProfileEditorProps {
  company: Company;
  availableServices: string[];
  availableAccreditations: string[];
}

export function ProfileEditor({
  company,
  availableServices,
  availableAccreditations,
}: ProfileEditorProps) {
  const [form, setForm] = useState({
    name: company.name,
    description: company.description ?? '',
    address_line1: company.address_line1 ?? '',
    address_line2: company.address_line2 ?? '',
    city: company.city ?? '',
    postcode: company.postcode ?? '',
    phone: company.phone ?? '',
    email: company.email ?? '',
    website: company.website ?? '',
    insurance_details: company.insurance_details ?? '',
    services: company.services,
    accreditations: company.accreditations,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function toggleService(service: string) {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
    setSaved(false);
  }

  function toggleAccreditation(accreditation: string) {
    setForm((prev) => ({
      ...prev,
      accreditations: prev.accreditations.includes(accreditation)
        ? prev.accreditations.filter((a) => a !== accreditation)
        : [...prev.accreditations, accreditation],
    }));
    setSaved(false);
  }

  async function handleSave() {
    setIsSaving(true);

    // TODO: Call server action to update company profile
    // await updateCompanyProfile(company.id, form);

    // Mock save
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);
    setSaved(true);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Company Profile
          </h1>
          <p className="text-text-secondary mt-1">
            Keep your profile up to date to attract more customers.
          </p>
        </div>
        <Button onClick={handleSave} loading={isSaving} className="gap-2">
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-xl">
          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
          <p className="text-sm text-accent">
            Profile saved successfully.
          </p>
        </div>
      )}

      {/* Company details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-light" />
            Company Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              id="name"
              label="Company Name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-text-primary"
              >
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={4}
                placeholder="Tell customers about your company..."
                className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary-light" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              id="address_line1"
              label="Address Line 1"
              value={form.address_line1}
              onChange={(e) => updateField('address_line1', e.target.value)}
            />
            <Input
              id="address_line2"
              label="Address Line 2"
              value={form.address_line2}
              onChange={(e) => updateField('address_line2', e.target.value)}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="city"
                label="City"
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
              <Input
                id="postcode"
                label="Postcode"
                value={form.postcode}
                onChange={(e) => updateField('postcode', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary-light" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              id="phone"
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
            />
            <Input
              id="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <Input
              id="website"
              label="Website"
              type="url"
              placeholder="https://"
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary-light" />
            Services Offered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Select all services your company provides.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {availableServices.map((service) => {
              const checked = form.services.includes(service);
              return (
                <label
                  key={service}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    checked
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-surface border-border hover:border-border-light'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleService(service)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-surface"
                  />
                  <span
                    className={`text-sm ${
                      checked
                        ? 'text-text-primary font-medium'
                        : 'text-text-secondary'
                    }`}
                  >
                    {service}
                  </span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Accreditations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-light" />
            Accreditations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-secondary mb-4">
            Select any accreditations your company holds.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {availableAccreditations.map((accreditation) => {
              const checked = form.accreditations.includes(accreditation);
              return (
                <label
                  key={accreditation}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    checked
                      ? 'bg-accent/10 border-accent/30'
                      : 'bg-surface border-border hover:border-border-light'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAccreditation(accreditation)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface"
                  />
                  <span
                    className={`text-sm ${
                      checked
                        ? 'text-text-primary font-medium'
                        : 'text-text-secondary'
                    }`}
                  >
                    {accreditation}
                  </span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-light" />
            Insurance Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            <label
              htmlFor="insurance"
              className="block text-sm font-medium text-text-primary"
            >
              Insurance Coverage
            </label>
            <textarea
              id="insurance"
              value={form.insurance_details}
              onChange={(e) => updateField('insurance_details', e.target.value)}
              rows={4}
              placeholder="Describe your insurance coverage (goods in transit, public liability, etc.)"
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo upload placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-primary-light" />
            Company Logo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-border-light transition-colors">
            <ImagePlus className="w-10 h-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary font-medium">
              Drag and drop your logo, or click to browse
            </p>
            <p className="text-xs text-text-muted mt-1">
              PNG, JPG or SVG, max 2MB
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Upload Logo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bottom save button */}
      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} loading={isSaving} className="gap-2">
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
