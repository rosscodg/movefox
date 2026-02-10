import type { Metadata } from 'next';
import { Cookie } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'MoveFox cookie policy. Learn how we use cookies and similar technologies on our website.',
};

export default function CookiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="primary" className="mb-6">
              <Cookie className="w-3 h-3 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Cookie Policy
            </h1>
            <p className="mt-6 text-text-secondary">
              Last updated: February 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Cookies are small text files that are placed on your device
              (computer, tablet, or mobile phone) when you visit a website.
              They are widely used to make websites work more efficiently, to
              improve user experience, and to provide information to website
              owners.
            </p>
            <p className="text-text-secondary leading-relaxed">
              This Cookie Policy explains what cookies we use, why we use them,
              and how you can manage your cookie preferences.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              2. Types of Cookies We Use
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Essential Cookies
                </h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  These cookies are strictly necessary for the website to
                  function properly. They enable core functionality such as
                  security, session management, and accessibility. You cannot
                  opt out of essential cookies as the website cannot function
                  without them.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 text-text-primary font-medium">
                          Cookie
                        </th>
                        <th className="text-left py-2 pr-4 text-text-primary font-medium">
                          Purpose
                        </th>
                        <th className="text-left py-2 text-text-primary font-medium">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 text-text-secondary">
                          session_id
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Maintains your session
                        </td>
                        <td className="py-2 text-text-secondary">Session</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 text-text-secondary">
                          csrf_token
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Security protection
                        </td>
                        <td className="py-2 text-text-secondary">Session</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-text-secondary">
                          cookie_consent
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Stores your cookie preferences
                        </td>
                        <td className="py-2 text-text-secondary">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  These cookies help us understand how visitors interact with
                  our website by collecting and reporting information
                  anonymously. This helps us improve our website and your
                  experience.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 text-text-primary font-medium">
                          Cookie
                        </th>
                        <th className="text-left py-2 pr-4 text-text-primary font-medium">
                          Purpose
                        </th>
                        <th className="text-left py-2 text-text-primary font-medium">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 text-text-secondary">
                          _ga
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Google Analytics - distinguishes users
                        </td>
                        <td className="py-2 text-text-secondary">2 years</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-text-secondary">
                          _ga_*
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Google Analytics - maintains session state
                        </td>
                        <td className="py-2 text-text-secondary">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  Functional Cookies
                </h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  These cookies enable enhanced functionality and
                  personalisation, such as remembering your preferences or
                  form entries. If you do not allow these cookies, some
                  features may not function as intended.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 pr-4 text-text-primary font-medium">
                          Cookie
                        </th>
                        <th className="text-left py-2 pr-4 text-text-primary font-medium">
                          Purpose
                        </th>
                        <th className="text-left py-2 text-text-primary font-medium">
                          Duration
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 pr-4 text-text-secondary">
                          user_prefs
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Stores your site preferences
                        </td>
                        <td className="py-2 text-text-secondary">1 year</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4 text-text-secondary">
                          form_data
                        </td>
                        <td className="py-2 pr-4 text-text-secondary">
                          Saves form progress
                        </td>
                        <td className="py-2 text-text-secondary">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              3. Third-Party Cookies
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Some cookies are placed by third-party services that appear on
              our pages. We do not control the setting of these cookies. The
              third parties that set cookies on our website include:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    Google Analytics:
                  </strong>{' '}
                  For website usage analysis and improvement
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    Supabase:
                  </strong>{' '}
                  For authentication and session management
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              4. Managing Cookies
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              You can control and manage cookies in several ways. Please note
              that disabling certain cookies may affect the functionality of
              the website.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    Browser Settings:
                  </strong>{' '}
                  Most browsers allow you to refuse or accept cookies, delete
                  existing cookies, and set preferences for certain websites.
                  Check your browser&apos;s help section for instructions.
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    Cookie Consent Banner:
                  </strong>{' '}
                  When you first visit our site, you will be presented with a
                  cookie consent banner that allows you to accept or decline
                  non-essential cookies.
                </span>
              </li>
              <li className="flex items-start gap-2 text-text-secondary">
                <span className="text-primary font-bold mt-0.5">-</span>
                <span>
                  <strong className="text-text-primary">
                    Opt-Out Links:
                  </strong>{' '}
                  For Google Analytics, you can install the{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-light transition-colors"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                  .
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              5. Changes to This Policy
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Cookie Policy from time to time to reflect
              changes in the cookies we use or for other operational, legal, or
              regulatory reasons. Please revisit this page periodically to stay
              informed about our use of cookies.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              6. Contact Us
            </h2>
            <p className="text-text-secondary leading-relaxed">
              If you have any questions about our use of cookies, please
              contact us at:
            </p>
            <div className="mt-4 p-4 bg-surface-alt rounded-xl">
              <p className="text-sm text-text-primary font-medium">
                MoveFox
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Email:{' '}
                <a
                  href="mailto:privacy@movefox.co.uk"
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  privacy@movefox.co.uk
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
