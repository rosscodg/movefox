'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Building2,
  Briefcase,
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Award,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SERVICES, ACCREDITATIONS } from '@/lib/constants';
import { UK_POSTCODE_PREFIXES } from '@/lib/validations';
import { registerPartner } from './actions';

// ─── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Account
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  // Company
  company_name: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postcode: string;
  description: string;
  // Services
  services: string[];
  accreditations: string[];
  insurance_details: string;
  postcode_areas: string[];
  // Terms
  terms_accepted: boolean;
}

type FormErrors = Partial<Record<keyof FormData | 'general', string>>;

const STEPS = [
  { label: 'Account', icon: User },
  { label: 'Company', icon: Building2 },
  { label: 'Services', icon: Briefcase },
  { label: 'Review', icon: ClipboardCheck },
];

const LONDON_PREFIXES = ['E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC'];

// ─── Step indicator (extracted to avoid creating component during render) ─────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = i === step;
        const isComplete = i < step;
        return (
          <div key={s.label} className="flex items-center">
            <div className="flex flex-col items-center mt-[5px]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isComplete
                    ? 'bg-accent text-white'
                    : isActive
                      ? 'bg-primary text-white'
                      : 'bg-surface-alt text-text-muted'
                }`}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  isActive ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 mx-2 mb-5 ${
                  i < step ? 'bg-accent' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function RegistrationForm() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    company_name: '',
    company_phone: '',
    company_email: '',
    company_website: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postcode: '',
    description: '',
    services: [],
    accreditations: [],
    insurance_details: '',
    postcode_areas: [],
    terms_accepted: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [postcodeSearch, setPostcodeSearch] = useState('');

  // ── Helpers ──────────────────────────────────────────────────────────────

  function updateField(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear that field's error
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toggleArrayItem(field: 'services' | 'accreditations' | 'postcode_areas', item: string) {
    setForm((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item],
      };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  // ── Validation per step ──────────────────────────────────────────────────

  function validateStep(s: number): FormErrors {
    const errs: FormErrors = {};

    if (s === 0) {
      if (!form.full_name.trim()) errs.full_name = 'Full name is required';
      if (!form.email.trim()) {
        errs.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errs.email = 'Please enter a valid email address';
      }
      if (!form.password) {
        errs.password = 'Password is required';
      } else if (form.password.length < 8) {
        errs.password = 'Password must be at least 8 characters';
      }
      if (form.password !== form.confirm_password) {
        errs.confirm_password = 'Passwords do not match';
      }
    }

    if (s === 1) {
      if (!form.company_name.trim()) errs.company_name = 'Company name is required';
      if (!form.company_phone.trim()) {
        errs.company_phone = 'Phone number is required';
      } else if (!/^[\d\s+()-]{10,20}$/.test(form.company_phone)) {
        errs.company_phone = 'Please enter a valid phone number';
      }
      if (!form.company_email.trim()) {
        errs.company_email = 'Company email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.company_email)) {
        errs.company_email = 'Please enter a valid email address';
      }
      if (form.company_website) {
        // Auto-prepend https:// if the user omitted a protocol
        let url = form.company_website.trim();
        if (url && !/^https?:\/\//i.test(url)) {
          url = `https://${url}`;
          updateField('company_website', url);
        }
        if (!/^https?:\/\/.+\..+/.test(url)) {
          errs.company_website = 'Please enter a valid website (e.g. example.com)';
        }
      }
      if (!form.address_line1.trim()) errs.address_line1 = 'Address is required';
      if (!form.city.trim()) errs.city = 'City is required';
      if (!form.postcode.trim()) {
        errs.postcode = 'Postcode is required';
      } else if (!/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(form.postcode)) {
        errs.postcode = 'Please enter a valid UK postcode';
      }
    }

    if (s === 2) {
      if (form.services.length === 0) errs.services = 'Please select at least one service';
      if (form.postcode_areas.length === 0) errs.postcode_areas = 'Please select at least one coverage area';
    }

    if (s === 3) {
      if (!form.terms_accepted) errs.terms_accepted = 'You must accept the terms and conditions';
    }

    return errs;
  }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }

  function handleBack() {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // Call server action to create user + company + link + coverage
      // User creation uses admin API (no confirmation email sent)
      const result = await registerPartner({
        email: form.email,
        password: form.password,
        fullName: form.full_name,
        companyName: form.company_name,
        companyPhone: form.company_phone,
        companyEmail: form.company_email,
        companyWebsite: form.company_website || undefined,
        addressLine1: form.address_line1,
        addressLine2: form.address_line2 || undefined,
        city: form.city,
        postcode: form.postcode,
        description: form.description || undefined,
        services: form.services,
        accreditations: form.accreditations,
        insuranceDetails: form.insurance_details || undefined,
        postcodeAreas: form.postcode_areas,
      });

      if (!result.success) {
        setErrors({ general: result.error || 'Failed to register company' });
        setLoading(false);
        return;
      }

      // Redirect to pending page
      router.push('/join/pending');
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      setLoading(false);
    }
  }

  // ── Filtered postcode list ───────────────────────────────────────────────

  const filteredPrefixes = postcodeSearch
    ? UK_POSTCODE_PREFIXES.filter((p) =>
        p.toLowerCase().startsWith(postcodeSearch.toLowerCase())
      )
    : UK_POSTCODE_PREFIXES;

  // ── Render steps ─────────────────────────────────────────────────────────

  return (
    <div>
      <StepIndicator step={step} />

      {/* Global error */}
      {errors.general && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
          {errors.general}
        </div>
      )}

      <Card variant="elevated">
        <CardContent>
          {/* ─── Step 0: Account ──────────────────────────────────── */}
          {step === 0 && (
            <form onSubmit={handleNext} noValidate>
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                Create Your Account
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                This will be your login to manage leads and your company profile.
              </p>

              <div className="space-y-4">
                <Input
                  id="full_name"
                  label="Full Name"
                  placeholder="John Smith"
                  value={form.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  error={errors.full_name}
                  autoComplete="name"
                />

                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    error={errors.password}
                    autoComplete="new-password"
                  />
                  <Input
                    id="confirm_password"
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirm_password}
                    onChange={(e) => updateField('confirm_password', e.target.value)}
                    error={errors.confirm_password}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Link href="/login">
                  <Button variant="ghost" type="button">
                    Already have an account?
                  </Button>
                </Link>
                <Button type="submit" className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* ─── Step 1: Company Details ──────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleNext} noValidate>
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                Company Details
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Tell us about your removal company.
              </p>

              <div className="space-y-4">
                <Input
                  id="company_name"
                  label="Company Name"
                  placeholder="Acme Removals Ltd"
                  value={form.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  error={errors.company_name}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    id="company_phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="020 7946 0958"
                    value={form.company_phone}
                    onChange={(e) => updateField('company_phone', e.target.value)}
                    error={errors.company_phone}
                  />
                  <Input
                    id="company_email"
                    label="Company Email"
                    type="email"
                    placeholder="info@company.com"
                    value={form.company_email}
                    onChange={(e) => updateField('company_email', e.target.value)}
                    error={errors.company_email}
                  />
                </div>

                <Input
                  id="company_website"
                  label="Website (optional)"
                  type="url"
                  placeholder="https://www.company.com"
                  value={form.company_website}
                  onChange={(e) => updateField('company_website', e.target.value)}
                  error={errors.company_website}
                />

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-3">
                    <MapPin className="w-4 h-4 text-primary-light" />
                    Business Address
                  </div>

                  <div className="space-y-4">
                    <Input
                      id="address_line1"
                      label="Address Line 1"
                      placeholder="14 Warehouse Lane"
                      value={form.address_line1}
                      onChange={(e) => updateField('address_line1', e.target.value)}
                      error={errors.address_line1}
                    />
                    <Input
                      id="address_line2"
                      label="Address Line 2 (optional)"
                      placeholder="Unit 3"
                      value={form.address_line2}
                      onChange={(e) => updateField('address_line2', e.target.value)}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        id="city"
                        label="City"
                        placeholder="London"
                        value={form.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        error={errors.city}
                      />
                      <Input
                        id="postcode"
                        label="Postcode"
                        placeholder="SE1 9PQ"
                        value={form.postcode}
                        onChange={(e) => updateField('postcode', e.target.value)}
                        error={errors.postcode}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-sm font-medium text-text-primary">
                    Company Description (optional)
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    placeholder="Tell customers about your company..."
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button type="submit" className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* ─── Step 2: Services & Coverage ──────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleNext} noValidate>
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                Services & Coverage
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Select the services you offer and the areas you cover.
              </p>

              <div className="space-y-6">
                {/* Services */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Briefcase className="w-4 h-4 text-primary-light" />
                    <span className="text-sm font-medium text-text-primary">Services Offered</span>
                  </div>
                  {errors.services && (
                    <p className="text-sm text-danger mb-2">{errors.services}</p>
                  )}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SERVICES.map((service) => {
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
                            onChange={() => toggleArrayItem('services', service)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-surface"
                          />
                          <span className={`text-sm ${checked ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                            {service}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Accreditations */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-primary-light" />
                    <span className="text-sm font-medium text-text-primary">Accreditations (optional)</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {ACCREDITATIONS.map((accreditation) => {
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
                            onChange={() => toggleArrayItem('accreditations', accreditation)}
                            className="w-4 h-4 rounded border-border text-accent focus:ring-accent bg-surface"
                          />
                          <span className={`text-sm ${checked ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                            {accreditation}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Insurance */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-primary-light" />
                    <span className="text-sm font-medium text-text-primary">Insurance Details (optional)</span>
                  </div>
                  <textarea
                    value={form.insurance_details}
                    onChange={(e) => updateField('insurance_details', e.target.value)}
                    rows={3}
                    placeholder="Describe your insurance coverage (goods in transit, public liability, etc.)"
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                  />
                </div>

                {/* Postcode Coverage */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary-light" />
                    <span className="text-sm font-medium text-text-primary">Coverage Areas</span>
                  </div>
                  {errors.postcode_areas && (
                    <p className="text-sm text-danger mb-2">{errors.postcode_areas}</p>
                  )}
                  <p className="text-sm text-text-secondary mb-3">
                    Select the postcode areas where you provide services.
                  </p>

                  {/* Selected badges */}
                  {form.postcode_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {form.postcode_areas.map((area) => (
                        <Badge
                          key={area}
                          variant="primary"
                          className="cursor-pointer"
                          onClick={() => toggleArrayItem('postcode_areas', area)}
                        >
                          {area} &times;
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <input
                    type="text"
                    value={postcodeSearch}
                    onChange={(e) => setPostcodeSearch(e.target.value)}
                    placeholder="Search postcode areas..."
                    className="w-full px-4 py-2.5 mb-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />

                  {/* London quick select */}
                  <div className="mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected = LONDON_PREFIXES.every((p) => form.postcode_areas.includes(p));
                        if (allSelected) {
                          setForm((prev) => ({
                            ...prev,
                            postcode_areas: prev.postcode_areas.filter((p) => !LONDON_PREFIXES.includes(p)),
                          }));
                        } else {
                          setForm((prev) => ({
                            ...prev,
                            postcode_areas: [...new Set([...prev.postcode_areas, ...LONDON_PREFIXES])],
                          }));
                        }
                      }}
                      className="text-xs text-primary hover:text-primary-light transition-colors font-medium"
                    >
                      {LONDON_PREFIXES.every((p) => form.postcode_areas.includes(p))
                        ? 'Deselect all London'
                        : 'Select all London postcodes'}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-1">
                    {filteredPrefixes.map((prefix) => {
                      const checked = form.postcode_areas.includes(prefix);
                      return (
                        <button
                          key={prefix}
                          type="button"
                          onClick={() => toggleArrayItem('postcode_areas', prefix)}
                          className={`px-2 py-2 text-xs font-mono rounded-lg border transition-colors ${
                            checked
                              ? 'bg-primary/10 border-primary/30 text-primary font-semibold'
                              : 'bg-surface border-border text-text-secondary hover:border-border-light'
                          }`}
                        >
                          {prefix}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button type="submit" className="gap-2">
                  Review
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* ─── Step 3: Review & Submit ──────────────────────────── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="text-xl font-semibold text-text-primary mb-1">
                Review & Submit
              </h2>
              <p className="text-sm text-text-secondary mb-6">
                Check your details before submitting your application.
              </p>

              <div className="space-y-5">
                {/* Account summary */}
                <div className="bg-surface-alt rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-light" />
                      <span className="text-sm font-semibold text-text-primary">Account</span>
                    </div>
                    <button type="button" onClick={() => setStep(0)} className="text-xs text-primary hover:text-primary-light font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-text-muted">Name:</span>{' '}
                      <span className="text-text-primary">{form.full_name}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Email:</span>{' '}
                      <span className="text-text-primary">{form.email}</span>
                    </div>
                  </div>
                </div>

                {/* Company summary */}
                <div className="bg-surface-alt rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary-light" />
                      <span className="text-sm font-semibold text-text-primary">Company</span>
                    </div>
                    <button type="button" onClick={() => setStep(1)} className="text-xs text-primary hover:text-primary-light font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-text-muted">Company:</span>{' '}
                      <span className="text-text-primary font-medium">{form.company_name}</span>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1 text-text-secondary">
                        <Phone className="w-3 h-3" /> {form.company_phone}
                      </span>
                      <span className="flex items-center gap-1 text-text-secondary">
                        <Mail className="w-3 h-3" /> {form.company_email}
                      </span>
                      {form.company_website && (
                        <span className="flex items-center gap-1 text-text-secondary">
                          <Globe className="w-3 h-3" /> {form.company_website}
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-1 text-text-secondary">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      {form.address_line1}
                      {form.address_line2 && `, ${form.address_line2}`}, {form.city}, {form.postcode}
                    </div>
                    {form.description && (
                      <p className="text-text-secondary mt-1 text-xs line-clamp-2">{form.description}</p>
                    )}
                  </div>
                </div>

                {/* Services summary */}
                <div className="bg-surface-alt rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary-light" />
                      <span className="text-sm font-semibold text-text-primary">Services & Coverage</span>
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="text-xs text-primary hover:text-primary-light font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-text-muted uppercase tracking-wider">Services</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {form.services.map((s) => (
                          <Badge key={s} variant="primary">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {form.accreditations.length > 0 && (
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wider">Accreditations</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {form.accreditations.map((a) => (
                            <Badge key={a} variant="success">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-text-muted uppercase tracking-wider">Coverage Areas</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {form.postcode_areas.map((p) => (
                          <Badge key={p} variant="info">{p}</Badge>
                        ))}
                      </div>
                    </div>
                    {form.insurance_details && (
                      <div>
                        <span className="text-xs text-text-muted uppercase tracking-wider">Insurance</span>
                        <p className="text-sm text-text-secondary mt-1">{form.insurance_details}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="border border-border rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.terms_accepted}
                      onChange={(e) => updateField('terms_accepted', e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary bg-surface"
                    />
                    <span className="text-sm text-text-secondary">
                      I agree to the MoveFox{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      . I understand that my application will be reviewed before I
                      can start receiving leads.
                    </span>
                  </label>
                  {errors.terms_accepted && (
                    <p className="text-sm text-danger mt-2 ml-7">{errors.terms_accepted}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="ghost" onClick={handleBack} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button type="submit" loading={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
