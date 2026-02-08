'use client';

import { useState, useCallback, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Package,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PROPERTY_SIZES } from '@/lib/constants';
import { quoteFormSchema, type QuoteFormData } from '@/lib/validations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepKey = 'location' | 'details' | 'services' | 'contact';

interface StepMeta {
  key: StepKey;
  label: string;
  icon: React.ReactNode;
}

type FieldErrors = Partial<Record<keyof QuoteFormData, string>>;

// ---------------------------------------------------------------------------
// Step metadata
// ---------------------------------------------------------------------------

const STEPS: StepMeta[] = [
  { key: 'location', label: 'Location', icon: <MapPin size={16} /> },
  { key: 'details', label: 'Move Details', icon: <Calendar size={16} /> },
  { key: 'services', label: 'Services', icon: <Package size={16} /> },
  { key: 'contact', label: 'Your Details', icon: <User size={16} /> },
];

// ---------------------------------------------------------------------------
// Per-step field lists (used for partial validation)
// ---------------------------------------------------------------------------

const STEP_FIELDS: Record<StepKey, (keyof QuoteFormData)[]> = {
  location: ['from_postcode', 'to_postcode'],
  details: ['move_date', 'move_date_flexible', 'property_size', 'access_notes'],
  services: [
    'packing_required',
    'storage_required',
    'dismantling_required',
    'fragile_items',
    'additional_notes',
  ],
  contact: ['full_name', 'email', 'phone', 'consent'],
};

// ---------------------------------------------------------------------------
// Default values
// ---------------------------------------------------------------------------

