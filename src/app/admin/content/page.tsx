import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { CmsContent } from '@/types/database';
import { ContentManager } from './content-manager';

export const metadata: Metadata = {
  title: 'Content',
};

// --- Fallback Data (used when Supabase tables are empty or on error) ---

const FALLBACK_content: CmsContent[] = [
  {
    id: 'cms1',
    slug: 'about-us',
    content_type: 'page',
    title: 'About Us',
    body: '<h1>About MoveCompare</h1><p>We help people find trusted removal companies across the UK.</p>',
    meta_description: 'Learn about MoveCompare and our mission to simplify moving.',
    published: true,
    sort_order: 1,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: 'cms2',
    slug: 'how-it-works',
    content_type: 'page',
    title: 'How It Works',
    body: '<h1>How It Works</h1><p>Step 1: Enter your move details. Step 2: Receive quotes. Step 3: Choose your mover.</p>',
    meta_description: 'Find out how MoveCompare works in three simple steps.',
    published: true,
    sort_order: 2,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-18T14:00:00Z',
  },
  {
    id: 'cms3',
    slug: 'terms-and-conditions',
    content_type: 'page',
    title: 'Terms and Conditions',
    body: '<h1>Terms and Conditions</h1><p>By using MoveCompare, you agree to the following terms...</p>',
    meta_description: null,
    published: true,
    sort_order: 3,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'cms4',
    slug: 'what-is-movecompare',
    content_type: 'faq',
    title: 'What is MoveCompare?',
    body: 'MoveCompare is a free comparison platform that connects you with up to 5 trusted removal companies for your home move.',
    meta_description: null,
    published: true,
    sort_order: 1,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cms5',
    slug: 'how-much-does-it-cost',
    content_type: 'faq',
    title: 'How much does it cost to use MoveCompare?',
    body: 'MoveCompare is completely free for homeowners. We charge removal companies a small fee to connect with you.',
    meta_description: null,
    published: true,
    sort_order: 2,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cms6',
    slug: 'how-are-companies-vetted',
    content_type: 'faq',
    title: 'How are removal companies vetted?',
    body: 'All removal companies on MoveCompare must provide proof of insurance, accreditations, and pass our review process.',
    meta_description: null,
    published: true,
    sort_order: 3,
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cms7',
    slug: 'can-i-cancel',
    content_type: 'faq',
    title: 'Can I cancel after receiving quotes?',
    body: 'Yes, there is no obligation to hire any of the removal companies. You are free to choose or not.',
    meta_description: null,
    published: false,
    sort_order: 4,
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z',
  },
  {
    id: 'cms8',
    slug: 'moving-checklist-2025',
    content_type: 'blog',
    title: 'The Ultimate Moving Checklist for 2025',
    body: '<h1>The Ultimate Moving Checklist for 2025</h1><p>Moving house can be stressful, but with the right plan...</p>',
    meta_description: 'Your complete guide to planning a house move in 2025.',
    published: true,
    sort_order: 1,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-25T12:00:00Z',
  },
  {
    id: 'cms9',
    slug: 'how-to-choose-removal-company',
    content_type: 'blog',
    title: 'How to Choose the Right Removal Company',
    body: '<h1>How to Choose the Right Removal Company</h1><p>With so many options available...</p>',
    meta_description: 'Tips for choosing a reliable removal company for your move.',
    published: true,
    sort_order: 2,
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-01-22T09:00:00Z',
  },
  {
    id: 'cms10',
    slug: 'packing-tips',
    content_type: 'blog',
    title: 'Top 10 Packing Tips from the Pros',
    body: '<h1>Top 10 Packing Tips</h1><p>Professional movers share their best packing secrets...</p>',
    meta_description: 'Expert packing tips to make your house move easier.',
    published: false,
    sort_order: 3,
    created_at: '2025-01-26T00:00:00Z',
    updated_at: '2025-01-26T00:00:00Z',
  },
];

export default async function ContentPage() {
  const supabase = await createClient();

  // Query CMS content from Supabase, fall back to mock data
  const { data: content, error } = await supabase
    .from('cms_content')
    .select('*')
    .order('content_type')
    .order('sort_order');

  const resolvedContent: CmsContent[] =
    !error && content && content.length > 0 ? content : FALLBACK_content;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Content Management</h2>
        <p className="text-text-secondary mt-1">Manage pages, FAQs, and blog posts</p>
      </div>

      <ContentManager content={resolvedContent} />
    </div>
  );
}
