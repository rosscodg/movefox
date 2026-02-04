-- ============================================================
-- MoveCompare — Seed Data
-- Run after schema.sql to populate demo data
-- ============================================================

-- 1. Insert default pricing rule
insert into public.pricing_rules (id, name, base_price, property_size_modifiers, short_notice_days, short_notice_surcharge, distance_band_modifiers, is_active)
values (
  '00000000-0000-0000-0000-000000000001',
  'Default UK Pricing',
  5.00,
  '{"studio": 0, "1_bed": 0, "2_bed": 0, "3_bed": 1.0, "4_bed": 2.0, "5_plus_bed": 3.0}',
  7,
  2.00,
  '{"local": 0, "medium": 1.0, "long": 2.0}',
  true
);

-- 2. Insert credit packs
insert into public.credit_packs (id, name, credits, price_gbp, is_active) values
  ('00000000-0000-0000-0000-000000000010', 'Starter', 20, 90.00, true),
  ('00000000-0000-0000-0000-000000000011', 'Growth', 50, 200.00, true),
  ('00000000-0000-0000-0000-000000000012', 'Pro', 100, 350.00, true);

-- 3. Insert demo companies
insert into public.companies (id, name, slug, description, city, postcode, phone, email, status, services, accreditations) values
  (
    '00000000-0000-0000-0000-000000000100',
    'Swift Removals London',
    'swift-removals-london',
    'Professional house removals across London and the South East. Family-run business with over 20 years of experience.',
    'London',
    'SW1A 1AA',
    '020 7946 0958',
    'info@swiftremovals.example.com',
    'approved',
    '{"House Removals", "Packing Services", "Storage", "Office Removals"}',
    '{"BAR Member", "Which? Trusted Trader"}'
  ),
  (
    '00000000-0000-0000-0000-000000000101',
    'Northern Movers',
    'northern-movers',
    'Covering Manchester, Leeds, and the wider North West. Competitive pricing with a personal touch.',
    'Manchester',
    'M1 1AE',
    '0161 496 0123',
    'hello@northernmovers.example.com',
    'approved',
    '{"House Removals", "Packing Services", "Man and Van", "Furniture Assembly"}',
    '{"BAR Member", "Checkatrade"}'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'Midlands Express Removals',
    'midlands-express',
    'Fast, reliable removals covering Birmingham and the Midlands region.',
    'Birmingham',
    'B1 1BB',
    '0121 496 0456',
    'bookings@midlandsexpress.example.com',
    'approved',
    '{"House Removals", "Packing Services", "Storage", "Piano Moving"}',
    '{"Trading Standards Approved"}'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'Edinburgh Home Movers',
    'edinburgh-home-movers',
    'Scotland''s trusted removal service. Covering Edinburgh, Glasgow, and all of central Scotland.',
    'Edinburgh',
    'EH1 1YZ',
    '0131 496 0789',
    'moves@edinburghhome.example.com',
    'approved',
    '{"House Removals", "Packing Services", "Storage", "International Removals"}',
    '{"BAR Member", "ISO 9001"}'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'Bristol Bay Removals',
    'bristol-bay-removals',
    'Covering Bristol, Bath, and the South West. Eco-friendly moving options available.',
    'Bristol',
    'BS1 1AA',
    '0117 496 0321',
    'info@bristolbay.example.com',
    'approved',
    '{"House Removals", "Packing Services", "Storage", "Cleaning Services"}',
    '{"Checkatrade", "Trading Standards Approved"}'
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    'Pending Movers Ltd',
    'pending-movers',
    'A new company awaiting approval.',
    'Liverpool',
    'L1 1AA',
    '0151 496 0654',
    'info@pendingmovers.example.com',
    'pending',
    '{"House Removals", "Man and Van"}',
    '{}'
  );

