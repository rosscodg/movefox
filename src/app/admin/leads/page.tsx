import type { Metadata } from 'next';
// import { createClient } from '@/lib/supabase/server';
import type { Lead } from '@/types/database';
import { LeadsTable } from './leads-table';

export const metadata: Metadata = {
  title: 'Leads',
};

// --- Mock Data ---
// In production:
// const supabase = await createClient();
// const { data: leads } = await supabase
//   .from('leads')
//   .select('*, lead_assignments(count)')
//   .order('created_at', { ascending: false });

const mockLeads: (Lead & { assignedCount: number; revealedCount: number })[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    from_postcode: 'SW1A 1AA',
    to_postcode: 'E1 6AN',
    move_date: '2025-02-15',
    move_date_flexible: false,
    property_size: '2_bed',
    access_notes: null,
    packing_required: true,
    storage_required: false,
    dismantling_required: false,
    fragile_items: true,
    additional_notes: null,
    created_at: '2025-01-28T10:30:00Z',
    assignedCount: 5,
    revealedCount: 3,
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    from_postcode: 'M1 1AD',
    to_postcode: 'LS1 1UR',
    move_date: '2025-03-01',
    move_date_flexible: true,
    property_size: '3_bed',
    access_notes: 'Third floor, no lift',
    packing_required: false,
    storage_required: true,
    dismantling_required: true,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-28T09:15:00Z',
    assignedCount: 4,
    revealedCount: 2,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    from_postcode: 'BS1 4DJ',
    to_postcode: 'BA1 1SU',
    move_date: '2025-02-20',
    move_date_flexible: false,
    property_size: '1_bed',
    access_notes: null,
    packing_required: false,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-27T16:45:00Z',
    assignedCount: 5,
    revealedCount: 5,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    from_postcode: 'B1 1BB',
    to_postcode: 'CV1 1FL',
    move_date: '2025-02-10',
    move_date_flexible: true,
    property_size: '4_bed',
    access_notes: 'Narrow driveway',
    packing_required: true,
    storage_required: true,
    dismantling_required: true,
    fragile_items: true,
    additional_notes: 'Grand piano needs moving',
    created_at: '2025-01-27T14:20:00Z',
    assignedCount: 3,
    revealedCount: 1,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-234567890123',
    from_postcode: 'EH1 1YZ',
    to_postcode: 'G1 1XQ',
    move_date: null,
    move_date_flexible: true,
    property_size: 'studio',
    access_notes: null,
    packing_required: false,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-27T11:00:00Z',
    assignedCount: 5,
    revealedCount: 4,
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-345678901234',
    from_postcode: 'LE1 1AA',
    to_postcode: 'NG1 1AB',
    move_date: '2025-02-28',
    move_date_flexible: false,
    property_size: '5_plus_bed',
    access_notes: 'Large driveway, two-vehicle access needed',
    packing_required: true,
    storage_required: true,
    dismantling_required: true,
    fragile_items: true,
    additional_notes: 'Hot tub and garden furniture',
    created_at: '2025-01-26T10:00:00Z',
    assignedCount: 5,
    revealedCount: 5,
  },
  {
    id: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
    from_postcode: 'CF10 1AA',
    to_postcode: 'SA1 1AA',
    move_date: '2025-03-15',
    move_date_flexible: true,
    property_size: '2_bed',
    access_notes: null,
    packing_required: false,
    storage_required: false,
    dismantling_required: false,
    fragile_items: false,
    additional_notes: null,
    created_at: '2025-01-25T14:30:00Z',
    assignedCount: 2,
    revealedCount: 0,
  },
  {
    id: 'a7b8c9d0-e1f2-3456-abcd-567890123456',
    from_postcode: 'OX1 1AA',
    to_postcode: 'CB1 1AA',
    move_date: '2025-02-05',
    move_date_flexible: false,
    property_size: '3_bed',
    access_notes: 'Steps to front door',
    packing_required: true,
    storage_required: false,
    dismantling_required: true,
    fragile_items: true,
    additional_notes: null,
    created_at: '2025-01-24T09:45:00Z',
    assignedCount: 5,
    revealedCount: 3,
  },
];

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Leads</h2>
        <p className="text-text-secondary mt-1">Browse and manage all leads on the platform</p>
      </div>

      <LeadsTable leads={mockLeads} />
    </div>
  );
}
