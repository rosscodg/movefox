'use client';

import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@movecompare.co.uk',
    href: 'mailto:hello@movecompare.co.uk',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '0800 123 4567',
    href: 'tel:08001234567',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'United Kingdom',
    href: undefined,
  },
  {
    icon: Clock,
    label: 'Support Hours',
    value: 'Mon-Fri: 9am - 5pm GMT',
    href: undefined,
  },
];

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Form */}
      <div className="lg:col-span-2">
        <Card variant="elevated">
          <CardContent>
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Message Sent
                </h3>
                <p className="text-text-secondary max-w-md mx-auto">
                  Thank you for getting in touch. We will review your
                  message and get back to you within 1 to 2 business days.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      message: '',
                    });
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-xl font-semibold text-text-primary mb-6">
                  Send us a message
                </h2>

                <div className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      id="name"
                      label="Full Name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      error={errors.name}
                    />
                    <Input
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      error={errors.email}
                    />
                  </div>

                  <Input
                    id="subject"
                    label="Subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    error={errors.subject}
                  />

                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-text-primary"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          message: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none ${
                        errors.message ? 'border-danger' : ''
                      }`}
                    />
                    {errors.message && (
                      <p className="text-sm text-danger">{errors.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card variant="bordered">
          <CardContent>
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Contact Information
            </h3>
            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-text-secondary">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardContent>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              For Removal Companies
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Interested in joining MoveFox as a partner? Register your
              company and start receiving quality move requests.
            </p>
            <a
              href="/join"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Become a Partner &rarr;
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
