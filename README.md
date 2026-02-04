# MoveCompare — UK Removals Quote Comparison Platform

A pay-per-lead marketplace connecting homeowners requesting removal quotes with vetted removal companies. Built with Next.js 16, Supabase, Stripe, and Tailwind CSS.

## Architecture

```
Public website          Company portal ("Lead Manager")          Admin portal
───────────────         ──────────────────────────────           ────────────
Homepage                Dashboard + lead list                   KPI dashboard
How it works            Lead detail + reveal flow               Company management
Get Quotes (4-step)     Company profile editor                  Lead browser
FAQs, Contact           Billing + credit purchase               Pricing rules
Legal pages             Settings + coverage mgmt                CMS, Audit log
```

### How it works

1. Homeowner submits a quote request via the multi-step form
2. System matches the lead to up to **5** removal companies based on postcode coverage
3. Matched companies see the lead summary in their portal
4. A company **reveals** the lead (pays credits) to see contact details
5. Companies contact the homeowner directly

### Key design decisions

- **Charge on reveal** — companies only pay when they choose to view contact details
- **Contact detail isolation** — `lead_contact_details` is a separate table with no company RLS access; revealed via server action after balance check
- **Credit ledger** — append-only log with `balance_after` for efficient balance queries
- **Postcode matching** — two-tier: exact outward code first, then broader area code fallback
- **Distance estimation** — heuristic using UK regional postcode groupings

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Payments | Stripe Checkout + Webhooks |
| Email | Resend |
| Validation | Zod |
| Testing | Vitest |
| CI | GitHub Actions |

## Project structure

```
src/
├── app/
│   ├── (public)/           # Marketing pages (home, how-it-works, faqs, contact, legal)
│   │   └── get-quotes/     # Multi-step quote form
│   ├── login/              # Auth (password + magic link)
│   ├── portal/             # Company portal (protected)
│   │   ├── leads/[id]/     # Lead detail + reveal
│   │   ├── profile/        # Company profile editor
│   │   ├── billing/        # Credits + purchase
│   │   └── settings/       # Coverage + account
│   ├── admin/              # Admin portal (protected, admin role)
│   │   ├── companies/[id]/ # Company management
│   │   ├── leads/[id]/     # Lead management
│   │   ├── pricing/        # Pricing rules + credit packs
│   │   ├── content/        # CMS
│   │   └── audit-log/      # Audit log viewer
│   └── api/
│       ├── leads/submit/   # Lead submission (rate-limited)
│       ├── leads/reveal/   # Lead reveal (debit credits)
│       ├── stripe/checkout/# Create Stripe checkout session
│       ├── stripe/webhook/ # Handle Stripe events
│       └── auth/callback/  # OAuth/magic link redirect
├── components/
│   ├── ui/                 # Button, Input, Card, Badge
│   └── layout/             # Nav, Footer
├── lib/
│   ├── supabase/           # Client, server, middleware helpers
│   ├── constants.ts        # App-wide constants + default pricing
│   ├── validations.ts      # Zod schemas
│   ├── lead-matching.ts    # Postcode matching algorithm
│   ├── pricing.ts          # Price calculation + distance bands
│   └── email.ts            # Resend email templates
└── types/
    └── database.ts         # TypeScript interfaces

supabase/
├── schema.sql              # Full DB schema + RLS policies + triggers
└── seed.sql                # Demo data (companies, leads, coverage, credits)

tests/
├── lead-matching.test.ts   # Postcode extraction + matching logic
├── pricing.test.ts         # Price calculation + short notice
└── validations.test.ts     # Zod schema validation
```

## Local development

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Stripe](https://stripe.com) account (test mode)
- A [Resend](https://resend.com) account (free tier works)

### 1. Clone and install

```bash
git clone <repo-url>
cd removals-platform
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in the values:

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard > Settings > API (keep secret) |
| `STRIPE_SECRET_KEY` | Stripe dashboard > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or dashboard webhook endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard > Developers > API keys |
| `RESEND_API_KEY` | Resend dashboard > API Keys |
| `EMAIL_FROM` | Your verified sender domain in Resend |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

### 3. Set up Supabase

1. Open the Supabase SQL Editor
2. Run `supabase/schema.sql` to create all tables, RLS policies, and functions
3. Run `supabase/seed.sql` to load demo data

### 4. Set up Stripe

1. Create three products in Stripe matching the credit packs in `src/lib/constants.ts`:
   - **Starter** — 20 credits / £90
   - **Growth** — 50 credits / £200
   - **Pro** — 100 credits / £350
2. Copy the price IDs into your `credit_packs` table (or update the seed SQL)
3. Set up a webhook endpoint pointing to `{APP_URL}/api/stripe/webhook` listening for `checkout.session.completed`

For local development, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Create test users

Use the Supabase Auth dashboard or the app's login page to create:

- A **company user**: sign up, then update `profiles.role` to `company_user` and link to a company in `company_users`
- An **admin user**: sign up, then update `profiles.role` to `admin`

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests cover:
- Postcode prefix/area extraction
- Lead matching logic (coverage filtering, max 5 limit)
- Price calculation (base + modifiers + surcharges)
- Short notice detection
- Zod form validation schemas

## CI

GitHub Actions runs on every pull request:
1. Lint (`eslint`)
2. Type check (`tsc --noEmit`)
3. Tests (`vitest run`)
4. Build (`next build`)

See `.github/workflows/ci.yml`.

## Database schema

12 tables with Row Level Security:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (extends Supabase auth) |
| `companies` | Removal company records |
| `company_users` | Links users to companies |
| `leads` | Quote requests (no contact details) |
| `lead_contact_details` | Contact info (isolated, no company RLS) |
| `lead_assignments` | Matches leads to companies |
| `postcode_coverage` | Company service area definitions |
| `pricing_rules` | Configurable pricing (base + modifiers) |
| `credit_ledger` | Append-only credit transaction log |
| `credit_packs` | Purchasable credit bundles |
| `admin_audit_log` | All admin actions + system flags |
| `cms_content` | Editable pages, FAQs, blog posts |

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set all environment variables in the Vercel dashboard. Ensure:
- Supabase project URL is accessible
- Stripe webhook points to your production URL
- Resend sender domain is verified for production
- `NEXT_PUBLIC_APP_URL` is set to your production domain
