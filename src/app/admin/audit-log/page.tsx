import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { AdminAuditLog } from '@/types/database';
import { AuditLogViewer } from './audit-log-viewer';

export const metadata: Metadata = {
  title: 'Audit Log',
};

// --- Fallback Data (used when Supabase tables are empty or on error) ---

const FALLBACK_auditLogs: (AdminAuditLog & { actorEmail: string })[] = [
  {
    id: 'al1',
    actor_user_id: 'admin1',
    action: 'company.approve',
    entity_type: 'company',
    entity_id: '3',
    before_data: { status: 'pending' },
    after_data: { status: 'approved' },
    created_at: '2025-01-28T14:30:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al2',
    actor_user_id: 'admin1',
    action: 'company.reject',
    entity_type: 'company',
    entity_id: '5',
    before_data: { status: 'pending', name: 'QuickShift Removals' },
    after_data: { status: 'rejected' },
    created_at: '2025-01-28T14:25:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al3',
    actor_user_id: 'admin1',
    action: 'pricing.update',
    entity_type: 'pricing_rule',
    entity_id: 'pr1',
    before_data: { base_price: 4.5, short_notice_surcharge: 1.5 },
    after_data: { base_price: 5.0, short_notice_surcharge: 2.0 },
    created_at: '2025-01-27T10:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al4',
    actor_user_id: 'admin1',
    action: 'credit.adjustment',
    entity_type: 'credit_ledger',
    entity_id: 'cl_adj1',
    before_data: null,
    after_data: { company_id: '3', delta: 10, reason: 'Goodwill adjustment for duplicate lead' },
    created_at: '2025-01-26T16:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al5',
    actor_user_id: 'admin1',
    action: 'content.create',
    entity_type: 'cms_content',
    entity_id: 'cms8',
    before_data: null,
    after_data: { title: 'The Ultimate Moving Checklist for 2025', content_type: 'blog', published: true },
    created_at: '2025-01-25T12:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al6',
    actor_user_id: 'admin1',
    action: 'content.update',
    entity_type: 'cms_content',
    entity_id: 'cms1',
    before_data: { title: 'About Us', published: true },
    after_data: { title: 'About Us', published: true, body: 'Updated body content...' },
    created_at: '2025-01-24T14:30:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al7',
    actor_user_id: 'admin2',
    action: 'company.suspend',
    entity_type: 'company',
    entity_id: '6',
    before_data: { status: 'approved', name: 'SafeHands Moving' },
    after_data: { status: 'suspended', paused: true },
    created_at: '2025-01-20T16:00:00Z',
    actorEmail: 'ops@movefox.co.uk',
  },
  {
    id: 'al8',
    actor_user_id: 'admin1',
    action: 'credit.refund',
    entity_type: 'credit_ledger',
    entity_id: 'cl_ref1',
    before_data: null,
    after_data: { company_id: '4', delta: 7, reason: 'Refund for invalid lead' },
    created_at: '2025-01-19T11:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al9',
    actor_user_id: 'admin1',
    action: 'credit_pack.update',
    entity_type: 'credit_pack',
    entity_id: 'cp2',
    before_data: { name: 'Growth', credits: 50, price_gbp: 190 },
    after_data: { name: 'Growth', credits: 50, price_gbp: 200 },
    created_at: '2025-01-18T09:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al10',
    actor_user_id: 'admin1',
    action: 'company.approve',
    entity_type: 'company',
    entity_id: '4',
    before_data: { status: 'pending', name: 'Premier Moving Co' },
    after_data: { status: 'approved' },
    created_at: '2025-01-15T10:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  {
    id: 'al11',
    actor_user_id: 'admin2',
    action: 'content.update',
    entity_type: 'cms_content',
    entity_id: 'cms4',
    before_data: { title: 'What is MoveFox?', published: false },
    after_data: { title: 'What is MoveFox?', published: true },
    created_at: '2025-01-15T10:00:00Z',
    actorEmail: 'ops@movefox.co.uk',
  },
  {
    id: 'al12',
    actor_user_id: 'admin1',
    action: 'company.approve',
    entity_type: 'company',
    entity_id: '3',
    before_data: { status: 'pending', name: 'Careful Carriers' },
    after_data: { status: 'approved' },
    created_at: '2025-01-12T14:00:00Z',
    actorEmail: 'admin@movefox.co.uk',
  },
  // Add more to fill out pagination testing
  ...Array.from({ length: 38 }, (_, i) => ({
    id: `al${13 + i}`,
    actor_user_id: 'admin1',
    action: i % 3 === 0 ? 'company.approve' : i % 3 === 1 ? 'content.update' : 'credit.adjustment',
    entity_type: i % 3 === 0 ? 'company' : i % 3 === 1 ? 'cms_content' : 'credit_ledger',
    entity_id: `entity_${13 + i}`,
    before_data: { status: 'before' },
    after_data: { status: 'after' },
    created_at: new Date(2025, 0, 10 - Math.floor(i / 3), 10, 0, 0).toISOString(),
    actorEmail: 'admin@movefox.co.uk',
  })),
];

export default async function AuditLogPage() {
  const supabase = await createClient();

  // Query audit logs from Supabase, fall back to mock data
  const { data: logs, error } = await supabase
    .from('admin_audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  let resolvedLogs: (AdminAuditLog & { actorEmail: string })[];

  if (!error && logs && logs.length > 0) {
    // Look up actor emails from profiles for each unique actor_user_id
    const actorIds = [...new Set(logs.map((log) => log.actor_user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', actorIds);

    const emailMap = new Map(
      (profiles ?? []).map((p: { id: string; email: string }) => [p.id, p.email])
    );

    resolvedLogs = logs.map((log) => ({
      ...log,
      actorEmail: emailMap.get(log.actor_user_id) ?? 'unknown@movefox.co.uk',
    }));
  } else {
    resolvedLogs = FALLBACK_auditLogs;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Audit Log</h2>
        <p className="text-text-secondary mt-1">Track all administrative actions</p>
      </div>

      <AuditLogViewer logs={resolvedLogs} />
    </div>
  );
}