-- 4. Insert postcode coverage for demo companies
-- Swift Removals London — covers London postcodes
insert into public.postcode_coverage (company_id, postcode_prefix) values
  ('00000000-0000-0000-0000-000000000100', 'SW'),
  ('00000000-0000-0000-0000-000000000100', 'SE'),
  ('00000000-0000-0000-0000-000000000100', 'N'),
  ('00000000-0000-0000-0000-000000000100', 'E'),
  ('00000000-0000-0000-0000-000000000100', 'W'),
  ('00000000-0000-0000-0000-000000000100', 'EC'),
  ('00000000-0000-0000-0000-000000000100', 'WC'),
  ('00000000-0000-0000-0000-000000000100', 'NW');

-- Northern Movers — covers Manchester, Leeds, North West
insert into public.postcode_coverage (company_id, postcode_prefix) values
  ('00000000-0000-0000-0000-000000000101', 'M'),
  ('00000000-0000-0000-0000-000000000101', 'LS'),
  ('00000000-0000-0000-0000-000000000101', 'WN'),
  ('00000000-0000-0000-0000-000000000101', 'BL'),
  ('00000000-0000-0000-0000-000000000101', 'OL');

-- Midlands Express — covers Birmingham, Midlands
insert into public.postcode_coverage (company_id, postcode_prefix) values
  ('00000000-0000-0000-0000-000000000102', 'B'),
  ('00000000-0000-0000-0000-000000000102', 'CV'),
  ('00000000-0000-0000-0000-000000000102', 'WS'),
  ('00000000-0000-0000-0000-000000000102', 'WV'),
  ('00000000-0000-0000-0000-000000000102', 'DY');

-- Edinburgh Home Movers — covers Scotland
insert into public.postcode_coverage (company_id, postcode_prefix) values
  ('00000000-0000-0000-0000-000000000103', 'EH'),
  ('00000000-0000-0000-0000-000000000103', 'G'),
  ('00000000-0000-0000-0000-000000000103', 'FK'),
  ('00000000-0000-0000-0000-000000000103', 'KY');

-- Bristol Bay — covers South West
insert into public.postcode_coverage (company_id, postcode_prefix) values
  ('00000000-0000-0000-0000-000000000104', 'BS'),
  ('00000000-0000-0000-0000-000000000104', 'BA'),
  ('00000000-0000-0000-0000-000000000104', 'GL'),
  ('00000000-0000-0000-0000-000000000104', 'EX'),
  ('00000000-0000-0000-0000-000000000104', 'TA');

-- 5. Give each approved company some starting credits
insert into public.credit_ledger (company_id, delta, balance_after, reason, description) values
  ('00000000-0000-0000-0000-000000000100', 50, 50, 'adjustment', 'Welcome credits'),
  ('00000000-0000-0000-0000-000000000101', 50, 50, 'adjustment', 'Welcome credits'),
  ('00000000-0000-0000-0000-000000000102', 50, 50, 'adjustment', 'Welcome credits'),
  ('00000000-0000-0000-0000-000000000103', 50, 50, 'adjustment', 'Welcome credits'),
  ('00000000-0000-0000-0000-000000000104', 50, 50, 'adjustment', 'Welcome credits');

-- 6. Insert some demo leads
insert into public.leads (id, from_postcode, to_postcode, move_date, move_date_flexible, property_size, packing_required, storage_required, access_notes) values
  (
    '00000000-0000-0000-0000-000000000200',
    'SW1A 1AA', 'N1 9GU',
    '2026-03-15', false, '2_bed',
    true, false, 'Ground floor flat, easy parking'
  ),
  (
    '00000000-0000-0000-0000-000000000201',
    'M1 1AE', 'LS1 1BA',
    '2026-04-01', true, '3_bed',
    true, true, 'Third floor, lift available'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    'B1 1BB', 'CV1 1FB',
    '2026-03-20', false, '4_bed',
    false, false, 'Detached house, driveway parking'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    'EH1 1YZ', 'G1 1AA',
    null, true, '1_bed',
    false, false, null
  ),
  (
    '00000000-0000-0000-0000-000000000204',
    'BS1 1AA', 'EX1 1AA',
    '2026-02-20', false, '5_plus_bed',
    true, true, 'Large Victorian house, narrow street access'
  );

