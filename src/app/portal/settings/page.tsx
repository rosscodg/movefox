import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Company, PostcodeCoverage } from '@/types/database';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let company: Company | null = null;
  let postcodes: PostcodeCoverage[] = [];

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

  if (!company) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          No company profile found
        </h2>
        <p className="text-text-secondary">
          Your account is not yet linked to a company. Please contact support if
          you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <SettingsClient
      company={company}
      postcodes={postcodes}
    />
  );
}
