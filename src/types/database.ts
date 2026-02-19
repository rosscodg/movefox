export type UserRole = 'visitor' | 'company_user' | 'admin';

export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export type LeadAssignmentStatus = 'assigned' | 'revealed' | 'contacted' | 'quoted' | 'won' | 'lost';

export type CreditReason = 'purchase' | 'reveal' | 'refund' | 'adjustment';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  postcode: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  status: CompanyStatus;
  paused: boolean;
  services: string[];
  insurance_details: string | null;
  accreditations: string[];
  photos: string[];
  created_at: string;
  updated_at: string;
}

export interface CompanyUser {
  id: string;
  company_id: string;
  user_id: string;
  is_primary: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  from_postcode: string;
  to_postcode: string;
  move_date: string | null;
  move_date_flexible: boolean;
  property_size: string;
  access_notes: string | null;
  packing_required: boolean;
  storage_required: boolean;
  dismantling_required: boolean;
  fragile_items: boolean;
  additional_notes: string | null;
  created_at: string;
}

export interface LeadContactDetails {
  id: string;
  lead_id: string;
  full_name: string;
  email: string;
  phone: string;
  consent_given: boolean;
  created_at: string;
}

export interface LeadAssignment {
  id: string;
  lead_id: string;
  company_id: string;
  assigned_at: string;
  revealed_at: string | null;
  status: LeadAssignmentStatus;
  price_at_reveal: number | null;
  notes: string | null;
}

export interface PostcodeCoverage {
  id: string;
  company_id: string;
  postcode_prefix: string;
  enabled: boolean;
  created_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  base_price: number;
  property_size_modifiers: Record<string, number>;
  short_notice_days: number;
  short_notice_surcharge: number;
  distance_band_modifiers: Record<string, number>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditLedger {
  id: string;
  company_id: string;
  delta: number;
  balance_after: number;
  reason: CreditReason;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price_gbp: number;
  stripe_price_id: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  actor_user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  created_at: string;
}

export interface CmsContent {
  id: string;
  slug: string;
  content_type: 'page' | 'faq' | 'blog';
  title: string;
  body: string;
  meta_description: string | null;
  published: boolean;
  sort_order: number;
  author: string | null;
  category: string | null;
  featured_image_url: string | null;
  read_time_minutes: number | null;
  excerpt: string | null;
  faqs: { question: string; answer: string }[] | null;
  created_at: string;
  updated_at: string;
}

// Composite types for queries
export interface LeadWithAssignment extends Lead {
  lead_assignments: LeadAssignment[];
}

export interface LeadAssignmentWithLead extends LeadAssignment {
  leads: Lead;
}

export interface CompanyWithUsers extends Company {
  company_users: CompanyUser[];
}
