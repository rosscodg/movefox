import { createClient } from '@/lib/supabase/server';
import { SERVICES, ACCREDITATIONS } from '@/lib/constants';
import type { Company } from '@/types/database';
import { ProfileEditor } from './profile-editor';

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_COMPANY: Company = {
  id: 'comp_001',
  name: 'Swift Removals Ltd',
  slug: 'swift-removals',
  description:
    'Professional removal services across London and the South East. Family-run business with over 15 years of experience.',
  address_line1: '14 Warehouse Lane',
  address_line2: 'Unit 3',
  city: 'London',
  postcode: 'SE1 9PQ',
  phone: '020 7946 0958',
  email: 'info@swiftremovals.co.uk',
  website: 'https://swiftremovals.co.uk',
  logo_url: null,
  status: 'approved',
  paused: false,
  services: ['House Removals', 'Office Removals', 'Packing Services', 'Storage'],
  insurance_details:
    'Goods in transit cover up to £50,000. Public liability insurance £5,000,000. Employer liability insurance £10,000,000.',
  accreditations: ['BAR Member', 'Which? Trusted Trader'],
  photos: [],
  created_at: '2024-06-01T10:00:00Z',
  updated_at: '2024-12-01T10:00:00Z',
};

export default async function ProfilePage() {
  let company: Company = MOCK_COMPANY;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch company
      // const { data: companyUser } = await supabase
      //   .from('company_users')
      //   .select('company_id')
      //   .eq('user_id', user.id)
      //   .single();

      // const { data: companyData } = await supabase
      //   .from('companies')
      //   .select('*')
      //   .eq('id', companyUser.company_id)
      //   .single();

      // if (companyData) {
      //   company = companyData;
      // }
    }
  } catch {
    // Fall through to mock data
  }

  return (
    <ProfileEditor
      company={company}
      availableServices={[...SERVICES]}
      availableAccreditations={[...ACCREDITATIONS]}
    />
  );
}
