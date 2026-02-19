import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, User, Calendar, ArrowLeft, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd } from '@/components/seo/json-ld';
import { formatDate } from '@/lib/dates';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('cms_content')
    .select('*')
    .eq('slug', slug)
    .eq('content_type', 'blog')
    .eq('published', true)
    .single();
  return data;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | MoveFox Blog`,
    description: post.excerpt ?? post.meta_description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.meta_description ?? undefined,
      url: `https://movefox.co.uk/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      ...(post.featured_image_url ? { images: [post.featured_image_url] } : {}),
    },
  };
}

// Render on-demand — createClient() depends on cookies() so SSG is not possible
export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? post.meta_description ?? '',
    ...(post.featured_image_url ? { image: post.featured_image_url } : {}),
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': post.author ? 'Person' : 'Organization',
      name: post.author ?? 'MoveFox',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MoveFox',
      url: 'https://movefox.co.uk',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://movefox.co.uk/blog/${post.slug}`,
    },
  };

  // FAQPage JSON-LD for AEO/GEO optimisation
  const faqs = Array.isArray(post.faqs) ? post.faqs : [];
  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <JsonLd data={blogPostingJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        {/* Header */}
        <header className="mt-8">
          {post.category && (
            <Badge variant="primary" className="mb-4">
              {post.category}
            </Badge>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
            {post.read_time_minutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.read_time_minutes} min read
              </span>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image_url && (
          <div className="mt-8 rounded-2xl overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Body */}
        <div
          className="mt-10 prose prose-lg dark:prose-invert max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-primary prose-strong:text-text-primary"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq: { question: string; answer: string }, idx: number) => (
                <details
                  key={idx}
                  className="group bg-surface border border-border rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-surface-alt/50 transition-colors">
                    <span className="text-text-primary font-medium pr-4">{faq.question}</span>
                    <ChevronDown className="w-5 h-5 text-text-muted shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-4 text-text-secondary leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Back to blog */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/blog">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </article>
    </>
  );
}