-- 7. Insert lead contact details
insert into public.lead_contact_details (lead_id, full_name, email, phone, consent_given) values
  ('00000000-0000-0000-0000-000000000200', 'Sarah Johnson', 'sarah.johnson@example.com', '07700 900123', true),
  ('00000000-0000-0000-0000-000000000201', 'James Wilson', 'james.wilson@example.com', '07700 900456', true),
  ('00000000-0000-0000-0000-000000000202', 'Emma Thompson', 'emma.t@example.com', '07700 900789', true),
  ('00000000-0000-0000-0000-000000000203', 'Liam MacGregor', 'liam.mac@example.com', '07700 900012', true),
  ('00000000-0000-0000-0000-000000000204', 'Olivia Pearce', 'olivia.p@example.com', '07700 900345', true);

-- 8. Insert lead assignments (each lead to relevant companies)
-- Lead 200 (London SW→N): Swift Removals
insert into public.lead_assignments (lead_id, company_id, status) values
  ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000100', 'assigned');

-- Lead 201 (Manchester M→Leeds LS): Northern Movers
insert into public.lead_assignments (lead_id, company_id, status) values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'assigned');

-- Lead 202 (Birmingham B→Coventry CV): Midlands Express
insert into public.lead_assignments (lead_id, company_id, status, revealed_at, price_at_reveal) values
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', 'revealed', now() - interval '2 days', 7.00);

-- Lead 203 (Edinburgh EH→Glasgow G): Edinburgh Home Movers
insert into public.lead_assignments (lead_id, company_id, status) values
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000103', 'assigned');

-- Lead 204 (Bristol BS→Exeter EX): Bristol Bay
insert into public.lead_assignments (lead_id, company_id, status, revealed_at, price_at_reveal) values
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000104', 'contacted', now() - interval '1 day', 10.00);

-- Debit reveals from ledger for companies that revealed
insert into public.credit_ledger (company_id, delta, balance_after, reason, reference_type, reference_id, description) values
  ('00000000-0000-0000-0000-000000000102', -7.00, 43.00, 'reveal', 'lead', '00000000-0000-0000-0000-000000000202', 'Lead reveal: B1 → CV1'),
  ('00000000-0000-0000-0000-000000000104', -10.00, 40.00, 'reveal', 'lead', '00000000-0000-0000-0000-000000000204', 'Lead reveal: BS1 → EX1');

-- 9. Insert CMS content
insert into public.cms_content (slug, content_type, title, body, published, sort_order) values
  ('how-does-it-work', 'faq', 'How does MoveCompare work?', 'Simply fill out our quick quote form with your move details. We''ll match you with up to 5 verified removal companies in your area who will provide quotes for your move.', true, 1),
  ('is-it-free', 'faq', 'Is MoveCompare free to use?', 'Yes, MoveCompare is completely free for homeowners. You''ll never be charged for using our comparison service. Removal companies pay a small fee to access leads.', true, 2),
  ('how-many-quotes', 'faq', 'How many quotes will I receive?', 'You''ll receive up to 5 quotes from verified removal companies that cover your area. The exact number depends on how many companies service your route.', true, 3),
  ('how-are-companies-selected', 'faq', 'How are removal companies selected?', 'We match you with companies based on their coverage area, services offered, and track record. All companies on our platform are verified and vetted.', true, 4),
  ('data-protection', 'faq', 'How is my data protected?', 'We take data protection seriously and comply with UK GDPR. Your contact details are only shared with removal companies when they choose to view your lead. See our Privacy Policy for full details.', true, 5),
  ('can-i-cancel', 'faq', 'Can I cancel my quote request?', 'Yes, you can contact us at any time to cancel your quote request. Any companies that have already accessed your details will be notified.', true, 6),
  ('what-information-needed', 'faq', 'What information do I need to provide?', 'You''ll need your current and new postcodes, approximate move date, property size, and any special requirements like packing or storage. We also need your name, email, and phone number so companies can contact you.', true, 7),
  ('about-page', 'page', 'About MoveCompare', 'MoveCompare helps UK homeowners find trusted removal companies by comparing quotes from verified movers.', true, 1);
