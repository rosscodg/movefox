import { createClient } from '@/lib/supabase/server';
import type { Company, PostcodeCoverage } from '@/types/database';
import { SettingsClient } from './settings-client';

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_COMPANY: Company = {
  id: 'comp_001',
  name: 'Swift Removals Ltd',
  slug: 'swift-removals',
  description: null,
  address_line1: null,
  address_line2: null,
  city: null,
  postcode: null,
  phone: null,
  email: null,
  website: null,
  logo_url: null,
  status: 'approved',
  paused: false,
  services: [],
  insurance_details: null,
  accreditations: [],
  photos: [],
  created_at: '2024-06-01T10:00:00Z',
  updated_at: '2024-12-01T10:00:00Z',
};

const MOCK_POSTCODES: PostcodeCoverage[] = [
  {
    id: 'pc_001',
    company_id: 'comp_001',
    postcode_prefix: 'SW',
    enabled: true,
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pc_002',
    company_id: 'comp_001',
    postcode_prefix: 'SE',
    enabled: true,
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pc_003',
    company_id: 'comp_001',
    postcode_prefix: 'EC',
    enabled: true,
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pc_004',
    company_id: 'comp_001',
    postcode_prefix: 'WC',
    enabled: true,
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pc_005',
    company_id: 'comp_001',
    postcode_prefix: 'N',
    enabled: false,
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pc_006',
    company_id: 'comp_001',
    postcode_prefix: 'E',
    enabled: true,
    created_at: '2024-06-01T10:00:00Z',
  },
  {
    id: 'pc_007',
    company_id: 'comp_001',
    postcode_prefix: 'W',
    enabled: false,
    created_at: '2024-08-15T10:00:00Z',
  },
];

export default async function SettingsPage() {
  let company: Company = MOCK_COMPANY;
  let postcodes: PostcodeCoverage[] = MOCK_POSTCODES;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Fetch company
      const { data: companyUser } = await supabase
        .from('company_users')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

      if (companyUser) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('*')
          .eq('id', companyUser.company_id)
          .single();

        if (companyData) {
          company = companyData;
        }

        // Fetch postcode coverage
        const { data: postcodeData } = await supabase
          .from('postcode_coverage')
          .select('*')
          .eq('company_id', companyUser.company_id)
          .order('postcode_prefix');

        if (postcodeData && postcodeData.length > 0) {
          postcodes = postcodeData;
        }
      }
    }
  } catch {
    // Fall through to mock data
  }

  return (
    <SettingsClient
      company={company}
      postcodes={postcodes}
    />
  );
}
