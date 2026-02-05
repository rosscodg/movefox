'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { sendNewPartnerNotification, isResendConfigured } from '@/lib/email';

interface RegisterPartnerInput {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
  description?: string;
  services: string[];
  accreditations: string[];
  insuranceDetails?: string;
  postcodeAreas: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export async function registerPartner(
  input: RegisterPartnerInput
): Promise<{ success: boolean; error?: string; companyId?: string }> {
  try {
    const supabase = await createAdminClient();

    // 1. Create auth user via admin API (auto-confirms, no confirmation email sent)
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: { full_name: input.fullName },
      });

    if (userError) {
      console.error('[join/actions] Failed to create user:', userError);
      // Handle duplicate email
      if (userError.message?.includes('already been registered')) {
        return { success: false, error: 'An account with this email already exists. Please log in instead.' };
      }
      return { success: false, error: userError.message || 'Failed to create account' };
    }

    if (!userData.user) {
      return { success: false, error: 'Failed to create account. Please try again.' };
    }

    const userId = userData.user.id;

    // 2. Wait briefly for the DB trigger to create the profile, then update it
    // The profile trigger fires on auth.users insert
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: input.fullName,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (profileError) {
      console.error('[join/actions] Failed to update profile:', profileError);
      return { success: false, error: 'Failed to update profile' };
    }

    // Generate a unique slug
    let slug = slugify(input.companyName);
    const { data: existingSlug } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Create the company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: input.companyName,
        slug,
        description: input.description || null,
        address_line1: input.addressLine1,
        address_line2: input.addressLine2 || null,
        city: input.city,
        postcode: input.postcode,
        phone: input.companyPhone,
        email: input.companyEmail,
        website: input.companyWebsite || null,
        status: 'pending',
        paused: false,
        services: input.services,
        insurance_details: input.insuranceDetails || null,
        accreditations: input.accreditations,
        photos: [],
      })
      .select('id')
      .single();

    if (companyError || !company) {
      console.error('[join/actions] Failed to create company:', companyError);
      return { success: false, error: 'Failed to create company record' };
    }

    // Link user to company
    const { error: linkError } = await supabase.from('company_users').insert({
      company_id: company.id,
      user_id: userId,
      is_primary: true,
    });

    if (linkError) {
      console.error('[join/actions] Failed to link user to company:', linkError);
      // Clean up the company we just created
      await supabase.from('companies').delete().eq('id', company.id);
      return { success: false, error: 'Failed to link user to company' };
    }

    // Insert postcode coverage
    if (input.postcodeAreas.length > 0) {
      const coverageRows = input.postcodeAreas.map((prefix) => ({
        company_id: company.id,
        postcode_prefix: prefix.toUpperCase().trim(),
        enabled: true,
      }));

      const { error: coverageError } = await supabase
        .from('postcode_coverage')
        .insert(coverageRows);

      if (coverageError) {
        console.error('[join/actions] Failed to insert postcode coverage:', coverageError);
        // Non-fatal — company and user link still valid
      }
    }

    // Notify admin of new registration (non-blocking — don't fail registration if this errors)
    if (isResendConfigured()) {
      sendNewPartnerNotification({
        companyId: company.id,
        companyName: input.companyName,
        contactName: input.fullName,
        contactEmail: input.email,
        companyEmail: input.companyEmail,
        companyPhone: input.companyPhone,
        city: input.city,
        postcode: input.postcode,
        services: input.services,
      }).catch((err) => {
        console.error('[join/actions] Failed to send admin notification:', err);
      });
    }

    return { success: true, companyId: company.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('[join/actions] registerPartner error:', message);
    return { success: false, error: message };
  }
}
