import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from './components/admin-sidebar';
import { AdminTopBar } from './components/admin-top-bar';

export const metadata: Metadata = {
  title: 'Admin Portal',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Server-side admin check ---
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, email')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/login');

  const adminUser = {
    email: profile.email ?? user.email ?? 'admin@movefox.co.uk',
    full_name: profile.full_name ?? 'Admin User',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar user={adminUser} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
