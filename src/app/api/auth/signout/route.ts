import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';

  // Use 303 (See Other) so the browser follows the redirect with GET
  // instead of preserving POST — avoids 405 on the login page
  return NextResponse.redirect(url, 303);
}
