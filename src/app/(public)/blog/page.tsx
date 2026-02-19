import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { formatDate } from '@/lib/dates';
import type { CmsContent } from '@/types/database';

export const metadata: Metadata = {
  title: 'Blog | MoveFox',
  description:
    'Moving tips, guides, and advice from the MoveFox team. Everything you need to know about planning your UK house move.',
  openGraph: {
    title: 'Blog | MoveFox',
    description:
      'Moving tips, guides, and advice from the MoveFox team.',
    url: 'https://movefox.co.uk/blog',
  },
};

export default async function BlogIndexPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('cms_content')
    .select('*')
    .eq('content_type', 'blog')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const blogPosts: CmsContent[] = posts ?? [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Blog' },
              ]}
            />
            <Badge variant="primary" className="mb-6 mt-6">
              <BookOpen className="w-3 h-3 mr-1" />
              Blog
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
              Moving Tips &amp; Guides
            </h1>
            <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Expert advice, checklists, and insights to help you plan the
              perfect house move across the UK.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {blogPosts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-lg">
              No blog posts yet. Check back soon for moving tips and guides.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  {/* Featured Image or Gradient Placeholder */}
                  <div className="aspect-[16/9] relative overflow-hidden">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-primary/40" />
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="primary" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.excerpt && (
                      <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      )}
                      {post.read_time_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time_minutes} min read
                        </span>
                      )}
                      <span>{formatDate(post.created_at)}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