const INITIAL_VALUES: QuoteFormData = {
  from_postcode: '',
  to_postcode: '',
  move_date: null,
  move_date_flexible: false,
  property_size: 'studio',
  access_notes: null,
  packing_required: false,
  storage_required: false,
  dismantling_required: false,
  fragile_items: false,
  additional_notes: null,
  full_name: '',
  email: '',
  phone: '',
  consent: true as const,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GetQuotesPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuoteFormData>({ ...INITIAL_VALUES, consent: false as unknown as true });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Track transition direction for animation
  const [, setDirection] = useState<'forward' | 'backward'>('forward');
  const [animating, setAnimating] = useState(false);

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  const updateField = useCallback(
    <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      // Clear field error on change
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const validateStep = useCallback(
    (stepIndex: number): boolean => {
      const stepKey = STEPS[stepIndex].key;
      const fields = STEP_FIELDS[stepKey];

      // Build a partial object for validation
      const partial: Record<string, unknown> = {};
      for (const f of fields) {
        partial[f] = formData[f];
      }

      // Use zod safeParse on the full schema but only inspect relevant fields
      const result = quoteFormSchema.safeParse(formData);

      if (result.success) {
        setErrors({});
        return true;
      }

      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof QuoteFormData | undefined;
        if (path && fields.includes(path) && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }

      // If no errors for this step's fields, allow proceed
      if (Object.keys(fieldErrors).length === 0) {
        setErrors({});
        return true;
      }

      setErrors(fieldErrors);
      return false;
    },
    [formData],
  );

  const animateTransition = useCallback(
    (dir: 'forward' | 'backward', cb: () => void) => {
      setDirection(dir);
      setAnimating(true);
      // Short delay to trigger exit animation, then switch step
      setTimeout(() => {
        cb();
        // Re-enter
        setTimeout(() => setAnimating(false), 20);
      }, 200);
    },
    [],
  );

  const goNext = useCallback(() => {
    if (!validateStep(currentStep)) return;
    if (currentStep < STEPS.length - 1) {
      animateTransition('forward', () => setCurrentStep((s) => s + 1));
    }
  }, [currentStep, validateStep, animateTransition]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      animateTransition('backward', () => setCurrentStep((s) => s - 1));
    }
  }, [currentStep, animateTransition]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validateStep(currentStep)) return;

      // Final full validation
      const result = quoteFormSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        for (const issue of result.error.issues) {
          const path = issue.path[0] as keyof QuoteFormData | undefined;
          if (path && !fieldErrors[path]) {
            fieldErrors[path] = issue.message;
          }
        }
        setErrors(fieldErrors);
        return;
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        const res = await fetch('/api/leads/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(result.data),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(body?.error || 'Something went wrong. Please try again.');
        }

        router.push('/get-quotes/confirmation');
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
      } finally {
        setSubmitting(false);
      }
    },
    [currentStep, formData, router, validateStep],
  );

  // ------------------------------------------------------------------
  // Render helpers
  // ------------------------------------------------------------------

  const transitionClass = animating
    ? 'opacity-0 translate-y-2'
    : 'opacity-100 translate-y-0';

  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
            Get Free Removal Quotes
          </h1>
          <p className="text-text-secondary">
            Tell us about your move and we&apos;ll match you with up to 5 trusted
            removal companies.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;

            return (
              <div key={step.key} className="flex items-center">
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-primary text-white'
                        : isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/40'
                          : 'bg-surface-alt text-text-muted border border-border'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : idx + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-medium hidden sm:block ${
                      isActive ? 'text-primary-light' : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-10 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-5 sm:mb-5 transition-colors duration-300 ${
                      idx < currentStep ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Form card */}
        <Card variant="elevated" className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} noValidate>
            {/* Step content with animation */}
            <div
              className={`transition-all duration-200 ease-in-out ${transitionClass}`}
            >
              {/* -------- Step 1: Location -------- */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-text-primary">
                      Where are you moving?
                    </h2>
                  </div>

                  <Input
                    id="from_postcode"
                    label="Moving from (postcode)"
                    placeholder="e.g. SW1A 1AA"
                    value={formData.from_postcode}
                    onChange={(e) =>
                      updateField('from_postcode', e.target.value.toUpperCase())
                    }
                    error={errors.from_postcode}
                    autoFocus
                  />

                  <Input
                    id="to_postcode"
                    label="Moving to (postcode)"
                    placeholder="e.g. EC2A 4BX"
                    value={formData.to_postcode}
                    onChange={(e) =>
                      updateField('to_postcode', e.target.value.toUpperCase())
                    }
                    error={errors.to_postcode}
                  />
                </div>
              )}

              {/* -------- Step 2: Move Details -------- */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-text-primary">
                      Move details
                    </h2>
                  </div>

                  <Input
                    id="move_date"
                    label="Preferred move date"
                    type="date"
                    value={formData.move_date ?? ''}
                    onChange={(e) =>
                      updateField('move_date', e.target.value || null)
                    }
                    error={errors.move_date}
                    min={new Date().toISOString().split('T')[0]}
                  />

                  {/* Flexible checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.move_date_flexible}
                        onChange={(e) =>
                          updateField('move_date_flexible', e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded-md border border-border bg-surface peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                        {formData.move_date_flexible && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                      My dates are flexible
                    </span>
                  </label>

                  {/* Property size */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="property_size"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Property size
                    </label>
                    <select
                      id="property_size"
                      value={formData.property_size}
                      onChange={(e) =>
                        updateField(
                          'property_size',
                          e.target.value as QuoteFormData['property_size'],
                        )
                      }
                      className={`w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none ${
                        errors.property_size ? 'border-danger' : ''
                      }`}
                    >
                      <option value="" disabled>
                        Select property size
                      </option>
                      {PROPERTY_SIZES.map((ps) => (
                        <option key={ps.value} value={ps.value}>
                          {ps.label}
                        </option>
                      ))}
                    </select>
                    {errors.property_size && (
                      <p className="text-sm text-danger">{errors.property_size}</p>
                    )}
                  </div>

                  {/* Access notes */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="access_notes"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Access notes{' '}
                      <span className="text-text-muted font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="access_notes"
                      rows={3}
                      maxLength={500}
                      placeholder="e.g. Third floor flat, no lift, permit parking..."
                      value={formData.access_notes ?? ''}
                      onChange={(e) =>
                        updateField('access_notes', e.target.value || null)
                      }
                      className={`w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none ${
                        errors.access_notes ? 'border-danger' : ''
                      }`}
                    />
                    {errors.access_notes && (
                      <p className="text-sm text-danger">{errors.access_notes}</p>
                    )}
                  </div>
                </div>
              )}

              {/* -------- Step 3: Services -------- */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-text-primary">
                      Additional services
                    </h2>
                  </div>

                  <p className="text-sm text-text-secondary -mt-2">
                    Select any additional services you need for your move.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(
                      [
                        {
                          key: 'packing_required' as const,
                          label: 'Packing service',
                          desc: 'Professional packing of your belongings',
                        },
                        {
                          key: 'storage_required' as const,
                          label: 'Storage',
                          desc: 'Short or long-term storage solutions',
                        },
                        {
                          key: 'dismantling_required' as const,
                          label: 'Dismantling & reassembly',
                          desc: 'Furniture dismantling and setup',
                        },
                        {
                          key: 'fragile_items' as const,
                          label: 'Fragile items',
                          desc: 'Special care for delicate items',
                        },
                      ] as const
                    ).map((svc) => (
                      <label
                        key={svc.key}
                        className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData[svc.key]
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-border-light bg-surface'
                        }`}
                      >
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={formData[svc.key]}
                            onChange={(e) =>
                              updateField(svc.key, e.target.checked)
                            }
                            className="sr-only peer"
                          />
                          <div
                            className={`w-5 h-5 rounded-md border transition-colors flex items-center justify-center ${
                              formData[svc.key]
                                ? 'bg-primary border-primary'
                                : 'border-border bg-surface'
                            }`}
                          >
                            {formData[svc.key] && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-text-primary block">
                            {svc.label}
                          </span>
                          <span className="text-xs text-text-muted">{svc.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Additional notes */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="additional_notes"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Additional notes{' '}
                      <span className="text-text-muted font-normal">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      id="additional_notes"
                      rows={3}
                      maxLength={1000}
                      placeholder="Anything else the removal companies should know..."
                      value={formData.additional_notes ?? ''}
                      onChange={(e) =>
                        updateField('additional_notes', e.target.value || null)
                      }
                      className={`w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none ${
                        errors.additional_notes ? 'border-danger' : ''
                      }`}
                    />
                    {errors.additional_notes && (
                      <p className="text-sm text-danger">
                        {errors.additional_notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* -------- Step 4: Contact -------- */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-text-primary">
                      Your details
                    </h2>
                  </div>

                  <Input
                    id="full_name"
                    label="Full name"
                    placeholder="John Smith"
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    error={errors.full_name}
                    autoFocus
                  />

                  <Input
                    id="email"
                    label="Email address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email}
                  />

                  <Input
                    id="phone"
                    label="Phone number"
                    type="tel"
                    placeholder="07700 900000"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    error={errors.phone}
                  />

                  {/* Consent checkbox */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData.consent as boolean}
                          onChange={(e) =>
                            updateField(
                              'consent',
                              e.target.checked as unknown as true,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`w-5 h-5 rounded-md border transition-colors flex items-center justify-center ${
                            formData.consent
                              ? 'bg-primary border-primary'
                              : errors.consent
                                ? 'border-danger bg-surface'
                                : 'border-border bg-surface'
                          }`}
                        >
                          {formData.consent && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
                        I agree to be contacted by up to 5 removal companies
                        regarding my move. View our{' '}
                        <a
                          href="/privacy"
                          className="text-primary hover:underline"
                          target="_blank"
                        >
                          Privacy Policy
                        </a>
                        .
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-sm text-danger mt-1.5">{errors.consent}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
                {submitError}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={goBack}
                  className="gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  size="lg"
                  className="gap-2"
                >
                  Continue
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="lg"
                  loading={submitting}
                  className="gap-2"
                >
                  {submitting ? 'Submitting...' : 'Get My Quotes'}
                  {!submitting && <ArrowRight size={16} />}
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Trust note */}
        <p className="text-center text-xs text-text-muted mt-6">
          Your details are only shared with verified removal companies. 100% free,
          no obligation.
        </p>
      </div>
    </section>
  );
}
