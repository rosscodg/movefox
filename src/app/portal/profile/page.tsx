import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SERVICES, ACCREDITATIONS } from '@/lib/constants';
import type { Company } from '@/types/database';
import { ProfileEditor } from './profile-editor';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let company: Company | null = null;

  try {
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
    }
  } catch (error) {
    console.error('[portal/profile] Failed to fetch company data:', error);
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
    <ProfileEditor
      company={company}
      availableServices={[...SERVICES]}
      availableAccreditations={[...ACCREDITATIONS]}
    />
  );
}
