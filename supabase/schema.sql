-- ============================================================
-- MoveCompare — Supabase Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. Profiles (linked to Supabase Auth)
-- ============================================================
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'company_user' check (role in ('company_user', 'admin')),
  full_name text,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

-- ============================================================
-- 2. Companies
-- ============================================================
create table public.companies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  phone text,
  email text,
  website text,
  logo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  paused boolean not null default false,
  services text[] not null default '{}',
  insurance_details text,
  accreditations text[] not null default '{}',
  photos text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 3. Company Users (many-to-one: users belong to a company)
-- ============================================================
create table public.company_users (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(company_id, user_id)
);

-- ============================================================
-- 4. Leads (job details only — no contact info)
-- ============================================================
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  from_postcode text not null,
  to_postcode text not null,
  move_date date,
  move_date_flexible boolean not null default false,
  property_size text not null,
  access_notes text,
  packing_required boolean not null default false,
  storage_required boolean not null default false,
  dismantling_required boolean not null default false,
  fragile_items boolean not null default false,
  additional_notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. Lead Contact Details (separate table, protected)
-- ============================================================
create table public.lead_contact_details (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade unique,
  full_name text not null,
  email text not null,
  phone text not null,
  consent_given boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. Lead Assignments
-- ============================================================
create table public.lead_assignments (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  revealed_at timestamptz,
  status text not null default 'assigned' check (status in ('assigned', 'revealed', 'contacted', 'quoted', 'won', 'lost')),
  price_at_reveal numeric(10,2),
  notes text,
  unique(lead_id, company_id)
);

-- ============================================================
-- 7. Postcode Coverage
-- ============================================================
create table public.postcode_coverage (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  postcode_prefix text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique(company_id, postcode_prefix)
);

-- ============================================================
-- 8. Pricing Rules
-- ============================================================
create table public.pricing_rules (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  base_price numeric(10,2) not null default 5.00,
  property_size_modifiers jsonb not null default '{}',
  short_notice_days integer not null default 7,
  short_notice_surcharge numeric(10,2) not null default 2.00,
  distance_band_modifiers jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 9. Credit Ledger
-- ============================================================
create table public.credit_ledger (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  delta numeric(10,2) not null,
  balance_after numeric(10,2) not null,
  reason text not null check (reason in ('purchase', 'reveal', 'refund', 'adjustment')),
  reference_type text,
  reference_id text,
  description text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 10. Credit Packs
-- ============================================================
create table public.credit_packs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  credits integer not null,
  price_gbp numeric(10,2) not null,
  stripe_price_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 11. Admin Audit Log
-- ============================================================
create table public.admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid not null references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 12. CMS Content
-- ============================================================
create table public.cms_content (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  content_type text not null check (content_type in ('page', 'faq', 'blog')),
  title text not null,
  body text not null default '',
  meta_description text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_company_users_user_id on public.company_users(user_id);
create index idx_company_users_company_id on public.company_users(company_id);
create index idx_leads_created_at on public.leads(created_at desc);
create index idx_leads_from_postcode on public.leads(from_postcode);
create index idx_lead_assignments_company_id on public.lead_assignments(company_id);
create index idx_lead_assignments_lead_id on public.lead_assignments(lead_id);
create index idx_postcode_coverage_company_id on public.postcode_coverage(company_id);
create index idx_postcode_coverage_prefix on public.postcode_coverage(postcode_prefix);
create index idx_credit_ledger_company_id on public.credit_ledger(company_id);
create index idx_admin_audit_log_created on public.admin_audit_log(created_at desc);
create index idx_cms_content_type on public.cms_content(content_type, published, sort_order);

-- ============================================================
-- Helper function: get company_id for current user
-- ============================================================
create or replace function public.get_user_company_id()
returns uuid
language sql
security definer
stable
as $$
  select company_id
  from public.company_users
  where user_id = auth.uid()
  limit 1;
$$;

-- ============================================================
-- Helper function: check if current user is admin
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- Helper function: get credit balance for a company
-- ============================================================
create or replace function public.get_company_credit_balance(p_company_id uuid)
returns numeric
language sql
security definer
stable
as $$
  select coalesce(
    (select balance_after from public.credit_ledger
     where company_id = p_company_id
     order by created_at desc
     limit 1),
    0
  );
$$;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (user_id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (user_id = auth.uid());

create policy "Admin can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admin can manage all profiles"
  on public.profiles for all
  using (public.is_admin());

-- Companies
alter table public.companies enable row level security;

create policy "Company users can view own company"
  on public.companies for select
  using (id = public.get_user_company_id());

create policy "Company users can update own company"
  on public.companies for update
  using (id = public.get_user_company_id());

create policy "Admin can manage all companies"
  on public.companies for all
  using (public.is_admin());

-- Company Users
alter table public.company_users enable row level security;

create policy "Company users can view own membership"
  on public.company_users for select
  using (user_id = auth.uid());

create policy "Admin can manage company users"
  on public.company_users for all
  using (public.is_admin());

-- Leads (job details only — any assigned company can view)
alter table public.leads enable row level security;

create policy "Company users can view assigned leads"
  on public.leads for select
  using (
    exists (
      select 1 from public.lead_assignments la
      where la.lead_id = id
        and la.company_id = public.get_user_company_id()
    )
  );

create policy "Admin can manage all leads"
  on public.leads for all
  using (public.is_admin());

-- Lead Contact Details — NO company access via RLS
-- Only accessible via server action after reveal check
alter table public.lead_contact_details enable row level security;

create policy "Admin can view all contact details"
  on public.lead_contact_details for select
  using (public.is_admin());

create policy "Admin can manage contact details"
  on public.lead_contact_details for all
  using (public.is_admin());

-- Service role can insert (for lead submission)
-- No company user policy — they must use the reveal server action

-- Lead Assignments
alter table public.lead_assignments enable row level security;

create policy "Company users can view own assignments"
  on public.lead_assignments for select
  using (company_id = public.get_user_company_id());

create policy "Company users can update own assignments"
  on public.lead_assignments for update
  using (company_id = public.get_user_company_id());

create policy "Admin can manage all assignments"
  on public.lead_assignments for all
  using (public.is_admin());

-- Postcode Coverage
alter table public.postcode_coverage enable row level security;

create policy "Company users can view own coverage"
  on public.postcode_coverage for select
  using (company_id = public.get_user_company_id());

create policy "Company users can manage own coverage"
  on public.postcode_coverage for all
  using (company_id = public.get_user_company_id());

create policy "Admin can manage all coverage"
  on public.postcode_coverage for all
  using (public.is_admin());

-- Pricing Rules (read-only for companies)
alter table public.pricing_rules enable row level security;

create policy "Anyone authenticated can view active pricing"
  on public.pricing_rules for select
  using (is_active = true);

create policy "Admin can manage pricing rules"
  on public.pricing_rules for all
  using (public.is_admin());

-- Credit Ledger
alter table public.credit_ledger enable row level security;

create policy "Company users can view own ledger"
  on public.credit_ledger for select
  using (company_id = public.get_user_company_id());

create policy "Admin can manage all ledger entries"
  on public.credit_ledger for all
  using (public.is_admin());

-- Credit Packs (public read)
alter table public.credit_packs enable row level security;

create policy "Anyone can view active credit packs"
  on public.credit_packs for select
  using (is_active = true);

create policy "Admin can manage credit packs"
  on public.credit_packs for all
  using (public.is_admin());

-- Admin Audit Log
alter table public.admin_audit_log enable row level security;

create policy "Admin can view audit log"
  on public.admin_audit_log for select
  using (public.is_admin());

create policy "Admin can insert audit log"
  on public.admin_audit_log for insert
  with check (public.is_admin());

-- CMS Content
alter table public.cms_content enable row level security;

create policy "Anyone can view published content"
  on public.cms_content for select
  using (published = true);

create policy "Admin can manage all content"
  on public.cms_content for all
  using (public.is_admin());

-- ============================================================
-- Trigger: auto-create profile on user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, role, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'company_user'),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Trigger: updated_at auto-update
-- ============================================================
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

create trigger set_companies_updated_at
  before update on public.companies
  for each row execute procedure public.update_updated_at();

create trigger set_pricing_rules_updated_at
  before update on public.pricing_rules
  for each row execute procedure public.update_updated_at();

create trigger set_cms_content_updated_at
  before update on public.cms_content
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- Storage bucket for logos/photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('company-assets', 'company-assets', true)
on conflict (id) do nothing;

create policy "Company users can upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'company-assets'
    and (storage.foldername(name))[1] = public.get_user_company_id()::text
  );

create policy "Anyone can view company assets"
  on storage.objects for select
  using (bucket_id = 'company-assets');

-- ============================================================
-- Migration: Add blog-specific columns to cms_content
-- ============================================================
alter table public.cms_content add column if not exists author text;
alter table public.cms_content add column if not exists category text;
alter table public.cms_content add column if not exists featured_image_url text;
alter table public.cms_content add column if not exists read_time_minutes integer;
alter table public.cms_content add column if not exists excerpt text;
